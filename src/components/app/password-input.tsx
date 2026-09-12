'use client'

import { Eye, EyeOff } from 'lucide-react'
import { type InputHTMLAttributes, forwardRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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
          className={cn('pr-10', className)}
          ref={ref} // Aqui o ref é passado corretamente
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="-translate-y-1/2 absolute top-1/2 right-0.5 text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    )
  }
)

// É importante definir um displayName para componentes com forwardRef
PasswordInput.displayName = 'PasswordInput'
