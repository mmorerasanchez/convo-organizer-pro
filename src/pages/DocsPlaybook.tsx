import React, { useEffect, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
// Vite supports importing text as raw via ?raw
import playbookMd from '../../docs/product-playbook.md?raw';

const DocsPlaybook: React.FC = () => {
  useEffect(() => {
    document.title = 'Product Playbook | Promptito';
  }, []);

  const blobUrl = useMemo(() => {
    const blob = new Blob([playbookMd], { type: 'text/markdown;charset=utf-8' });
    return URL.createObjectURL(blob);
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <PageHeader
          title="Product Playbook"
          description="Central reference for objectives, design system, architecture, schema, integrations, and guidelines"
        />

        <div className="flex flex-wrap gap-3">
          <a href={blobUrl} download="product-playbook.md">
            <Button variant="secondary">Download Markdown</Button>
          </a>
          <Button variant="outline" onClick={() => window.print()}>Print / Save as PDF</Button>
        </div>

        <article className="mt-4 space-y-6 text-sm leading-6">
          <ReactMarkdown>{playbookMd}</ReactMarkdown>
        </article>
      </div>
    </MainLayout>
  );
};

export default DocsPlaybook;
