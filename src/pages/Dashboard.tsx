
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
import TicketList from '@/components/TicketList';
import { RainbowButton } from '@/components/magicui/rainbow-button';


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
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          {/* Site Header */}
          <div className="md:hidden">
          <SiteHeader />
          </div>

          {/* Main Content */}
          <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-textprimary">
                        Welcome back, {user?.name}!
                      </h1>
                      {isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 px-3 py-1">
                          <Crown className="h-4 w-4 mr-1" />
                          {user?.subscription?.planName || 'Premium'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-zinc-400 font-semibold" >
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
                <div className="flex gap-3 mt-4 sm:mt-0 flex-wrap justify-center">
                  {!isPremium && (
                    <RainbowButton onClick={() => navigate('/payment')}>Upgrade to Premium</RainbowButton>
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

              {/* STATISTICS CARD */}

              <StatisticCard5 statsData={statsData} />


              {/* SEARCH FILTER TICKETS */}
              <Card className="w-full  max-w-4xl mx-auto bg-white dark:bg-[#121214] backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl mb-10 shadow-md dark:shadow-zinc-900 ">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                        <Input
                          placeholder="Search tickets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-zinc-50 dark:bg-zinc-800/50"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full lg:w-48 bg-zinc-50 dark:bg-zinc-800/50">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className='bg-zinc-50 dark:bg-zinc-900'>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full lg:w-48 bg-zinc-50 dark:bg-zinc-800/50">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent className='bg-zinc-50 dark:bg-zinc-900'>
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
                    // <div className="space-y-4">
                    //   {filteredTickets.map((ticket) => (
                    //     <div
                    //       key={ticket.id}
                    //       className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
                    //       onClick={() => navigate(`/ticket/${ticket.id}`)}
                    //     >
                    //       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    //         <div className="flex-1">
                    //           <div className="flex items-center gap-3 mb-2">
                    //             <h3 className="font-semibold text-gray-900 text-lg">
                    //               {ticket.title}
                    //             </h3>
                    //             <Badge className={getStatusColor(ticket.status)}>
                    //               {getStatusIcon(ticket.status)}
                    //               <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                    //             </Badge>
                    //             <Badge className={getPriorityColor(ticket.priority)}>
                    //               {ticket.priority.toUpperCase()}
                    //             </Badge>
                    //           </div>
                    //           <p className="text-gray-600 mb-3 line-clamp-2">
                    //             {ticket.description}
                    //           </p>
                    //           <div className="flex items-center gap-4 text-sm text-gray-500">
                    //             <div className="flex items-center gap-1">
                    //               <Calendar className="h-4 w-4" />
                    //               Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                    //             </div>
                    //             <div className="capitalize">
                    //               Category: {ticket.category.replace('-', ' ')}
                    //             </div>
                    //             {ticket.comments.length > 0 && (
                    //               <div>
                    //                 {ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}
                    //               </div>
                    //             )}
                    //           </div>
                    //         </div>
                    //       </div>
                    //     </div>
                    //   ))}
                    // </div>
              <TicketList filteredTickets={filteredTickets}/>
                  )}



            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;
