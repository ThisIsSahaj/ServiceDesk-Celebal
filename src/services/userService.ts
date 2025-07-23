
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirebaseUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  photoURL?: string;
  createdAt: Timestamp;
  subscription?: {
    planId: string;
    planName: string;
    status: 'active' | 'inactive';
    startDate: Timestamp;
    amount: number;
  };
}

export const createUser = async (userId: string, userData: Omit<FirebaseUser, 'id' | 'createdAt'>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      id: userId,
      createdAt: Timestamp.now(),
    }, { merge: true }); // Use merge to avoid overwriting existing data
    console.log('User created successfully:', userId);
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    }
    throw error;
  }
};

export const getUser = async (userId: string): Promise<FirebaseUser | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as FirebaseUser;
      console.log('User data retrieved:', userData.email);
      return userData;
    }
    console.log('User not found:', userId);
    return null;
  } catch (error: any) {
    console.error('Error getting user:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    }
    throw error;
  }
};

export const updateUserSubscription = async (userId: string, subscription: FirebaseUser['subscription']) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { subscription });
    console.log('User subscription updated:', userId);
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    }
    throw error;
  }
};
