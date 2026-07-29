import clsx from 'clsx';
import { colors, gradients } from '@/lib/design-tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ glow = false, className, children, ...rest }: CardProps) {
  if (glow) {
    return (
      <div
        className={clsx('rounded-xl p-6 relative', className)}
        style={{
          background: `linear-gradient(${colors.bg.panel}, ${colors.bg.panel}) padding-box, ${gradients.energyFlow} border-box`,
          border: '1px solid transparent'
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={clsx('rounded-xl border border-border-subtle bg-bg-panel/70 backdrop-blur-md p-6', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
