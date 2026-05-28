import { motion } from 'framer-motion';
import { Heart, UserX, Flag } from 'lucide-react';

const UserCard = ({ user, onAddCrush, onBlock, onReport, isCrushed, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card group"
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-white/[0.08] grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <span className="text-lg font-semibold text-zinc-400">
              {user.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{user.name}</h3>
        <p className="text-sm text-zinc-500 truncate">{user.email}</p>
        {(user.branch || user.year) && (
          <p className="text-xs text-zinc-600 mt-1">
            {user.branch}{user.branch && user.year && ' · '}{user.year}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {onAddCrush && (
          <button
            onClick={() => onAddCrush(user._id)}
            disabled={isCrushed || loading}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isCrushed
                ? 'bg-purple-500/10 text-purple-400 cursor-not-allowed'
                : 'hover:bg-white/[0.06] text-zinc-400 hover:text-purple-400'
            }`}
            title={isCrushed ? 'Already added' : 'Add crush'}
          >
            <Heart size={18} fill={isCrushed ? 'currentColor' : 'none'} />
          </button>
        )}
        {onReport && (
          <button
            onClick={() => onReport(user._id)}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-amber-400 transition-all duration-300"
            title="Report"
          >
            <Flag size={16} />
          </button>
        )}
        {onBlock && (
          <button
            onClick={() => onBlock(user._id)}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-red-400 transition-all duration-300"
            title="Block"
          >
            <UserX size={16} />
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

export default UserCard;
