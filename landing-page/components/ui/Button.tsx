import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-energy-red text-f5f5f5 font-narrative font-medium hover:bg-energy-red/90 active:scale-[0.98] shadow-electric',
  secondary:
    'text-energy-yellow underline underline-offset-4 font-narrative hover:text-energy-yellow/80 active:scale-[0.98]',
  outline:
    'border border-border-subtle text-f5f5f5 font-narrative hover:border-energy-yellow/60 active:scale-[0.98]'
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl'
};

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    />
  );
}
