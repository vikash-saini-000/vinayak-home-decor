import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaWhatsapp } from 'react-icons/fa';
import { productAPI } from '../services/api';

const categories = ['All', 'Sofas', 'Beds', 'Office Furniture', 'Dining', 'Decor', 'Custom Furniture'];

const demoProducts = [
  { _id: '1', title: 'Royal Chesterfield Sofa', category: 'Sofas', price: 89999, images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' }] },
  { _id: '2', title: 'Empress King Bed', category: 'Beds', price: 125000, images: [{ url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80' }] },
  { _id: '3', title: 'Executive Office Desk', category: 'Office Furniture', price: 45000, images: [{ url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' }] },
  { _id: '4', title: 'Heritage Dining Table', category: 'Dining', price: 78000, images: [{ url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80' }] },
  { _id: '5', title: 'Artisan Floor Lamp', category: 'Decor', price: 15000, images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' }] },
  { _id: '6', title: 'Bespoke Bookshelf', category: 'Custom Furniture', price: 55000, images: [{ url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80' }] },
  { _id: '7', title: 'Velvet Lounge Chair', category: 'Sofas', price: 35000, images: [{ url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80' }] },
  { _id: '8', title: 'Modern Platform Bed', category: 'Beds', price: 95000, images: [{ url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80' }] },
  { _id: '9', title: 'Minimalist Work Desk', category: 'Office Furniture', price: 32000, images: [{ url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80' }] },
];

const CollectionsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [allProducts, setAllProducts] = useState(demoProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll({ limit: 100 });
        if (data.products?.length > 0) {
          setAllProducts(data.products);
        }
      } catch {
        // keep demo fallback
      }
    };
    fetchProducts();
  }, []);

  const filtered = activeCategory === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[#C8A97E] text-xs tracking-[0.4em] uppercase mb-4 block">Our Collections</span>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
            Explore Our <span className="text-gradient">Furniture</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-[#C8A97E] text-[#0A0A0A] border-[#C8A97E]'
                  : 'border-white/10 text-white/50 hover:border-[#C8A97E]/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-20">
          {filtered.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in "${product.title}" (₹${product.price.toLocaleString('en-IN')}) from Vinayak Home Decor.`
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group"
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-[#111]">
        <img
          src={product.images[0]?.url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <a
            href={`https://wa.me/919876543210?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-medium hover:bg-[#22c55e] transition-colors duration-300"
          >
            <FaWhatsapp className="text-lg" />
            Inquire on WhatsApp
          </a>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <span className="text-[#C8A97E] text-xs tracking-[0.2em] uppercase">{product.category}</span>
        <h3 className="font-[family-name:var(--font-heading)] text-lg text-white group-hover:text-[#C8A97E] transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-white/60 text-sm">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </motion.div>
  );
};

export default CollectionsPage;
