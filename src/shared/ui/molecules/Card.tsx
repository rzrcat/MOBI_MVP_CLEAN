import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'bordered' | 'subtle' | 'hover';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default:
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-ios-sm',
    bordered:
      'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
    subtle:
      'bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800',
    hover:
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-ios-sm hover:shadow-ios-md transition-shadow',
  };

  return (
    <div
      ref={ref}
      className={cn('rounded-ios-large', variantStyles[variant], className)}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 p-4 sm:p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeStyles = {
    sm: 'text-subtitle font-semibold',
    md: 'text-title-3 font-semibold',
    lg: 'text-title-2 font-semibold',
  };

  return (
    <h3
      ref={ref}
      className={cn(
        sizeStyles[size],
        'leading-tight tracking-tighter',
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-footnote text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 sm:p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between p-4 sm:p-6 pt-0',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
