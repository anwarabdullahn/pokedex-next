'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Copy, Play } from 'lucide-react'
import { PokemonTypeName } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import Image from 'next/image'

interface SavedTeam {
  id: number
  name: string
  pokemon: Array<{
    id: number
    name: string
    types: string[]
    sprite: string
  }>
  createdAt: string
}

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

export function SavedTeams() {
  const [teams, setTeams] = useState<SavedTeam[]>([])

  // Load teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('pokemon-teams')
    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams))
      } catch (error) {
        console.error('Error parsing saved teams:', error)
      }
    }
  }, [])

  const deleteTeam = (teamId: number) => {
    if (confirm('Are you sure you want to delete this team?')) {
      const updatedTeams = teams.filter(team => team.id !== teamId)
      setTeams(updatedTeams)
      localStorage.setItem('pokemon-teams', JSON.stringify(updatedTeams))
    }
  }

  const duplicateTeam = (team: SavedTeam) => {
    const newTeam = {
      ...team,
      id: Date.now(),
      name: `${team.name} (Copy)`,
      createdAt: new Date().toISOString()
    }
    const updatedTeams = [...teams, newTeam]
    setTeams(updatedTeams)
    localStorage.setItem('pokemon-teams', JSON.stringify(updatedTeams))
  }

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <div className="text-4xl mb-2">📦</div>
            <h3 className="text-lg font-semibold mb-2">No Saved Teams</h3>
            <p className="text-sm">
              Create your first team using the Team Builder to get started!
            </p>
          </div>
          <Button asChild>
            <a href="#builder">Create Your First Team</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard 
          key={team.id} 
          team={team} 
          onDelete={() => deleteTeam(team.id)}
          onDuplicate={() => duplicateTeam(team)}
        />
      ))}
    </div>
  )
}

function TeamCard({ 
  team, 
  onDelete, 
  onDuplicate 
}: { 
  team: SavedTeam
  onDelete: () => void
  onDuplicate: () => void
}) {
  const uniqueTypes = new Set(team.pokemon.flatMap(p => p.types))
  const createdDate = new Date(team.createdAt).toLocaleDateString()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{team.name}</CardTitle>
            <div className="text-sm text-gray-500">
              {team.pokemon.length} Pokémon • Created {createdDate}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onDuplicate}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pokemon Sprites */}
        <div className="grid grid-cols-3 gap-2">
          {team.pokemon.slice(0, 6).map((pokemon, index) => (
            <div 
              key={index} 
              className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center relative"
            >
              <div className="w-12 h-12 relative">
                <Image
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: 6 - team.pokemon.length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
            />
          ))}
        </div>

        {/* Type Coverage */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Type Coverage ({uniqueTypes.size} types)
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from(uniqueTypes).slice(0, 8).map(type => (
              <Badge 
                key={type}
                className={typeBadgeVariants({ type: type as PokemonTypeName })}
              >
                {type}
              </Badge>
            ))}
            {uniqueTypes.size > 8 && (
              <Badge variant="secondary">
                +{uniqueTypes.size - 8} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" className="flex-1" disabled>
            <Play className="w-4 h-4 mr-2" />
            Battle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 