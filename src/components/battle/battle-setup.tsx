'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Play, Bot, Users, Shuffle, Settings, Swords } from 'lucide-react'
import { BattleSetupConfig } from '@/lib/types/battle'

interface BattleSetupProps {
  onStartBattle: (config: BattleSetupConfig) => void
}

export function BattleSetup({ onStartBattle }: BattleSetupProps) {
  const [config, setConfig] = useState<BattleSetupConfig>({
    battleType: 'single',
    opponentType: 'ai',
    difficulty: 'medium',
    rules: {
      levelCap: 50,
      allowLegendaries: false,
      turnTimeLimit: 30
    }
  })

  const handleStartBattle = () => {
    onStartBattle(config)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Battle Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Battle Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Battle Format */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Battle Format</Label>
            <RadioGroup
              value={config.battleType}
              onValueChange={(value: 'single' | 'double' | 'triple') => 
                setConfig(prev => ({ ...prev, battleType: value }))
              }
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="flex-1 cursor-pointer">
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="font-semibold">Single Battle</div>
                    <div className="text-sm text-gray-600">1v1 Pokemon battle</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <RadioGroupItem value="double" id="double" disabled />
                <Label htmlFor="double" className="flex-1 cursor-not-allowed">
                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold">Double Battle</div>
                    <div className="text-sm text-gray-600">2v2 Pokemon battle</div>
                    <Badge variant="secondary" className="text-xs mt-1">Coming Soon</Badge>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <RadioGroupItem value="triple" id="triple" disabled />
                <Label htmlFor="triple" className="flex-1 cursor-not-allowed">
                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold">Triple Battle</div>
                    <div className="text-sm text-gray-600">3v3 Pokemon battle</div>
                    <Badge variant="secondary" className="text-xs mt-1">Coming Soon</Badge>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Opponent Type */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Opponent</Label>
            <RadioGroup
              value={config.opponentType}
              onValueChange={(value: 'ai' | 'random' | 'custom') => 
                setConfig(prev => ({ ...prev, opponentType: value }))
              }
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai" id="ai" />
                <Label htmlFor="ai" className="flex-1 cursor-pointer">
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <Bot className="w-6 h-6 mb-2 text-blue-500" />
                    <div className="font-semibold">AI Trainer</div>
                    <div className="text-sm text-gray-600">Smart AI opponent</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random" className="flex-1 cursor-pointer">
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <Shuffle className="w-6 h-6 mb-2 text-green-500" />
                    <div className="font-semibold">Random Team</div>
                    <div className="text-sm text-gray-600">Random Pokemon team</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <RadioGroupItem value="custom" id="custom" disabled />
                <Label htmlFor="custom" className="flex-1 cursor-not-allowed">
                  <div className="p-4 border rounded-lg">
                    <Users className="w-6 h-6 mb-2 text-purple-500" />
                    <div className="font-semibold">Custom Team</div>
                    <div className="text-sm text-gray-600">Build opponent team</div>
                    <Badge variant="secondary" className="text-xs mt-1">Coming Soon</Badge>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Difficulty */}
          {config.opponentType === 'ai' && (
            <div>
              <Label className="text-base font-semibold mb-3 block">AI Difficulty</Label>
              <RadioGroup
                value={config.difficulty}
                onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                  setConfig(prev => ({ ...prev, difficulty: value }))
                }
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy" className="flex-1 cursor-pointer">
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="font-semibold text-green-600">Easy</div>
                      <div className="text-sm text-gray-600">Beginner friendly</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="flex-1 cursor-pointer">
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="font-semibold text-yellow-600">Medium</div>
                      <div className="text-sm text-gray-600">Balanced challenge</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard" className="flex-1 cursor-pointer">
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="font-semibold text-red-600">Hard</div>
                      <div className="text-sm text-gray-600">Competitive level</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Battle Rules */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Battle Rules</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">Allow Legendary Pokémon</div>
                  <div className="text-sm text-gray-600">Include legendary Pokemon in battles</div>
                </div>
                                 <Switch
                   checked={config.rules.allowLegendaries}
                   onCheckedChange={(checked: boolean) => 
                     setConfig(prev => ({
                       ...prev,
                       rules: { ...prev.rules, allowLegendaries: checked }
                     }))
                   }
                 />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">Level Cap: {config.rules.levelCap}</div>
                  <div className="text-sm text-gray-600">Maximum Pokemon level</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      rules: { ...prev.rules, levelCap: Math.max(1, (prev.rules.levelCap || 50) - 10) }
                    }))}
                  >
                    -10
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      rules: { ...prev.rules, levelCap: Math.min(100, (prev.rules.levelCap || 50) + 10) }
                    }))}
                  >
                    +10
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Start Battle Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleStartBattle}
              size="lg" 
              className="w-full flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Battle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Battle Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
          setConfig({
            battleType: 'single',
            opponentType: 'ai',
            difficulty: 'easy',
            rules: { levelCap: 30, allowLegendaries: false }
          })
          onStartBattle({
            battleType: 'single',
            opponentType: 'ai',
            difficulty: 'easy',
            rules: { levelCap: 30, allowLegendaries: false }
          })
        }}>
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="font-semibold">Quick Battle</div>
            <div className="text-sm text-gray-600">Easy AI • Level 30</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
          setConfig({
            battleType: 'single',
            opponentType: 'random',
            difficulty: 'medium',
            rules: { levelCap: 50, allowLegendaries: false }
          })
          onStartBattle({
            battleType: 'single',
            opponentType: 'random',
            difficulty: 'medium',
            rules: { levelCap: 50, allowLegendaries: false }
          })
        }}>
          <CardContent className="p-4 text-center">
            <Shuffle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="font-semibold">Random Battle</div>
            <div className="text-sm text-gray-600">Random Team • Level 50</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
          setConfig({
            battleType: 'single',
            opponentType: 'ai',
            difficulty: 'hard',
            rules: { levelCap: 100, allowLegendaries: true }
          })
          onStartBattle({
            battleType: 'single',
            opponentType: 'ai',
            difficulty: 'hard',
            rules: { levelCap: 100, allowLegendaries: true }
          })
        }}>
          <CardContent className="p-4 text-center">
            <Swords className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="font-semibold">Challenge Mode</div>
            <div className="text-sm text-gray-600">Hard AI • Level 100</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 