import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiLogout, HiStar, HiX, HiPhotograph } from 'react-icons/hi';
import { productAPI, contactAPI, authAPI } from '../services/api';

const categories = ['Sofas', 'Beds', 'Office Furniture', 'Dining', 'Decor', 'Custom Furniture'];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [contact, setContact] = useState({});
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, contactRes] = await Promise.all([
        productAPI.getAll(),
        contactAPI.get(),
      ]);
      setProducts(prodRes.data.products);
      setContact(contactRes.data);
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

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-semibold text-white">
              Dashboard
            </h1>
            <p className="text-white/40 text-sm mt-1">Manage your products & settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/50 text-sm hover:text-red-400 hover:border-red-400/30 transition-all duration-300"
          >
            <HiLogout /> Logout
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          {['products', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
                activeTab === tab
                  ? 'bg-[#C8A97E] text-[#0A0A0A] border-[#C8A97E]'
                  : 'border-white/10 text-white/50 hover:border-[#C8A97E]/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30">Loading...</div>
        ) : activeTab === 'products' ? (
          <ProductsTab
            products={products}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ContactTab contact={contact} onUpdate={setContact} />
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductsTab = ({ products, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-end mb-6">
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-[#C8A97E] text-[#0A0A0A] text-sm font-semibold tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300"
      >
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
          <motion.div
            key={product._id}
            layout
            className="glass p-4 group"
          >
            <div className="relative aspect-[4/3] overflow-hidden mb-4">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
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
              <button
                onClick={() => onEdit(product)}
                className="flex-1 py-2 border border-white/10 text-white/50 text-xs hover:border-[#C8A97E]/30 hover:text-[#C8A97E] transition-all duration-300 flex items-center justify-center gap-1"
              >
                <HiPencil /> Edit
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 py-2 border border-white/10 text-white/50 text-xs hover:border-red-500/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-1"
              >
                <HiTrash /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

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
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <HiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#111]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C8A97E] px-4 py-3 text-white text-sm outline-none transition-colors duration-300"
                required
                min="0"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-[#C8A97E]"
            />
            <span className="text-white/60 text-sm">Featured Product</span>
          </label>

          {existingImages.length > 0 && (
            <div>
              <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">Current Images</label>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img) => (
                  <div key={img.publicId} className="relative w-20 h-20">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.publicId)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-white/40 text-xs tracking-wider uppercase block mb-2">
              {product ? 'Add More Images' : 'Images'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white/50 text-sm file:mr-4 file:py-1 file:px-4 file:border-0 file:bg-[#C8A97E] file:text-[#0A0A0A] file:text-xs file:font-semibold file:cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-white/50 text-sm hover:border-white/30 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-[#C8A97E] text-[#0A0A0A] font-semibold text-sm tracking-wider uppercase hover:bg-[#D4B896] transition-colors duration-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

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

export default AdminDashboard;
