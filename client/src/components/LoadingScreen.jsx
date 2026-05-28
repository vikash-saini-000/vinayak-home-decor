import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-2 border-white/10 border-t-purple-400 rounded-full mx-auto mb-6"
      />
      <p className="text-sm text-zinc-500 tracking-widest uppercase">Loading</p>
    </motion.div>
  </div>
);

export default LoadingScreen;
