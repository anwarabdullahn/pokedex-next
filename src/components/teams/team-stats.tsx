'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Sword, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { PokemonTypeName } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'

interface TeamStats {
  totalPokemon: number
  uniqueTypes: string[]
  averageStats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
  typeWeaknesses: string[]
  typeResistances: string[]
  teamBalance: 'Poor' | 'Fair' | 'Good' | 'Excellent'
}

// Type effectiveness data (simplified)
const TYPE_EFFECTIVENESS = {
  fire: { weakTo: ['water', 'ground', 'rock'], resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
  water: { weakTo: ['electric', 'grass'], resistantTo: ['fire', 'water', 'ice', 'steel'] },
  electric: { weakTo: ['ground'], resistantTo: ['electric', 'flying', 'steel'] },
  grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resistantTo: ['water', 'electric', 'grass', 'ground'] },
  // Add more as needed...
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

export function TeamStats() {
  const [teams, setTeams] = useState<Array<{id: number, name: string, pokemon: Array<{types: string[]}>, createdAt: string}>>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)

  // Load teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('pokemon-teams')
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams)
        setTeams(parsedTeams)
        if (parsedTeams.length > 0 && !selectedTeamId) {
          setSelectedTeamId(parsedTeams[0].id)
        }
      } catch (error) {
        console.error('Error parsing saved teams:', error)
      }
    }
  }, [selectedTeamId])

  const selectedTeam = teams.find(team => team.id === selectedTeamId)

  const teamStats = useMemo((): TeamStats | null => {
    if (!selectedTeam) return null

    const uniqueTypes = new Set(selectedTeam.pokemon.flatMap((p) => p.types))
    
    // Calculate team balance based on type diversity and coverage
    let balance: TeamStats['teamBalance'] = 'Poor'
    if (uniqueTypes.size >= 8) balance = 'Excellent'
    else if (uniqueTypes.size >= 6) balance = 'Good'
    else if (uniqueTypes.size >= 4) balance = 'Fair'

    return {
      totalPokemon: selectedTeam.pokemon.length,
      uniqueTypes: Array.from(uniqueTypes),
      averageStats: {
        hp: 85, // Placeholder - would calculate from real data
        attack: 90,
        defense: 80,
        speed: 88
      },
      typeWeaknesses: ['electric', 'ice'], // Simplified analysis
      typeResistances: ['fire', 'water', 'grass'],
      teamBalance: balance
    }
  }, [selectedTeam])

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-2">No Teams to Analyze</h3>
            <p className="text-sm">
              Create and save teams to see detailed statistics and analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!teamStats) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <h3 className="text-lg font-semibold mb-2">Select a Team</h3>
            <p className="text-sm">Choose a team from your saved teams to analyze.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Team Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Team to Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedTeamId === team.id 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {team.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{teamStats.totalPokemon}</div>
            <div className="text-sm text-gray-600">Team Size</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{teamStats.uniqueTypes.length}</div>
            <div className="text-sm text-gray-600">Unique Types</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${
              teamStats.teamBalance === 'Excellent' ? 'text-green-600' :
              teamStats.teamBalance === 'Good' ? 'text-blue-600' :
              teamStats.teamBalance === 'Fair' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {teamStats.teamBalance}
            </div>
            <div className="text-sm text-gray-600">Balance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((teamStats.averageStats.hp + teamStats.averageStats.attack + 
                          teamStats.averageStats.defense + teamStats.averageStats.speed) / 4)}
            </div>
            <div className="text-sm text-gray-600">Avg Stats</div>
          </CardContent>
        </Card>
      </div>

      {/* Type Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Type Coverage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Types in Team ({teamStats.uniqueTypes.length}/18)
            </div>
            <div className="flex flex-wrap gap-2">
              {teamStats.uniqueTypes.map(type => (
                <Badge 
                  key={type}
                  className={typeBadgeVariants({ type: type as PokemonTypeName })}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Common Weaknesses
              </div>
              <div className="flex flex-wrap gap-1">
                {teamStats.typeWeaknesses.map(type => (
                  <Badge 
                    key={type}
                    variant="destructive"
                    className="text-xs"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Strong Resistances
              </div>
              <div className="flex flex-wrap gap-1">
                {teamStats.typeResistances.map(type => (
                  <Badge 
                    key={type}
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Team Average Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(teamStats.averageStats).map(([stat, value]) => (
            <div key={stat} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-medium">{stat}</span>
                <span>{value}</span>
              </div>
              <Progress value={(value / 150) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamStats.teamBalance === 'Poor' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Consider adding more type diversity to improve team balance.
                </AlertDescription>
              </Alert>
            )}
            
            {teamStats.totalPokemon < 6 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your team has {6 - teamStats.totalPokemon} empty slots. Fill them for maximum effectiveness.
                </AlertDescription>
              </Alert>
            )}

            {teamStats.typeWeaknesses.length > 2 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your team is vulnerable to {teamStats.typeWeaknesses.join(', ')} types. 
                  Consider adding resistant Pokémon.
                </AlertDescription>
              </Alert>
            )}

            {teamStats.teamBalance === 'Excellent' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Excellent type coverage! Your team is well-balanced for competitive play.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 