'use client'

import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Gamepad2, BookOpen } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const POKEMON_TYPES = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Logo and title */}
            <div className="flex items-center space-x-3">
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
            </div>

            {/* Navigation */}
            <nav className="flex gap-3">
              <Button variant="default" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Pokédex
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/battle" className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Battle Arena
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore the World of Pokémon
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover detailed information about all Pokémon, build your perfect team, 
            and test your skills in epic battles.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search Pokémon by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="lg:w-auto">
              <div className="flex flex-wrap gap-2">
                {POKEMON_TYPES.map((type) => (
                  <Badge
                    key={type}
                    variant={typeFilter === type ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setTypeFilter(type)}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {(searchQuery || typeFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                                 <Badge variant="secondary">
                   Search: &ldquo;{searchQuery}&rdquo;
                 </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="capitalize">
                  Type: {typeFilter}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                }}
                className="ml-auto text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Pokemon Grid */}
        <PokemonGrid 
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          className="mb-8"
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            Built with Next.js, TanStack Query, and shadcn/ui • Data from{' '}
            <a 
              href="https://pokeapi.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              PokéAPI
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
