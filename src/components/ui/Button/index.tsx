'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ios' | 'ios-tint';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-ios-blue text-white hover:bg-ios-blue/90 active:bg-ios-blue/80 focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2 rounded-ios-full shadow-sm',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 rounded-ios-full shadow-sm',
    outline:
      'border border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-gray-100/80 active:bg-gray-100/90 focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2 rounded-ios-full',
    ghost:
      'bg-transparent hover:bg-gray-100/80 text-gray-700 active:bg-gray-100/90 rounded-ios-full',
    ios: 'bg-ios-blue rounded-ios-full text-white font-semibold hover:bg-ios-blue/90 active:scale-[0.98] transition-all shadow-sm',
    'ios-tint':
      'bg-ios-blue/10 rounded-ios-full text-ios-blue font-semibold hover:bg-ios-blue/15 active:bg-ios-blue/20 active:scale-[0.98] transition-all',
  };

  const sizes = {
    xs: 'h-7 px-3 text-footnote gap-1.5',
    sm: 'h-8 px-4 text-subhead gap-1.5',
    md: 'h-10 px-5 py-2 text-callout gap-2',
    lg: 'h-12 px-6 text-body gap-2.5',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  // 로딩 스피너 iOS 스타일로 업데이트
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : iconPosition === 'left' && icon ? (
        <>
          <span className="flex items-center">{icon}</span>
          {children}
        </>
      ) : (
        <>
          {children}
          {iconPosition === 'right' && icon && (
            <span className="flex items-center">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};
