import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminOrders = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No orders yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;