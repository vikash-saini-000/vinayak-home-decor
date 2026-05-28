import { motion } from 'framer-motion';
import { Eye, EyeOff, X, Clock, Sparkles } from 'lucide-react';

const MatchCard = ({ match, onConfirm, onDecline, loading }) => {
  const isPending = match.status === 'pending';
  const isRevealed = match.revealed;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card relative overflow-hidden ${
        isRevealed ? 'border-purple-500/20' : ''
      }`}
    >
      {isRevealed && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
      )}

      <div className="relative">
        {isRevealed ? (
          <div className="flex items-center gap-4">
            <div className="relative">
              {match.otherUser?.avatar ? (
                <img
                  src={match.otherUser.avatar}
                  alt={match.otherUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-400">
                    {match.otherUser?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <Sparkles size={14} className="absolute -bottom-1 -right-1 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{match.otherUser?.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Revealed
                </span>
              </div>
              <p className="text-sm text-zinc-500">{match.otherUser?.email}</p>
              {(match.otherUser?.branch || match.otherUser?.year) && (
                <p className="text-xs text-zinc-600 mt-1">
                  {match.otherUser?.branch}{match.otherUser?.branch && match.otherUser?.year && ' · '}{match.otherUser?.year}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <EyeOff size={20} className="text-zinc-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-300">Hidden Match</h3>
              <p className="text-sm text-zinc-500">Someone you added also added you</p>
              {match.userConfirmed && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={12} className="text-zinc-600" />
                  <span className="text-xs text-zinc-600">Waiting for them to confirm...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {isPending && !match.userConfirmed && (
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => onConfirm(match._id)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              <Eye size={16} />
              Reveal Match
            </button>
            <button
              onClick={() => onDecline(match._id)}
              disabled={loading}
              className="px-4 py-2.5 border border-white/[0.08] rounded-xl text-zinc-400 hover:text-red-400 hover:border-red-500/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MatchCard;
