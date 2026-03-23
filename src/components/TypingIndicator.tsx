import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  return (
    <div className="flex space-x-1.5 p-3 bg-white/5 rounded-2xl rounded-tl-sm w-fit border border-white/5">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
      />
    </div>
  );
};
