import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, User, Package, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getUserDetails = (userId: string) => {
    return users.find(user => user._id === userId);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Order deleted successfully');
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      toast.error('Error deleting order');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders yet
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => {
                const user = getUserDetails(order.userId);
                return (
                  <div key={order._id} className="border rounded-lg p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <User className="h-4 w-4" />
                          Customer Details
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-gray-600">{user?.email}</p>
                          <p className="text-gray-600">{user?.phone}</p>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Package className="h-4 w-4" />
                          Product Details
                        </div>
                        <div className="flex gap-3">
                          <img
                            src={order.product.imageUrl || '/placeholder.svg'}
                            alt={order.product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="text-sm">
                            <p className="font-medium">{order.product.title}</p>
                            <p className="text-gray-600">{order.product.category}</p>
                            <p className="text-amber-600 font-bold">₹{order.product.price}</p>
                          </div>
                        </div>
                      </div>

                      {/* Address Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MapPin className="h-4 w-4" />
                          Delivery Address
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state}</p>
                          <p>{order.address.zipCode}, {order.address.country}</p>
                        </div>
                      </div>

                      {/* Order Info & Actions */}
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="text-gray-500">Order #{order._id.slice(-8)}</p>
                          <p className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-gray-600">Payment: {order.paymentMethod}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleDeleteOrder(order._id)}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;