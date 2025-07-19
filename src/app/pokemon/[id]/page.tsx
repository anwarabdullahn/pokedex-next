'use client'

import { usePokemon, usePokemonSpecies } from '@/lib/hooks/use-pokemon'
import { PokemonStats } from '@/components/pokemon/pokemon-stats'
import { PokemonAbilities } from '@/components/pokemon/pokemon-abilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Heart, Share2, Ruler, Weight } from 'lucide-react'
import { PokemonTypeName, TYPE_COLORS, FlavorText } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// CVA for type badges (reused from pokemon-card)
const typeBadgeVariants = cva(
  "text-xs font-semibold capitalize px-3 py-1.5",
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

export default function PokemonDetailPage() {
  const params = useParams()
  const pokemonId = params.id as string

  const { 
    data: pokemon, 
    isLoading: pokemonLoading, 
    error: pokemonError 
  } = usePokemon(pokemonId)

  const { 
    data: species, 
    isLoading: speciesLoading,
    error: speciesError 
  } = usePokemonSpecies(pokemon?.id || 0)

  const isLoading = pokemonLoading || speciesLoading
  const error = pokemonError || speciesError

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="mt-8">
            <AlertDescription>
              Failed to load Pokemon data. Please check the Pokemon ID and try again.
            </AlertDescription>
          </Alert>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pokédex
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <PokemonDetailSkeleton />
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="mt-8">
            <AlertDescription>
              Pokemon not found. Please check the ID and try again.
            </AlertDescription>
          </Alert>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pokédex
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const primaryType = pokemon.types[0]?.type.name as PokemonTypeName
  const flavorText = species?.flavor_text_entries
    ?.find((entry: FlavorText) => entry.language.name === 'en')?.flavor_text
    ?.replace(/\f/g, ' ') || 'No description available.'

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        background: `linear-gradient(135deg, ${TYPE_COLORS[primaryType]}15 0%, white 50%, ${TYPE_COLORS[primaryType]}05 100%)`
      }}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pokédex
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Pokemon Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Image and Basic Info */}
              <div className="text-center">
                <div className="relative aspect-square max-w-sm mx-auto mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.png'}
                    alt={pokemon.name}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
                    <Badge variant="secondary" className="font-mono">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type.type.name}
                        className={typeBadgeVariants({ type: type.type.name as PokemonTypeName })}
                      >
                        {type.type.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-gray-700 leading-relaxed">{flavorText}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Height</div>
                      <div className="font-semibold">{(pokemon.height / 10).toFixed(1)} m</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Weight</div>
                      <div className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Species Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {species?.is_legendary && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <Badge variant="destructive" className="text-xs">Legendary</Badge>
                      </div>
                    )}
                    {species?.is_mythical && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <Badge variant="destructive" className="text-xs">Mythical</Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Base Experience:</span>
                      <span className="font-semibold">{pokemon.base_experience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Abilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PokemonStats stats={pokemon.stats} />
          <PokemonAbilities abilities={pokemon.abilities} />
        </div>
      </div>
    </div>
  )
}

// Loading skeleton component
function PokemonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-center space-y-4">
                <Skeleton className="aspect-square max-w-sm mx-auto rounded-xl" />
                <Skeleton className="h-8 w-48 mx-auto" />
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    </div>
  )
} 