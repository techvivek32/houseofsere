import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [categories, setCategories] = useState(['']);
  const [savedCategories, setSavedCategories] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    category: '',
    price: '',
    image: null,
    imageUrl: '',
    description: ''
  });
  const { logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if (response.ok) {
        const data = await response.json();
        setSavedCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handleAddCategoryField = () => {
    setCategories([...categories, '']);
  };

  const handleDeleteCategoryField = (index: number) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      setCategories(newCategories);
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleSaveCategories = async () => {
    const validCategories = categories.filter(cat => cat.trim() !== '');
    if (validCategories.length > 0) {
      try {
        const response = await fetch('http://localhost:8080/api/categories/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: validCategories }),
        });
        
        if (response.ok) {
          toast.success(`${validCategories.length} categories saved successfully`);
          fetchCategories(); // Refresh the saved categories list
          setCategories(['']); // Clear input fields
        } else {
          toast.error('Failed to save categories');
        }
      } catch (error) {
        toast.error('Error saving categories');
      }
    } else {
      toast.error('Please add at least one category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories(); // Refresh the list
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setProductForm({
      title: '',
      category: '',
      price: '',
      image: null,
      imageUrl: '',
      description: ''
    });
  };

  const handleProductFormChange = (field: string, value: any) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = async () => {
    if (!productForm.title || !productForm.category || !productForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: productForm.title,
          category: productForm.category,
          price: productForm.price,
          imageUrl: productForm.imageUrl,
          description: productForm.description
        }),
      });
      
      if (response.ok) {
        toast.success('Product added successfully');
        handleCloseProductForm();
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      toast.error('Error adding product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Collections (0)</h2>
          </div>
          <Button
            onClick={handleAddProduct}
            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Categories Section */}
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Enter category name"
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  className="flex-1"
                />
                {categories.length > 1 && (
                  <Button
                    onClick={() => handleDeleteCategoryField(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddCategoryField}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
              
              <Button
                onClick={handleSaveCategories}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Save Categories
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Categories Section */}
        {savedCategories.length > 0 && (
          <Card className="w-full max-w-2xl mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Saved Categories ({savedCategories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedCategories.map((category: any) => (
                  <div key={category._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{category.name}</span>
                    <Button
                      onClick={() => handleDeleteCategory(category._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <Button
                onClick={handleCloseProductForm}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Product Title"
                value={productForm.title}
                onChange={(e) => handleProductFormChange('title', e.target.value)}
              />
              
              <Select
                value={productForm.category}
                onValueChange={(value) => handleProductFormChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {savedCategories.map((category: any) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Price (e.g., ₹25,000 or Inquire)"
                value={productForm.price}
                onChange={(e) => handleProductFormChange('price', e.target.value)}
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProductFormChange('image', e.target.files?.[0])}
                  className="mb-2"
                />
                <Input
                  placeholder="Or paste image URL"
                  value={productForm.imageUrl}
                  onChange={(e) => handleProductFormChange('imageUrl', e.target.value)}
                />
              </div>
              
              <Textarea
                placeholder="Description (optional)"
                value={productForm.description}
                onChange={(e) => handleProductFormChange('description', e.target.value)}
                rows={3}
              />
              
              <Button
                onClick={handleSaveProduct}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Add Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;