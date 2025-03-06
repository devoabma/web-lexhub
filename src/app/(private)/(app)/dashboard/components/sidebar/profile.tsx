'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Profile() {
  return (
    <div className="flex items-center gap-3">
      {/* truncate => adicionar o ... se o texto estourar o tamanho da div. */}
      <div className="flex flex-col truncate">
        <span className="truncate font-medium">Hilquias Ferreira Melo</span>
        <span className="truncate text-xs text-muted-foreground">
          hilquiasfmelo@hotmail.com
        </span>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="ml-auto rounded cursor-pointer"
        title="Sair"
      >
        <LogOut className="size-5 text-muted-foreground" />
      </Button>
    </div>
  )
}
