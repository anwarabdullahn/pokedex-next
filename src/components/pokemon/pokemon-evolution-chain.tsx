'use client'

import { useEvolutionChain } from '@/lib/hooks/use-pokemon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight, Zap, Sun, Moon, Star, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPokemonIdFromUrl } from '@/lib/api/pokemon'

interface EvolutionChainProps {
  evolutionChainUrl: string
}

interface EvolutionDetail {
  min_level?: number
  trigger: {
    name: string
    url: string
  }
  item?: {
    name: string
    url: string
  }
  time_of_day?: string
  min_happiness?: number
  min_beauty?: number
  held_item?: {
    name: string
    url: string
  }
  known_move?: {
    name: string
    url: string
  }
  location?: {
    name: string
    url: string
  }
  min_affection?: number
  needs_overworld_rain?: boolean
  party_species?: {
    name: string
    url: string
  }
  party_type?: {
    name: string
    url: string
  }
  relative_physical_stats?: number
  trade_species?: {
    name: string
    url: string
  }
  turn_upside_down?: boolean
}

interface EvolutionNode {
  species: {
    name: string
    url: string
  }
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionNode[]
}

interface EvolutionChain {
  id: number
  chain: EvolutionNode
}

export function PokemonEvolutionChain({ evolutionChainUrl }: EvolutionChainProps) {
  const { 
    data: evolutionChain, 
    isLoading, 
    error 
  } = useEvolutionChain(evolutionChainUrl)

  if (isLoading) {
    return <EvolutionChainSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolution Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load evolution chain data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!evolutionChain) {
    return null
  }

  const chain = evolutionChain as EvolutionChain
  const evolutionStages = flattenEvolutionChain(chain.chain)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolution Chain</CardTitle>
      </CardHeader>
      <CardContent>
        {evolutionStages.length === 1 ? (
          <div className="text-center text-gray-500 py-4">
            This Pokémon does not evolve.
          </div>
        ) : (
          <div className="space-y-6">
            {evolutionStages.map((stage, stageIndex) => (
              <div key={stageIndex} className="space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {stage.map((pokemon, pokemonIndex) => (
                    <div key={pokemon.species.name} className="flex items-center gap-4">
                      <PokemonEvolutionCard pokemon={pokemon} />
                      
                      {/* Show evolution arrow and trigger if there's a next stage */}
                      {stageIndex < evolutionStages.length - 1 && (
                        <div className="flex flex-col items-center gap-2">
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                          {pokemon.evolution_details.length > 0 && (
                            <div className="text-center">
                              {pokemon.evolution_details.map((detail, index) => (
                                <EvolutionTrigger key={index} detail={detail} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Separator between stages */}
                {stageIndex < evolutionStages.length - 1 && (
                  <div className="border-t border-gray-200 pt-4" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PokemonEvolutionCard({ pokemon }: { pokemon: EvolutionNode }) {
  const pokemonId = getPokemonIdFromUrl(pokemon.species.url)
  const pokemonName = pokemon.species.name
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`

  return (
    <Link href={`/pokemon/${pokemonId}`}>
      <div className="text-center p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer group">
        <div className="w-20 h-20 mx-auto mb-2 relative">
          <Image
            src={imageUrl}
            alt={pokemonName}
            fill
            className="object-contain group-hover:scale-110 transition-transform"
            sizes="80px"
            onError={(e) => {
              // Fallback to default sprite if official artwork fails
              const target = e.target as HTMLImageElement;
              target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            }}
          />
        </div>
        <div className="font-semibold text-sm capitalize">{pokemonName}</div>
        <div className="text-xs text-gray-500">#{pokemonId.toString().padStart(3, '0')}</div>
      </div>
    </Link>
  )
}

function EvolutionTrigger({ detail }: { detail: EvolutionDetail }) {
  const getTriggerText = () => {
    const trigger = detail.trigger.name
    
    switch (trigger) {
      case 'level-up':
        if (detail.min_level) {
          return `Level ${detail.min_level}`
        }
        if (detail.min_happiness) {
          return (
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>High Friendship</span>
            </div>
          )
        }
        if (detail.time_of_day === 'day') {
          return (
            <div className="flex items-center gap-1">
              <Sun className="w-3 h-3" />
              <span>Day</span>
            </div>
          )
        }
        if (detail.time_of_day === 'night') {
          return (
            <div className="flex items-center gap-1">
              <Moon className="w-3 h-3" />
              <span>Night</span>
            </div>
          )
        }
        if (detail.held_item) {
          return `Hold ${detail.held_item.name.replace('-', ' ')}`
        }
        if (detail.known_move) {
          return `Learn ${detail.known_move.name.replace('-', ' ')}`
        }
        if (detail.location) {
          return `At ${detail.location.name.replace('-', ' ')}`
        }
        return 'Level up'
        
      case 'trade':
        if (detail.held_item) {
          return `Trade holding ${detail.held_item.name.replace('-', ' ')}`
        }
        return 'Trade'
        
      case 'use-item':
        if (detail.item) {
          return (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{detail.item.name.replace('-', ' ')}</span>
            </div>
          )
        }
        return 'Use item'
        
      case 'three-critical-hits':
        return '3 Critical Hits'
        
      case 'take-damage':
        return 'Take damage'
        
      default:
        return trigger.replace('-', ' ')
    }
  }

  return (
    <Badge variant="secondary" className="text-xs whitespace-nowrap">
      {getTriggerText()}
    </Badge>
  )
}

// Helper function to flatten the evolution chain into stages
function flattenEvolutionChain(chain: EvolutionNode): EvolutionNode[][] {
  const stages: EvolutionNode[][] = []
  
  // Start with the base Pokemon
  stages.push([chain])
  
  // Process each evolution level
  let currentLevel = [chain]
  
  while (currentLevel.some(pokemon => pokemon.evolves_to.length > 0)) {
    const nextLevel: EvolutionNode[] = []
    
    currentLevel.forEach(pokemon => {
      nextLevel.push(...pokemon.evolves_to)
    })
    
    if (nextLevel.length > 0) {
      stages.push(nextLevel)
      currentLevel = nextLevel
    } else {
      break
    }
  }
  
  return stages
}

function EvolutionChainSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolution Chain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-center p-4">
                <Skeleton className="w-20 h-20 mx-auto mb-2 rounded-lg" />
                <Skeleton className="h-4 w-16 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
              {index < 3 && (
                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                  <Skeleton className="h-5 w-16" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 