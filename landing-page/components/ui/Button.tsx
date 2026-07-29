'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import { gradients, shadows } from '@/lib/design-tokens';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: 'text-matter-white',
  secondary: 'text-energy-yellow underline underline-offset-4',
  outline: 'border border-energy-yellow/40 text-matter-white bg-transparent'
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

const variantStyle: Record<Variant, React.CSSProperties> = {
  primary: { background: gradients.energyFlow, boxShadow: shadows.electric },
  secondary: {},
  outline: {}
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-narrative font-medium rounded-lg transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-energy-red focus:ring-offset-2 focus:ring-offset-bg-void',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={variantStyle[variant]}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
