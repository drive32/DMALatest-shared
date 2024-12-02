import React, { useState } from 'react';
import { Brain, Calendar } from 'lucide-react';
import { useStore } from '../store';
import { QuantitativeFactors } from './DecisionInput/QuantitativeFactors';
import { QualitativeFactors } from './DecisionInput/QualitativeFactors';
import { Preferences } from './DecisionInput/Preferences';
import type { QuantitativeFactor, QualitativeFactor, Preference } from '../types';

export function NewDecision() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [quantitativeFactors, setQuantitativeFactors] = useState<QuantitativeFactor[]>([]);
  const [qualitativeFactors, setQualitativeFactors] = useState<QualitativeFactor[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  
  const addDecision = useStore(state => state.addDecision);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    
    addDecision({
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      quantitativeFactors,
      qualitativeFactors,
      preferences
    });

    setTitle('');
    setDescription('');
    setDeadline('');
    setQuantitativeFactors([]);
    setQualitativeFactors([]);
    setPreferences([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg ring-1 ring-sand-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">New Decision</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              What decision do you need to make?
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border-sand-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="e.g., Should I accept the job offer?"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Provide more context
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-lg border-sand-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Describe your situation, options, and any important factors..."
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Decision Deadline
            </label>
            <div className="mt-1 relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-sand-400" />
              </div>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="block w-full pl-10 rounded-lg border-sand-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <QuantitativeFactors
            factors={quantitativeFactors}
            onChange={setQuantitativeFactors}
          />
          
          <QualitativeFactors
            factors={qualitativeFactors}
            onChange={setQualitativeFactors}
          />
          
          <Preferences
            preferences={preferences}
            onChange={setPreferences}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-ocean-600 hover:from-purple-700 hover:to-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
        >
          Get AI Recommendations
        </button>
      </form>
    </div>
  );
}