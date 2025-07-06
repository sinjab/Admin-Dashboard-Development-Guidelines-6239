import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/ui/DashboardCard';
import Button from '../components/ui/Button';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { useApiQuery, useApiMutation } from '../hooks/useQuery';
import { projectsAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiExternalLink, FiGithub, FiEye, FiGrid, FiList } = FiIcons;

const Projects = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const { data: projects, isLoading, error } = useApiQuery(
    ['projects'],
    () => projectsAPI.getAll()
  );

  const deleteMutation = useApiMutation(
    (id) => projectsAPI.delete(id),
    {
      successMessage: t('project_deleted', { en: 'Project deleted successfully', ar: 'تم حذف المشروع بنجاح' }),
      invalidateQueries: ['projects']
    }
  );

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete', { en: 'Are you sure you want to delete this project?', ar: 'هل أنت متأكد من حذف هذا المشروع؟' }))) {
      deleteMutation.mutate(id);
    }
  };

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

  const TableView = () => (
    <DashboardCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                {t('title', { en: 'Title', ar: 'العنوان' })}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                {t('status', { en: 'Status', ar: 'الحالة' })}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                {t('category', { en: 'Category', ar: 'الفئة' })}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                {t('tech_stack', { en: 'Tech Stack', ar: 'التقنيات' })}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                {t('links', { en: 'Links', ar: 'الروابط' })}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                {t('actions', { en: 'Actions', ar: 'الإجراءات' })}
              </th>
            </tr>
          </thead>
          <tbody>
            {projects?.data?.map((project, index) => (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {project[`title_${language}`]}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {project[`description_${language}`]}
                      </p>
                    </div>
                    {project.is_featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        {t('featured', { en: 'Featured', ar: 'مميز' })}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusDisplay(project.status)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getCategoryDisplay(project.category)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack?.slice(0, 2).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack?.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        +{project.tech_stack.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {project.demo_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={FiExternalLink}
                        onClick={() => window.open(project.demo_url, '_blank')}
                      />
                    )}
                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={FiGithub}
                        onClick={() => window.open(project.github_url, '_blank')}
                      />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FiEye}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FiEdit}
                      onClick={() => navigate(`/projects/${project.id}/edit`)}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={FiTrash2}
                      onClick={() => handleDelete(project.id)}
                      loading={deleteMutation.isLoading}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.data?.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DashboardCard>
            <div className="space-y-4">
              {/* Project header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {project[`title_${language}`]}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {project[`description_${language}`]}
                  </p>
                </div>
                {project.is_featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    {t('featured', { en: 'Featured', ar: 'مميز' })}
                  </span>
                )}
              </div>

              {/* Status and category */}
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusDisplay(project.status)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getCategoryDisplay(project.category)}
                </span>
              </div>

              {/* Tech stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {project.demo_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FiExternalLink}
                      onClick={() => window.open(project.demo_url, '_blank')}
                    >
                      {t('demo', { en: 'Demo', ar: 'تجربة' })}
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FiGithub}
                      onClick={() => window.open(project.github_url, '_blank')}
                    >
                      {t('code', { en: 'Code', ar: 'الكود' })}
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEye}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon={FiEdit}
                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    icon={FiTrash2}
                    onClick={() => handleDelete(project.id)}
                    loading={deleteMutation.isLoading}
                  />
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96"></div>
          </div>
        </div>
        <DashboardCard loading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('ai_projects', { en: 'AI Projects', ar: 'مشاريع الذكاء الاصطناعي' })}
            </h1>
          </div>
        </div>
        <DashboardCard error={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('ai_projects', { en: 'AI Projects', ar: 'مشاريع الذكاء الاصطناعي' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('projects_subtitle', { en: 'Manage your AI and machine learning projects', ar: 'أدر مشاريع الذكاء الاصطناعي والتعلم الآلي' })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
          </div>
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => navigate('/projects/new')}
          >
            {t('new_project', { en: 'New Project', ar: 'مشروع جديد' })}
          </Button>
        </div>
      </div>

      {/* Content */}
      {projects?.data?.length === 0 ? (
        <DashboardCard>
          <div className="text-center py-12">
            <SafeIcon icon={FiPlus} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('no_projects', { en: 'No projects yet', ar: 'لا توجد مشاريع بعد' })}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('no_projects_desc', { en: 'Get started by creating your first AI project', ar: 'ابدأ بإنشاء مشروع الذكاء الاصطناعي الأول' })}
            </p>
            <Button
              variant="primary"
              icon={FiPlus}
              onClick={() => navigate('/projects/new')}
            >
              {t('create_first_project', { en: 'Create First Project', ar: 'إنشاء أول مشروع' })}
            </Button>
          </div>
        </DashboardCard>
      ) : (
        viewMode === 'table' ? <TableView /> : <GridView />
      )}
    </div>
  );
};

export default Projects;