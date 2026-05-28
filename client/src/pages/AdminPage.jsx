import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Flag, Shield, Search, UserX, UserCheck, ChevronDown, BarChart3 } from 'lucide-react';
import api from '../services/api';
import { ListSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportFilter, setReportFilter] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/api/admin/stats');
      setStats(data);
    } catch {
      toast.error('Failed to load stats.');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      const { data } = await api.get('/api/admin/users', { params });
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users.');
    }
  }, [searchQuery]);

  const fetchReports = useCallback(async () => {
    try {
      const params = {};
      if (reportFilter) params.status = reportFilter;
      const { data } = await api.get('/api/admin/reports', { params });
      setReports(data.reports);
    } catch {
      toast.error('Failed to load reports.');
    }
  }, [reportFilter]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchReports()]);
      setLoading(false);
    };
    load();
  }, [fetchStats, fetchUsers, fetchReports]);

  const handleDisable = async (userId) => {
    try {
      await api.post(`/api/admin/users/${userId}/disable`);
      toast.success('User disabled.');
      fetchUsers();
    } catch {
      toast.error('Failed to disable user.');
    }
  };

  const handleEnable = async (userId) => {
    try {
      await api.post(`/api/admin/users/${userId}/enable`);
      toast.success('User enabled.');
      fetchUsers();
    } catch {
      toast.error('Failed to enable user.');
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      await api.put(`/api/admin/reports/${reportId}`, { status });
      toast.success('Report updated.');
      fetchReports();
      fetchStats();
    } catch {
      toast.error('Failed to update report.');
    }
  };

  const tabs = [
    { key: 'stats', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'reports', label: 'Reports', icon: Flag },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Shield size={24} className="text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-zinc-500">Manage users and reports.</p>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              tab === t.key
                ? 'bg-white text-black'
                : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton count={4} />
      ) : (
        <>
          {tab === 'stats' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Users', value: stats.totalUsers, icon: Users },
                { label: 'Crushes', value: stats.totalCrushes, icon: Heart },
                { label: 'Matches', value: stats.totalMatches, icon: Heart },
                { label: 'Reports', value: stats.totalReports, icon: Flag },
                { label: 'Pending', value: stats.pendingReports, icon: Flag },
              ].map((s) => (
                <div key={s.label} className="glass-card text-center">
                  <s.icon size={18} className="text-zinc-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div>
              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="input-field pl-11"
                />
              </div>
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u._id} className="glass-card flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.06] flex items-center justify-center shrink-0">
                      {u.avatar ? (
                        <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-zinc-400">{u.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{u.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {u.isDisabled ? (
                        <button
                          onClick={() => handleEnable(u._id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                        >
                          <UserCheck size={14} />
                          Enable
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDisable(u._id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                          <UserX size={14} />
                          Disable
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="input-field max-w-[200px] appearance-none"
                >
                  <option value="">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <p className="text-center text-zinc-500 py-10">No reports found.</p>
                ) : (
                  reports.map((r) => (
                    <div key={r._id} className="glass-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium">
                            <span className="text-zinc-400">{r.reportedBy?.name}</span>
                            {' reported '}
                            <span className="text-white">{r.reportedUser?.name}</span>
                          </p>
                          <p className="text-xs text-zinc-600 mt-1">Reason: {r.reason}</p>
                          {r.description && (
                            <p className="text-xs text-zinc-500 mt-1">{r.description}</p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          r.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                          r.status === 'resolved' ? 'bg-green-500/10 text-green-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      {r.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateReport(r._id, 'resolved')}
                            className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleUpdateReport(r._id, 'dismissed')}
                            className="px-3 py-1.5 text-xs rounded-lg bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
