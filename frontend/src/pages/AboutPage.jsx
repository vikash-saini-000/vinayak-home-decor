import { motion } from 'framer-motion';
import AboutSection from '../components/sections/AboutSection';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import TestimonialsSection from '../components/sections/TestimonialsSection';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#C8A97E] text-xs tracking-[0.4em] uppercase mb-4 block"
        >
          About Us
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-semibold text-white"
        >
          The Art of <span className="text-gradient">Living</span>
        </motion.h1>
      </div>
      <AboutSection />
      <WhyChooseUs />
      <TestimonialsSection />
    </div>
  );
};

export default AboutPage;
