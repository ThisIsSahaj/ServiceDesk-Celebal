import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { ArrowLeft, User, Mail, Calendar, Edit, Save, X, Crown, Star } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';



const Profile = () => {
  const { user, isPremium } = useAuth();
  const { getUserTickets } = useTickets();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const userTickets = getUserTickets(user?.id || '');

  const stats = {
    totalTickets: userTickets.length,
    openTickets: userTickets.filter(t => t.status === 'open').length,
    resolvedTickets: userTickets.filter(t => t.status === 'resolved').length,
  };

  const handleSaveProfile = () => {
    // Note: In a real implementation, you would update the user profile in Firebase
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (

    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />


          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          Profile Information
                        </CardTitle>
                        {!isEditing ? (
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveProfile}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.name} />
                          ) : null}
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="max-w-md"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                {isPremium && (
                                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0">
                                    <Crown className="h-4 w-4 mr-1" />
                                    {user.subscription?.planName || 'Premium'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role === 'admin' ? 'Administrator' : 'User'}
                                </Badge>
                                {isPremium && (
                                  <span className="text-sm text-amber-600 flex items-center">
                                    <Star className="h-4 w-4 mr-1" />
                                    Premium Member
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email Address</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium text-gray-900">
                              {format(new Date(user.createdAt), 'MMMM yyyy')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">User ID</p>
                            <p className="font-medium text-gray-900 font-mono text-sm">{user.id}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription Management */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        Subscription Management
                      </CardTitle>
                      <CardDescription>
                        Manage your ServiceDesk Pro subscription and billing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isPremium && user?.subscription ? (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-amber-800 text-lg">
                                  {user.subscription.planName} Plan
                                </h3>
                                <p className="text-amber-700">Active Subscription</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Star className="h-4 w-4 mr-1" />
                                Active
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-amber-600">Amount</p>
                                <p className="font-semibold text-amber-800">₹{user.subscription.amount}/month</p>
                              </div>
                              <div>
                                <p className="text-amber-600">Started</p>
                                <p className="font-semibold text-amber-800">
                                  {format(new Date(user.subscription.startDate), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => navigate('/payment')}
                              className="flex-1"
                            >
                              Change Plan
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => toast({
                                title: "Contact Support",
                                description: "Please contact our support team to cancel your subscription.",
                              })}
                            >
                              Manage Billing
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Active Subscription
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Upgrade to a premium plan to unlock advanced features and priority support
                          </p>
                          <Button
                            onClick={() => navigate('/payment')}
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade to Premium
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Recent Ticket Activity
                      </CardTitle>
                      <CardDescription>
                        Your latest support tickets and their current status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userTickets.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">No tickets created yet</p>
                          <Button onClick={() => navigate('/create-ticket')}>
                            Create Your First Ticket
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userTickets.slice(0, 5).map((ticket) => (
                            <div
                              key={ticket.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => navigate(`/ticket/${ticket.id}`)}
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                                <p className="text-sm text-gray-600">
                                  Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <Badge className={
                                ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                  ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                              }>
                                {ticket.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          ))}

                          {userTickets.length > 5 && (
                            <Button
                              variant="outline"
                              onClick={() => navigate('/dashboard')}
                              className="w-full mt-4"
                            >
                              View All Tickets
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Ticket Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">{stats.totalTickets}</div>
                        <div className="text-sm text-blue-800">Total Tickets</div>
                      </div>

                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-3xl font-bold text-yellow-600">{stats.openTickets}</div>
                        <div className="text-sm text-yellow-800">Open Tickets</div>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">{stats.resolvedTickets}</div>
                        <div className="text-sm text-green-800">Resolved Tickets</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={() => navigate('/create-ticket')}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Create New Ticket
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/payment')}
                        className="w-full"
                      >
                        Upgrade Plan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Profile;
