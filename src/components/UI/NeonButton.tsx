import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}: NeonButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-purple-600 text-white
      shadow-[0_10px_30px_rgba(6,182,212,0.4)]
      hover:shadow-[0_15px_40px_rgba(6,182,212,0.6)]
      hover:-translate-y-1
    `,
    secondary: `
      bg-gradient-to-r from-purple-500 to-pink-600 text-white
      shadow-[0_10px_30px_rgba(139,92,246,0.4)]
      hover:shadow-[0_15px_40px_rgba(139,92,246,0.6)]
      hover:-translate-y-1
    `,
    outline: `
      bg-transparent border-2 border-cyan-400 text-cyan-400
      hover:bg-cyan-400 hover:text-white
      hover:shadow-[0_10px_30px_rgba(6,182,212,0.3)]
    `
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...(props as any)}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </motion.button>
  )
}
