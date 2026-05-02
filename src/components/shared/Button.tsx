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
  sm: 'px-5 py-2.5 text-sm rounded-xl',
  md: 'px-7 py-3.5 text-base rounded-2xl',
  lg: 'px-10 py-4 text-lg rounded-2xl',
};

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button', pulse = false }: Props) {
  const base = `inline-flex items-center justify-center gap-2 font-black transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${className}`;

  if (variant === 'primary') {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        whileHover={{ scale: disabled ? 1 : 1.04 }}
        className={`${base} ${pulse && !disabled ? 'pulse-ring btn-shine' : ''}`}
        style={{
          background: disabled
            ? 'rgba(245,184,0,0.25)'
            : !pulse
            ? 'linear-gradient(135deg, #F5B800 0%, #FFD166 50%, #F5B800 100%)'
            : undefined,
          color: '#09090F',
          boxShadow: disabled ? 'none' : '0 4px 20px rgba(245,184,0,0.35)',
        }}
      >
        {children}
      </motion.button>
    );
  }

  if (variant === 'outline') {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        className={base}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1.5px solid rgba(245,184,0,0.35)',
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`${base} text-white/45 hover:text-white/80`}
    >
      {children}
    </motion.button>
  );
}
