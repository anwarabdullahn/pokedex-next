'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Plus, Star } from 'lucide-react'
import { BattlePokemon } from '@/lib/types/battle'
import Image from 'next/image'

interface TeamSelectionProps {
  onTeamSelected: (team: BattlePokemon[]) => void
  onBack: () => void
}

interface SavedTeam {
  id: number
  name: string
  pokemon: Array<{
    id: number
    name: string
    types: string[]
    sprite: string
    stats: {
      hp: number
      attack: number
      defense: number
      'special-attack': number
      'special-defense': number
      speed: number
    }
  }>
  createdAt: string
}

export function TeamSelection({ onTeamSelected, onBack }: TeamSelectionProps) {
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([])
  const [selectedTeam, setSelectedTeam] = useState<SavedTeam | null>(null)

  // Load saved teams from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pokemon-teams')
    if (saved) {
      try {
        setSavedTeams(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading teams:', error)
      }
    }
  }, [])

  const convertToBattleTeam = (team: SavedTeam): BattlePokemon[] => {
    return team.pokemon.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      sprite: pokemon.sprite,
      level: 50, // Default battle level
      currentHp: pokemon.stats.hp,
      maxHp: pokemon.stats.hp,
      stats: pokemon.stats,
      moves: [
        // Default moves for now - will be enhanced later
        {
          id: 1,
          name: 'Tackle',
          type: 'normal',
          power: 40,
          accuracy: 100,
          pp: 35,
          currentPp: 35,
          category: 'physical'
        },
        {
          id: 2,
          name: 'Quick Attack',
          type: 'normal',
          power: 40,
          accuracy: 100,
          pp: 30,
          currentPp: 30,
          category: 'physical'
        },
        {
          id: 3,
          name: 'Rest',
          type: 'psychic',
          power: 0,
          accuracy: 100,
          pp: 10,
          currentPp: 10,
          category: 'status'
        },
        {
          id: 4,
          name: 'Hyper Beam',
          type: 'normal',
          power: 150,
          accuracy: 90,
          pp: 5,
          currentPp: 5,
          category: 'special'
        }
      ]
    }))
  }

  const handleTeamSelect = (team: SavedTeam) => {
    const battleTeam = convertToBattleTeam(team)
    onTeamSelected(battleTeam)
  }

  const generateRandomTeam = () => {
    // Create a simple random team for testing
    const randomTeam: BattlePokemon[] = [
      {
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        level: 50,
        currentHp: 100,
        maxHp: 100,
        stats: {
          hp: 100,
          attack: 90,
          defense: 70,
          'special-attack': 110,
          'special-defense': 80,
          speed: 120
        },
        moves: [
          {
            id: 1,
            name: 'Thunderbolt',
            type: 'electric',
            power: 90,
            accuracy: 100,
            pp: 15,
            currentPp: 15,
            category: 'special'
          },
          {
            id: 2,
            name: 'Quick Attack',
            type: 'normal',
            power: 40,
            accuracy: 100,
            pp: 30,
            currentPp: 30,
            category: 'physical'
          },
          {
            id: 3,
            name: 'Iron Tail',
            type: 'steel',
            power: 100,
            accuracy: 75,
            pp: 15,
            currentPp: 15,
            category: 'physical'
          },
          {
            id: 4,
            name: 'Agility',
            type: 'psychic',
            power: 0,
            accuracy: 100,
            pp: 30,
            currentPp: 30,
            category: 'status'
          }
        ]
      }
    ]
    onTeamSelected(randomTeam)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Select Your Team</h2>
            <p className="text-gray-600">Choose a team for battle</p>
          </div>
        </div>
      </div>

      {/* Quick Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={generateRandomTeam}>
          <CardContent className="p-6 text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
            <p className="text-sm text-gray-600">Use a pre-made team to start battling immediately</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
          <CardContent className="p-6 text-center">
            <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Build New Team</h3>
            <p className="text-sm text-gray-600">Create a new team from scratch</p>
            <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Import Team</h3>
            <p className="text-sm text-gray-600">Import a team from a battle code</p>
            <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Saved Teams */}
      {savedTeams.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Saved Teams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onSelect={() => handleTeamSelect(team)}
                isSelected={selectedTeam?.id === team.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* No teams message */}
      {savedTeams.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Saved Teams</h3>
                         <p className="text-gray-500 mb-6">
               You haven&apos;t created any teams yet. Build your first team in the Team Builder!
             </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={generateRandomTeam}>
                Use Quick Start Team
              </Button>
              <Button variant="outline" asChild>
                <a href="/teams">Go to Team Builder</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TeamCard({ 
  team, 
  onSelect, 
  isSelected 
}: { 
  team: SavedTeam
  onSelect: () => void
  isSelected: boolean
}) {
  return (
    <Card className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{team.name}</CardTitle>
        <p className="text-sm text-gray-600">
          {team.pokemon.length} Pokémon • Created {new Date(team.createdAt).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        {/* Pokemon preview */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {team.pokemon.slice(0, 6).map((pokemon, index) => (
            <div key={index} className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center relative">
              <div className="w-8 h-8 relative">
                <Image
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
            </div>
          ))}
          {Array.from({ length: 6 - team.pokemon.length }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300" />
          ))}
        </div>

        <Button 
          onClick={onSelect}
          className="w-full"
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? 'Selected' : 'Select Team'}
        </Button>
      </CardContent>
    </Card>
  )
} 