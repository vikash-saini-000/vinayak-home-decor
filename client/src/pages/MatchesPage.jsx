import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import api from '../services/api';
import MatchCard from '../components/MatchCard';
import RevealAnimation from '../components/RevealAnimation';
import EmptyState from '../components/EmptyState';
import { ListSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [revealData, setRevealData] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchMatches = useCallback(async () => {
    try {
      const { data } = await api.get('/api/matches');
      setMatches(data);
    } catch {
      toast.error('Failed to load matches.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleConfirm = async (matchId) => {
    setActionLoading(true);
    try {
      const { data } = await api.post(`/api/matches/${matchId}/confirm`);
      toast.success(data.message);

      if (data.revealed) {
        await fetchMatches();
        const revealed = matches.find((m) => m._id === matchId) ||
          (await api.get('/api/matches')).data.find((m) => m._id === matchId);

        if (revealed?.otherUser) {
          setRevealData({
            name: revealed.otherUser.name,
            avatar: revealed.otherUser.avatar,
          });
        }
      } else {
        await fetchMatches();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async (matchId) => {
    setActionLoading(true);
    try {
      await api.post(`/api/matches/${matchId}/decline`);
      toast.success('Match declined.');
      setMatches((prev) => prev.filter((m) => m._id !== matchId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to decline.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = matches.filter((m) => {
    if (filter === 'pending') return m.status === 'pending';
    if (filter === 'revealed') return m.revealed;
    return true;
  });

  const pendingCount = matches.filter((m) => m.status === 'pending').length;
  const revealedCount = matches.filter((m) => m.revealed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold mb-1">Your Matches</h1>
        <p className="text-sm text-zinc-500">Manage your mutual crush matches.</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: `All (${matches.length})` },
          { key: 'pending', label: `Pending (${pendingCount})` },
          { key: 'revealed', label: `Revealed (${revealedCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              filter === tab.key
                ? 'bg-white text-black'
                : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={filter === 'revealed' ? Sparkles : Heart}
          title={
            filter === 'pending'
              ? 'No pending matches'
              : filter === 'revealed'
                ? 'No revealed matches yet'
                : 'No mutual feelings yet.'
          }
          description={
            filter === 'all'
              ? 'When someone you added also adds you, a match will appear here.'
              : filter === 'pending'
                ? 'All your matches have been resolved.'
                : 'Confirm a pending match to see revealed identities.'
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              onConfirm={handleConfirm}
              onDecline={handleDecline}
              loading={actionLoading}
            />
          ))}
        </div>
      )}

      <RevealAnimation
        show={!!revealData}
        matchName={revealData?.name}
        matchAvatar={revealData?.avatar}
        onClose={() => setRevealData(null)}
      />
    </div>
  );
};

export default MatchesPage;
