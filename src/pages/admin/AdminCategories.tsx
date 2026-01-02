import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { Category } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';

interface CategoryFormData {
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  subcategories: string[];
}

const emptyForm: CategoryFormData = {
  slug: '',
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  icon: 'folder',
  subcategories: [],
};

const iconOptions = [
  'palette', 'dumbbell', 'chef-hat', 'music', 'leaf', 'globe',
  'briefcase', 'trophy', 'code', 'camera', 'book', 'heart',
  'star', 'zap', 'folder', 'users', 'home', 'compass',
];

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [subcategoryInput, setSubcategoryInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: Category | null }>({
    isOpen: false,
    category: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        slug: category.slug,
        name_en: category.name_en,
        name_ar: category.name_ar,
        description_en: category.description_en,
        description_ar: category.description_ar,
        icon: category.icon,
        subcategories: category.subcategories || [],
      });
    } else {
      setEditingCategory(null);
      setFormData(emptyForm);
    }
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData(emptyForm);
    setSubcategoryInput('');
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setActionLoading(true);

    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory._id, formData);
      } else {
        await adminApi.createCategory(formData);
      }
      closeModal();
      fetchCategories();
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Failed to save category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    setActionLoading(true);
    try {
      await adminApi.deleteCategory(deleteModal.category._id);
      setDeleteModal({ isOpen: false, category: null });
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };

  const addSubcategory = () => {
    if (subcategoryInput.trim() && !formData.subcategories.includes(subcategoryInput.trim())) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, subcategoryInput.trim()],
      });
      setSubcategoryInput('');
    }
  };

  const removeSubcategory = (sub: string) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((s) => s !== sub),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-deep-violet">Categories</h1>
          <p className="text-gray-500 mt-1">Manage listing categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo text-white rounded-lg hover:bg-indigo/90"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-lilac/20 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No categories found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-lavender">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lilac/10">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-light-lavender/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-deep-violet">{category.name_en}</p>
                        <p className="text-sm text-gray-500 font-arabic">{category.name_ar}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-lilac/20 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{category.listingCount || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories?.slice(0, 3).map((sub) => (
                          <span
                            key={sub}
                            className="text-xs bg-lilac/20 text-gray-600 px-2 py-0.5 rounded"
                          >
                            {sub}
                          </span>
                        ))}
                        {(category.subcategories?.length || 0) > 3 && (
                          <span className="text-xs text-gray-400">
                            +{(category.subcategories?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(category)}
                          className="p-2 text-gray-400 hover:text-indigo rounded-lg hover:bg-indigo/10"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, category })}
                          className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-error/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-lilac/20 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-deep-violet">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-error/10 text-error rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo"
                    placeholder="category-slug"
                    required
                    disabled={!!editingCategory}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-3 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (Arabic) *
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    className="w-full px-3 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo font-arabic text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (English)
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-3 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Arabic)
                </label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  className="w-full px-3 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo resize-none font-arabic text-right"
                  rows={2}
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategories
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubcategory();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo"
                    placeholder="Add subcategory..."
                  />
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="px-3 py-2 bg-lilac/30 text-gray-600 rounded-lg hover:bg-lilac/50"
                  >
                    Add
                  </button>
                </div>
                {formData.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1 text-sm bg-lilac/20 text-gray-600 px-2 py-1 rounded"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => removeSubcategory(sub)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-lilac/20">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo text-white rounded-lg hover:bg-indigo/90 font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.category?.name_en}"? This cannot be undone.`}
        confirmText="Delete"
        isDestructive
        isLoading={actionLoading}
      />
    </div>
  );
}
