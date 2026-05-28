import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';
import EmptyState from '../components/EmptyState';
import { ListSkeleton } from '../components/Skeleton';

const typeColors = {
  mutual_crush: 'purple',
  match_revealed: 'green',
  match_declined: 'red',
  crush_added: 'blue',
  welcome: 'zinc',
  report_update: 'amber',
};

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-sm text-zinc-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white glass transition-all duration-300 hover:bg-white/[0.06]"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </motion.div>

      {loading ? (
        <ListSkeleton count={5} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You'll be notified when someone you like feels the same way."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const color = typeColors[notif.type] || 'zinc';
            return (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !notif.read && markAsRead(notif._id)}
                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  notif.read
                    ? 'bg-transparent hover:bg-white/[0.02]'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  notif.read ? 'bg-transparent' : `bg-${color}-400`
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${notif.read ? 'text-zinc-500' : 'text-zinc-200'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">{formatTime(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <button className="p-1 rounded hover:bg-white/[0.06] text-zinc-600 shrink-0">
                    <Check size={14} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
