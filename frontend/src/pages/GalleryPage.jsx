import { motion } from 'framer-motion';
import GallerySection from '../components/sections/GallerySection';

const GalleryPage = () => {
  return (
    <div className="min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#C8A97E] text-xs tracking-[0.4em] uppercase mb-4 block"
        >
          Our Work
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-semibold text-white"
        >
          Design <span className="text-gradient">Gallery</span>
        </motion.h1>
      </div>
      <GallerySection />
    </div>
  );
};

export default GalleryPage;
