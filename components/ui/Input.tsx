'use client';

import React from 'react';
import Icon from '../Icon';
import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';

interface InputProps {
  icon?: string;
  iconRight?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  size?: Size;
  error?: string;
  hint?: string;
  label?: string;
  full?: boolean;
  className?: string;
  disabled?: boolean;
}

const height: Record<Size, string> = {
  sm: 'h-8 text-[13px]',
  md: 'h-[38px] text-sm',
  lg: 'h-11 text-sm',
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ icon, iconRight, placeholder, value, onChange, type = 'text', size = 'md', error, hint, label, full = true, className, disabled }, ref) => (
  <div className={cn('flex flex-col gap-1.5', full ? 'w-full' : 'w-auto', className)}>
    {label && <label className="text-xs font-semibold text-muted">{label}</label>}
    <div className={cn('flex items-center gap-2 rounded-md border bg-glass px-3', height[size], error ? 'border-error' : 'border-border-strong', disabled && 'opacity-70')}>
      {icon && <Icon name={icon} size={15} className="text-subtle" />}
      <input ref={ref} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="h-full min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-subtle disabled:cursor-not-allowed" />
      {iconRight && <Icon name={iconRight} size={15} className="text-subtle" />}
    </div>
    {(error || hint) && <span className={cn('text-xs', error ? 'text-error' : 'text-subtle')}>{error || hint}</span>}
  </div>
));

Input.displayName = 'Input';
export default Input;
