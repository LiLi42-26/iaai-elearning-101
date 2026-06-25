/**
 * Button — composant unique remplaçant Button.jsx + ARIAButton.jsx
 *
 * Usage :
 *   <Button>Texte</Button>
 *   <Button variant="primary" size="lg" leftIcon={<IconPlay />}>Commencer</Button>
 *   <Button variant="danger" loading>Suppression...</Button>
 *   <Button variant="ghost" disabled>Non disponible</Button>
 */

import React from 'react';

const SIZE_CLASSES = {
  sm: 'h-7 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
};

const VARIANT_CLASSES = {
  primary:
    'bg-gray-900 text-white border-transparent hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
  secondary:
    'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-50 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800',
  danger:
    'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
  ghost:
    'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon = null,
      rightIcon = null,
      className = '',
      type = 'button',
      ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        onClick={onClick}
        className={[
          'inline-flex items-center justify-center rounded-md border font-medium',
          'transition-colors duration-150 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400',
          'active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          SIZE_CLASSES[size],
          VARIANT_CLASSES[variant],
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children && <span>{children}</span>}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
