import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineCube } from 'react-icons/hi';
import SectionHeading from '../ui/SectionHeading';

const features = [
  {
    icon: <HiOutlineSparkles className="text-2xl" />,
    title: 'Premium Craftsmanship',
    description: 'Each piece is handcrafted by master artisans with decades of experience in luxury furniture making.',
  },
  {
    icon: <HiOutlineCube className="text-2xl" />,
    title: 'Custom Designs',
    description: 'Bring your vision to life with our bespoke furniture service, tailored to your exact specifications.',
  },
  {
    icon: <HiOutlineShieldCheck className="text-2xl" />,
    title: 'Quality Guarantee',
    description: 'Every piece comes with our premium quality guarantee, ensuring lasting beauty and durability.',
  },
  {
    icon: <HiOutlineTruck className="text-2xl" />,
    title: 'White Glove Delivery',
    description: 'Professional delivery and installation, ensuring your furniture arrives in perfect condition.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding relative bg-[#111111]/50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C8A97E]/3 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          subtitle="Why Us"
          title="The Vinayak Difference"
          description="What sets us apart in the world of luxury furniture."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative p-8 glass hover:border-[#C8A97E]/20 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#C8A97E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <motion.div
          className="w-14 h-14 rounded-full border border-[#C8A97E]/20 flex items-center justify-center text-[#C8A97E] mb-6 group-hover:border-[#C8A97E]/40 transition-colors duration-500"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {feature.icon}
        </motion.div>
        <h3 className="font-[family-name:var(--font-heading)] text-lg text-white mb-3">
          {feature.title}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export default WhyChooseUs;
