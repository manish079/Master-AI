import { TextareaHTMLAttributes, forwardRef } from 'react';
import { theme } from '../../styles/theme';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', ...rest }, ref) => (
    <textarea
      ref={ref}
      className={`${theme.fieldSurface} min-h-[140px] resize-y px-4 py-3 scrollbar-slim ${className}`}
      {...rest}
    />
  ),
);
TextArea.displayName = 'TextArea';
