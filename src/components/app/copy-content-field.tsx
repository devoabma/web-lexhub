'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CopyContentFieldProps {
  value: string
  label?: string
  className?: string
}

export function CopyContentField({
  value,
  label = 'Copiar',
  className,
}: CopyContentFieldProps) {
  const [copied, setCopied] = useState(false)

  const markCopied = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fallback manual para navegadores sem a API Clipboard ou sem permissão
  const copyWithTextArea = () => {
    const textArea = document.createElement('textarea')
    textArea.value = value
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      markCopied()
    } catch (err) {
      console.error('Falha ao copiar texto: ', err)
    }
    document.body.removeChild(textArea)
  }

  const copyToClipboard = () => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      navigator.clipboard.writeText(value).then(markCopied, copyWithTextArea)
    } else {
      copyWithTextArea()
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={copyToClipboard}
      aria-label={copied ? 'Copiado' : label}
      title={copied ? 'Copiado' : label}
      className={cn(
        'shrink-0 text-muted-foreground hover:text-foreground',
        copied && 'text-success hover:text-success',
        className
      )}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}
