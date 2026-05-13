import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';

const categories = [
  {
    name: 'Sofas',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    desc: 'Luxurious seating',
  },
  {
    name: 'Beds',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
    desc: 'Restful elegance',
  },
  {
    name: 'Office Furniture',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
    desc: 'Productive luxury',
  },
  {
    name: 'Dining',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80',
    desc: 'Elegant gatherings',
  },
  {
    name: 'Decor',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    desc: 'Refined accents',
  },
  {
    name: 'Custom Furniture',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80',
    desc: 'Bespoke creations',
  },
];

const CategoryCard = ({ category, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to="/collections" className="group relative block overflow-hidden aspect-[3/4]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        <div className="absolute inset-0 border border-white/5 group-hover:border-[#C8A97E]/20 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[#C8A97E] text-xs tracking-[0.3em] uppercase mb-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            {category.desc}
          </p>
          <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-medium text-white group-hover:translate-y-0 transition-transform duration-500">
            {category.name}
          </h3>
          <div className="h-[1px] bg-[#C8A97E] mt-3 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </Link>
    </motion.div>
  );
};

const CategoriesSection = () => {
  return (
    <section className="section-padding relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C8A97E]/3 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          subtitle="Our Collections"
          title="Curated Categories"
          description="Each piece in our collection is a testament to the art of fine living."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
