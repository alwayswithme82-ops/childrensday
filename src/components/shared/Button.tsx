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
  const base = `inline-flex items-center justify-center gap-2 font-900 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${className}`;

  if (variant === 'primary') {
    return (
      <motion.button
        type={type} onClick={onClick} disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        className={`${base} text-white ${pulse && !disabled ? 'btn-pulse' : ''}`}
        style={{
          background: disabled
            ? '#ccc'
            : 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
          boxShadow: disabled ? 'none' : '0 6px 24px rgba(255,107,107,0.4)',
          fontFamily: "'Fredoka One', cursive",
          letterSpacing: '0.03em',
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
        whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
        className={`${base} bg-white`}
        style={{ border: '2.5px solid #E5E7EB', color: '#555' }}
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
