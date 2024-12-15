import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useDecisions } from '../../hooks/useDecisions';
import type { Decision } from '../../types/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  editingDecision?: Decision | null;
}

export function NewDecisionModal({ isOpen, onClose, categories, editingDecision }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [decisionExpired,setDecisionExpired] = useState('');
  const [calculatedDateTime, setCalculatedDateTime] = useState<string | null>(null); // New datetime

  const { createDecision } = useDecisions();

  useEffect(() => {
    if (editingDecision) {
      setTitle(editingDecision.title);
      setDescription(editingDecision.description);
      setSelectedTags(editingDecision.category ? [editingDecision.category] : []);
    }
  }, [editingDecision]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      await createDecision({
        id: editingDecision?.id,
        title,
        description,
        category: selectedTags[0],
        image: image || undefined,
        decision_expired: decisionExpired,
      });
      onClose();
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setImage(null);
      setDecisionExpired('');
    } catch (error) {
      console.error('Error creating decision:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpiryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDays = parseInt(event.target.value, 10); // Convert to number
    setDecisionExpired(event.target.value);

    if (!isNaN(selectedDays) && selectedDays > 0) {
      const currentDate = new Date(); // Current date and time
      const newDate = new Date(currentDate.getTime() + selectedDays * 24 * 60 * 60 * 1000); // Add days

      // Format datetime as ISO 8601 (or customize it)
      const formattedDateTime = newDate.toISOString(); // Outputs: YYYY-MM-DDTHH:mm:ss.sssZ
      setCalculatedDateTime(formattedDateTime); // Set the calculated datetime
    } else {
      setCalculatedDateTime(null); // Reset if no valid days are selected
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="inline-block w-full max-w-2xl my-8 p-6 text-left align-middle bg-secondary rounded-2xl shadow-xl transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-2xl font-display font-bold text-primary">
                  {editingDecision ? 'Edit Decision' : 'Share Your Decision'}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-primary w-full"
                    placeholder="What decision do you need help with?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-primary w-full h-32 resize-none"
                    placeholder="Provide more context about your decision..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(category)
                              ? prev.filter(t => t !== category)
                              : [...prev, category]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(category)
                            ? 'bg-accent-500 text-white'
                            : 'bg-accent-50 text-accent-600 hover:bg-accent-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {image ? (
                        <div className="relative">
                          <img
                            src={image}
                            alt="Preview"
                            className="max-h-48 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-accent-600 hover:text-accent-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Expiration
                  </label>
                  <input
                    type="datetime-local"
                    id="decision_expired"
                    className="input-primary w-full transition-all focus:ring-2 focus:ring-accent-500 pl-10"
                    aria-label="Post Expiration"
                    value={decisionExpired}
                    onChange={(e) => setDecisionExpired(e.target.value)}              
                  />

                  
                </div>


                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !title.trim() || !description.trim()}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingDecision ? 'Updating...' : 'Posting...'}
                      </>
                    ) : (
                      editingDecision ? 'Update Decision' : 'Post Decision'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}