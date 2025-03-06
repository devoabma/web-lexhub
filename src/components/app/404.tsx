'use client'

import { motion } from 'framer-motion'
import { FileSearch } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function NotFound404() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
          ease: 'easeInOut',
        }}
        className="mb-8 inline-block"
      >
        <FileSearch className="h-24 w-24 " />
      </motion.div>
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Página Não Encontrada</h2>
      <p className="mx-auto mb-8 max-w-md text-gray-600">
        Ops! Parece que você se perdeu. Esta página não existe no nosso sistema.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          asChild
          className="bg-sky-600 rounded text-white hover:bg-sky-700"
        >
          <Link href="/">Voltar para a Página Inicial</Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}
