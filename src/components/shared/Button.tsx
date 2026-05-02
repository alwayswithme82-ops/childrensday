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
  const baseStyle = `
    inline-flex items-center justify-center gap-2 font-black
    transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizes[size]}
    ${className}
  `;

  if (variant === 'primary') {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        className={`${baseStyle} text-[#1A0A3C] ${pulse && !disabled ? 'btn-gold-pulse' : ''}`}
        style={{
          background: disabled
            ? 'rgba(255,215,0,0.3)'
            : 'linear-gradient(135deg, #FFD700 0%, #FBBF24 50%, #F59E0B 100%)',
          boxShadow: disabled ? 'none' : '0 4px 20px rgba(255,165,0,0.45)',
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
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        whileHover={{ scale: disabled ? 1 : 1.04 }}
        className={`${baseStyle} border-2 text-white/80 hover:text-white hover:border-gold/80`}
        style={{ borderColor: 'rgba(255,215,0,0.45)', background: 'rgba(255,255,255,0.05)' }}
      >
        {children}
      </motion.button>
    );
  }

  // ghost
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className={`${baseStyle} text-white/50 hover:text-white/90`}
    >
      {children}
    </motion.button>
  );
}
