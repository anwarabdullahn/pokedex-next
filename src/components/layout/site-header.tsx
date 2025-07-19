'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Gamepad2, Heart } from 'lucide-react'

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo and title */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pokédex Battle Arena
              </h1>
              <p className="text-gray-600 text-sm">
                Discover Pokemon • Build Teams • Battle
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-3">
            <Button variant={pathname === '/' ? 'default' : 'outline'} asChild>
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Pokédex
              </Link>
            </Button>
            <Button variant={pathname === '/teams' ? 'default' : 'outline'} asChild>
              <Link href="/teams" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Teams
              </Link>
            </Button>
            <Button variant={pathname === '/favorites' ? 'default' : 'outline'} asChild>
              <Link href="/favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </Link>
            </Button>
            <Button variant={pathname === '/battle' ? 'default' : 'outline'} asChild>
              <Link href="/battle" className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Battle Arena
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 