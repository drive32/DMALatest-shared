import React from 'react';
import { Share2, Link as LinkIcon, Twitter, Facebook, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareSectionProps {
  decisionId: string;
}

export function ShareSection({ decisionId }: ShareSectionProps) {
  const shareUrl = `${window.location.origin}/decision/${decisionId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out my decision on Decikar.ai!`,
      '_blank'
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Check out my decision on Decikar.ai&body=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100">
          Share Decision
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sand-100 dark:bg-sand-700 text-sand-900 dark:text-sand-100 hover:bg-sand-200 dark:hover:bg-sand-600 transition-colors"
        >
          <LinkIcon className="w-4 h-4" />
          Copy Link
        </button>

        <button
          onClick={shareOnTwitter}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </button>

        <button
          onClick={shareOnFacebook}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20 transition-colors"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </button>

        <button
          onClick={shareViaEmail}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sand-100 dark:bg-sand-700 text-sand-900 dark:text-sand-100 hover:bg-sand-200 dark:hover:bg-sand-600 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
      </div>
    </motion.div>
  );
}