import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ 
  title, 
  children, 
  actions, 
  className = '',
  loading = false,
  error = null 
}) => {
  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 ${className}`}>
        <div className="text-red-600 dark:text-red-400">
          <h3 className="font-semibold mb-2">Error</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default DashboardCard;