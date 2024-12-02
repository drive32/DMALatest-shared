import React from 'react';
import { useStore } from '../store';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, Users } from 'lucide-react';
import { AnalysisView } from './DecisionAnalysis/AnalysisView';

export function DecisionList() {
  const decisions = useStore(state => state.decisions);
  const [selectedDecision, setSelectedDecision] = React.useState<string | null>(null);

  if (decisions.length === 0) {
    return null;
  }

  const selected = decisions.find(d => d.id === selectedDecision);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Decisions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {decisions.map(decision => (
            <button
              key={decision.id}
              onClick={() => setSelectedDecision(decision.id)}
              className={`w-full text-left bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${
                selectedDecision === decision.id ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{decision.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created {formatDistanceToNow(decision.createdAt)} ago
                  </p>
                </div>
                <StatusBadge status={decision.status} />
              </div>
              
              <p className="text-gray-600 mt-2 line-clamp-2">{decision.description}</p>
              
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{decision.collaborators.length} collaborators</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{decision.aiRecommendations.length} recommendations</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="lg:col-span-2">
            <AnalysisView decision={selected} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    decided: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const icons = {
    pending: Clock,
    decided: CheckCircle,
    completed: CheckCircle
  };

  const Icon = icons[status as keyof typeof icons];
  const colorClass = colors[status as keyof typeof colors];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}