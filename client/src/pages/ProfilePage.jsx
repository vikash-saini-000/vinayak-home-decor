import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, BookOpen, Calendar, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const YEARS = ['', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const [branch, setBranch] = useState(user?.branch || '');
  const [year, setYear] = useState(user?.year || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/api/user/update', { branch, year, bio });
      setUser(data);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-sm text-zinc-500">Manage your account details.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 mb-6"
      >
        <div className="flex items-center gap-5 mb-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border border-white/[0.08]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-400">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <div className="flex items-center gap-1 text-sm text-zinc-500">
              <Mail size={14} />
              {user?.email}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02]">
          <div className="text-center">
            <p className="text-xl font-bold">{user?.crushesCount || 0}</p>
            <p className="text-xs text-zinc-500">Crushes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{user?.matchesCount || 0}</p>
            <p className="text-xs text-zinc-500">Matches</p>
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSave}
        className="glass p-6 space-y-5"
      >
        <h3 className="font-semibold">Edit Profile</h3>

        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <BookOpen size={14} />
            Branch / Department
          </label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="e.g. Computer Science"
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <Calendar size={14} />
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="input-field appearance-none"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y || 'Select year'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <FileText size={14} />
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others a little about yourself..."
            maxLength={200}
            rows={3}
            className="input-field resize-none"
          />
          <p className="text-xs text-zinc-600 mt-1">{bio.length}/200</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <button
          onClick={logout}
          className="btn-danger w-full flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
