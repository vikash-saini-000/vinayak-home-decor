import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus, HiPencil, HiTrash, HiLogout, HiStar, HiX, HiPhotograph,
  HiMail, HiChat, HiUpload, HiCheckCircle, HiExclamationCircle,
  HiCloudUpload, HiCube, HiCurrencyRupee, HiTag, HiSearch,
  HiHome, HiCog, HiMenu, HiChevronDown, HiPhone,
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { productAPI, contactAPI, authAPI, testimonialAPI, galleryAPI, inquiryAPI, settingsAPI } from '../services/api';

const categories = ['Sofas', 'Beds', 'Office Furniture', 'Dining', 'Decor', 'Custom Furniture'];
const galleryCategories = ['General', 'Living Room', 'Bedroom', 'Office', 'Dining', 'Outdoor', 'Custom'];
const inquiryStatuses = ['All', 'New', 'Contacted', 'Negotiating', 'Closed'];

/* ========== Toast ========== */
const Toast = ({ message, type = 'success', onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-2xl backdrop-blur-xl border ${
      type === 'success'
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}
  >
    {type === 'success' ? <HiCheckCircle className="text-xl shrink-0" /> : <HiExclamationCircle className="text-xl shrink-0" />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><HiX /></button>
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
      <AnimatePresence>{toasts.map((t) => <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />)}</AnimatePresence>
    </div>
  );
  return { show, ToastContainer };
};

/* ========== ImageDropZone ========== */
const ImageDropZone = ({ files, setFiles, multiple = true, label = 'Images' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const f = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')); if (f.length) setFiles(multiple ? [...files, ...f] : [f[0]]); };
  const handleSelect = (e) => { const s = Array.from(e.target.files); setFiles(multiple ? [...files, ...s] : s); };
  return (
    <div>
      <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">{label}</label>
      <div
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-[#C8A97E] bg-[#C8A97E]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
      >
        <input ref={inputRef} type="file" multiple={multiple} accept="image/*" onChange={handleSelect} className="hidden" />
        <HiCloudUpload className={`text-3xl mx-auto mb-2 ${isDragging ? 'text-[#C8A97E]' : 'text-white/20'}`} />
        <p className="text-white/40 text-sm">{isDragging ? 'Drop here' : 'Drag & drop or click to browse'}</p>
        <p className="text-white/20 text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {files.map((file, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <HiTrash className="text-red-400 text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========== StatCard ========== */
const StatCard = ({ icon: Icon, label, value, color = '#C8A97E', sub }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-5 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon className="text-xl" style={{ color }} />
      </div>
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-semibold">{value}</p>
        {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  </motion.div>
);

/* ========== MAIN DASHBOARD ========== */
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [inquiries, setInquiries] = useState({ inquiries: [], total: 0, unread: 0, statusCounts: {} });
  const [contact, setContact] = useState({});
  const [siteSettings, setSiteSettings] = useState({});
  const [activeSection, setActiveSection] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('product');
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { show: showToast, ToastContainer } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, contactRes, testRes, gallRes, inqRes, settRes] = await Promise.all([
        productAPI.getAll(),
        contactAPI.get(),
        testimonialAPI.getAll(),
        galleryAPI.getAll(),
        inquiryAPI.getAll(),
        settingsAPI.get().catch(() => ({ data: {} })),
      ]);
      setProducts(prodRes.data.products || []);
      setContact(contactRes.data || {});
      setTestimonials(testRes.data || []);
      setGalleryImages(gallRes.data || []);
      setInquiries(inqRes.data || { inquiries: [], total: 0, unread: 0, statusCounts: {} });
      setSiteSettings(settRes.data || {});
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('adminToken'); navigate('/admin'); }
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => {
    const verify = async () => {
      try { await authAPI.getProfile(); fetchData(); } catch { localStorage.removeItem('adminToken'); navigate('/admin'); }
    };
    verify();
  }, [navigate, fetchData]);

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await productAPI.delete(id); setProducts((p) => p.filter((x) => x._id !== id)); showToast('Product deleted'); } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };
  const handleDeleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await testimonialAPI.delete(id); setTestimonials((p) => p.filter((x) => x._id !== id)); showToast('Testimonial deleted'); } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };
  const handleDeleteGallery = async (id) => {
    if (!confirm('Delete this image?')) return;
    try { await galleryAPI.delete(id); setGalleryImages((p) => p.filter((x) => x._id !== id)); showToast('Image deleted'); } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };
  const handleDeleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try { await inquiryAPI.delete(id); setInquiries((p) => ({ ...p, inquiries: p.inquiries.filter((x) => x._id !== id), total: p.total - 1 })); showToast('Inquiry deleted'); } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
  };
  const handleMarkRead = async (id) => {
    try { await inquiryAPI.markAsRead(id); setInquiries((p) => ({ ...p, inquiries: p.inquiries.map((i) => i._id === id ? { ...i, read: true } : i), unread: p.unread - 1 })); } catch (err) { showToast(err.response?.data?.message || 'Error', 'error'); }
  };
  const handleUpdateStatus = async (id, status) => {
    try { const { data } = await inquiryAPI.updateStatus(id, status); setInquiries((p) => ({ ...p, inquiries: p.inquiries.map((i) => i._id === id ? data : i) })); showToast(`Status: ${status}`); } catch (err) { showToast(err.response?.data?.message || 'Error', 'error'); }
  };
  const handleToggleFeatured = async (id) => {
    try { const { data } = await productAPI.toggleFeatured(id); setProducts((p) => p.map((x) => x._id === id ? data : x)); showToast(data.featured ? 'Marked as featured' : 'Removed from featured'); } catch (err) { showToast(err.response?.data?.message || 'Error', 'error'); }
  };
  const handleLogout = () => { localStorage.removeItem('adminToken'); navigate('/admin'); };
  const openForm = (type, item = null) => { setFormType(type); setEditingItem(item); setShowForm(true); };

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: HiHome },
    { key: 'products', label: 'Products', icon: HiCube, count: products.length },
    { key: 'inquiries', label: 'Inquiries', icon: HiMail, count: inquiries.unread || 0 },
    { key: 'testimonials', label: 'Testimonials', icon: HiChat, count: testimonials.length },
    { key: 'gallery', label: 'Gallery', icon: HiPhotograph, count: galleryImages.length },
    { key: 'contact', label: 'Contact Info', icon: HiPhone },
    { key: 'settings', label: 'Site Settings', icon: HiCog },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#111]/95 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5">
          <h1 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
            Vinayak<span className="text-[#C8A97E]">.</span>
          </h1>
          <p className="text-white/30 text-xs mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button key={item.key} onClick={() => { setActiveSection(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-all duration-200 ${active ? 'bg-[#C8A97E]/10 text-[#C8A97E]' : 'text-white/50 hover:text-white/70 hover:bg-white/5'}`}>
                <Icon className="text-lg shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${active ? 'bg-[#C8A97E]/20' : 'bg-white/10'}`}>{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/40 text-sm rounded-lg hover:text-red-400 hover:bg-red-500/5 transition-all">
            <HiLogout /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
              <HiMenu className="text-2xl" />
            </button>
            <h2 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl text-white capitalize">{activeSection === 'overview' ? 'Dashboard' : activeSection.replace('_', ' ')}</h2>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-[#C8A97E]/30 border-t-[#C8A97E] rounded-full animate-spin" />
            </div>
          ) : activeSection === 'overview' ? (
            <OverviewSection products={products} testimonials={testimonials} galleryImages={galleryImages} inquiries={inquiries} />
          ) : activeSection === 'products' ? (
            <ProductsTab products={products} onAdd={() => openForm('product')} onEdit={(p) => openForm('product', p)} onDelete={handleDeleteProduct} onToggleFeatured={handleToggleFeatured} />
          ) : activeSection === 'testimonials' ? (
            <TestimonialsTab testimonials={testimonials} onAdd={() => openForm('testimonial')} onEdit={(t) => openForm('testimonial', t)} onDelete={handleDeleteTestimonial} />
          ) : activeSection === 'gallery' ? (
            <GalleryTab images={galleryImages} onAdd={() => openForm('gallery')} onEdit={(g) => openForm('gallery', g)} onDelete={handleDeleteGallery} />
          ) : activeSection === 'inquiries' ? (
            <InquiriesTab inquiries={inquiries} onMarkRead={handleMarkRead} onDelete={handleDeleteInquiry} onUpdateStatus={handleUpdateStatus} />
          ) : activeSection === 'contact' ? (
            <ContactTab key={contact._id || 'contact'} contact={contact} onUpdate={setContact} showToast={showToast} />
          ) : activeSection === 'settings' ? (
            <SettingsTab key={siteSettings._id || 'settings'} settings={siteSettings} onUpdate={setSiteSettings} showToast={showToast} />
          ) : null}
        </div>
      </main>

      <AnimatePresence>
        {showForm && (
          formType === 'product' ? <ProductForm product={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); showToast(editingItem ? 'Product updated' : 'Product created'); }} showToast={showToast} />
          : formType === 'testimonial' ? <TestimonialForm testimonial={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); showToast(editingItem ? 'Testimonial updated' : 'Testimonial created'); }} showToast={showToast} />
          : formType === 'gallery' ? <GalleryForm gallery={editingItem} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); showToast(editingItem ? 'Gallery updated' : 'Gallery uploaded'); }} showToast={showToast} />
          : null
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

/* ========== Overview Section ========== */
const OverviewSection = ({ products, testimonials, galleryImages, inquiries }) => {
  const featuredCount = products.filter((p) => p.featured).length;
  const recentInquiries = (inquiries.inquiries || []).slice(0, 5);
  const recentProducts = products.slice(0, 5);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={HiCube} label="Products" value={products.length} color="#C8A97E" sub={`${featuredCount} featured`} />
        <StatCard icon={HiMail} label="Inquiries" value={inquiries.total || 0} color="#F87171" sub={`${inquiries.unread || 0} unread`} />
        <StatCard icon={HiChat} label="Reviews" value={testimonials.length} color="#34D399" />
        <StatCard icon={HiPhotograph} label="Gallery" value={galleryImages.length} color="#818CF8" />
      </div>

      {/* Status breakdown */}
      {inquiries.statusCounts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {['New', 'Contacted', 'Negotiating', 'Closed'].map((s) => {
            const colors = { New: '#C8A97E', Contacted: '#60A5FA', Negotiating: '#FBBF24', Closed: '#34D399' };
            return (
              <div key={s} className="glass rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold" style={{ color: colors[s] }}>{inquiries.statusCounts[s] || 0}</p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-1">{s}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-white font-medium text-sm mb-4">Recent Inquiries</h3>
          {recentInquiries.length === 0 ? (
            <p className="text-white/30 text-sm py-8 text-center">No inquiries yet</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq._id} className={`flex items-start gap-3 p-3 rounded-lg ${!inq.read ? 'bg-[#C8A97E]/5 border border-[#C8A97E]/10' : 'bg-white/[0.02]'}`}>
                  <div className="w-8 h-8 rounded-full bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E] text-xs font-semibold shrink-0">{inq.name?.[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-xs font-medium truncate">{inq.name}</p>
                      {!inq.read && <span className="text-[8px] px-1.5 py-0.5 bg-[#C8A97E] text-[#0A0A0A] font-bold uppercase rounded">New</span>}
                    </div>
                    <p className="text-white/40 text-xs truncate mt-0.5">{inq.message}</p>
                  </div>
                  <span className="text-white/20 text-[10px] shrink-0">{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-white font-medium text-sm mb-4">Recent Products</h3>
          {recentProducts.length === 0 ? (
            <p className="text-white/30 text-sm py-8 text-center">No products yet</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <div key={p._id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                    {p.images?.[0] ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" /> : <HiCube className="w-full h-full p-2 text-white/10" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{p.title}</p>
                    <p className="text-white/40 text-[10px]">{p.category} · ₹{p.price?.toLocaleString('en-IN')}</p>
                  </div>
                  {p.featured && <HiStar className="text-[#C8A97E] text-sm shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========== Products Tab ========== */
const ProductsTab = ({ products, onAdd, onEdit, onDelete, onToggleFeatured }) => (
  <div>
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <p className="text-white/40 text-sm">{products.length} product{products.length !== 1 ? 's' : ''}</p>
      <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors shadow-lg shadow-[#C8A97E]/20">
        <HiPlus /> Add Product
      </button>
    </div>
    {products.length === 0 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
        <HiCube className="text-5xl text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-lg mb-2">No products yet</p>
        <button onClick={onAdd} className="px-6 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold rounded-lg"><HiPlus className="inline mr-1" /> Add Product</button>
      </motion.div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map((product, i) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="glass rounded-xl overflow-hidden group hover:border-white/10 transition-all">
            <div className="relative aspect-[4/3] overflow-hidden">
              {product.images?.[0] ? (
                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center"><HiPhotograph className="text-4xl text-white/10" /></div>
              )}
              <button onClick={() => onToggleFeatured(product._id)}
                className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 shadow-lg transition-all duration-300 ${product.featured ? 'bg-[#C8A97E] text-[#0A0A0A]' : 'bg-black/60 backdrop-blur-sm text-white/60 hover:text-[#C8A97E]'}`}>
                <HiStar /> {product.featured ? 'Featured' : 'Feature'}
              </button>
              {product.images?.length > 1 && (
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white/80 text-xs rounded-md">{product.images.length} photos</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium truncate text-sm">{product.title}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[#C8A97E] text-xs font-medium flex items-center gap-0.5"><HiTag className="text-[10px]" /> {product.category}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/50 text-xs flex items-center gap-0.5"><HiCurrencyRupee className="text-[10px]" /> {product.price?.toLocaleString('en-IN')}</span>
              </div>
              {product.description && <p className="text-white/30 text-xs mt-2 line-clamp-2">{product.description}</p>}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <button onClick={() => onEdit(product)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all flex items-center justify-center gap-1.5"><HiPencil className="text-xs" /> Edit</button>
                <button onClick={() => onDelete(product._id)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all flex items-center justify-center gap-1.5"><HiTrash className="text-xs" /> Delete</button>
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
      <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors shadow-lg shadow-[#C8A97E]/20"><HiPlus /> Add</button>
    </div>
    {testimonials.length === 0 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
        <HiChat className="text-5xl text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-lg mb-2">No testimonials yet</p>
      </motion.div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
            <div className="flex items-start gap-4 mb-4">
              {t.image?.url ? <img src={t.image.url} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#C8A97E]/20" />
                : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8A97E]/30 to-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E] text-lg font-semibold">{t.name?.[0]}</div>}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm">{t.name}</h3>
                <p className="text-white/40 text-xs">{t.role}</p>
                <div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={`text-xs ${i < (t.rating || 5) ? 'text-[#C8A97E]' : 'text-white/10'}`}>★</span>)}</div>
              </div>
            </div>
            <p className="text-white/50 text-sm italic line-clamp-3 mb-4">&ldquo;{t.text}&rdquo;</p>
            <div className="flex gap-2 pt-3 border-t border-white/5">
              <button onClick={() => onEdit(t)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all flex items-center justify-center gap-1.5"><HiPencil className="text-xs" /> Edit</button>
              <button onClick={() => onDelete(t._id)} className="flex-1 py-2 border border-white/10 text-white/50 text-xs rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all flex items-center justify-center gap-1.5"><HiTrash className="text-xs" /> Delete</button>
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
      <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors shadow-lg shadow-[#C8A97E]/20"><HiUpload /> Upload</button>
    </div>
    {images.length === 0 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
        <HiPhotograph className="text-5xl text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-lg mb-2">Gallery is empty</p>
      </motion.div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <motion.div key={img._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
            className="glass rounded-xl overflow-hidden group relative">
            <div className="aspect-square overflow-hidden">
              <img src={img.image?.url} alt={img.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              {img.title && <p className="text-white text-xs font-medium truncate">{img.title}</p>}
              {img.category && <p className="text-[#C8A97E] text-[10px] tracking-wider uppercase">{img.category}</p>}
              <div className="flex gap-2 mt-2">
                <button onClick={() => onEdit(img)} className="flex-1 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs rounded-md hover:bg-white/20 transition-colors flex items-center justify-center gap-1"><HiPencil className="text-[10px]" /> Edit</button>
                <button onClick={() => onDelete(img._id)} className="py-1.5 px-3 bg-red-500/20 backdrop-blur-sm text-red-400 text-xs rounded-md hover:bg-red-500/30 transition-colors"><HiTrash /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ========== Inquiries Tab (CRM) ========== */
const InquiriesTab = ({ inquiries, onMarkRead, onDelete, onUpdateStatus }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = (inquiries.inquiries || [])
    .filter((i) => statusFilter === 'All' || i.status === statusFilter)
    .filter((i) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return i.name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q) || i.phone?.toLowerCase().includes(q) || i.message?.toLowerCase().includes(q) || i.product?.toLowerCase().includes(q);
    });

  const statusColors = { New: 'bg-[#C8A97E] text-[#0A0A0A]', Contacted: 'bg-blue-500/20 text-blue-400', Negotiating: 'bg-yellow-500/20 text-yellow-400', Closed: 'bg-emerald-500/20 text-emerald-400' };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <HiMail className="text-[#C8A97E] text-xl" />
          <span className="text-white/60 text-sm">{inquiries.total || 0} total · {inquiries.unread || 0} unread</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search inquiries..."
            className="w-full bg-white/[0.03] border border-white/10 focus:border-[#C8A97E]/50 pl-10 pr-4 py-2.5 text-white text-sm outline-none rounded-lg placeholder-white/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {inquiryStatuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs uppercase tracking-wider rounded-lg transition-all ${statusFilter === s ? 'bg-[#C8A97E]/10 text-[#C8A97E] border border-[#C8A97E]/20' : 'text-white/40 border border-white/5 hover:text-white/60'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 glass rounded-xl">
          <HiMail className="text-5xl text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-lg">No inquiries found</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq, i) => (
            <motion.div key={inq._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`glass rounded-xl p-4 sm:p-5 ${!inq.read ? 'border-l-2 border-l-[#C8A97E]' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-white font-medium text-sm">{inq.name}</h3>
                    {!inq.read && <span className="text-[10px] px-2 py-0.5 bg-[#C8A97E] text-[#0A0A0A] font-bold uppercase tracking-wider rounded-md">New</span>}
                    <span className={`text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider rounded-md ${statusColors[inq.status] || statusColors.New}`}>{inq.status || 'New'}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/40 text-xs mb-3">
                    <span>{inq.email}</span>
                    {inq.phone && <span>{inq.phone}</span>}
                    {inq.product && <span className="text-[#C8A97E]">Re: {inq.product}</span>}
                    <span>{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-white/50 text-sm">{inq.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Status dropdown */}
                  <StatusDropdown currentStatus={inq.status || 'New'} onChange={(s) => onUpdateStatus(inq._id, s)} />
                  {!inq.read && (
                    <button onClick={() => onMarkRead(inq._id)} className="px-3 py-1.5 border border-white/10 text-white/40 text-xs rounded-lg hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all" title="Mark as read">
                      Read
                    </button>
                  )}
                  <button onClick={() => onDelete(inq._id)} className="px-3 py-1.5 border border-white/10 text-white/40 text-xs rounded-lg hover:text-red-400 hover:border-red-500/30 transition-all">
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
};

const StatusDropdown = ({ currentStatus, onChange }) => {
  const [open, setOpen] = useState(false);
  const statuses = ['New', 'Contacted', 'Negotiating', 'Closed'];
  const colors = { New: '#C8A97E', Contacted: '#60A5FA', Negotiating: '#FBBF24', Closed: '#34D399' };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 px-3 py-1.5 border border-white/10 text-xs rounded-lg hover:border-white/20 transition-all" style={{ color: colors[currentStatus] }}>
        {currentStatus} <HiChevronDown className="text-[10px]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden z-50 min-w-[140px] shadow-xl">
            {statuses.map((s) => (
              <button key={s} onClick={() => { onChange(s); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors ${s === currentStatus ? 'text-[#C8A97E]' : 'text-white/60'}`}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ========== Contact Tab ========== */
const ContactTab = ({ contact, onUpdate, showToast }) => {
  const [form, setForm] = useState({
    phone: contact.phone || '', whatsapp: contact.whatsapp || '', email: contact.email || '',
    address: contact.address || '', mapUrl: contact.mapUrl || '', instagram: contact.instagram || '',
    facebook: contact.facebook || '', youtube: contact.youtube || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { const { data } = await contactAPI.update(form); onUpdate(data); showToast('Contact info updated'); } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); } finally { setSaving(false); }
  };
  const fields = [
    { name: 'phone', label: 'Phone', type: 'tel', icon: HiPhone },
    { name: 'whatsapp', label: 'WhatsApp', type: 'tel', icon: FaWhatsapp },
    { name: 'email', label: 'Email', type: 'email', icon: HiMail },
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
            <input type={field.type} value={form[field.name]} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors rounded-lg" />
          </div>
        ))}
        <button type="submit" disabled={saving} className="px-8 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-[0.2em] uppercase rounded-lg hover:bg-[#D4B896] transition-colors disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20">
          {saving ? 'Saving...' : 'Update Contact Info'}
        </button>
      </form>
    </motion.div>
  );
};

/* ========== Settings Tab ========== */
const SettingsTab = ({ settings, onUpdate, showToast }) => {
  const [form, setForm] = useState({
    heroTitle: settings.heroTitle || 'Vinayak',
    heroSubtitle: settings.heroSubtitle || 'Home Decor',
    heroTagline: settings.heroTagline || 'Premium Furniture',
    heroDescription: settings.heroDescription || '',
    aboutTitle: settings.aboutTitle || '',
    aboutDescription: settings.aboutDescription || '',
    whatsappNumber: settings.whatsappNumber || '919876543210',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { const { data } = await settingsAPI.update(form); onUpdate(data); showToast('Settings updated'); } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 md:p-8 max-w-2xl">
      <h2 className="font-[family-name:var(--font-heading)] text-xl text-white mb-6">Website Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="glass rounded-lg p-4 mb-4">
          <p className="text-[#C8A97E] text-xs tracking-wider uppercase mb-3">Hero Section</p>
          <div className="space-y-4">
            {[
              { name: 'heroTitle', label: 'Hero Title', placeholder: 'Vinayak' },
              { name: 'heroSubtitle', label: 'Hero Subtitle', placeholder: 'Home Decor' },
              { name: 'heroTagline', label: 'Hero Tagline', placeholder: 'Premium Furniture' },
            ].map((f) => (
              <div key={f.name}>
                <label className="text-white/40 text-xs block mb-1">{f.label}</label>
                <input type="text" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-2.5 text-white text-sm outline-none rounded-lg placeholder-white/20" />
              </div>
            ))}
            <div>
              <label className="text-white/40 text-xs block mb-1">Hero Description</label>
              <textarea rows={3} value={form.heroDescription} onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-2.5 text-white text-sm outline-none rounded-lg resize-none placeholder-white/20" />
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 mb-4">
          <p className="text-[#C8A97E] text-xs tracking-wider uppercase mb-3">About Section</p>
          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-xs block mb-1">About Title</label>
              <input type="text" value={form.aboutTitle} onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-2.5 text-white text-sm outline-none rounded-lg" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">About Description</label>
              <textarea rows={3} value={form.aboutDescription} onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-2.5 text-white text-sm outline-none rounded-lg resize-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">WhatsApp Number (for floating button)</label>
          <input type="text" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="919876543210"
            className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg placeholder-white/20" />
          <p className="text-white/20 text-xs mt-1">Format: country code + number without spaces (e.g., 919876543210)</p>
        </div>

        <button type="submit" disabled={saving} className="px-8 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-[0.2em] uppercase rounded-lg hover:bg-[#D4B896] transition-colors disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20">
          {saving ? 'Saving...' : 'Update Settings'}
        </button>
      </form>
    </motion.div>
  );
};

/* ========== Product Form Modal ========== */
const ProductForm = ({ product, onClose, onSaved, showToast }) => {
  const [form, setForm] = useState({
    title: product?.title || '', description: product?.description || '',
    category: product?.category || 'Sofas', price: product?.price || '',
    featured: product?.featured || false, material: product?.material || '',
    dimensions: product?.dimensions || '',
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
      formData.append('material', form.material.trim());
      formData.append('dimensions', form.dimensions.trim());
      if (product) formData.append('existingImages', JSON.stringify(existingImages));
      files.forEach((file) => formData.append('images', file));
      if (product) await productAPI.update(product._id, formData);
      else await productAPI.create(formData);
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-2xl glass rounded-xl p-6 md:p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1"><HiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product name"
              className={`w-full bg-white/5 border ${errors.title ? 'border-red-500/50' : 'border-white/10'} focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg placeholder-white/20`} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Description *</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description"
              className={`w-full bg-white/5 border ${errors.description ? 'border-red-500/50' : 'border-white/10'} focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg resize-none placeholder-white/20`} />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg">
                {categories.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0"
                className={`w-full bg-white/5 border ${errors.price ? 'border-red-500/50' : 'border-white/10'} focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg`} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Material</label>
              <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="e.g. Teak Wood, Leather"
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg placeholder-white/20" />
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Dimensions</label>
              <input type="text" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="e.g. L:200cm × W:90cm × H:80cm"
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg placeholder-white/20" />
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <button type="button" onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`w-10 h-5 rounded-full transition-all duration-300 ${form.featured ? 'bg-[#C8A97E]' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-white/60 text-sm">Featured product</span>
          </div>

          <ImageDropZone files={files} setFiles={setFiles} label={product ? 'Add More Images' : 'Product Images *'} />
          {errors.images && <p className="text-red-400 text-xs">{errors.images}</p>}

          {existingImages.length > 0 && (
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Current Images</label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <HiTrash className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm rounded-lg hover:border-white/30 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20 flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />Saving...</> : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ========== Testimonial Form Modal ========== */
const TestimonialForm = ({ testimonial, onClose, onSaved, showToast }) => {
  const [form, setForm] = useState({ name: testimonial?.name || '', role: testimonial?.role || '', text: testimonial?.text || '', rating: testimonial?.rating || 5 });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name); formData.append('role', form.role);
      formData.append('text', form.text); formData.append('rating', form.rating);
      if (files.length > 0) formData.append('image', files[0]);
      if (testimonial) await testimonialAPI.update(testimonial._id, formData);
      else await testimonialAPI.create(formData);
      onSaved();
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-lg glass rounded-xl p-6 md:p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1"><HiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg placeholder-white/20" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Role / Title *</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Interior Designer"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg placeholder-white/20" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Review *</label>
            <textarea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Customer review text"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg resize-none placeholder-white/20" required />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                  className={`text-2xl transition-all duration-200 hover:scale-110 ${star <= form.rating ? 'text-[#C8A97E]' : 'text-white/15 hover:text-white/30'}`}>★</button>
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
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm rounded-lg hover:border-white/30 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20 flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />Saving...</> : testimonial ? 'Update' : 'Create'}
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
    if (!isEdit && files.length === 0) { showToast('Select at least one image', 'error'); return; }
    setSaving(true); setUploadProgress(0);
    try {
      if (isEdit) {
        const formData = new FormData();
        formData.append('title', title); formData.append('category', category);
        if (files.length > 0) formData.append('image', files[0]);
        await galleryAPI.update(gallery._id, formData);
      } else {
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append('title', title); formData.append('category', category);
          formData.append('image', files[i]);
          await galleryAPI.create(formData);
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }
      }
      onSaved();
    } catch (err) { showToast(err.response?.data?.message || 'Upload failed', 'error'); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-lg glass rounded-xl p-6 md:p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">{isEdit ? 'Edit Gallery Image' : 'Upload Gallery Images'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1"><HiX className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Title (optional)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Living Room"
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg placeholder-white/20" />
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none rounded-lg">
              {galleryCategories.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
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
          <ImageDropZone files={files} setFiles={setFiles} multiple={!isEdit} label={isEdit ? 'Replace Image (optional)' : 'Images *'} />
          {saving && !isEdit && (
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-1"><span>Uploading...</span><span>{uploadProgress}%</span></div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-[#C8A97E] rounded-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 text-sm rounded-lg hover:border-white/30 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase rounded-lg hover:bg-[#D4B896] transition-colors disabled:opacity-50 shadow-lg shadow-[#C8A97E]/20 flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />{isEdit ? 'Saving...' : 'Uploading...'}</> : isEdit ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
