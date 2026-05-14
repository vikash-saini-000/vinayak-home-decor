import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import SectionHeading from '../ui/SectionHeading';
import { inquiryAPI, contactAPI } from '../../services/api';

const ContactSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [focused, setFocused] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    phone: '+91 98765 43210',
    whatsapp: '+91 77370 40962',
    email: 'info@vinayakhomedecor.com',
    address: 'Main Market, India',
    mapUrl: '',
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await contactAPI.get();
        if (data) {
          setContactDetails({
            phone: data.phone || '+91 98765 43210',
            whatsapp: data.whatsapp || '+91 77370 40962',
            email: data.email || 'info@vinayakhomedecor.com',
            address: data.address || 'Main Market, India',
            mapUrl: data.mapUrl || '',
          });
        }
      } catch {
        // keep defaults
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('');
    try {
      await inquiryAPI.create(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappNumber = contactDetails.whatsapp.replace(/[^0-9]/g, '');

  const contactInfo = [
    { icon: <FaPhone />, label: 'Phone', value: contactDetails.phone, href: `tel:${contactDetails.phone.replace(/[^0-9+]/g, '')}` },
    { icon: <FaWhatsapp />, label: 'WhatsApp', value: contactDetails.whatsapp, href: `https://wa.me/${whatsappNumber}` },
    { icon: <FaEnvelope />, label: 'Email', value: contactDetails.email, href: `mailto:${contactDetails.email}` },
    { icon: <FaMapMarkerAlt />, label: 'Visit Us', value: contactDetails.address, href: '#' },
  ];

  return (
    <section ref={ref} className="section-padding relative" id="contact">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#C8A97E]/3 rounded-full blur-[180px]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          subtitle="Get in Touch"
          title="Let's Create Together"
          description="Ready to transform your space? We'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: 'name', type: 'text', label: 'Your Name' },
                { name: 'email', type: 'email', label: 'Email Address' },
                { name: 'phone', type: 'tel', label: 'Phone Number' },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <label
                    className={`absolute left-0 transition-all duration-300 ${
                      focused === field.name || formData[field.name]
                        ? 'text-xs text-[#C8A97E] -top-5'
                        : 'text-sm text-white/30 top-3'
                    }`}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused('')}
                    className="w-full bg-transparent border-b border-white/10 focus:border-[#C8A97E] py-3 text-white outline-none transition-colors duration-300"
                    required
                  />
                </div>
              ))}
              <div className="relative">
                <label
                  className={`absolute left-0 transition-all duration-300 ${
                    focused === 'message' || formData.message
                      ? 'text-xs text-[#C8A97E] -top-5'
                      : 'text-sm text-white/30 top-3'
                  }`}
                >
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused('')}
                  className="w-full bg-transparent border-b border-white/10 focus:border-[#C8A97E] py-3 text-white outline-none transition-colors duration-300 resize-none"
                  required
                />
              </div>
              {submitStatus === 'success' && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                  Thank you! Your inquiry has been submitted successfully.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  Something went wrong. Please try again or contact us via WhatsApp.
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full py-4 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#C8A97E]/20 disabled:opacity-50"
              >
                <span className="relative z-10">{submitting ? 'Sending...' : 'Send Inquiry'}</span>
                <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-8"
          >
            {contactInfo.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-[#C8A97E] group-hover:border-[#C8A97E]/30 group-hover:bg-[#C8A97E]/5 transition-all duration-300 shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-1">{info.label}</p>
                  <p className="text-white/70 text-sm group-hover:text-[#C8A97E] transition-colors duration-300">
                    {info.value}
                  </p>
                </div>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 aspect-video overflow-hidden border border-white/5"
            >
              <iframe
                src={contactDetails.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5!2d75.78!3d26.91!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzM2LjAiTiA3NcKwNDYnNDguMCJF!5e0!3m2!1sen!2sin!4v1"}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                allowFullScreen=""
                loading="lazy"
                title="Vinayak Home Decor Location"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
