import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const RevealAnimation = ({ show, matchName, matchAvatar, onClose }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
          className="relative max-w-sm w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute -inset-20 bg-purple-500/10 blur-3xl rounded-full animate-pulse-slow" />

          <div className="relative glass p-10 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/[0.06] text-zinc-500 transition-colors"
            >
              <X size={18} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 15 }}
              className="relative mx-auto mb-6"
            >
              {matchAvatar ? (
                <img
                  src={matchAvatar}
                  alt={matchName}
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/30 mx-auto"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold text-purple-400">
                    {matchName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-1 -right-1"
              >
                <Sparkles size={20} className="text-purple-400" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-purple-400 uppercase tracking-widest mb-2">Mutual Match</p>
              <h2 className="text-2xl font-bold text-white mb-2">
                It&apos;s a Match.
              </h2>
              <p className="text-lg text-zinc-300 mb-1">{matchName}</p>
              <p className="text-sm text-zinc-500">
                The feelings are mutual. What happens next is up to you.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default RevealAnimation;
