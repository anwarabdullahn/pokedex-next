'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Heart, Search, Trash2, Plus, Filter } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { PokemonCard } from '@/components/pokemon/pokemon-card'
import { PokemonTypeName } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import Image from 'next/image'
import Link from 'next/link'

interface FavoritePokemon {
  id: number
  name: string
  types: string[]
  sprite: string
  addedAt: string
}

const POKEMON_TYPES = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

// CVA for type badges
const typeBadgeVariants = cva(
  "text-xs font-semibold capitalize px-2 py-1",
  {
    variants: {
      type: {
        normal: "bg-pokemon-normal text-white",
        fire: "bg-pokemon-fire text-white", 
        water: "bg-pokemon-water text-white",
        electric: "bg-pokemon-electric text-black",
        grass: "bg-pokemon-grass text-white",
        ice: "bg-pokemon-ice text-black",
        fighting: "bg-pokemon-fighting text-white",
        poison: "bg-pokemon-poison text-white",
        ground: "bg-pokemon-ground text-white",
        flying: "bg-pokemon-flying text-white",
        psychic: "bg-pokemon-psychic text-white",
        bug: "bg-pokemon-bug text-white",
        rock: "bg-pokemon-rock text-white",
        ghost: "bg-pokemon-ghost text-white",
        dragon: "bg-pokemon-dragon text-white",
        dark: "bg-pokemon-dark text-white",
        steel: "bg-pokemon-steel text-white",
        fairy: "bg-pokemon-fairy text-white",
      }
    },
    defaultVariants: {
      type: "normal"
    }
  }
)

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type'>('date')

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemon-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error parsing favorites:', error)
      }
    }
  }, [])

  const removeFavorite = (pokemonId: number) => {
    if (confirm('Remove this Pokémon from favorites?')) {
      const updatedFavorites = favorites.filter(fav => fav.id !== pokemonId)
      setFavorites(updatedFavorites)
      localStorage.setItem('pokemon-favorites', JSON.stringify(updatedFavorites))
    }
  }

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites? This action cannot be undone.')) {
      setFavorites([])
      localStorage.setItem('pokemon-favorites', JSON.stringify([]))
    }
  }

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(pokemon => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pokemon.id.toString().includes(searchQuery)
      const matchesType = typeFilter === 'all' || pokemon.types.includes(typeFilter)
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        case 'type':
          return a.types[0]?.localeCompare(b.types[0] || '') || 0
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">Favorite Pokémon</h1>
          </div>
          <p className="text-gray-600">
            Your personal collection of favorite Pokémon for quick access and team building.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{favorites.length}</div>
              <div className="text-sm text-gray-600">Total Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(favorites.flatMap(f => f.types)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Types</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.ceil(favorites.length / 6)}
              </div>
              <div className="text-sm text-gray-600">Potential Teams</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {favorites.length > 0 ? 
                  Math.round(favorites.reduce((acc, f) => acc + f.id, 0) / favorites.length) : 0
                }
              </div>
              <div className="text-sm text-gray-600">Avg Pokédex #</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {POKEMON_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'type')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="date">Sort by Date Added</option>
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
              </select>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Plus className="w-4 h-4 mr-2" />
                    Add More
                  </Link>
                </Button>
                {favorites.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllFavorites}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Favorites Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start building your collection by adding Pokémon to your favorites from the Pokédex!
              </p>
              <Button asChild>
                <Link href="/">
                  <Search className="w-4 h-4 mr-2" />
                  Explore Pokédex
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : filteredFavorites.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Found</h3>
              <p className="text-gray-500">
                No favorites match your current search and filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredFavorites.length} of {favorites.length} favorites
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFavorites.map((pokemon) => (
                <FavoriteCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onRemove={() => removeFavorite(pokemon.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FavoriteCard({ 
  pokemon, 
  onRemove 
}: { 
  pokemon: FavoritePokemon
  onRemove: () => void 
}) {
  const addedDate = new Date(pokemon.addedAt).toLocaleDateString()

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <Link href={`/pokemon/${pokemon.id}`}>
            <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <Image
                src={pokemon.sprite}
                alt={pokemon.name}
                fill
                className="object-contain p-2 group-hover:scale-110 transition-transform"
                sizes="200px"
              />
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </Button>
        </div>

        <div className="space-y-2">
          <Link href={`/pokemon/${pokemon.id}`}>
            <h3 className="font-semibold text-sm capitalize hover:text-blue-600 transition-colors">
              {pokemon.name}
            </h3>
          </Link>
          
          <div className="text-xs text-gray-500">
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map(type => (
              <Badge 
                key={type}
                className={typeBadgeVariants({ type: type as PokemonTypeName })}
              >
                {type}
              </Badge>
            ))}
          </div>
          
          <div className="text-xs text-gray-400">
            Added {addedDate}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 