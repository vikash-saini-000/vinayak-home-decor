import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: '15+', label: 'Years of Craftsmanship' },
  { number: '5000+', label: 'Homes Transformed' },
  { number: '200+', label: 'Artisan Designs' },
  { number: '100%', label: 'Customer Satisfaction' },
];

const AboutSection = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { y: 80 },
        {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C8A97E]/3 rounded-full blur-[200px]" />

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div ref={imageRef} className="relative overflow-hidden aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
                alt="Vinayak Home Decor craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 border border-[#C8A97E]/10" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-[#C8A97E]/20 hidden lg:block" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-[#C8A97E]/10 hidden lg:block" />
          </div>

          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[#C8A97E] text-xs tracking-[0.4em] uppercase mb-4 block"
            >
              Our Story
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6"
            >
              Crafting Elegance
              <br />
              <span className="text-gradient">Since 2009</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/50 text-base leading-relaxed mb-6"
            >
              At Vinayak Home Decor, we believe furniture is more than function — it&apos;s an
              expression of who you are. Every piece we create is a harmony of traditional
              craftsmanship and contemporary design.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-white/40 text-base leading-relaxed mb-10"
            >
              From hand-selected materials to meticulous finishing, our artisans pour
              their expertise into every curve and corner, ensuring your home tells a
              story of luxury and comfort.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 gap-8"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#C8A97E] font-semibold">
                    {stat.number}
                  </h3>
                  <p className="text-white/40 text-xs tracking-wider uppercase mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
