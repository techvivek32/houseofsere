import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminCategories = () => {
  const [categories, setCategories] = useState(['']);
  const [savedCategories, setSavedCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setSavedCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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
        const response = await fetch('/api/categories/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: validCategories }),
        });
        
        if (response.ok) {
          toast.success(`${validCategories.length} categories saved successfully`);
          fetchCategories();
          setCategories(['']);
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
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
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
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleAddCategoryField} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
              <Button onClick={handleSaveCategories} className="bg-amber-600 hover:bg-amber-700">
                Save Categories
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Saved Categories ({savedCategories.length})</CardTitle>
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
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCategories;