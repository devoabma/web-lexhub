'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function CopyContentField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } else {
      // Fallback manual para navegadores sem suporte à API Clipboard
      const textArea = document.createElement('textarea')
      textArea.value = value
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Falha ao copiar texto: ', err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={copyToClipboard}
      className="absolute rounded right-2 top-1/2 -translate-y-1/2 border-primary/30 cursor-pointer"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
