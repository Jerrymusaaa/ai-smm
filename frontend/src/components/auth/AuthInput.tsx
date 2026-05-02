'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-white/70">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200',
              'focus:bg-white/[0.08] focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10',
              error
                ? 'border-red-500/50 focus:border-red-500/60'
                : 'border-white/10 hover:border-white/20',
              icon ? 'pl-10' : '',
              isPassword ? 'pr-11' : '',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
