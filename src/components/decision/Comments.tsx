import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export function Comments({ comments, onAddComment }: CommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100">
          Discussion
        </h3>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {comment.author[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sand-900 dark:text-sand-100">
                  {comment.author}
                </span>
                <span className="text-sm text-sand-500 dark:text-sand-400">
                  {formatDistanceToNow(comment.createdAt)} ago
                </span>
              </div>
              <p className="mt-1 text-sand-700 dark:text-sand-300">
                {comment.text}
              </p>
            </div>
          </div>
        ))}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your thoughts..."
              className="flex-1 px-4 py-2 rounded-lg border border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 text-sand-900 dark:text-sand-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}