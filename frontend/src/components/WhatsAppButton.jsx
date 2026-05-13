import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { settingsAPI } from '../services/api';

const WhatsAppButton = () => {
  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await settingsAPI.get();
        if (data?.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      } catch {
        // keep default
      }
    };
    fetchSettings();
  }, []);

  const msg = encodeURIComponent(
    'Hi! I visited your website and I am interested in your furniture collection. Could you share more details?'
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden sm:block bg-white text-[#0A0A0A] text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap"
              >
                Chat with us!
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-white rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-110"
          >
            <FaWhatsapp className="text-white text-2xl" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
