
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Services from './pages/Services';
import TrainingPage from './pages/Training';
import News from './pages/News';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Partners from './pages/Partners';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatBot from './components/ChatBot';
import Koop from './pages/Koop';
import Communities from './pages/Communities';
import MyOffice from './pages/MyOffice';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Avis from './pages/Avis'; 
import Messages from './pages/Messages';
import CoursePlayer from './pages/CoursePlayer';
import Subscription from './pages/Subscription';
import VerifyEmail from './pages/VerifyEmail';
import EmailVerificationInfo from './pages/EmailVerificationInfo';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { LanguageProvider } from './context/LanguageContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-cdr-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // FORCE AVIS: Si l'utilisateur est connecté mais n'a pas donné son avis
  if (user && !user.hasGivenAvis && location.pathname !== '/avis') {
    return <Navigate to="/avis" replace />;
  }
  
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const hideNavAndFooter = location.pathname.startsWith('/course/') || 
                          ['/login', '/signup', '/verify-email-info'].includes(location.pathname);
  const hideFooterOnly = ['/messages', '/dashboard'].includes(location.pathname);
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  // Redirection automatique vers /avis si nécessaire sur les pages publiques (Home)
  const shouldForceAvisOnPublic = isAuthenticated && user && !user.hasGivenAvis && location.pathname === '/';

  if (shouldForceAvisOnPublic) {
    return <Navigate to="/avis" replace />;
  }

  return (
    <div className={`flex flex-col min-h-screen font-sans ${!hideNavAndFooter ? 'pb-20 lg:pb-0' : ''}`}>
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideNavAndFooter && !hideFooterOnly && <Footer />}
      {!hideNavAndFooter && <ChatBot />}
      {!hideNavAndFooter && !isAuthPage && <MobileNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ChatProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/training" element={<TrainingPage />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/koop" element={<Koop />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/news" element={<News />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/about" element={<About />} />
                <Route path="/avis" element={<Avis />} /> 
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verify-email-info" element={<EmailVerificationInfo />} />
                
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/my-office" element={<ProtectedRoute><MyOffice /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/course/:courseId" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
              </Routes>
            </Layout>
          </ChatProvider>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
