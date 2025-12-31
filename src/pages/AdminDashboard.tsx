import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [categories, setCategories] = useState(['']);
  const [savedCategories, setSavedCategories] = useState([]);
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
    // In a real app, this would open a product form
    toast.info('Add Product functionality would be implemented here');
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;