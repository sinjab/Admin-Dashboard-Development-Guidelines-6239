import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Input = React.forwardRef(({ label, error, required = false, className = '', containerClassName = '', labelClassName = '', ...props }, ref) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${isRTL ? 'text-right' : 'text-left'}
          ${className}
        `}
        dir={isRTL ? 'rtl' : 'ltr'}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;