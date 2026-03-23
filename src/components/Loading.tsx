import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
      <div className="flex flex-col items-center space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-blue-600/20"
        >
          X
        </motion.div>
        <div className="flex space-x-1.5">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
