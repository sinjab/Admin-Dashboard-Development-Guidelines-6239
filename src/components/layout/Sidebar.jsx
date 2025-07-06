import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const { 
  FiHome, FiCpu, FiBookOpen, FiFileText, FiUsers, FiSettings, 
  FiGrid, FiImage, FiStar, FiTool, FiBarChart3, FiMail, 
  FiShield, FiUser, FiGlobe, FiFolder, FiEdit3, FiCamera,
  FiPlay, FiAward, FiMessageSquare, FiTrendingUp, FiDatabase,
  FiChevronDown
} = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const menuSections = [
    {
      title: t('dashboard', { en: 'Dashboard', ar: 'لوحة التحكم' }),
      items: [
        {
          name: t('overview', { en: 'Overview', ar: 'نظرة عامة' }),
          path: '/',
          icon: FiHome,
          badge: null
        },
        {
          name: t('analytics', { en: 'Analytics', ar: 'التحليلات' }),
          path: '/analytics',
          icon: FiBarChart3,
          badge: null
        }
      ]
    },
    {
      title: t('content_management', { en: 'Content Management', ar: 'إدارة المحتوى' }),
      items: [
        {
          name: t('ai_projects', { en: 'AI Projects', ar: 'مشاريع الذكاء الاصطناعي' }),
          path: '/projects',
          icon: FiCpu,
          badge: null
        },
        {
          name: t('research', { en: 'Research', ar: 'البحث العلمي' }),
          path: '/research',
          icon: FiBookOpen,
          badge: null
        },
        {
          name: t('publications', { en: 'Publications', ar: 'المنشورات' }),
          path: '/publications',
          icon: FiFileText,
          badge: null
        },
        {
          name: t('blog', { en: 'Blog', ar: 'المدونة' }),
          path: '/blog',
          icon: FiEdit3,
          badge: null
        }
      ]
    },
    {
      title: t('portfolio', { en: 'Portfolio', ar: 'المعرض' }),
      items: [
        {
          name: t('services', { en: 'Services', ar: 'الخدمات' }),
          path: '/services',
          icon: FiTool,
          badge: null
        },
        {
          name: t('testimonials', { en: 'Testimonials', ar: 'التوصيات' }),
          path: '/testimonials',
          icon: FiStar,
          badge: null
        }
      ]
    },
    {
      title: t('media', { en: 'Media & Assets', ar: 'الوسائط والملفات' }),
      items: [
        {
          name: t('media_library', { en: 'Media Library', ar: 'مكتبة الوسائط' }),
          path: '/media',
          icon: FiImage,
          badge: null
        }
      ]
    },
    {
      title: t('system', { en: 'System', ar: 'النظام' }),
      items: [
        {
          name: t('settings', { en: 'Settings', ar: 'الإعدادات' }),
          path: '/settings',
          icon: FiSettings,
          badge: null
        }
      ]
    }
  ];

  const [expandedSections, setExpandedSections] = React.useState(new Set(['dashboard', 'content_management']));

  const toggleSection = (sectionTitle) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 
          bg-white dark:bg-gray-800 shadow-lg z-50 border-r border-gray-200 dark:border-gray-700
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')} 
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiShield} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('admin_panel', { en: 'Admin Panel', ar: 'لوحة الإدارة' })}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.full_name || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <span>{section.title}</span>
                <SafeIcon 
                  icon={FiChevronDown} 
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    expandedSections.has(section.title) ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Section Items */}
              {expandedSections.has(section.title) && (
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: linkIsActive }) =>
                        `flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                          linkIsActive || isActive(item.path)
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`
                      }
                      onClick={() => window.innerWidth < 1024 && onClose()}
                    >
                      <SafeIcon 
                        icon={item.icon} 
                        className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'} transition-colors`} 
                      />
                      <span className="font-medium flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('online', { en: 'Online', ar: 'متصل' })}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('version', { en: 'v1.0.0', ar: 'الإصدار 1.0.0' })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;