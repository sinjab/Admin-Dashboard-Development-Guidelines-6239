import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import DashboardCard from '../components/ui/DashboardCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { updateAdminPassword, createAdminUser } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const { FiSettings, FiLock, FiUserPlus, FiSave } = FiIcons;

const Settings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [createUserLoading, setCreateUserLoading] = useState(false);

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();
  const { register: registerUser, handleSubmit: handleUserSubmit, formState: { errors: userErrors }, reset: resetUser } = useForm();

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: result, error } = await updateAdminPassword(
        user.email,
        data.currentPassword,
        data.newPassword
      );

      if (error) {
        toast.error(error.message || t('password_update_error', {
          en: 'Failed to update password',
          ar: 'فشل في تحديث كلمة المرور'
        }));
      } else if (result) {
        toast.success(t('password_updated', {
          en: 'Password updated successfully',
          ar: 'تم تحديث كلمة المرور بنجاح'
        }));
        resetPassword();
      } else {
        toast.error(t('current_password_incorrect', {
          en: 'Current password is incorrect',
          ar: 'كلمة المرور الحالية غير صحيحة'
        }));
      }
    } catch (error) {
      toast.error(t('password_update_error', {
        en: 'Failed to update password',
        ar: 'فشل في تحديث كلمة المرور'
      }));
    } finally {
      setLoading(false);
    }
  };

  const onCreateUserSubmit = async (data) => {
    setCreateUserLoading(true);
    try {
      const { data: result, error } = await createAdminUser(
        data.email,
        data.password,
        data.fullName,
        data.role
      );

      if (error) {
        toast.error(error.message || t('user_create_error', {
          en: 'Failed to create user',
          ar: 'فشل في إنشاء المستخدم'
        }));
      } else {
        toast.success(t('user_created', {
          en: 'User created successfully',
          ar: 'تم إنشاء المستخدم بنجاح'
        }));
        resetUser();
      }
    } catch (error) {
      toast.error(t('user_create_error', {
        en: 'Failed to create user',
        ar: 'فشل في إنشاء المستخدم'
      }));
    } finally {
      setCreateUserLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('settings', {
              en: 'Settings',
              ar: 'الإعدادات'
            })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('settings_subtitle', {
              en: 'Manage your account and system settings',
              ar: 'أدر حسابك وإعدادات النظام'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <DashboardCard
          title={t('change_password', {
            en: 'Change Password',
            ar: 'تغيير كلمة المرور'
          })}
        >
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label={t('current_password', {
                en: 'Current Password',
                ar: 'كلمة المرور الحالية'
              })}
              type="password"
              {...registerPassword('currentPassword', {
                required: t('current_password_required', {
                  en: 'Current password is required',
                  ar: 'كلمة المرور الحالية مطلوبة'
                })
              })}
              error={passwordErrors.currentPassword?.message}
              required
            />

            <Input
              label={t('new_password', {
                en: 'New Password',
                ar: 'كلمة المرور الجديدة'
              })}
              type="password"
              {...registerPassword('newPassword', {
                required: t('new_password_required', {
                  en: 'New password is required',
                  ar: 'كلمة المرور الجديدة مطلوبة'
                }),
                minLength: {
                  value: 6,
                  message: t('password_min_length', {
                    en: 'Password must be at least 6 characters',
                    ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                  })
                }
              })}
              error={passwordErrors.newPassword?.message}
              required
            />

            <Input
              label={t('confirm_password', {
                en: 'Confirm Password',
                ar: 'تأكيد كلمة المرور'
              })}
              type="password"
              {...registerPassword('confirmPassword', {
                required: t('confirm_password_required', {
                  en: 'Please confirm your password',
                  ar: 'يرجى تأكيد كلمة المرور'
                }),
                validate: (value, { newPassword }) => {
                  return value === newPassword || t('passwords_dont_match', {
                    en: 'Passwords do not match',
                    ar: 'كلمات المرور غير متطابقة'
                  });
                }
              })}
              error={passwordErrors.confirmPassword?.message}
              required
            />

            <Button
              type="submit"
              variant="primary"
              icon={FiLock}
              loading={loading}
              className="w-full"
            >
              {t('update_password', {
                en: 'Update Password',
                ar: 'تحديث كلمة المرور'
              })}
            </Button>
          </form>
        </DashboardCard>

        {/* Create New Admin User */}
        {user?.role === 'super_admin' && (
          <DashboardCard
            title={t('create_admin_user', {
              en: 'Create Admin User',
              ar: 'إنشاء مستخدم إداري'
            })}
          >
            <form onSubmit={handleUserSubmit(onCreateUserSubmit)} className="space-y-4">
              <Input
                label={t('full_name', {
                  en: 'Full Name',
                  ar: 'الاسم الكامل'
                })}
                type="text"
                {...registerUser('fullName', {
                  required: t('full_name_required', {
                    en: 'Full name is required',
                    ar: 'الاسم الكامل مطلوب'
                  })
                })}
                error={userErrors.fullName?.message}
                required
              />

              <Input
                label={t('email', {
                  en: 'Email',
                  ar: 'البريد الإلكتروني'
                })}
                type="email"
                {...registerUser('email', {
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
                error={userErrors.email?.message}
                required
              />

              <Input
                label={t('password', {
                  en: 'Password',
                  ar: 'كلمة المرور'
                })}
                type="password"
                {...registerUser('password', {
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
                error={userErrors.password?.message}
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('role', {
                    en: 'Role',
                    ar: 'الدور'
                  })}
                </label>
                <select
                  {...registerUser('role', {
                    required: t('role_required', {
                      en: 'Role is required',
                      ar: 'الدور مطلوب'
                    })
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="admin">
                    {t('admin', {
                      en: 'Admin',
                      ar: 'مدير'
                    })}
                  </option>
                  <option value="super_admin">
                    {t('super_admin', {
                      en: 'Super Admin',
                      ar: 'مدير عام'
                    })}
                  </option>
                </select>
                {userErrors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400">{userErrors.role.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                icon={FiUserPlus}
                loading={createUserLoading}
                className="w-full"
              >
                {t('create_user', {
                  en: 'Create User',
                  ar: 'إنشاء المستخدم'
                })}
              </Button>
            </form>
          </DashboardCard>
        )}
      </div>
    </div>
  );
};

export default Settings;