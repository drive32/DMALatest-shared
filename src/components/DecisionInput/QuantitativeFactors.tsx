import React from 'react';
import { PlusCircle, MinusCircle, DollarSign, Percent, Hash } from 'lucide-react';
import { QuantitativeFactor } from '../../types';

interface Props {
  factors: QuantitativeFactor[];
  onChange: (factors: QuantitativeFactor[]) => void;
}

export function QuantitativeFactors({ factors, onChange }: Props) {
  const addFactor = () => {
    onChange([
      ...factors,
      {
        id: crypto.randomUUID(),
        name: '',
        value: 0,
        unit: '',
        type: 'neutral'
      }
    ]);
  };

  const removeFactor = (id: string) => {
    onChange(factors.filter(f => f.id !== id));
  };

  const updateFactor = (id: string, updates: Partial<QuantitativeFactor>) => {
    onChange(factors.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const commonUnits = [
    { icon: DollarSign, value: 'USD', label: 'USD' },
    { icon: Percent, value: '%', label: 'Percentage' },
    { icon: Hash, value: '', label: 'Number' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Quantitative Factors</h3>
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
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={factor.name}
                  onChange={(e) => updateFactor(factor.id, { name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g., Salary, Cost, Duration"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Value</label>
                  <input
                    type="number"
                    value={factor.value}
                    onChange={(e) => updateFactor(factor.id, { value: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <select
                    value={factor.unit}
                    onChange={(e) => updateFactor(factor.id, { unit: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {commonUnits.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={factor.type}
                onChange={(e) => updateFactor(factor.id, { type: e.target.value as 'cost' | 'benefit' | 'neutral' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="benefit">Benefit</option>
                <option value="cost">Cost</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => removeFactor(factor.id)}
              className="mt-6 text-red-600 hover:text-red-700"
            >
              <MinusCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}