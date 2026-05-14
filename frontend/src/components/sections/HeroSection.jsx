import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { HiArrowDown } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { settingsAPI } from '../../services/api';

const HeroSection = () => {
  const heroRef = useRef(null);
  const parallaxRef = useRef(null);
  const [whatsappNumber, setWhatsappNumber] = useState('917737040962');

  useEffect(() => {
    settingsAPI.get().then(({ data }) => {
      if (data?.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0003})`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line',
        { width: 0 },
        { width: '120px', duration: 1.5, delay: 0.5, ease: 'power3.out' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      <div
        ref={parallaxRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/40 to-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />

      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C8A97E]/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-[#E8956A]/5 rounded-full blur-[120px]" />

      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="hero-line h-[1px] bg-[#C8A97E]" />
          <span className="text-[#C8A97E] text-xs tracking-[0.4em] uppercase">
            Premium Furniture
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold text-white leading-[0.9] tracking-tight"
          >
            Vinayak
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold leading-[0.9] tracking-tight"
          >
            <span className="text-gradient">Home Decor</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 text-white/50 text-base md:text-lg max-w-lg leading-relaxed"
        >
          Where craftsmanship meets luxury. Discover furniture that transforms
          spaces into stories of elegance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center gap-5 md:gap-6"
        >
          <Link
            to="/collections"
           className="group relative flex items-center justify-center min-w-[230px] px-8 py-4 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#C8A97E]/20"
          >
            <span className="relative z-10">Explore Collections</span>
            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-center min-w-[230px] px-8 py-4 border border-white/20 text-white text-sm tracking-[0.2em] uppercase hover:border-[#C8A97E] hover:text-[#C8A97E] transition-all duration-500"
          >
            Get in Touch
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I visited your website and I am interested in your furniture.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 min-w-[230px] px-8 py-4 bg-[#25D366] text-white text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#22c55e] transition-all duration-500 shadow-lg shadow-[#25D366]/10"
          >
            <FaWhatsapp className="text-lg" />
            WhatsApp
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#C8A97E]"
        >
          <HiArrowDown />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
