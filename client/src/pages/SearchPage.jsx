import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import UserCard from '../components/UserCard';
import EmptyState from '../components/EmptyState';
import ReportModal from '../components/ReportModal';
import { ListSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [crushedIds, setCrushedIds] = useState(new Set());
  const [addingId, setAddingId] = useState(null);
  const [reportUserId, setReportUserId] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  const fetchCrushes = useCallback(async () => {
    try {
      const { data } = await api.get('/api/crush/my');
      setCrushedIds(new Set(data.map((c) => c.toUser?._id || c.toUser)));
    } catch {
      // ignore
    }
  }, []);

  const searchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (debouncedQuery) params.q = debouncedQuery;
      if (branch) params.branch = branch;
      if (year) params.year = year;

      const { data } = await api.get('/api/user/search', { params });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Search failed.');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, branch, year, page]);

  useEffect(() => {
    fetchCrushes();
  }, [fetchCrushes]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, branch, year]);

  useEffect(() => {
    searchUsers();
  }, [searchUsers]);

  const handleAddCrush = async (userId) => {
    setAddingId(userId);
    try {
      const { data } = await api.post('/api/crush/add', { userId });
      toast.success(data.message);
      setCrushedIds((prev) => new Set([...prev, userId]));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add crush.');
    } finally {
      setAddingId(null);
    }
  };

  const handleBlock = async (userId) => {
    try {
      await api.post(`/api/user/block/${userId}`);
      toast.success('User blocked.');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      toast.error('Failed to block user.');
    }
  };

  const clearFilters = () => {
    setBranch('');
    setYear('');
  };

  const hasFilters = branch || year;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold mb-1">Search Students</h1>
        <p className="text-sm text-zinc-500">Find and add your secret crushes.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field pl-11 pr-12"
            autoFocus
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
              showFilters || hasFilters ? 'bg-purple-500/10 text-purple-400' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Filter size={16} />
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-wrap gap-3"
          >
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Branch (e.g. CSE)"
              className="input-field flex-1 min-w-[150px]"
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-field flex-1 min-w-[150px] appearance-none"
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {loading ? (
        <ListSkeleton count={5} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No students found"
          description={query ? `No results for "${query}". Try a different search.` : 'Start typing to search for students on your campus.'}
        />
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onAddCrush={handleAddCrush}
                onBlock={handleBlock}
                onReport={setReportUserId}
                isCrushed={crushedIds.has(user._id)}
                loading={addingId === user._id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-sm text-zinc-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ReportModal
        show={!!reportUserId}
        onClose={() => setReportUserId(null)}
        userId={reportUserId}
      />
    </div>
  );
};

export default SearchPage;
