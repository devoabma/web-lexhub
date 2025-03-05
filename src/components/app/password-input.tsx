'use client'

import { Eye, EyeOff } from 'lucide-react'
import { type InputHTMLAttributes, forwardRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>

// Use React.forwardRef para permitir o uso de refs no componente
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={` ${className}`}
          ref={ref} // Aqui o ref é passado corretamente
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-2 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
    )
  }
)

// É importante definir um displayName para componentes com forwardRef
PasswordInput.displayName = 'PasswordInput'
