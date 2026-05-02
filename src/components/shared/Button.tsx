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

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-10 py-4 text-lg rounded-2xl',
};

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button', pulse = false }: Props) {
  const base = `inline-flex items-center justify-center gap-2 font-900 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${className}`;

  if (variant === 'primary') {
    return (
      <motion.button
        type={type} onClick={onClick} disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        className={`${base} text-white ${pulse && !disabled ? 'pulse-gold' : ''}`}
        style={{
          background: disabled ? '#FDE68A' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          boxShadow: disabled ? 'none' : '0 4px 16px rgba(245,158,11,0.4)',
        }}
      >
        {children}
      </motion.button>
    );
  }

  if (variant === 'outline') {
    return (
      <motion.button
        type={type} onClick={onClick} disabled={disabled}
        whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
        className={`${base} border-2 border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700 bg-white`}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type} onClick={onClick} disabled={disabled}
      whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
      className={`${base} text-gray-400 hover:text-gray-700`}
    >
      {children}
    </motion.button>
  );
}
