
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  Timestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirebaseTicket {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comments: FirebaseComment[];
}

export interface FirebaseComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Timestamp;
  isInternal: boolean;
}

export const createTicket = async (ticketData: Omit<FirebaseTicket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
  const ticketsRef = collection(db, 'tickets');
  const docRef = await addDoc(ticketsRef, {
    ...ticketData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    comments: [],
  });
  return docRef.id;
};

export const updateTicket = async (ticketId: string, updates: Partial<FirebaseTicket>) => {
  const ticketRef = doc(db, 'tickets', ticketId);
  await updateDoc(ticketRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const getTicket = async (ticketId: string): Promise<FirebaseTicket | null> => {
  const ticketRef = doc(db, 'tickets', ticketId);
  const ticketSnap = await getDoc(ticketRef);
  
  if (ticketSnap.exists()) {
    return { id: ticketSnap.id, ...ticketSnap.data() } as FirebaseTicket;
  }
  return null;
};

export const getUserTickets = async (userId: string): Promise<FirebaseTicket[]> => {
  try {
    console.log('Attempting to fetch user tickets with index-optimized query');
    const ticketsRef = collection(db, 'tickets');
    const q = query(
      ticketsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseTicket));
    
    console.log(`Successfully fetched ${tickets.length} tickets for user`);
    return tickets;
  } catch (error: any) {
    console.error('Error with indexed query, falling back to simple query:', error);
    
    // Fallback: Get all tickets and filter client-side (less efficient but works without index)
    try {
      const ticketsRef = collection(db, 'tickets');
      const q = query(ticketsRef, where('userId', '==', userId));
      
      const querySnapshot = await getDocs(q);
      const tickets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseTicket));
      
      // Sort client-side since we can't use orderBy without the index
      tickets.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      
      console.log(`Fallback: Successfully fetched ${tickets.length} tickets for user`);
      return tickets;
    } catch (fallbackError) {
      console.error('Both indexed and fallback queries failed:', fallbackError);
      throw fallbackError;
    }
  }
};

export const getAllTickets = async (): Promise<FirebaseTicket[]> => {
  const ticketsRef = collection(db, 'tickets');
  const q = query(ticketsRef, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as FirebaseTicket));
};

export const addCommentToTicket = async (ticketId: string, comment: Omit<FirebaseComment, 'id' | 'createdAt'>) => {
  const ticketRef = doc(db, 'tickets', ticketId);
  const newComment = {
    ...comment,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Timestamp.now(),
  };
  
  await updateDoc(ticketRef, {
    comments: arrayUnion(newComment),
    updatedAt: Timestamp.now(),
  });
};
