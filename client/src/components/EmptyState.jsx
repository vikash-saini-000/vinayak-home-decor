import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
        <Icon size={28} className="text-zinc-600" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title}</h3>
    <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
    {action}
  </motion.div>
);

export default EmptyState;
