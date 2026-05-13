import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus, HiPencil, HiTrash, HiLogout, HiStar, HiX, HiPhotograph,
  HiMail, HiEye, HiChat,
} from 'react-icons/hi';
import { productAPI, contactAPI, authAPI, testimonialAPI, galleryAPI, inquiryAPI } from '../services/api';

const categories = ['Sofas', 'Beds', 'Office Furniture', 'Dining', 'Decor', 'Custom Furniture'];

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
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await testimonialAPI.delete(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await galleryAPI.delete(id);
      setGalleryImages((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
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
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
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
      alert('Error: ' + (err.response?.data?.message || err.message));
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
    { key: 'products', label: 'Products', count: products.length },
    { key: 'testimonials', label: 'Testimonials', count: testimonials.length },
    { key: 'gallery', label: 'Gallery', count: galleryImages.length },
    { key: 'inquiries', label: 'Inquiries', count: inquiries.unread > 0 ? inquiries.unread : inquiries.total },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold text-white">
              Dashboard
            </h1>
            <p className="text-white/40 text-sm mt-1">Manage your store</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/50 text-sm hover:text-red-400 hover:border-red-400/30 transition-all duration-300"
          >
            <HiLogout /> Logout
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300 border flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#C8A97E] text-[#0A0A0A] border-[#C8A97E]'
                  : 'border-white/10 text-white/50 hover:border-[#C8A97E]/30'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-[#0A0A0A]/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30">Loading...</div>
        ) : activeTab === 'products' ? (
          <ProductsTab products={products} onAdd={() => openForm('product')} onEdit={(p) => openForm('product', p)} onDelete={handleDeleteProduct} />
        ) : activeTab === 'testimonials' ? (
          <TestimonialsTab testimonials={testimonials} onAdd={() => openForm('testimonial')} onEdit={(t) => openForm('testimonial', t)} onDelete={handleDeleteTestimonial} />
        ) : activeTab === 'gallery' ? (
          <GalleryTab images={galleryImages} onAdd={() => openForm('gallery')} onDelete={handleDeleteGallery} />
        ) : activeTab === 'inquiries' ? (
          <InquiriesTab inquiries={inquiries} onMarkRead={handleMarkRead} onDelete={handleDeleteInquiry} />
        ) : (
          <ContactTab contact={contact} onUpdate={setContact} />
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          formType === 'product' ? (
            <ProductForm product={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); }} />
          ) : formType === 'testimonial' ? (
            <TestimonialForm testimonial={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); }} />
          ) : formType === 'gallery' ? (
            <GalleryForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); }} />
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};

/* ========== Products Tab ========== */
const ProductsTab = ({ products, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-end mb-6">
      <button onClick={onAdd} className="flex items-center gap-2 px-6 py-3 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300">
        <HiPlus /> Add Product
      </button>
    </div>
    {products.length === 0 ? (
      <div className="text-center py-20 glass">
        <HiPhotograph className="text-4xl text-white/20 mx-auto mb-4" />
        <p className="text-white/40">No products yet. Add your first product!</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div key={product._id} layout className="glass p-4 group">
            <div className="relative aspect-[4/3] overflow-hidden mb-4">
              {product.images?.[0] ? (
                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <HiPhotograph className="text-3xl text-white/20" />
                </div>
              )}
              {product.featured && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold flex items-center gap-1">
                  <HiStar /> Featured
                </div>
              )}
            </div>
            <h3 className="text-white font-medium truncate">{product.title}</h3>
            <p className="text-white/40 text-sm">{product.category} · ₹{product.price?.toLocaleString('en-IN')}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onEdit(product)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all duration-300 flex items-center justify-center gap-1">
                <HiPencil /> Edit
              </button>
              <button onClick={() => onDelete(product._id)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs hover:border-red-500/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-1">
                <HiTrash /> Delete
              </button>
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
    <div className="flex justify-end mb-6">
      <button onClick={onAdd} className="flex items-center gap-2 px-6 py-3 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300">
        <HiPlus /> Add Testimonial
      </button>
    </div>
    {testimonials.length === 0 ? (
      <div className="text-center py-20 glass">
        <HiChat className="text-4xl text-white/20 mx-auto mb-4" />
        <p className="text-white/40">No testimonials yet. Add your first testimonial!</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <motion.div key={t._id} layout className="glass p-6">
            <div className="flex items-start gap-4 mb-4">
              {t.image?.url ? (
                <img src={t.image.url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center text-[#C8A97E] text-lg font-semibold">
                  {t.name?.[0]}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-white font-medium">{t.name}</h3>
                <p className="text-white/40 text-sm">{t.role}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <span key={i} className="text-[#C8A97E] text-xs">★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm italic mb-4 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
            <div className="flex gap-2">
              <button onClick={() => onEdit(t)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all duration-300 flex items-center justify-center gap-1">
                <HiPencil /> Edit
              </button>
              <button onClick={() => onDelete(t._id)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs hover:border-red-500/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-1">
                <HiTrash /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ========== Gallery Tab ========== */
const GalleryTab = ({ images, onAdd, onDelete }) => (
  <div>
    <div className="flex justify-end mb-6">
      <button onClick={onAdd} className="flex items-center gap-2 px-6 py-3 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300">
        <HiPlus /> Add Image
      </button>
    </div>
    {images.length === 0 ? (
      <div className="text-center py-20 glass">
        <HiPhotograph className="text-4xl text-white/20 mx-auto mb-4" />
        <p className="text-white/40">No gallery images yet. Add your first image!</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <motion.div key={img._id} layout className="glass p-2 group relative">
            <div className="aspect-square overflow-hidden">
              <img src={img.image?.url} alt={img.title || 'Gallery'} className="w-full h-full object-cover" />
            </div>
            {img.title && <p className="text-white/60 text-xs mt-2 truncate px-1">{img.title}</p>}
            {img.category && <p className="text-[#C8A97E] text-[10px] tracking-wider uppercase px-1">{img.category}</p>}
            <button
              onClick={() => onDelete(img._id)}
              className="absolute top-3 right-3 w-7 h-7 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
            >
              <HiTrash />
            </button>
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
      <div className="text-center py-20 glass">
        <HiMail className="text-4xl text-white/20 mx-auto mb-4" />
        <p className="text-white/40">No inquiries yet.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {inquiries.inquiries.map((inq) => (
          <motion.div
            key={inq._id}
            layout
            className={`glass p-5 ${!inq.read ? 'border-l-2 border-l-[#C8A97E]' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-medium">{inq.name}</h3>
                  {!inq.read && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#C8A97E] text-[#0A0A0A] font-semibold uppercase tracking-wider">New</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-white/40 text-xs mb-3">
                  <span>{inq.email}</span>
                  {inq.phone && <span>{inq.phone}</span>}
                  <span>{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-white/60 text-sm">{inq.message}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!inq.read && (
                  <button
                    onClick={() => onMarkRead(inq._id)}
                    className="p-2 border border-white/10 text-white/50 text-xs hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all duration-300"
                    title="Mark as read"
                  >
                    <HiEye />
                  </button>
                )}
                <button
                  onClick={() => onDelete(inq._id)}
                  className="p-2 border border-white/10 text-white/50 text-xs hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
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
const ContactTab = ({ contact, onUpdate }) => {
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
      alert('Contact info updated!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'phone', label: 'Phone' },
    { name: 'whatsapp', label: 'WhatsApp' },
    { name: 'email', label: 'Email' },
    { name: 'address', label: 'Address' },
    { name: 'mapUrl', label: 'Map Embed URL' },
    { name: 'instagram', label: 'Instagram URL' },
    { name: 'facebook', label: 'Facebook URL' },
    { name: 'youtube', label: 'YouTube URL' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 md:p-8 max-w-2xl">
      <h2 className="font-[family-name:var(--font-heading)] text-xl text-white mb-6">Contact Information</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">{field.label}</label>
            <input
              type="text"
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-[0.2em] uppercase hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Contact Info'}
        </button>
      </form>
    </motion.div>
  );
};

/* ========== Product Form Modal ========== */
const ProductForm = ({ product, onClose, onSaved }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
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
      alert('Error: ' + (err.response?.data?.message || err.message));
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
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-2xl glass p-6 md:p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><HiX className="text-xl" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300">
                {categories.map((c) => (<option key={c} value={c} className="bg-[#111]">{c}</option>))}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300" required min="0" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[#C8A97E]" />
            <span className="text-white/60 text-sm">Featured Product</span>
          </label>
          {existingImages.length > 0 && (
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Current Images</label>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img) => (
                  <div key={img.publicId} className="relative w-20 h-20">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(img.publicId)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">{product ? 'Add More Images' : 'Images'}</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white/50 text-sm file:mr-4 file:py-1 file:px-4 file:border-0 file:bg-[#C8A97E] file:text-[#0A0A0A] file:text-xs file:font-semibold file:cursor-pointer" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm hover:border-white/30 transition-all duration-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50">
              {saving ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ========== Testimonial Form Modal ========== */
const TestimonialForm = ({ testimonial, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    text: testimonial?.text || '',
    rating: testimonial?.rating || 5,
  });
  const [file, setFile] = useState(null);
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
      if (file) formData.append('image', file);

      if (testimonial) {
        await testimonialAPI.update(testimonial._id, formData);
      } else {
        await testimonialAPI.create(formData);
      }
      onSaved();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-lg glass p-6 md:p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">
            {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><HiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Role / Title</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Testimonial Text</label>
            <textarea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 resize-none" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                  className={`text-2xl transition-colors duration-200 ${star <= form.rating ? 'text-[#C8A97E]' : 'text-white/20'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Photo (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white/50 text-sm file:mr-4 file:py-1 file:px-4 file:border-0 file:bg-[#C8A97E] file:text-[#0A0A0A] file:text-xs file:font-semibold file:cursor-pointer" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm hover:border-white/30 transition-all duration-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50">
              {saving ? 'Saving...' : testimonial ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ========== Gallery Form Modal ========== */
const GalleryForm = ({ onClose, onSaved }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Please select at least one image');
      return;
    }
    setSaving(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('image', file);
        await galleryAPI.create(formData);
      }
      onSaved();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const galleryCategories = ['General', 'Living Room', 'Bedroom', 'Office', 'Dining', 'Outdoor', 'Custom'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-lg glass p-6 md:p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">Add Gallery Images</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><HiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Title (optional)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300" />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300">
              {galleryCategories.map((c) => (<option key={c} value={c} className="bg-[#111]">{c}</option>))}
            </select>
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white/50 text-sm file:mr-4 file:py-1 file:px-4 file:border-0 file:bg-[#C8A97E] file:text-[#0A0A0A] file:text-xs file:font-semibold file:cursor-pointer" required />
            {files.length > 0 && <p className="text-white/40 text-xs mt-2">{files.length} file(s) selected</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm hover:border-white/30 transition-all duration-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50">
              {saving ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
