import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  bgColor?: string;
  iconColor?: string;
  textColor?: string;
}

export function StatCard({ 
  icon: Icon,
  value,
  label,
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  textColor = 'text-blue-700'
}: StatCardProps) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl ${bgColor}`}>
      <Icon className={iconColor} />
      <div>
        <div className={`text-xl font-bold ${textColor}`}>{value}</div>
        <div className={`text-sm font-medium ${iconColor}`}>{label}</div>
      </div>
    </div>
  );
}