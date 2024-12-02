import React from 'react';
import { PlusCircle, MinusCircle, Check } from 'lucide-react';
import { Preference } from '../../types';

interface Props {
  preferences: Preference[];
  onChange: (preferences: Preference[]) => void;
}

export function Preferences({ preferences, onChange }: Props) {
  const addPreference = () => {
    onChange([
      ...preferences,
      {
        id: crypto.randomUUID(),
        factor: '',
        weight: 3,
        mustHave: false
      }
    ]);
  };

  const removePreference = (id: string) => {
    onChange(preferences.filter(p => p.id !== id));
  };

  const updatePreference = (id: string, updates: Partial<Preference>) => {
    onChange(preferences.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
        <button
          type="button"
          onClick={addPreference}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Preference
        </button>
      </div>

      <div className="space-y-3">
        {preferences.map((preference) => (
          <div key={preference.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
            <div className="flex-1">
              <input
                type="text"
                value={preference.factor}
                onChange={(e) => updatePreference(preference.id, { factor: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="What matters to you?"
              />
            </div>

            <div className="w-32">
              <select
                value={preference.weight}
                onChange={(e) => updatePreference(preference.id, { weight: parseInt(e.target.value) })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="1">Low</option>
                <option value="2">Medium-Low</option>
                <option value="3">Medium</option>
                <option value="4">Medium-High</option>
                <option value="5">High</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => updatePreference(preference.id, { mustHave: !preference.mustHave })}
              className={`p-2 rounded-md ${
                preference.mustHave 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Check className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => removePreference(preference.id)}
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