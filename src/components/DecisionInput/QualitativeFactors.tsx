import React from 'react';
import { PlusCircle, MinusCircle, Star } from 'lucide-react';
import { QualitativeFactor } from '../../types';

interface Props {
  factors: QualitativeFactor[];
  onChange: (factors: QualitativeFactor[]) => void;
}

export function QualitativeFactors({ factors, onChange }: Props) {
  const addFactor = () => {
    onChange([
      ...factors,
      {
        id: crypto.randomUUID(),
        category: '',
        description: '',
        impact: 'neutral',
        importance: 3
      }
    ]);
  };

  const removeFactor = (id: string) => {
    onChange(factors.filter(f => f.id !== id));
  };

  const updateFactor = (id: string, updates: Partial<QualitativeFactor>) => {
    onChange(factors.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Qualitative Factors</h3>
        <button
          type="button"
          onClick={addFactor}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Factor
        </button>
      </div>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={factor.category}
                    onChange={(e) => updateFactor(factor.id, { category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Work-Life Balance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Impact</label>
                  <select
                    value={factor.impact}
                    onChange={(e) => updateFactor(factor.id, { impact: e.target.value as 'positive' | 'negative' | 'neutral' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={factor.description}
                  onChange={(e) => updateFactor(factor.id, { description: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Describe this factor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Importance</label>
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => updateFactor(factor.id, { importance: rating as 1 | 2 | 3 | 4 | 5 })}
                      className={`p-1 rounded-full ${factor.importance >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeFactor(factor.id)}
              className="text-red-600 hover:text-red-700"
            >
              <MinusCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}