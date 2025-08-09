import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ToolDirectoryItem } from '@/lib/toolsDirectory';

interface ToolsTableViewProps {
  items: ToolDirectoryItem[];
}

const ToolsTableView: React.FC<ToolsTableViewProps> = ({ items }) => {
  if (!items.length) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No tools found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tool</TableHead>
            <TableHead>Primary Category</TableHead>
            <TableHead>Secondary Category</TableHead>
            <TableHead>URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((tool) => (
            <TableRow key={`${tool.name}-${tool.url}`} className="hover:bg-muted/40">
              <TableCell className="font-semibold">{tool.name}</TableCell>
              <TableCell className="text-muted-foreground">{tool.primaryCategory}</TableCell>
              <TableCell className="text-muted-foreground">{tool.secondaryCategory}</TableCell>
              <TableCell>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  aria-label={`Open ${tool.name} in a new tab`}
                >
                  {tool.url.replace(/^https?:\/\//, '')}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ToolsTableView;
