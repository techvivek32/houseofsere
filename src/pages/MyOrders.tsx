import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyOrders();
  }, [user, navigate]);

  const fetchMyOrders = async () => {
    try {
      const response = await fetch(`/api/orders/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800">My Orders</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
        
        {orders.length === 0 ? (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="text-gray-500 text-lg">No orders found</div>
              <p className="text-gray-400 mt-2">You haven't placed any orders yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <Card key={order._id} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Order #{order._id.slice(-8)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex gap-4">
                      <img
                        src={order.product.imageUrl || '/placeholder.svg'}
                        alt={order.product.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{order.product.title}</h3>
                        <p className="text-gray-600">{order.product.category}</p>
                        <p className="text-amber-600 font-bold">₹{order.product.price}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">{order.address.street}</p>
                      <p className="text-sm text-gray-600">{order.address.city}, {order.address.state}</p>
                      <p className="text-sm text-gray-600">{order.address.zipCode}, {order.address.country}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-2">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                      <p className="text-lg font-bold text-amber-800 mt-2">Total: ₹{order.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;