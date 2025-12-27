

export enum UserRole {
  CLIENT = 'CANDIDAT',
  FORMATEUR = 'FORMATEUR',
  PARTNER = 'PARTENAIRE',
  AGENT = 'AGENT'
}

export type CertificationStatus = 'none' | 'pending' | 'certified' | 'rejected';
export type SubscriptionTier = 'standard' | 'premium' | 'gold';

export interface User {
  id: string;
  name: string;
  postname?: string;
  firstname?: string;
  email?: string;
  phone?: string;
  gender?: 'M' | 'F';
  location?: string;
  role: UserRole;
  isCertified: boolean;
  certificationStatus?: CertificationStatus;
  hasAcceptedTerms: boolean;
  hasGivenAvis?: boolean;
  
  avatar?: string;
  idDocuments?: {
    front?: string;
    back?: string;
  };

  physicalAddress?: string; 
  cvFile?: string; 
  subjectField?: string; 
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };

  companyName?: string;
  city?: string;
  country?: string;
  commune?: string;
  website?: string;
  activitySector?: string;
  partnershipType?: string;
  partnershipDescription?: string;
  companyPresentation?: string;
  companyLogo?: string;

  stats?: {
    views: number;
    likes: number;
    posts: number;
  };
  enrolledCourses?: string[];
  preferences?: {
    language: string;
    visibility: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  bio?: string;
  subscriptionTier?: SubscriptionTier;
  certificates?: { courseId: string; title: string; date: string; instructor: string }[];
}

export interface Training { 
  id: string; 
  title: string; 
  provider: string; 
  source: string; 
  duration: string; 
  format: string; 
  image: string; 
  price: string; 
  description?: string;
  category?: string;
  instructorId?: string;
  participantsCount?: number;
  totalRevenue?: number;
  videoUrl?: string;
  sourceUrl?: string;
  // Added createdAt to support Firestore timestamps
  createdAt?: any;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
}

export interface Job { 
  id: string; 
  title: string; 
  company: string; 
  location: string; 
  type: string; 
  category?: string; 
  description: string; 
  requirements?: string; // Nouveau
  companyEmail: string; // Nouveau (boite de réception)
  postedDate: string; 
  posterId?: string; 
  salaryRange?: string; 
  // Added createdAt to support Firestore timestamps
  createdAt?: any;
}

export interface NewsArticle { id: string; title: string; excerpt: string; content?: string; date: string; category: string; image: string; authorId?: string; }
export interface Classified { 
  id: string; 
  title: string; 
  price: string; 
  category: string; 
  description: string; 
  image: string; 
  images?: string[]; 
  sellerId: string; 
  sellerName: string; 
  location: string; 
  date: string;
  condition?: 'Neuf' | 'Occasion';
  isSold: boolean;
}
export interface Community { id: string; name: string; type: string; membersCount: number; description: string; image: string; isMember?: boolean; protectorId?: string; }
export interface ChatMessage { id: string; role: 'user' | 'model'; text: string; timestamp: Date; }
export interface DirectMessage { id: string; senderId: string; receiverId: string; content: string; timestamp: string; read: boolean; }
export interface ChatThread { partnerId: string; partnerName: string; partnerAvatar?: string; lastMessage: DirectMessage | null; unreadCount: number; }