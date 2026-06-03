'use client';

import React from 'react';
import Icon from '../Icon';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  full?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const sizeClass: Record<Size, string> = {
  sm: 'h-[30px] gap-1.5 px-3 text-[13px]',
  md: 'h-[38px] gap-2 px-4 text-sm',
  lg: 'h-[46px] gap-2.5 px-5 text-[15px]',
};

const variantClass: Record<Variant, string> = {
  primary: 'border-brand bg-brand text-inverse shadow-glow font-bold hover:brightness-110',
  secondary: 'border-border-strong bg-glass text-text font-semibold hover:border-brand/60',
  ghost: 'border-transparent bg-transparent text-text hover:bg-glass',
  danger: 'border-error/40 bg-error/10 text-error font-semibold hover:bg-error/15',
  outline: 'border-brand bg-transparent text-brand font-semibold hover:bg-brand/10',
};

export default function Button({ children, variant = 'primary', size = 'md', icon, iconRight, full, className, onClick, disabled, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-50',
        sizeClass[size],
        variantClass[variant],
        full && 'w-full',
        className,
      )}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 17} />}
    </button>
  );
}
