import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-900/40 hover:from-indigo-400 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none',
  secondary:
    'bg-white/5 text-slate-100 border border-white/15 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', ...rest }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
