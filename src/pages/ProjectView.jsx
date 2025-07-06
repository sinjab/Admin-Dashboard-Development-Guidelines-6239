import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardCard from '../components/ui/DashboardCard';
import Button from '../components/ui/Button';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { useApiQuery } from '../hooks/useQuery';
import { projectsAPI } from '../lib/api';

const { FiArrowLeft, FiEdit, FiExternalLink, FiGithub, FiCalendar, FiTag } = FiIcons;

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const { data: project, isLoading, error } = useApiQuery(
    ['project', id],
    () => projectsAPI.getById(id)
  );

  const getStatusDisplay = (status) => {
    const statusMap = {
      'planned': { en: 'Planned', ar: 'مخطط' },
      'in_progress': { en: 'In Progress', ar: 'قيد التطوير' },
      'completed': { en: 'Completed', ar: 'مكتمل' }
    };
    return statusMap[status]?.[language] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'planned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'machine_learning': { en: 'Machine Learning', ar: 'تعلم الآلة' },
      'deep_learning': { en: 'Deep Learning', ar: 'التعلم العميق' },
      'nlp': { en: 'Natural Language Processing', ar: 'معالجة اللغة الطبيعية' },
      'computer_vision': { en: 'Computer Vision', ar: 'الرؤية الحاسوبية' },
      'data_science': { en: 'Data Science', ar: 'علم البيانات' },
      'ai_research': { en: 'AI Research', ar: 'بحوث الذكاء الاصطناعي' }
    };
    return categoryMap[category]?.[language] || category;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardCard loading={true} />
      </div>
    );
  }

  if (error || !project?.data) {
    return (
      <div className="space-y-6">
        <DashboardCard error={error || { message: 'Project not found' }} />
      </div>
    );
  }

  const projectData = project.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={FiArrowLeft}
            onClick={() => navigate('/projects')}
          >
            {t('back', { en: 'Back', ar: 'رجوع' })}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {projectData[`title_${language}`]}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {projectData[`description_${language}`]}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {projectData.demo_url && (
            <Button
              variant="outline"
              icon={FiExternalLink}
              onClick={() => window.open(projectData.demo_url, '_blank')}
            >
              {t('demo', { en: 'Demo', ar: 'تجربة' })}
            </Button>
          )}
          {projectData.github_url && (
            <Button
              variant="outline"
              icon={FiGithub}
              onClick={() => window.open(projectData.github_url, '_blank')}
            >
              {t('code', { en: 'Code', ar: 'الكود' })}
            </Button>
          )}
          <Button
            variant="primary"
            icon={FiEdit}
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            {t('edit', { en: 'Edit', ar: 'تعديل' })}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Image */}
          {projectData.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DashboardCard>
                <img
                  src={projectData.image_url}
                  alt={projectData[`title_${language}`]}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </DashboardCard>
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DashboardCard title={t('description', { en: 'Description', ar: 'الوصف' })}>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {projectData[`description_${language}`]}
                </p>
              </div>
            </DashboardCard>
          </motion.div>

          {/* Technology Stack */}
          {projectData.tech_stack && projectData.tech_stack.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DashboardCard title={t('tech_stack', { en: 'Technology Stack', ar: 'المكدس التقني' })}>
                <div className="flex flex-wrap gap-2">
                  {projectData.tech_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </DashboardCard>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DashboardCard title={t('project_info', { en: 'Project Information', ar: 'معلومات المشروع' })}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('status', { en: 'Status', ar: 'الحالة' })}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(projectData.status)}`}>
                    {getStatusDisplay(projectData.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('category', { en: 'Category', ar: 'الفئة' })}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getCategoryDisplay(projectData.category)}
                  </span>
                </div>

                {projectData.is_featured && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('featured', { en: 'Featured', ar: 'مميز' })}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {t('yes', { en: 'Yes', ar: 'نعم' })}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('sort_order', { en: 'Sort Order', ar: 'ترتيب العرض' })}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {projectData.sort_order}
                  </span>
                </div>

                {projectData.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('created_at', { en: 'Created', ar: 'تاريخ الإنشاء' })}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(projectData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DashboardCard title={t('quick_actions', { en: 'Quick Actions', ar: 'إجراءات سريعة' })}>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  icon={FiEdit}
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  className="w-full"
                >
                  {t('edit_project', { en: 'Edit Project', ar: 'تعديل المشروع' })}
                </Button>
                {projectData.demo_url && (
                  <Button
                    variant="outline"
                    icon={FiExternalLink}
                    onClick={() => window.open(projectData.demo_url, '_blank')}
                    className="w-full"
                  >
                    {t('view_demo', { en: 'View Demo', ar: 'عرض التجربة' })}
                  </Button>
                )}
                {projectData.github_url && (
                  <Button
                    variant="outline"
                    icon={FiGithub}
                    onClick={() => window.open(projectData.github_url, '_blank')}
                    className="w-full"
                  >
                    {t('view_code', { en: 'View Code', ar: 'عرض الكود' })}
                  </Button>
                )}
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;