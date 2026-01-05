import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Phone } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-800 mb-8">My Profile</h1>
        
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-serif text-amber-800">
              <User className="h-6 w-6" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  {user.firstName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  {user.lastName}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {user.email}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;