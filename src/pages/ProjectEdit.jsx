import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import DashboardCard from '../components/ui/DashboardCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import FileUpload from '../components/ui/FileUpload';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { useApiQuery, useApiMutation } from '../hooks/useQuery';
import { projectsAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

const { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiAlertCircle } = FiIcons;

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isNew = id === 'new';
  
  const [techStack, setTechStack] = useState([]);
  const [newTech, setNewTech] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Status options based on current language
  const statusOptions = language === 'en' ? [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ] : [
    { value: 'planned', label: 'مخطط' },
    { value: 'in_progress', label: 'قيد التطوير' },
    { value: 'completed', label: 'مكتمل' }
  ];

  const categoryOptions = language === 'en' ? [
    { value: 'machine_learning', label: 'Machine Learning' },
    { value: 'deep_learning', label: 'Deep Learning' },
    { value: 'nlp', label: 'Natural Language Processing' },
    { value: 'computer_vision', label: 'Computer Vision' },
    { value: 'data_science', label: 'Data Science' },
    { value: 'ai_research', label: 'AI Research' }
  ] : [
    { value: 'machine_learning', label: 'تعلم الآلة' },
    { value: 'deep_learning', label: 'التعلم العميق' },
    { value: 'nlp', label: 'معالجة اللغة الطبيعية' },
    { value: 'computer_vision', label: 'الرؤية الحاسوبية' },
    { value: 'data_science', label: 'علم البيانات' },
    { value: 'ai_research', label: 'بحوث الذكاء الاصطناعي' }
  ];

  const { data: project, isLoading, error } = useApiQuery(
    ['project', id],
    () => projectsAPI.getById(id),
    { enabled: !isNew }
  );

  const updateMutation = useApiMutation(
    async ({ id, data }) => {
      console.log('=== MUTATION START ===');
      console.log('ID:', id);
      console.log('Data:', data);
      console.log('Is New:', isNew);
      
      try {
        let result;
        if (isNew) {
          console.log('Creating new project...');
          result = await projectsAPI.create(data);
        } else {
          console.log('Updating existing project...');
          result = await projectsAPI.update(id, data);
        }
        
        console.log('Mutation result:', result);
        return result;
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    {
      onSuccess: (result) => {
        console.log('=== MUTATION SUCCESS ===');
        console.log('Success result:', result);
        
        const message = isNew 
          ? t('project_created', { en: 'Project created successfully', ar: 'تم إنشاء المشروع بنجاح' })
          : t('project_updated', { en: 'Project updated successfully', ar: 'تم تحديث المشروع بنجاح' });
        
        toast.success(message);
        navigate('/projects');
      },
      onError: (error) => {
        console.error('=== MUTATION ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        
        let errorMessage = error.message || 'Unknown error occurred';
        
        // Handle specific Supabase errors
        if (error.code === 'PGRST116') {
          errorMessage = 'Table not found. Please check database setup.';
        } else if (error.code === '42P01') {
          errorMessage = 'Database table does not exist.';
        } else if (error.code === '23505') {
          errorMessage = 'Duplicate entry detected.';
        } else if (error.message?.includes('column')) {
          errorMessage = 'Database schema error. Please contact administrator.';
        }
        
        const message = isNew 
          ? t('project_create_error', { en: `Failed to create project: ${errorMessage}`, ar: `فشل في إنشاء المشروع: ${errorMessage}` })
          : t('project_update_error', { en: `Failed to update project: ${errorMessage}`, ar: `فشل في تحديث المشروع: ${errorMessage}` });
        
        toast.error(message);
      },
      invalidateQueries: ['projects']
    }
  );

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      status: 'planned',
      category: 'machine_learning',
      demo_url: '',
      github_url: '',
      is_featured: false,
      sort_order: 0
    }
  });

  // Watch form values for debugging
  const formValues = watch();

  useEffect(() => {
    if (project?.data && !isNew) {
      const projectData = project.data;
      console.log('Setting form data:', projectData);
      
      reset({
        title_en: projectData.title_en || '',
        title_ar: projectData.title_ar || '',
        description_en: projectData.description_en || '',
        description_ar: projectData.description_ar || '',
        status: projectData.status || 'planned',
        category: projectData.category || 'machine_learning',
        demo_url: projectData.demo_url || '',
        github_url: projectData.github_url || '',
        is_featured: projectData.is_featured || false,
        sort_order: projectData.sort_order || 0
      });
      
      setTechStack(projectData.tech_stack || []);
      setImageUrl(projectData.image_url || '');
    }
  }, [project, reset, isNew]);

  // Comprehensive form validation
  const validateForm = (data) => {
    const errors = [];
    
    // Required field validation
    if (!data.title_en || data.title_en.trim() === '') {
      errors.push(t('title_en_required', { en: 'English title is required', ar: 'العنوان الإنجليزي مطلوب' }));
    }
    
    if (!data.title_ar || data.title_ar.trim() === '') {
      errors.push(t('title_ar_required', { en: 'Arabic title is required', ar: 'العنوان العربي مطلوب' }));
    }
    
    if (!data.description_en || data.description_en.trim() === '') {
      errors.push(t('description_en_required', { en: 'English description is required', ar: 'الوصف الإنجليزي مطلوب' }));
    }
    
    if (!data.description_ar || data.description_ar.trim() === '') {
      errors.push(t('description_ar_required', { en: 'Arabic description is required', ar: 'الوصف العربي مطلوب' }));
    }
    
    // Length validation
    if (data.title_en && data.title_en.length > 200) {
      errors.push(t('title_too_long', { en: 'English title is too long (max 200 characters)', ar: 'العنوان الإنجليزي طويل جداً (الحد الأقصى 200 حرف)' }));
    }
    
    if (data.title_ar && data.title_ar.length > 200) {
      errors.push(t('title_too_long', { en: 'Arabic title is too long (max 200 characters)', ar: 'العنوان العربي طويل جداً (الحد الأقصى 200 حرف)' }));
    }
    
    if (data.description_en && data.description_en.length > 1000) {
      errors.push(t('description_too_long', { en: 'English description is too long (max 1000 characters)', ar: 'الوصف الإنجليزي طويل جداً (الحد الأقصى 1000 حرف)' }));
    }
    
    if (data.description_ar && data.description_ar.length > 1000) {
      errors.push(t('description_too_long', { en: 'Arabic description is too long (max 1000 characters)', ar: 'الوصف العربي طويل جداً (الحد الأقصى 1000 حرف)' }));
    }
    
    // URL validation
    if (data.demo_url && data.demo_url.trim() !== '') {
      try {
        new URL(data.demo_url);
      } catch {
        errors.push(t('invalid_demo_url', { en: 'Invalid demo URL', ar: 'رابط التجربة غير صالح' }));
      }
    }
    
    if (data.github_url && data.github_url.trim() !== '') {
      try {
        new URL(data.github_url);
      } catch {
        errors.push(t('invalid_github_url', { en: 'Invalid GitHub URL', ar: 'رابط GitHub غير صالح' }));
      }
    }
    
    // Status validation
    const validStatuses = ['planned', 'in_progress', 'completed'];
    if (!validStatuses.includes(data.status)) {
      errors.push(t('invalid_status', { en: 'Invalid status', ar: 'حالة غير صالحة' }));
    }
    
    // Category validation
    const validCategories = ['machine_learning', 'deep_learning', 'nlp', 'computer_vision', 'data_science', 'ai_research'];
    if (!validCategories.includes(data.category)) {
      errors.push(t('invalid_category', { en: 'Invalid category', ar: 'فئة غير صالحة' }));
    }
    
    // Sort order validation
    if (data.sort_order < 0 || data.sort_order > 999) {
      errors.push(t('invalid_sort_order', { en: 'Sort order must be between 0 and 999', ar: 'ترتيب العرض يجب أن يكون بين 0 و 999' }));
    }
    
    return errors;
  };

  const onSubmit = async (data) => {
    console.log('=== FORM SUBMISSION START ===');
    console.log('Raw form data:', data);
    console.log('Form errors:', errors);
    console.log('Form values:', formValues);
    console.log('Tech stack:', techStack);
    console.log('Image URL:', imageUrl);
    
    setIsSubmitting(true);
    
    // Validate form data
    const validationErrors = validateForm(data);
    setValidationErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      toast.error(validationErrors[0]); // Show first error
      setIsSubmitting(false);
      return;
    }
    
    const formData = {
      title_en: data.title_en.trim(),
      title_ar: data.title_ar.trim(),
      description_en: data.description_en.trim(),
      description_ar: data.description_ar.trim(),
      status: data.status,
      category: data.category,
      tech_stack: techStack,
      image_url: imageUrl || null,
      demo_url: data.demo_url?.trim() || null,
      github_url: data.github_url?.trim() || null,
      is_featured: Boolean(data.is_featured),
      sort_order: Number(data.sort_order) || 0
    };

    console.log('Final form data:', formData);
    
    try {
      await updateMutation.mutateAsync({ id: isNew ? null : id, data: formData });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTech = (techToRemove) => {
    setTechStack(techStack.filter(tech => tech !== techToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

  const handleImageUpload = (url) => {
    console.log('Image uploaded:', url);
    setImageUrl(url);
    toast.success(t('image_uploaded', { en: 'Image uploaded successfully', ar: 'تم رفع الصورة بنجاح' }));
  };

  const handleImageUploadError = (error) => {
    console.error('Image upload error:', error);
    toast.error(t('image_upload_error', { en: 'Failed to upload image', ar: 'فشل في رفع الصورة' }));
  };

  if (isLoading && !isNew) {
    return (
      <div className="space-y-6">
        <DashboardCard loading={true} />
      </div>
    );
  }

  if (error && !isNew) {
    return (
      <div className="space-y-6">
        <DashboardCard error={error} />
      </div>
    );
  }

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
              {isNew 
                ? t('new_project', { en: 'New Project', ar: 'مشروع جديد' })
                : t('edit_project', { en: 'Edit Project', ar: 'تعديل المشروع' })
              }
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isNew
                ? t('create_project_desc', { en: 'Create a new AI project', ar: 'إنشاء مشروع ذكاء اصطناعي جديد' })
                : t('edit_project_desc', { en: 'Update project information', ar: 'تحديث معلومات المشروع' })
              }
            </p>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <DashboardCard>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {t('validation_errors', { en: 'Please fix the following errors:', ar: 'يرجى إصلاح الأخطاء التالية:' })}
                </h3>
                <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </DashboardCard>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <DashboardCard title={t('basic_info', { en: 'Basic Information', ar: 'المعلومات الأساسية' })}>
            <div className="space-y-4">
              <Input
                label={t('english_title', { en: 'English Title', ar: 'العنوان الإنجليزي' })}
                {...register('title_en', { 
                  required: {
                    value: true,
                    message: t('title_required', { en: 'English title is required', ar: 'العنوان الإنجليزي مطلوب' })
                  },
                  maxLength: {
                    value: 200,
                    message: t('title_too_long', { en: 'Title is too long (max 200 characters)', ar: 'العنوان طويل جداً (الحد الأقصى 200 حرف)' })
                  }
                })}
                error={errors.title_en?.message}
                required
              />

              <Input
                label={t('arabic_title', { en: 'Arabic Title', ar: 'العنوان العربي' })}
                {...register('title_ar', { 
                  required: {
                    value: true,
                    message: t('title_required', { en: 'Arabic title is required', ar: 'العنوان العربي مطلوب' })
                  },
                  maxLength: {
                    value: 200,
                    message: t('title_too_long', { en: 'Title is too long (max 200 characters)', ar: 'العنوان طويل جداً (الحد الأقصى 200 حرف)' })
                  }
                })}
                error={errors.title_ar?.message}
                required
              />

              <TextArea
                label={t('english_description', { en: 'English Description', ar: 'الوصف الإنجليزي' })}
                rows={4}
                {...register('description_en', { 
                  required: {
                    value: true,
                    message: t('description_required', { en: 'English description is required', ar: 'الوصف الإنجليزي مطلوب' })
                  },
                  maxLength: {
                    value: 1000,
                    message: t('description_too_long', { en: 'Description is too long (max 1000 characters)', ar: 'الوصف طويل جداً (الحد الأقصى 1000 حرف)' })
                  }
                })}
                error={errors.description_en?.message}
                required
              />

              <TextArea
                label={t('arabic_description', { en: 'Arabic Description', ar: 'الوصف العربي' })}
                rows={4}
                {...register('description_ar', { 
                  required: {
                    value: true,
                    message: t('description_required', { en: 'Arabic description is required', ar: 'الوصف العربي مطلوب' })
                  },
                  maxLength: {
                    value: 1000,
                    message: t('description_too_long', { en: 'Description is too long (max 1000 characters)', ar: 'الوصف طويل جداً (الحد الأقصى 1000 حرف)' })
                  }
                })}
                error={errors.description_ar?.message}
                required
              />
            </div>
          </DashboardCard>

          {/* Project Details */}
          <DashboardCard title={t('project_details', { en: 'Project Details', ar: 'تفاصيل المشروع' })}>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('status', { en: 'Status', ar: 'الحالة' })}
                </label>
                <select
                  {...register('status', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('category', { en: 'Category', ar: 'الفئة' })}
                </label>
                <select
                  {...register('category', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t('demo_url', { en: 'Demo URL', ar: 'رابط التجربة' })}
                type="url"
                {...register('demo_url', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: t('invalid_url', { en: 'Please enter a valid URL', ar: 'يرجى إدخال رابط صالح' })
                  }
                })}
                error={errors.demo_url?.message}
                placeholder="https://..."
              />

              <Input
                label={t('github_url', { en: 'GitHub URL', ar: 'رابط GitHub' })}
                type="url"
                {...register('github_url', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: t('invalid_url', { en: 'Please enter a valid URL', ar: 'يرجى إدخال رابط صالح' })
                  }
                })}
                error={errors.github_url?.message}
                placeholder="https://github.com/..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('sort_order', { en: 'Sort Order', ar: 'ترتيب العرض' })}
                  type="number"
                  {...register('sort_order', { 
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: t('sort_order_min', { en: 'Sort order must be 0 or greater', ar: 'ترتيب العرض يجب أن يكون 0 أو أكبر' })
                    },
                    max: {
                      value: 999,
                      message: t('sort_order_max', { en: 'Sort order must be 999 or less', ar: 'ترتيب العرض يجب أن يكون 999 أو أقل' })
                    }
                  })}
                  error={errors.sort_order?.message}
                  placeholder="0"
                />

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_featured"
                    {...register('is_featured')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('featured', { en: 'Featured', ar: 'مميز' })}
                  </label>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Tech Stack */}
        <DashboardCard title={t('tech_stack', { en: 'Technology Stack', ar: 'المكدس التقني' })}>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('add_tech', { en: 'Add technology...', ar: 'أضف تقنية...' })}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                icon={FiPlus}
                onClick={addTech}
                disabled={!newTech.trim()}
              >
                {t('add', { en: 'Add', ar: 'إضافة' })}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        </DashboardCard>

        {/* Image Upload */}
        <DashboardCard title={t('project_image', { en: 'Project Image', ar: 'صورة المشروع' })}>
          <div className="space-y-4">
            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Project"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            )}
            <FileUpload
              onFileUploaded={handleImageUpload}
              onError={handleImageUploadError}
              accept="image/*"
              directory="projects"
              maxSize={5 * 1024 * 1024} // 5MB
            />
          </div>
        </DashboardCard>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/projects')}
          >
            {t('cancel', { en: 'Cancel', ar: 'إلغاء' })}
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={FiSave}
            loading={isSubmitting || updateMutation.isLoading}
          >
            {isNew 
              ? t('create_project', { en: 'Create Project', ar: 'إنشاء المشروع' })
              : t('update_project', { en: 'Update Project', ar: 'تحديث المشروع' })
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEdit;