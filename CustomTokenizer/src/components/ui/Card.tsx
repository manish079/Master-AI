import { HTMLAttributes, ReactNode } from 'react';
import { theme } from '../../styles/theme';

interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function Card({ title, icon, actions, children, className = '', ...rest }: CardProps) {
  return (
    <section className={`${theme.card} ${className}`} {...rest}>
      {(title || actions) && (
        <header className={theme.cardHeader}>
          <div className="flex items-center gap-2">
            {icon && <span className="text-indigo-300">{icon}</span>}
            {title && (
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h2>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={theme.cardBody}>{children}</div>
    </section>
  );
}
