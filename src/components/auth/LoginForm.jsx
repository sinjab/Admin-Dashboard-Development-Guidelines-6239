import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { authenticateAdmin } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const { FiLogIn, FiMail, FiLock, FiShield } = FiIcons;

const LoginForm = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: adminData, error } = await authenticateAdmin(data.email, data.password);
      
      if (error) {
        toast.error(error.message || t('login_error', {
          en: 'Invalid credentials',
          ar: 'بيانات الدخول غير صحيحة'
        }));
      } else if (adminData) {
        login(adminData);
        toast.success(t('login_success', {
          en: 'Login successful',
          ar: 'تم تسجيل الدخول بنجاح'
        }));
      } else {
        toast.error(t('login_error', {
          en: 'Invalid credentials',
          ar: 'بيانات الدخول غير صحيحة'
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('login_error', {
        en: 'Login failed',
        ar: 'فشل في تسجيل الدخول'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiShield} className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('admin_login', {
                en: 'Admin Login',
                ar: 'تسجيل دخول المدير'
              })}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('login_subtitle', {
                en: 'Sign in to access the dashboard',
                ar: 'سجل دخولك للوصول إلى لوحة التحكم'
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label={t('email', {
                  en: 'Email',
                  ar: 'البريد الإلكتروني'
                })}
                type="email"
                placeholder={t('email_placeholder', {
                  en: 'Enter your email',
                  ar: 'أدخل بريدك الإلكتروني'
                })}
                {...register('email', {
                  required: t('email_required', {
                    en: 'Email is required',
                    ar: 'البريد الإلكتروني مطلوب'
                  }),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('email_invalid', {
                      en: 'Invalid email address',
                      ar: 'عنوان بريد إلكتروني غير صالح'
                    })
                  }
                })}
                error={errors.email?.message}
                required
              />
            </div>

            <div>
              <Input
                label={t('password', {
                  en: 'Password',
                  ar: 'كلمة المرور'
                })}
                type="password"
                placeholder={t('password_placeholder', {
                  en: 'Enter your password',
                  ar: 'أدخل كلمة المرور'
                })}
                {...register('password', {
                  required: t('password_required', {
                    en: 'Password is required',
                    ar: 'كلمة المرور مطلوبة'
                  }),
                  minLength: {
                    value: 6,
                    message: t('password_min_length', {
                      en: 'Password must be at least 6 characters',
                      ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                    })
                  }
                })}
                error={errors.password?.message}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={FiLogIn}
              loading={loading}
              className="w-full"
            >
              {t('sign_in', {
                en: 'Sign In',
                ar: 'تسجيل الدخول'
              })}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {t('default_credentials', {
                en: 'Default credentials: admin@khaldounsenjab.com / admin123',
                ar: 'بيانات الدخول الافتراضية: admin@khaldounsenjab.com / admin123'
              })}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;