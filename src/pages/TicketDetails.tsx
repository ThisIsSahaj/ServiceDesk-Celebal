
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets, Ticket } from '@/contexts/TicketContext';
import {
  ArrowLeft,
  Send,
  Clock,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AvatarImage } from '@/components/avatar';
import { RainbowButton } from '@/components/magicui/rainbow-button';

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const { getTicketById, addComment, updateTicket } = useTickets();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const fetchedTicket = await getTicketById(id);
        setTicket(fetchedTicket || null);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, getTicketById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading ticket details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
            <p className="text-gray-600 mb-6">The ticket you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmittingComment(true);

    await addComment(ticket.id, {
      ticketId: ticket.id,
      userId: user.id,
      userName: user.name,
      content: newComment,
      isInternal: false,
    });

    // Refresh ticket data to show new comment
    const updatedTicket = await getTicketById(ticket.id);
    if (updatedTicket) {
      setTicket(updatedTicket);
    }

    setNewComment('');
    setIsSubmittingComment(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateTicket(ticket.id, { status: newStatus as any });

    // Refresh ticket data
    const updatedTicket = await getTicketById(ticket.id);
    if (updatedTicket) {
      setTicket(updatedTicket);
    }
  };

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
      case 'low': return 'bg-green-400 text-green-800';
      case 'medium': return 'bg-yellow-400 text-yellow-800';
      case 'high': return 'bg-orange-400 text-orange-800';
      case 'urgent': return 'bg-red-400 text-red-800';
      default: return 'bg-gray-400 text-gray-800';
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-zinc-900 dark:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Info */}
            <Card className="rounded-2xl shadow-md dark:shadow-zinc-900 border-0 bg-white dark:bg-[#121214]  text-white">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                      {ticket.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-zinc-400 font-semibold uppercase">
                        {ticket.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2">
                      {ticket.status !== 'in-progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange('in-progress')}
                        >
                          Mark In Progress
                        </Button>
                      )}
                      {ticket.status !== 'resolved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange('resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-zinc-900 dark:text-white/70 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="rounded-2xl shadow-md dark:shadow-zinc-900 border-0 bg-white dark:bg-[#121214]  text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-white">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({ticket.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticket.comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-zinc-400 font-semibold">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ticket.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-zinc-900  rounded-lg">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={user?.photoURL} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-r  text-zinc-900 dark:text-white">
                            {comment.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-zinc-900 dark:text-white">{comment.userName}</span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(comment.createdAt), 'MMM d, yyyy at h:mm a')}
                            </span>
                          </div>
                          <p className="text-zinc-900 dark:text-white whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-4 pt-4 border-t">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[100px] text-zinc-900 dark:text-white bg-white dark:bg-zinc-900"
                  />
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className=""
                  >
                    {isSubmittingComment ? (
                      "Posting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <Card className="rounded-2xl shadow-md dark:shadow-zinc-900 border-0 bg-white dark:bg-[#121214]  text-zinc-900 dark:text-white">
              <CardHeader>
                <CardTitle className="text-lg">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Reporter</p>
                    <p className="font-medium">{ticket.userName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{format(new Date(ticket.updatedAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>

                {ticket.assignedTo && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Assigned To</p>
                      <p className="font-medium">{ticket.assignedTo}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {user?.id === ticket.userId && (
              <Card className="rounded-2xl shadow-md dark:shadow-zinc-900 border-0 bg-white dark:bg-[#121214] text-zinc-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <RainbowButton onClick={() => navigate('/payment')} className='w-full'>Upgrade to Premium</RainbowButton>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/create-ticket')}
                  >
                    Create Related Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
