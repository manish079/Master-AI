import { SelectHTMLAttributes, forwardRef } from 'react';
import { theme } from '../../styles/theme';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className = '', ...rest }, ref) => (
    <select
      ref={ref}
      className={`${theme.fieldSurface} px-3 py-2 pr-8 appearance-none bg-no-repeat bg-[length:14px] bg-[right_0.75rem_center] cursor-pointer ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'><path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/></svg>\")",
      }}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
          {opt.label}
        </option>
      ))}
    </select>
  ),
);
Select.displayName = 'Select';
