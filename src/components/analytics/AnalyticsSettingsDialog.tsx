
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { track, configureMixpanel, isMixpanelEnabled, reset } from '@/lib/analytics/mixpanel';
import { toast } from '@/lib/utils/toast';

interface AnalyticsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simple helper to read current stored values without importing window directly in multiple places
function getStoredValue(key: string) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

export const AnalyticsSettingsDialog: React.FC<AnalyticsSettingsDialogProps> = ({ open, onOpenChange }) => {
  const [token, setToken] = useState('');
  const [dataResidency, setDataResidency] = useState<'us' | 'eu'>('us');
  const apiHost = useMemo(() => (dataResidency === 'eu' ? 'https://api-eu.mixpanel.com' : undefined), [dataResidency]);

  // Load initial values when dialog opens
  useEffect(() => {
    if (open) {
      const existingToken = getStoredValue('MIXPANEL_TOKEN');
      const existingHost = getStoredValue('MIXPANEL_API_HOST');
      setToken(existingToken);
      setDataResidency(existingHost?.includes('eu') ? 'eu' : 'us');
    }
  }, [open]);

  const handleSave = () => {
    if (!token.trim()) {
      toast.error('Please enter your Mixpanel project token.');
      return;
    }
    const ok = configureMixpanel(token.trim(), apiHost);
    if (ok) {
      toast.success('Mixpanel configured. Page views and events will now be tracked.');
      try {
        track('Analytics Config Saved', { residency: dataResidency });
      } catch {}
      onOpenChange(false);
    } else {
      toast.error('Failed to initialize Mixpanel. Please verify your token.');
    }
  };

  const handleTest = () => {
    if (!token.trim()) {
      toast.warning('Enter a token first, then click Test.');
      return;
    }
    configureMixpanel(token.trim(), apiHost);
    if (!isMixpanelEnabled()) {
      toast.error('Mixpanel is not enabled. Check your token and try again.');
      return;
    }
    track('Analytics Test Event', { residency: dataResidency, ts: Date.now() });
    toast.info('Test event sent. Check your Mixpanel Live View.');
  };

  const handleDisable = () => {
    try {
      localStorage.removeItem('MIXPANEL_TOKEN');
      localStorage.removeItem('MIXPANEL_API_HOST');
    } catch {}
    reset();
    toast.message('Analytics disabled for this browser.');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Analytics Settings</DialogTitle>
          <DialogDescription>
            Add your Mixpanel project token to enable basic analytics. You can choose EU or US data residency.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mixpanel-token">Project token</Label>
            <Input
              id="mixpanel-token"
              placeholder="Mixpanel project token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Label>Data residency</Label>
            <RadioGroup
              className="grid grid-cols-2 gap-3"
              value={dataResidency}
              onValueChange={(v) => setDataResidency(v as 'us' | 'eu')}
            >
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="us" id="res-us" />
                <Label htmlFor="res-us" className="cursor-pointer">US (default)</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="eu" id="res-eu" />
                <Label htmlFor="res-eu" className="cursor-pointer">EU</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleTest}>Send Test Event</Button>
            <Button onClick={handleSave}>Save</Button>
            <div className="ml-auto" />
            <Button variant="outline" onClick={handleDisable}>Disable</Button>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsSettingsDialog;
