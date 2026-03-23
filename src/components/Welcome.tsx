import { motion } from 'framer-motion';
import { MessageSquare, Code, Zap, Shield } from 'lucide-react';

export const Welcome = () => {
  const features = [
    {
      icon: <MessageSquare size={20} className="text-blue-400" />,
      title: "Natural Conversations",
      desc: "Experience human-like dialogue with advanced reasoning."
    },
    {
      icon: <Code size={20} className="text-purple-400" />,
      title: "Coding Assistant",
      desc: "Generate, debug, and explain code in seconds."
    },
    {
      icon: <Zap size={20} className="text-yellow-400" />,
      title: "Fast Responses",
      desc: "Real-time streaming for an instant chat experience."
    },
    {
      icon: <Shield size={20} className="text-emerald-400" />,
      title: "Secure History",
      desc: "Your chats are private and stored securely."
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-blue-600/20 mx-auto mb-6">
          X
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          How can I help you today?
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Chat X is your premium AI companion for creative writing, coding, and more.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ scale: 1.02 }}
            className="glass-panel p-6 rounded-3xl text-left flex items-start gap-4 border-white/5 hover:border-white/10 transition-all cursor-pointer group"
          >
            <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5 shadow-inner">
              {f.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
        <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Try asking:</span>
        {["Write a React component", "Explain quantum physics", "Plan a 3-day trip to Tokyo"].map((q, i) => (
          <button
            key={i}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs text-gray-400 transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
