
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  createTicket as createFirebaseTicket,
  updateTicket as updateFirebaseTicket,
  getTicket as getFirebaseTicket,
  getUserTickets as getFirebaseUserTickets,
  getAllTickets as getFirebaseAllTickets,
  addCommentToTicket,
  FirebaseTicket,
  FirebaseComment
} from '@/services/ticketService';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'feature-request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  userId: string;
  userName: string;
  userEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  addComment: (ticketId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  getTicketById: (id: string) => Promise<Ticket | undefined>;
  getUserTickets: (userId: string) => Ticket[];
  loading: boolean;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

const convertFirebaseTicketToTicket = (firebaseTicket: FirebaseTicket): Ticket => {
  return {
    ...firebaseTicket,
    createdAt: firebaseTicket.createdAt.toDate().toISOString(),
    updatedAt: firebaseTicket.updatedAt.toDate().toISOString(),
    comments: firebaseTicket.comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toDate().toISOString(),
    })),
  };
};

const convertTicketToFirebaseTicket = (ticket: Partial<Ticket>): Partial<FirebaseTicket> => {
  // Extract date and comment properties to handle separately
  const { createdAt, updatedAt, comments, ...rest } = ticket;
  
  const firebaseTicket: Partial<FirebaseTicket> = { ...rest };
  
  // Convert string dates to Timestamps if they exist
  if (createdAt) {
    firebaseTicket.createdAt = Timestamp.fromDate(new Date(createdAt));
  }
  if (updatedAt) {
    firebaseTicket.updatedAt = Timestamp.fromDate(new Date(updatedAt));
  }
  
  // Convert comments if they exist
  if (comments) {
    firebaseTicket.comments = comments.map(comment => ({
      ...comment,
      createdAt: Timestamp.fromDate(new Date(comment.createdAt)),
    }));
  }
  
  return firebaseTicket;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    try {
      setLoading(true);
      console.log('Creating ticket:', ticketData);
      const ticketId = await createFirebaseTicket({
        ...ticketData,
        status: 'open',
      });
      
      // Refresh tickets after creation
      await loadTickets();
      
      toast({
        title: "Ticket Created",
        description: "Your ticket has been successfully created",
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      setLoading(true);
      console.log('Updating ticket:', id, updates);
      
      // Convert the updates to Firebase format
      const firebaseUpdates = convertTicketToFirebaseTicket(updates);
      await updateFirebaseTicket(id, firebaseUpdates);
      
      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      ));
      
      toast({
        title: "Ticket Updated",
        description: "Ticket has been successfully updated",
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (ticketId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    try {
      console.log('Adding comment to ticket:', ticketId, commentData);
      await addCommentToTicket(ticketId, commentData);
      
      // Refresh ticket data to get updated comments
      const updatedTicket = await getFirebaseTicket(ticketId);
      if (updatedTicket) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? convertFirebaseTicketToTicket(updatedTicket) : ticket
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTicketById = async (id: string): Promise<Ticket | undefined> => {
    try {
      console.log('Fetching ticket by ID:', id);
      const firebaseTicket = await getFirebaseTicket(id);
      return firebaseTicket ? convertFirebaseTicketToTicket(firebaseTicket) : undefined;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      return undefined;
    }
  };

  const getUserTickets = (userId: string) => {
    return tickets.filter(ticket => ticket.userId === userId);
  };

  const loadTickets = async () => {
    if (!user) {
      console.log('No user authenticated, skipping ticket loading');
      return;
    }

    try {
      setLoading(true);
      console.log('Loading tickets for user:', user.email, user.role);
      
      if (user.role === 'admin') {
        console.log('Loading all tickets for admin');
        const allFirebaseTickets = await getFirebaseAllTickets();
        const convertedTickets = allFirebaseTickets.map(convertFirebaseTicketToTicket);
        setTickets(convertedTickets);
        console.log('Loaded tickets:', convertedTickets.length);
      } else {
        console.log('Loading user tickets for:', user.id);
        const userFirebaseTickets = await getFirebaseUserTickets(user.id);
        const convertedTickets = userFirebaseTickets.map(convertFirebaseTicketToTicket);
        setTickets(convertedTickets);
        console.log('Loaded user tickets:', convertedTickets.length);
      }
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      
      // Provide specific error messages based on the error type
      if (error.message?.includes('index')) {
        toast({
          title: "Database Index Required",
          description: "Please create the required Firebase index. Check the setup instructions.",
          variant: "destructive",
        });
      } else if (error.message?.includes('permission')) {
        toast({
          title: "Permission Error",
          description: "Please check your Firebase security rules and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error Loading Tickets",
          description: "Failed to load tickets. Please refresh the page and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load tickets when user changes
  useEffect(() => {
    if (user) {
      loadTickets();
    } else {
      setTickets([]);
    }
  }, [user]);

  const value = {
    tickets,
    createTicket,
    updateTicket,
    addComment,
    getTicketById,
    getUserTickets,
    loading,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};
