
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, SubscriptionTier } from '../types';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  applyActionCode
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  getApplicationsCount: () => number;
  subscribe: (tier: SubscriptionTier) => void;
  enrollInCourse: (courseId: string) => void;
  submitCertification: (front: string, back: string) => Promise<void>;
  issueCertificate: (courseId: string, courseTitle: string, instructor: string) => Promise<void>;
  verifyEmailCode: (code: string) => Promise<void>;
  createCourse: (courseData: any) => Promise<void>;
  updateCourse: (courseId: string, courseData: any) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  createJob: (jobData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserFromFirestore = async (fUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, "users", fUser.uid);
      
      // Update lastSeen on sync
      await updateDoc(userDocRef, { lastSeen: serverTimestamp() }).catch(() => {});

      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
      }
    } catch (error: any) {
      console.error("Firestore sync error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser && fUser.emailVerified) {
        await syncUserFromFirestore(fUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (userData: any, password: string) => {
    const cleanEmail = (userData.email || '').trim();
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const fUser = userCredential.user;

    const newUser: any = {
      id: fUser.uid,
      role: userData.role || UserRole.CLIENT,
      email: cleanEmail,
      name: userData.name || '',
      firstname: userData.firstname || '',
      gender: userData.gender || 'M',
      phone: userData.phone || '',
      hasAcceptedTerms: true,
      isCertified: false,
      certificationStatus: 'pending',
      avatar: userData.avatar || '',
      enrolledCourses: [],
      certificates: [],
      companyName: userData.role === UserRole.PARTNER ? userData.companyName : '',
      subjectField: userData.role === UserRole.FORMATEUR ? userData.subjectField : '',
      lastSeen: serverTimestamp(),
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, "users", fUser.uid), newUser);
    await sendEmailVerification(fUser);
  };

  const login = async (email: string, password: string) => { 
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    if (!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      throw new Error('EMAIL_NOT_VERIFIED');
    }
    await syncUserFromFirestore(userCredential.user);
  };

  const logout = async () => { 
    if (user) {
        await updateDoc(doc(db, "users", user.id), { lastSeen: serverTimestamp() }).catch(() => {});
    }
    await signOut(auth); 
    setUser(null); 
  };
  
  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      await updateDoc(doc(db, "users", user.id), { ...data, updatedAt: serverTimestamp() });
      setUser({ ...user, ...data });
    }
  };

  const createCourse = async (courseData: any) => {
    if (!user || user.role !== UserRole.FORMATEUR) {
      throw new Error("Seuls les formateurs peuvent créer des cours.");
    }
    await addDoc(collection(db, "trainings"), {
      ...courseData,
      instructorId: user.id,
      provider: `${user.firstname} ${user.name}`,
      source: "Bomoko Academy",
      participantsCount: 0,
      totalRevenue: 0,
      createdAt: serverTimestamp()
    });
  };

  const updateCourse = async (courseId: string, courseData: any) => {
    if (!user || user.role !== UserRole.FORMATEUR) {
      throw new Error("Action non autorisée.");
    }
    const courseRef = doc(db, "trainings", courseId);
    await updateDoc(courseRef, {
      ...courseData,
      updatedAt: serverTimestamp()
    });
  };

  const deleteCourse = async (courseId: string) => {
    if (!user || user.role !== UserRole.FORMATEUR) {
      throw new Error("Action non autorisée.");
    }
    await deleteDoc(doc(db, "trainings", courseId));
  };

  const createJob = async (jobData: any) => {
    if (!user || (user.role !== UserRole.PARTNER && user.role !== UserRole.FORMATEUR)) {
      throw new Error("Seuls les partenaires ou formateurs peuvent publier des offres.");
    }
    await addDoc(collection(db, "jobs"), {
      ...jobData,
      posterId: user.id,
      company: user.role === UserRole.PARTNER ? user.companyName : `${user.firstname} ${user.name}`,
      postedDate: "À l'instant",
      createdAt: serverTimestamp()
    });
  };

  const submitCertification = async (front: string, back: string) => {
    await updateProfile({ certificationStatus: 'pending', idDocuments: { front, back } });
  };

  const sendPasswordReset = async (email: string) => { await sendPasswordResetEmail(auth, email.trim()); };
  
  const deleteAccount = async () => { 
    if (firebaseUser) { 
      await deleteDoc(doc(db, "users", firebaseUser.uid)); 
      await deleteUser(firebaseUser); 
    } 
  };

  const resendVerificationEmail = async () => { if (auth.currentUser) await sendEmailVerification(auth.currentUser); };
  const getApplicationsCount = () => 0;
  const subscribe = (tier: SubscriptionTier) => { updateProfile({ isCertified: true, subscriptionTier: tier }); };
  const enrollInCourse = (courseId: string) => { if (user && !user.enrolledCourses?.includes(courseId)) updateProfile({ enrolledCourses: [...(user.enrolledCourses || []), courseId] }); };
  const issueCertificate = async (courseId: string, title: string, instructor: string) => { if (user) updateProfile({ certificates: [...(user.certificates || []), { courseId, title, instructor, date: new Date().toISOString() }] }); };
  const verifyEmailCode = async (code: string) => { await applyActionCode(auth, code); };

  return (
    <AuthContext.Provider value={{ 
      user, firebaseUser, isAuthenticated: !!user, isLoading, 
      login, signup, sendPasswordReset, logout, updateProfile, 
      deleteAccount, getApplicationsCount, subscribe, enrollInCourse, submitCertification,
      issueCertificate, verifyEmailCode, resendVerificationEmail, createCourse, updateCourse, deleteCourse, createJob
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
