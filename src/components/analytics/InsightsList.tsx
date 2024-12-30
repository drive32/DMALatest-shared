import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface InsightsListProps {
  pros: string[];
  cons: string[];
}

export function InsightsList({ pros, cons }: InsightsListProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-emerald-600 flex items-center gap-2">
          <CheckCircle2 size={20} />
          Supporting Factors
        </h3>
        <ul className="space-y-2">
          {pros.map((pro, index) => (
            <li 
              key={index}
              className="flex items-start gap-2 text-gray-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
              {pro}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-rose-600 flex items-center gap-2">
          <XCircle size={20} />
          Challenging Factors
        </h3>
        <ul className="space-y-2">
          {cons.map((con, index) => (
            <li 
              key={index}
              className="flex items-start gap-2 text-gray-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}