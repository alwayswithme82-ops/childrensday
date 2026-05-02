import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const variants = {
  primary:   'bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg shadow-yellow-400/30',
  secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  ghost:     'text-white/70 hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button' }: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      className={`${variants[variant]} ${sizes[size]} transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
}
