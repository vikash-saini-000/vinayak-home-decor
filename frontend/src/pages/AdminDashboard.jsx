import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus, HiPencil, HiTrash, HiLogout, HiStar, HiX, HiPhotograph,
  HiMail, HiEye, HiChat, HiUpload, HiCheckCircle, HiExclamationCircle,
  HiCloudUpload, HiCube, HiCurrencyRupee, HiTag,
} from 'react-icons/hi';
import { productAPI, contactAPI, authAPI, testimonialAPI, galleryAPI, inquiryAPI } from '../services/api';

const categories = ['Sofas', 'Beds', 'Office Furniture', 'Dining', 'Decor', 'Custom Furniture'];
const galleryCategories = ['General', 'Living Room', 'Bedroom', 'Office', 'Dining', 'Outdoor', 'Custom'];

/* ========== Toast Notification System ========== */
const Toast = ({ message, type = 'success', onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-2xl backdrop-blur-xl border ${
      type === 'success'
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : type === 'error'
        ? 'bg-red-500/10 border-red-500/20 text-red-400'
        : 'bg-[#C8A97E]/10 border-[#C8A97E]/20 text-[#C8A97E]'
    }`}
  >
    {type === 'success' ? <HiCheckCircle className="text-xl shrink-0" /> : <HiExclamationCircle className="text-xl shrink-0" />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity"><HiX /></button>
  </motion.div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const ToastContainer = () => (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
  return { show, ToastContainer };
};

/* ========== Image Drop Zone ========== */
const ImageDropZone = ({ files, setFiles, multiple = true, label = 'Images' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (droppedFiles.length > 0) {
      setFiles(multiple ? [...files, ...droppedFiles] : [droppedFiles[0]]);
    }
  };

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(multiple ? [...files, ...selected] : selected);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">{label}</label>
      <div
        onDragEnter={handleDragIn}
        onDragOver={handleDrag}
        onDragLeave={handleDragOut}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-[#C8A97E] bg-[#C8A97E]/5'
            : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />
        <HiCloudUpload className={`text-3xl mx-auto mb-2 transition-colors ${isDragging ? 'text-[#C8A97E]' : 'text-white/20'}`} />
        <p className="text-white/40 text-sm">
          {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
        </p>
        <p className="text-white/20 text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HiTrash className="text-red-400 text-lg" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                <p className="text-white/60 text-[9px] truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========== Stat Card ========== */
const StatCard = ({ icon: Icon, label, value, color = '#C8A97E' }) => (
  <div className="glass p-4 flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
      <Icon className="text-lg" style={{ color }} />
    </div>
    <div>
      <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-white text-xl font-semibold">{value}</p>
    </div>
  </div>
);

/* ========== Main Dashboard ========== */
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [inquiries, setInquiries] = useState({ inquiries: [], total: 0, unread: 0 });
  const [contact, setContact] = useState({});
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('product');
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { show: showToast, ToastContainer } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, contactRes, testRes, gallRes, inqRes] = await Promise.all([
        productAPI.getAll(),
        contactAPI.get(),
        testimonialAPI.getAll(),
        galleryAPI.getAll(),
        inquiryAPI.getAll(),
      ]);
      setProducts(prodRes.data.products || []);
      setContact(contactRes.data || {});
      setTestimonials(testRes.data || []);
      setGalleryImages(gallRes.data || []);
      setInquiries(inqRes.data || { inquiries: [], total: 0, unread: 0 });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await authAPI.getProfile();
        fetchData();
      } catch {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    };
    verifyAuth();
  }, [navigate, fetchData]);

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await testimonialAPI.delete(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      showToast('Testimonial deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await galleryAPI.delete(id);
      setGalleryImages((prev) => prev.filter((g) => g._id !== id));
      showToast('Image deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await inquiryAPI.delete(id);
      setInquiries((prev) => ({
        ...prev,
        inquiries: prev.inquiries.filter((i) => i._id !== id),
        total: prev.total - 1,
      }));
      showToast('Inquiry deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await inquiryAPI.markAsRead(id);
      setInquiries((prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((i) => (i._id === id ? { ...i, read: true } : i)),
        unread: prev.unread - 1,
      }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const openForm = (type, item = null) => {
    setFormType(type);
    setEditingItem(item);
    setShowForm(true);
  };

  const tabs = [
    { key: 'products', label: 'Products', icon: HiCube, count: products.length },
    { key: 'testimonials', label: 'Testimonials', icon: HiChat, count: testimonials.length },
    { key: 'gallery', label: 'Gallery', icon: HiPhotograph, count: galleryImages.length },
    { key: 'inquiries', label: 'Inquiries', icon: HiMail, count: inquiries.unread > 0 ? inquiries.unread : inquiries.total },
    { key: 'contact', label: 'Contact', icon: HiMail },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 md:px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold text-white">
              Dashboard
            </h1>
            <p className="text-white/40 text-sm mt-1">Manage your store</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/50 text-sm rounded-lg hover:text-red-400 hover:border-red-400/30 transition-all duration-300"
          >
            <HiLogout /> Logout
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={HiCube} label="Products" value={products.length} color="#C8A97E" />
          <StatCard icon={HiPhotograph} label="Gallery" value={galleryImages.length} color="#818CF8" />
          <StatCard icon={HiChat} label="Reviews" value={testimonials.length} color="#34D399" />
          <StatCard icon={HiMail} label="Unread" value={inquiries.unread || 0} color="#F87171" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/[0.02] rounded-xl border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2.5 text-xs tracking-[0.1em] uppercase transition-all duration-300 rounded-lg flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-[#C8A97E] text-[#0A0A0A] shadow-lg shadow-[#C8A97E]/20'
                    : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="text-sm" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab.key ? 'bg-[#0A0A0A]/20' : 'bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#C8A97E]/30 border-t-[#C8A97E] rounded-full animate-spin" />
          </div>
        ) : activeTab === 'products' ? (
          <ProductsTab products={products} onAdd={() => openForm('product')} onEdit={(p) => openForm('product', p)} onDelete={handleDeleteProduct} />
        ) : activeTab === 'testimonials' ? (
          <TestimonialsTab testimonials={testimonials} onAdd={() => openForm('testimonial')} onEdit={(t) => openForm('testimonial', t)} onDelete={handleDeleteTestimonial} />
        ) : activeTab === 'gallery' ? (
          <GalleryTab images={galleryImages} onAdd={() => openForm('gallery')} onEdit={(g) => openForm('gallery', g)} onDelete={handleDeleteGallery} />
        ) : activeTab === 'inquiries' ? (
          <InquiriesTab inquiries={inquiries} onMarkRead={handleMarkRead} onDelete={handleDeleteInquiry} />
        ) : (
          <ContactTab contact={contact} onUpdate={setContact} showToast={showToast} />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          formType === 'product' ? (
            <ProductForm product={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); showToast(editingItem ? 'Product updated' : 'Product created'); }} showToast={showToast} />
          ) : formType === 'testimonial' ? (
            <TestimonialForm testimonial={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); showToast(editingItem ? 'Testimonial updated' : 'Testimonial created'); }} showToast={showToast} />
          ) : formType === 'gallery' ? (
            <GalleryForm gallery={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); showToast(editingItem ? 'Gallery image updated' : 'Gallery images uploaded'); }} showToast={showToast} />
          ) : null
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
};

/* ========== Products Tab ========== */
const ProductsTab = ({ products, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <p className="text-white/40 text-sm">{products.length} product{products.length !== 1 ? 's' : ''}</p>
      <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors duration-300 shadow-lg shadow-[#C8A97E]/20">
        <HiPlus /> Add Product
      </button>
    </div>
    {products.length === 0 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
        <HiCube className="text-5xl text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-lg mb-2">No products yet</p>
        <p className="text-white/20 text-sm mb-6">Start by adding your first product</p>
        <button onClick={onAdd} className="px-6 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-[#D4B896] transition-colors">
          <HiPlus className="inline mr-1" /> Add Product
        </button>
      </motion.div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl overflow-hidden group hover:border-white/10 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {product.images?.[0] ? (
                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                  <HiPhotograph className="text-4xl text-white/10" />
                </div>
              )}
              {product.featured && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#C8A97E] text-[#0A0A0A] text-xs font-bold rounded-md flex items-center gap-1 shadow-lg">
                  <HiStar /> Featured
                </div>
              )}
              {product.images?.length > 1 && (
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white/80 text-xs rounded-md">
                  {product.images.length} photos
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium truncate text-sm">{product.title}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[#C8A97E] text-xs font-medium flex items-center gap-0.5">
                  <HiTag className="text-[10px]" /> {product.category}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-white/50 text-xs flex items-center gap-0.5">
                  <HiCurrencyRupee className="text-[10px]" /> {product.price?.toLocaleString('en-IN')}
                </span>
              </div>
              {product.description && (
                <p className="text-white/30 text-xs mt-2 line-clamp-2">{product.description}</p>
              )}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <button onClick={() => onEdit(product)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all duration-300 flex items-center justify-center gap-1.5">
                  <HiPencil className="text-xs" /> Edit
                </button>
                <button onClick={() => onDelete(product._id)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-1.5">
                  <HiTrash className="text-xs" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ========== Testimonials Tab ========== */
const TestimonialsTab = ({ testimonials, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <p className="text-white/40 text-sm">{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</p>
      <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors duration-300 shadow-lg shadow-[#C8A97E]/20">
        <HiPlus /> Add Testimonial
      </button>
    </div>
    {testimonials.length === 0 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
        <HiChat className="text-5xl text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-lg mb-2">No testimonials yet</p>
        <p className="text-white/20 text-sm">Add customer reviews to build trust</p>
      </motion.div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start gap-4 mb-4">
              {t.image?.url ? (
                <img src={t.image.url} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#C8A97E]/20" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8A97E]/30 to-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E] text-lg font-semibold">
                  {t.name?.[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm">{t.name}</h3>
                <p className="text-white/40 text-xs">{t.role}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < (t.rating || 5) ? 'text-[#C8A97E]' : 'text-white/10'}`}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-white/50 text-sm italic line-clamp-3 mb-4">&ldquo;{t.text}&rdquo;</p>
            <div className="flex gap-2 pt-3 border-t border-white/5">
              <button onClick={() => onEdit(t)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all duration-300 flex items-center justify-center gap-1.5">
                <HiPencil className="text-xs" /> Edit
              </button>
              <button onClick={() => onDelete(t._id)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-1.5">
                <HiTrash className="text-xs" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ========== Gallery Tab ========== */
const GalleryTab = ({ images, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <p className="text-white/40 text-sm">{images.length} image{images.length !== 1 ? 's' : ''}</p>
      <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors duration-300 shadow-lg shadow-[#C8A97E]/20">
        <HiUpload /> Upload Images
      </button>
    </div>
    {images.length === 0 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
        <HiPhotograph className="text-5xl text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-lg mb-2">Gallery is empty</p>
        <p className="text-white/20 text-sm">Upload images to showcase your work</p>
      </motion.div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={img._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="glass rounded-xl overflow-hidden group relative"
          >
            <div className="aspect-square overflow-hidden">
              <img src={img.image?.url} alt={img.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              {img.title && <p className="text-white text-xs font-medium truncate">{img.title}</p>}
              {img.category && <p className="text-[#C8A97E] text-[10px] tracking-wider uppercase">{img.category}</p>}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onEdit(img)}
                  className="flex-1 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs rounded-md hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
                >
                  <HiPencil className="text-[10px]" /> Edit
                </button>
                <button
                  onClick={() => onDelete(img._id)}
                  className="py-1.5 px-3 bg-red-500/20 backdrop-blur-sm text-red-400 text-xs rounded-md hover:bg-red-500/30 transition-colors"
                >
                  <HiTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ========== Inquiries Tab ========== */
const InquiriesTab = ({ inquiries, onMarkRead, onDelete }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <HiMail className="text-[#C8A97E] text-xl" />
        <span className="text-white/60 text-sm">
          {inquiries.total} total · {inquiries.unread} unread
        </span>
      </div>
    </div>
    {(!inquiries.inquiries || inquiries.inquiries.length === 0) ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
        <HiMail className="text-5xl text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-lg">No inquiries yet</p>
      </motion.div>
    ) : (
      <div className="space-y-3">
        {inquiries.inquiries.map((inq, i) => (
          <motion.div
            key={inq._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass rounded-xl p-5 ${!inq.read ? 'border-l-2 border-l-[#C8A97E]' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-medium text-sm">{inq.name}</h3>
                  {!inq.read && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#C8A97E] text-[#0A0A0A] font-bold uppercase tracking-wider rounded-md">New</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-white/40 text-xs mb-3">
                  <span>{inq.email}</span>
                  {inq.phone && <span>{inq.phone}</span>}
                  <span>{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-white/50 text-sm">{inq.message}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!inq.read && (
                  <button
                    onClick={() => onMarkRead(inq._id)}
                    className="p-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all duration-300"
                    title="Mark as read"
                  >
                    <HiEye />
                  </button>
                )}
                <button
                  onClick={() => onDelete(inq._id)}
                  className="p-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
                  title="Delete"
                >
                  <HiTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ========== Contact Tab ========== */
const ContactTab = ({ contact, onUpdate, showToast }) => {
  const [form, setForm] = useState({
    phone: contact.phone || '',
    whatsapp: contact.whatsapp || '',
    email: contact.email || '',
    address: contact.address || '',
    mapUrl: contact.mapUrl || '',
    instagram: contact.instagram || '',
    facebook: contact.facebook || '',
    youtube: contact.youtube || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await contactAPI.update(form);
      onUpdate(data);
      showToast('Contact info updated');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'phone', label: 'Phone', type: 'tel' },
    { name: 'whatsapp', label: 'WhatsApp', type: 'tel' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'mapUrl', label: 'Map Embed URL', type: 'url' },
    { name: 'instagram', label: 'Instagram URL', type: 'url' },
    { name: 'facebook', label: 'Facebook URL', type: 'url' },
    { name: 'youtube', label: 'YouTube URL', type: 'url' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 md:p-8 max-w-2xl">
      <h2 className="font-[family-name:var(--font-heading)] text-xl text-white mb-6">Contact Information</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">{field.label}</label>
            <input
              type={field.type}
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-[0.2em] uppercase rounded-lg hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20"
        >
          {saving ? 'Saving...' : 'Update Contact Info'}
        </button>
      </form>
    </motion.div>
  );
};

/* ========== Product Form Modal ========== */
const ProductForm = ({ product, onClose, onSaved, showToast }) => {
  const [form, setForm] = useState({
    title: product?.title || '',
    description: product?.description || '',
    category: product?.category || 'Sofas',
    price: product?.price || '',
    featured: product?.featured || false,
  });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (!product && files.length === 0) errs.images = 'At least one image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('featured', form.featured);
      if (product) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }
      files.forEach((file) => formData.append('images', file));

      if (product) {
        await productAPI.update(product._id, formData);
      } else {
        await productAPI.create(formData);
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeExistingImage = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-2xl glass rounded-xl p-6 md:p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1"><HiX className="text-xl" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
              placeholder="e.g. Royal Chesterfield Sofa"
              className={`w-full bg-white/5 border ${errors.title ? 'border-red-500/50' : 'border-white/10'} focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg placeholder-white/20`}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Description *</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: '' }); }}
              placeholder="Describe the product materials, dimensions, and features..."
              className={`w-full bg-white/5 border ${errors.description ? 'border-red-500/50' : 'border-white/10'} focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg resize-none placeholder-white/20`}
            />
            <p className="text-white/20 text-xs mt-1">{form.description.length}/2000</p>
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg"
              >
                {categories.map((c) => (<option key={c} value={c} className="bg-[#111]">{c}</option>))}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => { setForm({ ...form, price: e.target.value }); setErrors({ ...errors, price: '' }); }}
                placeholder="25000"
                className={`w-full bg-white/5 border ${errors.price ? 'border-red-500/50' : 'border-white/10'} focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg placeholder-white/20`}
                min="0"
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${form.featured ? 'bg-[#C8A97E]' : 'bg-white/10'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${form.featured ? 'left-5' : 'left-0.5'}`} />
            </div>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="hidden" />
            <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Featured Product</span>
          </label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Current Images ({existingImages.length})</label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img) => (
                  <div key={img.publicId || img.url} className="relative w-24 h-24 rounded-lg overflow-hidden group border border-white/10">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.publicId)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiTrash className="text-red-400 text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <ImageDropZone
              files={files}
              setFiles={(f) => { setFiles(f); setErrors({ ...errors, images: '' }); }}
              label={product ? 'Add More Images' : 'Product Images *'}
            />
            {errors.images && <p className="text-red-400 text-xs mt-1">{errors.images}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm rounded-lg hover:border-white/30 hover:text-white/70 transition-all duration-300">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  Saving...
                </>
              ) : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ========== Testimonial Form Modal ========== */
const TestimonialForm = ({ testimonial, onClose, onSaved, showToast }) => {
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    text: testimonial?.text || '',
    rating: testimonial?.rating || 5,
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('role', form.role);
      formData.append('text', form.text);
      formData.append('rating', form.rating);
      if (files.length > 0) formData.append('image', files[0]);

      if (testimonial) {
        await testimonialAPI.update(testimonial._id, formData);
      } else {
        await testimonialAPI.create(formData);
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-lg glass rounded-xl p-6 md:p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">
            {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1"><HiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Customer name"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg placeholder-white/20" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Role / Title *</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Interior Designer, Homeowner"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg placeholder-white/20" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Testimonial Text *</label>
            <textarea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="What did the customer say about your products/service?"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg resize-none placeholder-white/20" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                  className={`text-2xl transition-all duration-200 hover:scale-110 ${star <= form.rating ? 'text-[#C8A97E]' : 'text-white/15 hover:text-white/30'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <ImageDropZone files={files} setFiles={setFiles} multiple={false} label="Photo (optional)" />
          {testimonial?.image?.url && files.length === 0 && (
            <div className="flex items-center gap-3">
              <img src={testimonial.image.url} alt="" className="w-12 h-12 rounded-full object-cover border border-white/10" />
              <span className="text-white/30 text-xs">Current photo</span>
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm rounded-lg hover:border-white/30 transition-all duration-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  Saving...
                </>
              ) : testimonial ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ========== Gallery Form Modal ========== */
const GalleryForm = ({ gallery, onClose, onSaved, showToast }) => {
  const isEdit = !!gallery;
  const [title, setTitle] = useState(gallery?.title || '');
  const [category, setCategory] = useState(gallery?.category || 'General');
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && files.length === 0) {
      showToast('Please select at least one image', 'error');
      return;
    }
    setSaving(true);
    setUploadProgress(0);
    try {
      if (isEdit) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        if (files.length > 0) formData.append('image', files[0]);
        await galleryAPI.update(gallery._id, formData);
      } else {
        const total = files.length;
        for (let i = 0; i < total; i++) {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('category', category);
          formData.append('image', files[i]);
          await galleryAPI.create(formData);
          setUploadProgress(Math.round(((i + 1) / total) * 100));
        }
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-lg glass rounded-xl p-6 md:p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">
            {isEdit ? 'Edit Gallery Image' : 'Upload Gallery Images'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1"><HiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Title (optional)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Living Room Setup"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg placeholder-white/20" />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 rounded-lg">
              {galleryCategories.map((c) => (<option key={c} value={c} className="bg-[#111]">{c}</option>))}
            </select>
          </div>

          {isEdit && gallery?.image?.url && files.length === 0 && (
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Current Image</label>
              <div className="w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                <img src={gallery.image.url} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <ImageDropZone
            files={files}
            setFiles={setFiles}
            multiple={!isEdit}
            label={isEdit ? 'Replace Image (optional)' : 'Images *'}
          />

          {saving && !isEdit && (
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#C8A97E] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm rounded-lg hover:border-white/30 transition-all duration-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  {isEdit ? 'Saving...' : 'Uploading...'}
                </>
              ) : isEdit ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
