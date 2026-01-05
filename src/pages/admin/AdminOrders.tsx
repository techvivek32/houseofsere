import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
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
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.product.title}</h3>
                      <p className="text-sm text-gray-600">Category: {order.product.category}</p>
                      <p className="text-sm text-gray-600">Price: {order.product.price}</p>
                      <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Delivery Address:</h4>
                      <p className="text-sm text-gray-600">{order.address.street}</p>
                      <p className="text-sm text-gray-600">{order.address.city}, {order.address.state}</p>
                      <p className="text-sm text-gray-600">{order.address.zipCode}, {order.address.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;