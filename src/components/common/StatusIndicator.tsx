import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning' | 'info' | 'destructive' | 'muted';

interface StatusIndicatorProps {
  status: string;
  type?: StatusType;
  className?: string;
  showDot?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  type,
  className,
  showDot = false
}) => {
  const getStatusType = (status: string): StatusType => {
    if (type) return type;
    
    // Auto-detect status type based on common patterns
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('active') || statusLower.includes('running') || statusLower.includes('live')) {
      return 'success';
    }
    if (statusLower.includes('inactive') || statusLower.includes('stopped') || statusLower.includes('not started')) {
      return 'info';
    }
    if (statusLower.includes('pending') || statusLower.includes('progress') || statusLower.includes('processing')) {
      return 'warning';
    }
    if (statusLower.includes('error') || statusLower.includes('failed') || statusLower.includes('failed')) {
      return 'error';
    }
    
    return 'inactive';
  };

  const getVariant = (statusType: StatusType) => {
    switch (statusType) {
      case 'active':
      case 'success':
        return 'success';
      case 'inactive':
      case 'info':
        return 'info';
      case 'pending':
      case 'warning':
        return 'warning';
      case 'error':
        return 'destructive';
      default:
        return 'muted';
    }
  };

  const statusType = getStatusType(status);
  const variant = getVariant(statusType);

  return (
    <Badge 
      variant={variant} 
      className={cn(
        showDot && "flex items-center gap-1.5",
        className
      )}
    >
      {showDot && (
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          statusType === 'success' && "bg-green-500",
          statusType === 'info' && "bg-blue-500", 
          statusType === 'warning' && "bg-yellow-500",
          statusType === 'error' && "bg-red-500",
          !['success', 'info', 'warning', 'error'].includes(statusType) && "bg-muted-foreground"
        )} />
      )}
      <span className="capitalize">{status}</span>
    </Badge>
  );
};

export default StatusIndicator;