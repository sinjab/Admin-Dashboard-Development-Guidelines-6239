import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectEdit from './pages/ProjectEdit';
import ProjectView from './pages/ProjectView';
import Settings from './pages/Settings';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectEdit />} />
        <Route path="projects/:id" element={<ProjectView />} />
        <Route path="projects/:id/edit" element={<ProjectEdit />} />
        <Route path="research" element={<div className="p-8 text-center">Research page coming soon...</div>} />
        <Route path="publications" element={<div className="p-8 text-center">Publications page coming soon...</div>} />
        <Route path="blog" element={<div className="p-8 text-center">Blog page coming soon...</div>} />
        <Route path="services" element={<div className="p-8 text-center">Services page coming soon...</div>} />
        <Route path="testimonials" element={<div className="p-8 text-center">Testimonials page coming soon...</div>} />
        <Route path="media" element={<div className="p-8 text-center">Media page coming soon...</div>} />
        <Route path="analytics" element={<div className="p-8 text-center">Analytics page coming soon...</div>} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;