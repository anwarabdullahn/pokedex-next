'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PokemonTypeName, TYPE_COLORS } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import { Sword, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

interface TypeEffectivenessProps {
  types: string[]
}

// Type effectiveness data based on Pokemon type chart
const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, ice: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
}

// CVA for effectiveness badges
const effectivenessBadgeVariants = cva(
  "text-xs font-semibold px-2 py-1",
  {
    variants: {
      effectiveness: {
        "super": "bg-green-500 text-white",
        "normal": "bg-gray-400 text-white",
        "not-very": "bg-orange-500 text-white",
        "no": "bg-red-500 text-white"
      }
    },
    defaultVariants: {
      effectiveness: "normal"
    }
  }
)

// CVA for type badges (reused from other components)
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

export function TypeEffectivenessChart({ types }: TypeEffectivenessProps) {
  // Calculate attack effectiveness (what this Pokemon's types are effective against)
  const getAttackEffectiveness = () => {
    const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
    
    const effectiveness: Record<string, string[]> = {
      'super': [],
      'not-very': [],
      'no': []
    }
    
    allTypes.forEach(defendingType => {
      let maxMultiplier = 1
      
      types.forEach(attackingType => {
        const multiplier = TYPE_EFFECTIVENESS[attackingType]?.[defendingType] || 1
        if (multiplier > maxMultiplier) {
          maxMultiplier = multiplier
        }
      })
      
      if (maxMultiplier === 2) {
        effectiveness.super.push(defendingType)
      } else if (maxMultiplier === 0.5) {
        effectiveness['not-very'].push(defendingType)
      } else if (maxMultiplier === 0) {
        effectiveness.no.push(defendingType)
      }
    })
    
    return effectiveness
  }

  // Calculate defense effectiveness (what damages this Pokemon)
  const getDefenseEffectiveness = () => {
    const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
    
    const effectiveness: Record<string, string[]> = {
      'super': [],
      'not-very': [],
      'no': []
    }
    
    allTypes.forEach(attackingType => {
      let totalMultiplier = 1
      
      types.forEach(defendingType => {
        const multiplier = TYPE_EFFECTIVENESS[attackingType]?.[defendingType] || 1
        totalMultiplier *= multiplier
      })
      
      if (totalMultiplier >= 2) {
        effectiveness.super.push(attackingType)
      } else if (totalMultiplier <= 0.5 && totalMultiplier > 0) {
        effectiveness['not-very'].push(attackingType)
      } else if (totalMultiplier === 0) {
        effectiveness.no.push(attackingType)
      }
    })
    
    return effectiveness
  }

  const attackEffectiveness = getAttackEffectiveness()
  const defenseEffectiveness = getDefenseEffectiveness()

  const getEffectivenessIcon = (type: string) => {
    switch (type) {
      case 'super': return <Sword className="w-4 h-4" />
      case 'not-very': return <Shield className="w-4 h-4" />
      case 'no': return <AlertTriangle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const getEffectivenessLabel = (type: string, isAttack: boolean) => {
    switch (type) {
      case 'super': return isAttack ? 'Super Effective Against' : 'Weak To'
      case 'not-very': return isAttack ? 'Not Very Effective Against' : 'Resistant To'
      case 'no': return isAttack ? 'No Effect Against' : 'Immune To'
      default: return 'Normal'
    }
  }

  const getEffectivenessMultiplier = (type: string) => {
    switch (type) {
      case 'super': return '2×'
      case 'not-very': return '½×'
      case 'no': return '0×'
      default: return '1×'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Type Effectiveness</CardTitle>
        <div className="flex gap-2">
          {types.map(type => (
            <Badge 
              key={type} 
              className={typeBadgeVariants({ type: type as PokemonTypeName })}
            >
              {type}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="defense" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="defense" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Defending
            </TabsTrigger>
            <TabsTrigger value="attack" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              Attacking
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="defense" className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              How effective attacks are against this Pokémon:
            </div>
            
            {(['super', 'not-very', 'no'] as const).map(effectiveness => {
              const types = defenseEffectiveness[effectiveness]
              if (types.length === 0) return null
              
              return (
                <div key={effectiveness} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getEffectivenessIcon(effectiveness)}
                    <span className="font-semibold text-sm">
                      {getEffectivenessLabel(effectiveness, false)}
                    </span>
                    <Badge className={effectivenessBadgeVariants({ effectiveness })}>
                      {getEffectivenessMultiplier(effectiveness)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {types.map(type => (
                      <Badge 
                        key={type} 
                        variant="outline"
                        className={typeBadgeVariants({ type: type as PokemonTypeName })}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>
          
          <TabsContent value="attack" className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              How effective this Pokémon&apos;s attacks are:
            </div>
            
            {(['super', 'not-very', 'no'] as const).map(effectiveness => {
              const types = attackEffectiveness[effectiveness]
              if (types.length === 0) return null
              
              return (
                <div key={effectiveness} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getEffectivenessIcon(effectiveness)}
                    <span className="font-semibold text-sm">
                      {getEffectivenessLabel(effectiveness, true)}
                    </span>
                    <Badge className={effectivenessBadgeVariants({ effectiveness })}>
                      {getEffectivenessMultiplier(effectiveness)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {types.map(type => (
                      <Badge 
                        key={type} 
                        variant="outline"
                        className={typeBadgeVariants({ type: type as PokemonTypeName })}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 