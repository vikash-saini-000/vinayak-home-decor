import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const REASONS = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate behavior' },
  { value: 'fake_account', label: 'Fake account' },
  { value: 'other', label: 'Other' },
];

const ReportModal = ({ show, onClose, userId }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error('Select a reason.');

    setLoading(true);
    try {
      await api.post('/api/reports', { userId, reason, description });
      toast.success('Report submitted.');
      onClose();
      setReason('');
      setDescription('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flag size={18} className="text-amber-400" />
                <h3 className="text-lg font-semibold">Report User</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/[0.06]">
                <X size={18} className="text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 ${
                      reason === r.value
                        ? 'bg-white/[0.06] border-white/[0.15] text-white'
                        : 'border-white/[0.06] text-zinc-400 hover:bg-white/[0.03]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details (optional)"
                maxLength={500}
                rows={3}
                className="input-field resize-none"
              />

              <button
                type="submit"
                disabled={!reason || loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
