
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AIModel } from "@/lib/types";
import { getAllModels, comingSoonProviders } from "@/lib/modelData";

export type CombinedModel = AIModel & {
  source?: string | null;
  vendor?: string | null;
  available: boolean;
};

export type ProviderStatus = {
  openai: boolean;
  google: boolean;
  anthropic: boolean;
  openrouter: boolean;
};

const mapAvailability = (provider: string, status?: ProviderStatus) => {
  if (!status) return false;
  switch (provider) {
    case "openai":
      return status.openai;
    case "google":
      return status.google;
    case "anthropic":
      return status.anthropic;
    case "openrouter":
      return status.openrouter;
    default:
      return false;
  }
};

export const useModelsRegistry = () => {
  const statusQuery = useQuery<ProviderStatus>({
    queryKey: ["provider-status"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("provider-status");
      if (error) throw error;
      return data as ProviderStatus;
    },
    staleTime: 60_000,
  });

  const modelsQuery = useQuery<CombinedModel[]>({
    queryKey: ["models-registry"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("models")
        .select("display_name, provider, context_window, external_id, source, vendor");
      if (error) throw error;

      // Map DB rows to AIModel-like shape using external_id as id when present
      const dbModels: CombinedModel[] = (data || []).map((row: any) => ({
        id: row.external_id || row.display_name,
        displayName: row.display_name || row.external_id,
        provider: row.provider || "openrouter",
        contextWindow: row.context_window || undefined,
        icon: undefined,
        pricing: undefined,
        description: undefined,
        strengths: undefined,
        bestFor: undefined,
        source: row.source,
        vendor: row.vendor,
        available: false, // set after status is fetched
      }));

      // Fallback to static if DB empty — include "coming soon" providers
      if (!dbModels.length) {
        const staticModels: AIModel[] = [
          ...getAllModels(),
          ...comingSoonProviders.flatMap((p) => p.models),
        ];
        return staticModels.map((m) => ({ ...m, available: false }));
      }

      return dbModels;
    },
    staleTime: 60_000,
  });

  // Auto-sync OpenRouter catalog once when key is present but no OpenRouter models yet
  const hasSyncedOpenRouterRef = useRef(false);
  useEffect(() => {
    const openrouterAvailable = statusQuery.data?.openrouter;
    const hasOpenRouterModels = (modelsQuery.data || []).some((m) => m.provider === "openrouter");

    if (openrouterAvailable && !hasOpenRouterModels && !hasSyncedOpenRouterRef.current) {
      hasSyncedOpenRouterRef.current = true;
      console.log("[useModelsRegistry] Triggering openrouter-sync-models...");
      supabase.functions
        .invoke("openrouter-sync-models")
        .then(({ data, error }) => {
          console.log("[useModelsRegistry] openrouter-sync-models result:", { data, error });
          // Refresh the models list so OpenRouter entries appear
          modelsQuery.refetch();
        })
        .catch((e) => console.error("[useModelsRegistry] openrouter-sync-models invoke error:", e));
    }
  }, [statusQuery.data?.openrouter, modelsQuery.data, modelsQuery]);

  // Compose with availability
  const models: CombinedModel[] = (modelsQuery.data || []).map((m) => ({
    ...m,
    available: mapAvailability(m.provider, statusQuery.data),
  }));

  const byProvider = models.reduce<Record<string, CombinedModel[]>>((acc, m) => {
    acc[m.provider] = acc[m.provider] || [];
    acc[m.provider].push(m);
    return acc;
  }, {});

  return {
    models,
    byProvider,
    status: statusQuery.data,
    isLoading: modelsQuery.isLoading || statusQuery.isLoading,
    isError: modelsQuery.isError || statusQuery.isError,
  };
};
