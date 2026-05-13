import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SectionHeading from '../ui/SectionHeading';
import { testimonialAPI } from '../../services/api';

const demoTestimonials = [
  {
    name: 'Priya Sharma',
    role: 'Interior Designer',
    text: 'Vinayak Home Decor transformed my client\'s living room into a masterpiece. The craftsmanship and attention to detail is unmatched. Every piece feels like a work of art.',
    rating: 5,
  },
  {
    name: 'Rajesh Gupta',
    role: 'Business Owner',
    text: 'The custom office furniture they created for our corporate space is exceptional. Premium quality, modern design, and delivered right on schedule. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Anita Verma',
    role: 'Homeowner',
    text: 'From the initial consultation to the final delivery, the experience was nothing short of luxurious. Our bedroom set is absolutely stunning and built to last generations.',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    role: 'Architect',
    text: 'I\'ve worked with many furniture brands, but Vinayak stands apart. Their ability to translate design concepts into reality while maintaining the highest quality standards is remarkable.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState(demoTestimonials);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await testimonialAPI.getAll();
        if (data?.length > 0) {
          setTestimonials(data);
        }
      } catch {
        // keep demo fallback
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section ref={ref} className="section-padding relative">
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E8956A]/3 rounded-full blur-[150px]" />
      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeading
          subtitle="Testimonials"
          title="What Our Clients Say"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative glass p-8 md:p-12"
        >
          <div className="absolute top-6 left-8 text-[#C8A97E]/10 text-8xl font-[family-name:var(--font-heading)]">&ldquo;</div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <span key={i} className="text-[#C8A97E] text-sm">★</span>
                ))}
              </div>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 italic font-[family-name:var(--font-heading)]">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>
              <h4 className="text-white font-medium text-lg">{testimonials[current].name}</h4>
              <p className="text-[#C8A97E] text-xs tracking-[0.2em] uppercase mt-1">
                {testimonials[current].role}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all duration-300"
            >
              <HiChevronLeft />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-[#C8A97E] w-6' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all duration-300"
            >
              <HiChevronRight />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
