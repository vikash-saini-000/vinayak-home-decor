import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { HiArrowLeft, HiChevronLeft, HiChevronRight, HiZoomIn } from 'react-icons/hi';
import { productAPI, settingsAPI } from '../services/api';

const demoProducts = [
  { _id: '1', title: 'Royal Chesterfield Sofa', category: 'Sofas', price: 89999, description: 'Handcrafted premium Chesterfield sofa with deep button tufting, rolled arms, and luxurious leather upholstery. Perfect for sophisticated living rooms.', material: 'Premium Italian Leather, Solid Teak Frame', dimensions: 'L: 220cm × W: 95cm × H: 78cm', images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' }] },
  { _id: '2', title: 'Empress King Bed', category: 'Beds', price: 125000, description: 'A regal king-size bed with upholstered headboard, featuring premium foam mattress support and intricate woodwork.', material: 'Sheesham Wood, Premium Fabric', dimensions: 'L: 210cm × W: 195cm × H: 120cm', images: [{ url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80' }] },
  { _id: '3', title: 'Executive Office Desk', category: 'Office Furniture', price: 45000, description: 'Modern executive desk with cable management, built-in drawers, and spacious work surface.', material: 'Engineered Wood, Steel Frame', dimensions: 'L: 160cm × W: 80cm × H: 75cm', images: [{ url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80' }] },
  { _id: '4', title: 'Heritage Dining Table', category: 'Dining', price: 78000, description: 'Elegant 8-seater dining table with carved legs and premium wood finish.', material: 'Solid Rosewood', dimensions: 'L: 240cm × W: 110cm × H: 78cm', images: [{ url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80' }] },
  { _id: '5', title: 'Artisan Floor Lamp', category: 'Decor', price: 15000, description: 'Handcrafted artisan floor lamp with warm ambient lighting and brushed brass finish.', material: 'Brass, Linen Shade', dimensions: 'H: 165cm × Base: 30cm', images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' }] },
  { _id: '6', title: 'Bespoke Bookshelf', category: 'Custom Furniture', price: 55000, description: 'Custom-designed bookshelf with asymmetric shelving and hidden storage.', material: 'Teak Wood, Glass', dimensions: 'L: 120cm × W: 35cm × H: 200cm', images: [{ url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80' }] },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getOne(id);
        setProduct(data);
        const { data: relData } = await productAPI.getAll({ category: data.category, limit: 4 });
        setRelatedProducts((relData.products || []).filter((p) => p._id !== id).slice(0, 3));
      } catch {
        const demo = demoProducts.find((p) => p._id === id);
        if (demo) {
          setProduct(demo);
          setRelatedProducts(demoProducts.filter((p) => p._id !== id && p.category === demo.category).slice(0, 3));
        }
      }
      try {
        const { data: settings } = await settingsAPI.get();
        if (settings?.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
      } catch {
        // keep default
      }
      setCurrentImage(0);
      setLoading(false);
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-10 h-10 border-2 border-[#C8A97E]/30 border-t-[#C8A97E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6">
        <h2 className="text-white text-2xl mb-4">Product Not Found</h2>
        <Link to="/collections" className="text-[#C8A97E] hover:underline">Browse Collections</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' }];
  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in "${product.title}" (₹${product.price?.toLocaleString('en-IN')}) from Vinayak Home Decor. Could you share more details?`
  );

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-[#C8A97E] transition-colors duration-300"
          >
            <HiArrowLeft /> Back to Collections
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#111] group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  src={images[currentImage].url}
                  alt={product.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={() => setZoomed(!zoomed)}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C8A97E] hover:text-[#0A0A0A]">
                    <HiChevronLeft className="text-xl" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C8A97E] hover:text-[#0A0A0A]">
                    <HiChevronRight className="text-xl" />
                  </button>
                </>
              )}

              <button
                onClick={() => setZoomed(!zoomed)}
                className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C8A97E] hover:text-[#0A0A0A]"
              >
                <HiZoomIn />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImage ? 'bg-[#C8A97E] w-6' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border-2 transition-all duration-300 ${i === currentImage ? 'border-[#C8A97E]' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="text-[#C8A97E] text-xs tracking-[0.4em] uppercase mb-3">
              {product.category}
            </span>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
              {product.title}
            </h1>

            <p className="text-[#C8A97E] text-2xl sm:text-3xl font-semibold mb-6">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>

            <div className="h-[1px] bg-white/10 mb-6" />

            <p className="text-white/50 text-base leading-relaxed mb-8">
              {product.description || 'A premium piece from Vinayak Home Decor, crafted with meticulous attention to detail and the finest materials.'}
            </p>

            {(product.material || product.dimensions) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {product.material && (
                  <div className="glass p-4">
                    <p className="text-white/30 text-xs tracking-wider uppercase mb-1">Material</p>
                    <p className="text-white text-sm">{product.material}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div className="glass p-4">
                    <p className="text-white/30 text-xs tracking-wider uppercase mb-1">Dimensions</p>
                    <p className="text-white text-sm">{product.dimensions}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-semibold text-sm tracking-wider uppercase hover:bg-[#22c55e] transition-all duration-300 shadow-lg shadow-[#25D366]/20"
              >
                <FaWhatsapp className="text-xl" />
                Inquire on WhatsApp
              </a>
              <Link
                to="/contact"
                className="flex items-center justify-center px-8 py-4 border border-white/20 text-white text-sm tracking-wider uppercase hover:border-[#C8A97E] hover:text-[#C8A97E] transition-all duration-500"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-24"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[#C8A97E] text-xs tracking-[0.4em] uppercase block mb-2">You May Also Like</span>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-semibold text-white">
                  Related Products
                </h2>
              </div>
              <Link
                to="/collections"
                className="text-[#C8A97E] text-sm hover:underline hidden sm:block"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((rp) => {
                const rpMsg = encodeURIComponent(`Hi! I'm interested in "${rp.title}" (₹${rp.price?.toLocaleString('en-IN')}) from Vinayak Home Decor.`);
                return (
                  <Link key={rp._id} to={`/product/${rp._id}`} className="group block">
                    <div className="relative overflow-hidden aspect-[4/5] bg-[#111]">
                      <img
                        src={rp.images?.[0]?.url}
                        alt={rp.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${rpMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white text-xs font-medium hover:bg-[#22c55e] transition-colors"
                        >
                          <FaWhatsapp /> Inquire
                        </a>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <span className="text-[#C8A97E] text-xs tracking-[0.2em] uppercase">{rp.category}</span>
                      <h3 className="font-[family-name:var(--font-heading)] text-base text-white group-hover:text-[#C8A97E] transition-colors">{rp.title}</h3>
                      <p className="text-white/60 text-sm">₹{rp.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
