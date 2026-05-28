import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-8xl font-bold text-zinc-800 mb-4">404</p>
      <h1 className="text-xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-zinc-500 mb-8">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft size={16} />
        Go Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
