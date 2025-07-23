
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Crown,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import StatisticCard5 from '@/components/StatisticCard';
import TicketList from '@/components/TIcketList';


const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const { tickets, getUserTickets } = useTickets();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const userTickets = getUserTickets(user?.id || '');

  const filteredTickets = userTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <TrendingUp className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.status === 'open').length,
    inProgress: userTickets.filter(t => t.status === 'in-progress').length,
    resolved: userTickets.filter(t => t.status === 'resolved').length,
  };

  const total = stats.total || 1;


  const statsData = {
    balance: stats.total,

    //   delta: 5.7,
    statistics: [
      {
        name: 'Open',
        percent: (stats.open / total) * 100,
        value: stats.open,
        color: 'bg-indigo-500',
      },
      {
        name: 'In Progress',
        percent: (stats.inProgress / total) * 100,
        value: stats.inProgress,
        color: 'bg-yellow-500',
      },
      {
        name: 'Resolved',
        percent: (stats.resolved / total) * 100,
        value: stats.resolved,
        color: 'bg-green-500',
      },
    ],
  };

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
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name}!
                      </h1>
                      {isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 px-3 py-1">
                          <Crown className="h-4 w-4 mr-1" />
                          {user?.subscription?.planName || 'Premium'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600">
                      Manage your support tickets and track their progress
                    </p>
                    {isPremium && user?.subscription && (
                      <p className="text-sm text-amber-600 mt-1">
                        <Star className="h-4 w-4 inline mr-1" />
                        Premium subscription active - Enjoy priority support!
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                  {!isPremium && (
                    <Button
                      onClick={() => navigate('/payment')}
                      variant="outline"
                      className="border-amber-500 text-amber-600 hover:bg-amber-50"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                    
                  )}
                  <Button
                        onClick={() => navigate('/create-ticket')}
                        asChild
                        size="lg"
                        className="rounded-xl px-5 text-base cursor-pointer">
                        <span className="text-nowrap">
                          <Plus className="h-4 w-4 mr-2" />Create Ticket</span>
                      </Button>
                </div>
              </div>


              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Resolved</p>
                        <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}


              {/* STATISTICS CARD */}

              <StatisticCard5 statsData={statsData} />


              <Card className="border-0 shadow-lg mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search tickets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets List */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Your Tickets ({filteredTickets.length})
                  </CardTitle>
                  <CardDescription>
                    Track and manage all your support tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {userTickets.length === 0 ? "No tickets yet" : "No tickets match your filters"}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {userTickets.length === 0
                          ? "Create your first support ticket to get started"
                          : "Try adjusting your search or filter criteria"
                        }
                      </p>
                      {userTickets.length === 0 && (
                        <Button onClick={() => navigate('/create-ticket')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Ticket
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
                          onClick={() => navigate(`/ticket/${ticket.id}`)}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {ticket.title}
                                </h3>
                                <Badge className={getStatusColor(ticket.status)}>
                                  {getStatusIcon(ticket.status)}
                                  <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                                </Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {ticket.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                                </div>
                                <div className="capitalize">
                                  Category: {ticket.category.replace('-', ' ')}
                                </div>
                                {ticket.comments.length > 0 && (
                                  <div>
                                    {ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <TicketList filteredTickets={filteredTickets}/>

            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;
