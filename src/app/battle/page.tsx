'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Swords, Shield, Zap, Heart, Settings, Play } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { BattleArena } from '@/components/battle/battle-arena'
import { TeamSelection } from '@/components/battle/team-selection'
import { BattleSetup } from '@/components/battle/battle-setup'
import { BattleResultScreen } from '@/components/battle/battle-result'
import { BattlePokemon, BattleSetupConfig, BattleResult } from '@/lib/types/battle'

export default function BattlePage() {
  const [battleState, setBattleState] = useState<'setup' | 'team-selection' | 'battle' | 'result'>('setup')
  const [playerTeam, setPlayerTeam] = useState<BattlePokemon[]>([])
  const [opponentTeam, setOpponentTeam] = useState<BattlePokemon[]>([])
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Battle Arena</h1>
              <p className="text-gray-600">
                Challenge opponents in strategic Pokémon battles
              </p>
            </div>
          </div>
        </div>

        {/* Battle State Content */}
        {battleState === 'setup' && (
          <BattleSetup 
            onStartBattle={(setup: BattleSetupConfig) => {
              console.log('Battle setup:', setup)
              setBattleState('team-selection')
            }}
          />
        )}

        {battleState === 'team-selection' && (
          <TeamSelection
            onTeamSelected={(team: BattlePokemon[]) => {
              setPlayerTeam(team)
              setBattleState('battle')
            }}
            onBack={() => setBattleState('setup')}
          />
        )}

        {battleState === 'battle' && (
          <BattleArena
            playerTeam={playerTeam}
            opponentTeam={opponentTeam}
            onBattleEnd={(result: BattleResult) => {
              console.log('Battle result:', result)
              setBattleResult(result)
              setBattleState('result')
            }}
            onBack={() => setBattleState('team-selection')}
          />
        )}

        {battleState === 'result' && battleResult && (
          <BattleResultScreen
            result={battleResult}
            onBattleAgain={() => setBattleState('battle')}
            onNewBattle={() => setBattleState('setup')}
            onGoHome={() => window.location.href = '/'}
          />
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Swords className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-lg font-bold">0</div>
              <div className="text-xs text-gray-500">Battles Won</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold">0</div>
              <div className="text-xs text-gray-500">Battles Lost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-lg font-bold">0</div>
              <div className="text-xs text-gray-500">Total Battles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <div className="text-lg font-bold">-</div>
              <div className="text-xs text-gray-500">Win Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 