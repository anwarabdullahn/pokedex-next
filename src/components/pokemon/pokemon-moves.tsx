'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PokemonTypeName, TYPE_COLORS } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import { useState, useMemo } from 'react'
import { Search, Filter, Zap, Target, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Move {
  move: {
    name: string
    url: string
  }
  version_group_details: {
    level_learned_at: number
    move_learn_method: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }[]
}

interface PokemonMovesProps {
  moves: Move[]
}

// CVA for move type badges
const moveTypeBadgeVariants = cva(
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

interface ProcessedMove {
  name: string
  level: number
  method: string
  url: string
  displayName: string
}

export function PokemonMoves({ moves }: PokemonMovesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<string>('all')

  // Process moves data
  const processedMoves = useMemo(() => {
    const latestMoves: Record<string, ProcessedMove> = {}
    
    moves.forEach(move => {
      const moveName = move.move.name
      // Get the latest version group details (usually the most recent game)
      const latestDetail = move.version_group_details[move.version_group_details.length - 1]
      
      if (latestDetail) {
        latestMoves[moveName] = {
          name: moveName,
          level: latestDetail.level_learned_at,
          method: latestDetail.move_learn_method.name,
          url: move.move.url,
          displayName: moveName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        }
      }
    })
    
    return Object.values(latestMoves)
  }, [moves])

  // Group moves by learning method
  const movesByMethod = useMemo(() => {
    const groups: Record<string, ProcessedMove[]> = {
      'level-up': [],
      'machine': [],
      'tutor': [],
      'egg': [],
      'other': []
    }

    processedMoves.forEach(move => {
      const method = move.method
      if (groups[method]) {
        groups[method].push(move)
      } else {
        groups.other.push(move)
      }
    })

    // Sort level-up moves by level
    groups['level-up'].sort((a, b) => a.level - b.level)
    
    // Sort other groups alphabetically
    Object.keys(groups).forEach(key => {
      if (key !== 'level-up') {
        groups[key].sort((a, b) => a.displayName.localeCompare(b.displayName))
      }
    })

    return groups
  }, [processedMoves])

  // Filter moves based on search and method
  const filteredMoves = useMemo(() => {
    let moves = selectedMethod === 'all' 
      ? processedMoves 
      : movesByMethod[selectedMethod] || []

    if (searchQuery.trim()) {
      moves = moves.filter(move => 
        move.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return moves
  }, [processedMoves, movesByMethod, selectedMethod, searchQuery])

  const methodCounts = useMemo(() => {
    return {
      'level-up': movesByMethod['level-up'].length,
      'machine': movesByMethod['machine'].length,
      'tutor': movesByMethod['tutor'].length,
      'egg': movesByMethod['egg'].length,
      'other': movesByMethod['other'].length
    }
  }, [movesByMethod])

  const getMethodDisplayName = (method: string) => {
    switch (method) {
      case 'level-up': return 'Level Up'
      case 'machine': return 'TM/TR'
      case 'tutor': return 'Move Tutor'
      case 'egg': return 'Egg Moves'
      case 'other': return 'Other'
      default: return method
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'level-up': return <Zap className="w-4 h-4" />
      case 'machine': return <Target className="w-4 h-4" />
      case 'tutor': return <Shield className="w-4 h-4" />
      case 'egg': return <span className="text-sm">🥚</span>
      default: return <Filter className="w-4 h-4" />
    }
  }

  if (moves.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Moves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No move data available for this Pokémon.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moves ({processedMoves.length})</CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search moves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all" className="text-xs">
                All ({processedMoves.length})
              </TabsTrigger>
              <TabsTrigger value="level-up" className="text-xs">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {methodCounts['level-up']}
                </div>
              </TabsTrigger>
              <TabsTrigger value="machine" className="text-xs">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {methodCounts['machine']}
                </div>
              </TabsTrigger>
              <TabsTrigger value="tutor" className="text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {methodCounts['tutor']}
                </div>
              </TabsTrigger>
              <TabsTrigger value="egg" className="text-xs">
                <div className="flex items-center gap-1">
                  🥚 {methodCounts['egg']}
                </div>
              </TabsTrigger>
              <TabsTrigger value="other" className="text-xs">
                Other ({methodCounts['other']})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredMoves.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchQuery ? 'No moves found matching your search.' : 'No moves in this category.'}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMoves.map((move, index) => (
              <MoveCard key={`${move.name}-${index}`} move={move} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MoveCard({ move }: { move: ProcessedMove }) {
  const getMethodBadgeVariant = (method: string) => {
    switch (method) {
      case 'level-up': return 'default'
      case 'machine': return 'secondary'
      case 'tutor': return 'outline'
      case 'egg': return 'destructive'
      default: return 'secondary'
    }
  }

  const getMethodDisplayName = (method: string) => {
    switch (method) {
      case 'level-up': return move.level > 0 ? `Lv. ${move.level}` : 'Level 1'
      case 'machine': return 'TM/TR'
      case 'tutor': return 'Tutor'
      case 'egg': return 'Egg'
      default: return method.replace('-', ' ')
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="font-medium text-sm capitalize">
          {move.displayName}
        </div>
        <div className="text-xs text-gray-500">
          Learn method: {getMethodDisplayName(move.method)}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant={getMethodBadgeVariant(move.method)} className="text-xs">
          {getMethodDisplayName(move.method)}
        </Badge>
      </div>
    </div>
  )
} 