import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, Eye, Bell, UserCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CardSkeleton } from '../components/Skeleton';

const StatCard = ({ icon: Icon, label, value, to, color = 'zinc' }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/10 flex items-center justify-center`}>
          <Icon size={18} className={`text-${color}-400`} />
        </div>
        <ArrowRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </motion.div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ crushes: 0, pendingMatches: 0, revealedMatches: 0, notifications: 0 });
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const [crushRes, matchRes, notifRes] = await Promise.all([
        api.get('/api/crush/my'),
        api.get('/api/matches'),
        api.get('/api/notifications?limit=5'),
      ]);

      const matches = matchRes.data;
      const pending = matches.filter((m) => m.status === 'pending');
      const revealed = matches.filter((m) => m.revealed);

      setStats({
        crushes: crushRes.data.length,
        pendingMatches: pending.length,
        revealedMatches: revealed.length,
        notifications: notifRes.data.unreadCount,
      });

      setRecentMatches(matches.slice(0, 3));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {greeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-zinc-500 text-sm">
          Here&apos;s what&apos;s happening with your crushes.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Heart} label="Crushes Sent" value={stats.crushes} to="/search" color="purple" />
            <StatCard icon={Eye} label="Pending Reveals" value={stats.pendingMatches} to="/matches" color="zinc" />
            <StatCard icon={Sparkles} label="Revealed Matches" value={stats.revealedMatches} to="/matches" color="purple" />
            <StatCard icon={Bell} label="Unread Alerts" value={stats.notifications} to="/notifications" color="zinc" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Link
                  to="/search"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <Search size={18} className="text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Search Students</p>
                    <p className="text-xs text-zinc-600">Find and add your crushes</p>
                  </div>
                  <ArrowRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </Link>
                <Link
                  to="/matches"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <Eye size={18} className="text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">View Matches</p>
                    <p className="text-xs text-zinc-600">Check pending and revealed matches</p>
                  </div>
                  <ArrowRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <UserCircle size={18} className="text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Edit Profile</p>
                    <p className="text-xs text-zinc-600">Update your branch and bio</p>
                  </div>
                  <ArrowRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Recent Matches</h2>
                <Link to="/matches" className="text-xs text-zinc-500 hover:text-white transition-colors">
                  View all
                </Link>
              </div>
              {recentMatches.length === 0 ? (
                <div className="text-center py-10">
                  <Heart size={24} className="text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No mutual feelings yet.</p>
                  <p className="text-xs text-zinc-600 mt-1">Start by adding some crushes!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMatches.map((match) => (
                    <div key={match._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        {match.revealed && match.otherUser?.avatar ? (
                          <img src={match.otherUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <Eye size={16} className="text-zinc-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {match.revealed ? match.otherUser?.name : 'Hidden Match'}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {match.revealed ? 'Revealed' : match.userConfirmed ? 'Waiting...' : 'Pending your response'}
                        </p>
                      </div>
                      {match.revealed && (
                        <Sparkles size={14} className="text-purple-400" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
