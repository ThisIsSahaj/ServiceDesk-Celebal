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
import { ArrowLeft, User, Mail, Calendar, Edit, Save, X, Wallet, Star } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { RainbowButton } from '@/components/magicui/rainbow-button';



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
      <div className="min-h-screen bg-gradient-to-br bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-400">Please log in to view your profile.</p>
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
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <div className="md:hidden">
            <SiteHeader />
          </div>


          <div className="min-h-screen bg-gradient-to-br bg-white dark:bg-[#0a0a0a]">
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

              <div className="grid grid-cols-1 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6 ">
                  <Card className="shadow-md dark:shadow-zinc-900 border-0 bg-white dark:bg-[#121214] text-zinc-900 dark:text-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold ">
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
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                {isPremium && (
                                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0">
                                    <Wallet className="h-4 w-4 mr-1" />
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
                          <div className="p-2 rounded-lg">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                             Member Since {format(new Date(user.createdAt), 'MMMM yyyy')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium font-mono text-sm">User ID: {user.id}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription Management */}
                  <Card className="shadow-md dark:shadow-zinc-900 border-0 bg-white dark:bg-[#121214]">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-yellow-500" />
                        Your Subscription
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isPremium && user?.subscription ? (
                        <div className="space-y-4">
                          <div className="p-6 rounded-md">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">
                                  {user.subscription.planName} Plan
                                </h3>
                                <p className="text-green-500">Active Subscription</p>
                              </div>
                              <Badge className="bg-green-500 text-zinc-900 dark:text-white">
                                <Star className="h-4 w-4 mr-1" />
                                Active
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-zinc-900 dark:text-white">Amount</p>
                                <p className="font-semibold text-green-500">₹{user.subscription.amount}/month</p>
                              </div>
                              <div>
                                <p className="text-zinc-900 dark:text-white">Started</p>
                                <p className="font-semibold text-green-500">
                                  {format(new Date(user.subscription.startDate), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          
                          <h3 className="text-lg font-semibold mb-2">
                            No Active Subscription
                          </h3>
                          <p className="text-zinc-400 mb-6">
                            Upgrade to a premium plan to unlock advanced features and priority support
                          </p>
                         <RainbowButton onClick={() => navigate('/payment')} >Upgrade to Premium</RainbowButton>
                        </div>
                      )}
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
