import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionHeading = ({ subtitle, title, description, align = 'center' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div ref={ref} className={`max-w-3xl mb-16 md:mb-20 ${alignClass}`}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-block text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-white/50 text-base md:text-lg leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
