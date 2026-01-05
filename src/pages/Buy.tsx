import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, CreditCard, Truck } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Buy = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user, isLoading: userLoading } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userLoading) return; // Wait for user context to load
    
    if (!user) {
      navigate('/login');
      return;
    }
    if (productId) {
      fetchProduct();
    } else {
      toast.error('Product not found');
      navigate('/');
    }
  }, [user, userLoading, productId, navigate]);

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        const foundProduct = products.find((p: any) => p._id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error('Product not found');
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      toast.error('Please fill in all address fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          product: {
            id: product._id,
            title: product.title,
            category: product.category,
            price: product.price,
            imageUrl: product.imageUrl
          },
          address,
          paymentMethod,
          total: product.price
        })
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        navigate('/my-orders');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Details */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-amber-800">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-serif text-gray-800">{product.title}</h3>
              <p className="text-amber-600 font-medium">{product.category}</p>
              <p className="text-2xl font-bold text-amber-800 mt-2">₹{product.price}</p>
              {product.description && (
                <p className="text-gray-600 mt-2">{product.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        <div className="space-y-6">
          {/* Address */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-serif text-amber-800">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                />
                <Input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="ZIP Code"
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                />
                <Input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-serif text-amber-800">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Cash on Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Online Payment
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-amber-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Product Price:</span>
                <span>₹{product.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{product.price}</span>
                </div>
              </div>
              <Button
                onClick={handleOrder}
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-base font-medium"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Buy;