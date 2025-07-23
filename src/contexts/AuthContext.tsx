
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseAuthUser
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUser, getUser, updateUserSubscription, FirebaseUser } from '@/services/userService';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  photoURL?: string;
  subscription?: {
    planId: string;
    planName: string;
    status: 'active' | 'inactive';
    startDate: string;
    amount: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateSubscription: (subscription: User['subscription']) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        try {
          console.log('Firebase user authenticated:', firebaseUser.email);
          let userData = await getUser(firebaseUser.uid);
          
          if (!userData) {
            // Create new user if doesn't exist
            const isAdmin = firebaseUser.email === 's21sahaj@gmail.com';
            const newUserData = {
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: isAdmin ? 'admin' as const : 'user' as const,
              photoURL: firebaseUser.photoURL || undefined,
            };
            console.log('Creating new user:', newUserData);
            await createUser(firebaseUser.uid, newUserData);
            userData = await getUser(firebaseUser.uid);
          }

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              photoURL: userData.photoURL,
              createdAt: userData.createdAt.toDate().toISOString(),
              subscription: userData.subscription ? {
                ...userData.subscription,
                startDate: userData.subscription.startDate.toDate().toISOString(),
              } : undefined,
            });
            console.log('User data loaded successfully:', userData.email, userData.role);
          }
        } catch (error: any) {
          console.error('Error fetching user data:', error);
          
          // Handle permission errors specifically
          if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
            toast({
              title: "Setup Required",
              description: "Please check the FIREBASE_SETUP.md file to configure Firestore security rules.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to load user data. Please try again.",
              variant: "destructive",
            });
          }
        }
      } else {
        console.log('No authenticated user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Starting Google login...');
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login successful:', result.user.email);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${result.user.displayName || result.user.email}!`,
      });
      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = "Failed to login with Google";
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "Domain not authorized. Please add this domain to Firebase Auth settings.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup blocked. Please allow popups and try again.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login cancelled. Please try again.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Keep the old login/register methods for backward compatibility
  const login = async (email: string, password: string): Promise<boolean> => {
    toast({
      title: "Authentication Method Changed",
      description: "Please use Google Sign-In for authentication",
      variant: "destructive",
    });
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    toast({
      title: "Authentication Method Changed", 
      description: "Please use Google Sign-In for authentication",
      variant: "destructive",
    });
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('User logged out successfully');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const updateSubscription = async (subscription: User['subscription']) => {
    if (user) {
      try {
        const firebaseSubscription = subscription ? {
          ...subscription,
          startDate: new Date(subscription.startDate) as any,
        } : undefined;

        await updateUserSubscription(user.id, firebaseSubscription);
        const updatedUser = { ...user, subscription };
        setUser(updatedUser);
        
        toast({
          title: "Subscription Updated",
          description: "Your subscription has been updated successfully",
        });
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update subscription",
          variant: "destructive",
        });
      }
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    updateSubscription,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPremium: user?.subscription?.status === 'active',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
