import React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
  valueClassName,
  onClick,
}: StatsCardProps) {
  
  
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-md overflow-hidden",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold tracking-tight truncate" style={{ lineHeight: '1.5' }}>
          <span className={valueClassName}>{value}</span>
        </div>       
      </CardContent>
    </Card>
  );
}
