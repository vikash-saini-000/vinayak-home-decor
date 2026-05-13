import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { HiArrowUp } from 'react-icons/hi';
import { contactAPI } from '../services/api';

const Footer = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contactInfo, setContactInfo] = useState({
    phone: '+91 98765 43210',
    email: 'info@vinayakhomedecor.com',
    address: 'Main Market, India',
    whatsapp: '+91 98765 43210',
    instagram: '',
    facebook: '',
    youtube: '',
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await contactAPI.get();
        if (data) setContactInfo((prev) => ({ ...prev, ...data }));
      } catch {
        // keep defaults
      }
    };
    fetchContact();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');
  const socialLinks = [
    { icon: <FaInstagram />, href: contactInfo.instagram || '#', label: 'Instagram' },
    { icon: <FaFacebookF />, href: contactInfo.facebook || '#', label: 'Facebook' },
    { icon: <FaYoutube />, href: contactInfo.youtube || '#', label: 'YouTube' },
    { icon: <FaWhatsapp />, href: `https://wa.me/${whatsappNumber}`, label: 'WhatsApp' },
  ];

  return (
    <footer ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C8A97E]/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-4">
              Vinayak<span className="text-[#C8A97E]">.</span>
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Crafting luxury living spaces with furniture that speaks the language of elegance and comfort.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h4 className="text-[#C8A97E] text-xs tracking-[0.3em] uppercase mb-6">Navigation</h4>
            <div className="flex flex-col gap-3">
              {['Home', 'Collections', 'About', 'Gallery', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-white/40 text-sm hover:text-[#C8A97E] transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h4 className="text-[#C8A97E] text-xs tracking-[0.3em] uppercase mb-6">Collections</h4>
            <div className="flex flex-col gap-3">
              {['Sofas', 'Beds', 'Office Furniture', 'Dining', 'Decor', 'Custom Furniture'].map((item) => (
                <Link
                  key={item}
                  to="/collections"
                  className="text-white/40 text-sm hover:text-[#C8A97E] transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h4 className="text-[#C8A97E] text-xs tracking-[0.3em] uppercase mb-6">Contact</h4>
            <div className="flex flex-col gap-3 text-white/40 text-sm">
              <p>Vinayak Home Decor</p>
              <p>{contactInfo.address}</p>
              <p>{contactInfo.phone}</p>
              <p>{contactInfo.email}</p>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} Vinayak Home Decor. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          <motion.button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full border border-[#C8A97E]/20 flex items-center justify-center text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#0A0A0A] transition-all duration-300"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiArrowUp />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
