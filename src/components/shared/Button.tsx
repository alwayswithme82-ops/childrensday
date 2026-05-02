import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  pulse?: boolean;
}

const variants = {
  primary: 'bg-gold text-navy font-black hover:bg-amber-400 active:bg-amber-500 shadow-lg shadow-gold/30',
  outline: 'border-2 border-gold/60 text-gold hover:bg-gold/10 hover:border-gold font-bold',
  ghost:   'text-slate-400 hover:text-white font-medium',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-10 py-4 text-xl rounded-2xl',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  type = 'button',
  pulse = false,
}: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      className={`
        inline-flex items-center justify-center gap-2
        ${variants[variant]} ${sizes[size]}
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${pulse && !disabled ? 'btn-pulse' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
