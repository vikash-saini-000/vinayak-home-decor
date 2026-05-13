import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiX } from 'react-icons/hi';
import SectionHeading from '../ui/SectionHeading';
import { galleryAPI } from '../../services/api';

const demoGalleryImages = [
  { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', span: 'col-span-2 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', span: '' },
  { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80', span: '' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', span: '' },
  { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', span: 'col-span-2' },
  { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', span: '' },
  { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', span: '' },
  { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', span: '' },
];

const spanPatterns = ['col-span-2 row-span-2', '', '', '', 'col-span-2', '', '', ''];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState(demoGalleryImages);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await galleryAPI.getAll();
        if (data?.length > 0) {
          const mapped = data.map((item, i) => ({
            url: item.image?.url || '',
            span: spanPatterns[i % spanPatterns.length] || '',
            title: item.title,
          }));
          setGalleryImages(mapped);
        }
      } catch {
        // keep demo fallback
      }
    };
    fetchGallery();
  }, []);

  return (
    <section className="section-padding relative">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#C8A97E]/3 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          subtitle="Inspiration"
          title="Our Gallery"
          description="Step into our world of design excellence."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {galleryImages.map((img, i) => (
            <GalleryItem key={i} image={img} index={i} onClick={() => setSelectedImage(img.url)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl z-10"
            >
              <HiX />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Gallery preview"
              className="max-w-full max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const GalleryItem = ({ image, index, onClick }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`relative overflow-hidden cursor-pointer group ${image.span}`}
      onClick={onClick}
    >
      <img
        src={image.url}
        alt={`Gallery ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/30 transition-colors duration-500" />
      <div className="absolute inset-0 border border-white/0 group-hover:border-[#C8A97E]/20 transition-colors duration-500" />
    </motion.div>
  );
};

export default GallerySection;
