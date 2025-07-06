import React from 'react';
import { motion } from 'framer-motion';
import DashboardCard from '../components/ui/DashboardCard';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { useApiQuery } from '../hooks/useQuery';
import { projectsAPI, publicationsAPI, blogAPI } from '../lib/api';

const { FiCpu, FiBookOpen, FiFileText, FiTrendingUp, FiUsers, FiEye } = FiIcons;

const Dashboard = () => {
  const { t } = useLanguage();

  const { data: projects, isLoading: projectsLoading } = useApiQuery(
    ['projects'],
    () => projectsAPI.getAll()
  );

  const { data: publications, isLoading: publicationsLoading } = useApiQuery(
    ['publications'],
    () => publicationsAPI.getAll()
  );

  const { data: blogPosts, isLoading: blogLoading } = useApiQuery(
    ['blog-posts'],
    () => blogAPI.getAll()
  );

  const stats = [
    {
      title: t('ai_projects', { en: 'AI Projects', ar: 'مشاريع الذكاء الاصطناعي' }),
      value: projects?.data?.length || 0,
      icon: FiCpu,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      loading: projectsLoading
    },
    {
      title: t('publications', { en: 'Publications', ar: 'المنشورات' }),
      value: publications?.data?.length || 0,
      icon: FiBookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      loading: publicationsLoading
    },
    {
      title: t('blog_posts', { en: 'Blog Posts', ar: 'مقالات المدونة' }),
      value: blogPosts?.data?.length || 0,
      icon: FiFileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      loading: blogLoading
    },
    {
      title: t('total_views', { en: 'Total Views', ar: 'إجمالي المشاهدات' }),
      value: '12.4K',
      icon: FiEye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: t('project_created', { en: 'New AI project created', ar: 'تم إنشاء مشروع ذكاء اصطناعي جديد' }),
      time: '2 hours ago',
      icon: FiCpu,
      color: 'text-blue-600'
    },
    {
      id: 2,
      action: t('publication_updated', { en: 'Publication updated', ar: 'تم تحديث منشور' }),
      time: '4 hours ago',
      icon: FiBookOpen,
      color: 'text-green-600'
    },
    {
      id: 3,
      action: t('blog_published', { en: 'Blog post published', ar: 'تم نشر مقال في المدونة' }),
      time: '1 day ago',
      icon: FiFileText,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          {t('welcome_dashboard', { en: 'Welcome to Dashboard', ar: 'مرحباً بك في لوحة التحكم' })}
        </h1>
        <p className="text-blue-100">
          {t('dashboard_subtitle', { en: 'Manage your portfolio content efficiently', ar: 'أدر محتوى موقعك بكفاءة' })}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard loading={stat.loading}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <DashboardCard title={t('recent_activity', { en: 'Recent Activity', ar: 'النشاط الأخير' })}>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <SafeIcon icon={activity.icon} className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard title={t('quick_actions', { en: 'Quick Actions', ar: 'إجراءات سريعة' })}>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <SafeIcon icon={FiCpu} className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">
                {t('new_project', { en: 'New Project', ar: 'مشروع جديد' })}
              </p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">
                {t('new_post', { en: 'New Post', ar: 'مقال جديد' })}
              </p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <SafeIcon icon={FiBookOpen} className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-600">
                {t('new_publication', { en: 'New Publication', ar: 'منشور جديد' })}
              </p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-600">
                {t('view_analytics', { en: 'View Analytics', ar: 'عرض التحليلات' })}
              </p>
            </motion.button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;