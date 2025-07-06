import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const { FiMenu, FiMoon, FiSun, FiGlobe, FiLogOut, FiUser } = FiIcons;

const Header = ({ onToggleSidebar }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleSignOut = async () => {
    try {
      logout();
      toast.success(t('signed_out', {
        en: 'Signed out successfully',
        ar: 'تم تسجيل الخروج بنجاح'
      }));
    } catch (error) {
      toast.error(t('sign_out_error', {
        en: 'Failed to sign out',
        ar: 'فشل في تسجيل الخروج'
      }));
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              variant="secondary"
              size="sm"
              icon={FiMenu}
              onClick={onToggleSidebar}
              className="lg:hidden"
            />
            <h1 className="hidden sm:block text-xl font-semibold text-gray-900 dark:text-white ml-4">
              {t('dashboard', {
                en: 'Dashboard',
                ar: 'لوحة التحكم'
              })}
            </h1>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <Button
              variant="secondary"
              size="sm"
              icon={FiGlobe}
              onClick={toggleLanguage}
              className="hidden sm:flex"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>

            {/* Dark mode toggle */}
            <Button
              variant="secondary"
              size="sm"
              icon={darkMode ? FiSun : FiMoon}
              onClick={toggleDarkMode}
            />

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.full_name || user?.email}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={FiLogOut}
                onClick={handleSignOut}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;