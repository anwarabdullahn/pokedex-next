'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Swords, Shield, Zap, Sparkles } from 'lucide-react'
import { BattlePokemon, BattleResult } from '@/lib/types/battle'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface BattleArenaProps {
  playerTeam: BattlePokemon[]
  opponentTeam: BattlePokemon[]
  onBattleEnd: (result: BattleResult) => void
  onBack: () => void
}

export function BattleArena({ playerTeam, opponentTeam, onBattleEnd, onBack }: BattleArenaProps) {
  const [currentPlayerPokemon, setCurrentPlayerPokemon] = useState<BattlePokemon | null>(
    playerTeam.length > 0 ? playerTeam[0] : null
  )
  const [currentOpponentPokemon, setCurrentOpponentPokemon] = useState<BattlePokemon | null>(
    // Generate simple opponent Pokemon for now
    {
      id: 6,
      name: 'charizard',
      types: ['fire', 'flying'],
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      level: 50,
      currentHp: 150,
      maxHp: 150,
      stats: {
        hp: 150,
        attack: 120,
        defense: 90,
        'special-attack': 130,
        'special-defense': 100,
        speed: 110
      },
      moves: [
        {
          id: 1,
          name: 'Flamethrower',
          type: 'fire',
          power: 90,
          accuracy: 100,
          pp: 15,
          currentPp: 15,
          category: 'special'
        },
        {
          id: 2,
          name: 'Dragon Claw',
          type: 'dragon',
          power: 80,
          accuracy: 100,
          pp: 15,
          currentPp: 15,
          category: 'physical'
        },
        {
          id: 3,
          name: 'Air Slash',
          type: 'flying',
          power: 75,
          accuracy: 95,
          pp: 15,
          currentPp: 15,
          category: 'special'
        },
        {
          id: 4,
          name: 'Roost',
          type: 'flying',
          power: 0,
          accuracy: 100,
          pp: 10,
          currentPp: 10,
          category: 'status'
        }
      ]
    }
  )
  const [battleLog, setBattleLog] = useState<string[]>(['Battle started!'])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [damageAnimation, setDamageAnimation] = useState<{target: 'player' | 'opponent', damage: number} | null>(null)
  const [moveAnimation, setMoveAnimation] = useState<{move: string, type: string} | null>(null)
  const [shakeTarget, setShakeTarget] = useState<'player' | 'opponent' | null>(null)

  const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon, moveIndex: number): number => {
    const move = attacker.moves[moveIndex]
    if (!move || move.power === 0) return 0

    // Simple damage calculation (will be enhanced later)
    const attackStat = move.category === 'physical' ? attacker.stats.attack : attacker.stats['special-attack']
    const defenseStat = move.category === 'physical' ? defender.stats.defense : defender.stats['special-defense']
    
    const baseDamage = Math.floor(
      ((2 * attacker.level / 5 + 2) * move.power * attackStat / defenseStat / 50 + 2)
    )
    
    // Add some randomness
    const randomFactor = Math.random() * 0.15 + 0.85 // 85-100%
    return Math.floor(baseDamage * randomFactor)
  }

  const handlePlayerMove = async (moveIndex: number) => {
    if (!currentPlayerPokemon || !currentOpponentPokemon || !isPlayerTurn || isAnimating) return

    setIsAnimating(true)
    const move = currentPlayerPokemon.moves[moveIndex]
    
    // Show move animation
    setMoveAnimation({ move: move.name, type: move.type })
    setBattleLog(prev => [...prev, `${currentPlayerPokemon.name} used ${move.name}!`])
    
    // Wait for move animation
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMoveAnimation(null)
    
    const damage = calculateDamage(currentPlayerPokemon, currentOpponentPokemon, moveIndex)
    
    if (damage > 0) {
      // Show damage animation
      setDamageAnimation({ target: 'opponent', damage })
      setShakeTarget('opponent')
      
      // Wait for damage animation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Apply damage with animation
      const newOpponentHp = Math.max(0, currentOpponentPokemon.currentHp - damage)
      setCurrentOpponentPokemon(prev => prev ? { ...prev, currentHp: newOpponentHp } : null)
      
      setBattleLog(prev => [...prev, `It dealt ${damage} damage!`])
      
      // Clear animations
      setDamageAnimation(null)
      setShakeTarget(null)
      
      // Check if opponent fainted
      if (newOpponentHp === 0) {
        setBattleLog(prev => [...prev, `${currentOpponentPokemon.name} fainted!`])
        setIsAnimating(false)
        
        // Battle won
        setTimeout(() => {
          onBattleEnd({
            winner: 'player',
            turns: battleLog.length,
            playerPokemonRemaining: 1,
            opponentPokemonRemaining: 0,
            experienceGained: 100,
            battleLog: battleLog
          })
        }, 2000)
        return
      }
    } else {
      setBattleLog(prev => [...prev, 'It had no effect!'])
    }

    setIsAnimating(false)
    setIsPlayerTurn(false)
    
    // AI turn
    setTimeout(() => {
      handleAIMove()
    }, 1000)
  }

  const handleAIMove = async () => {
    if (!currentOpponentPokemon || !currentPlayerPokemon) return

    setIsAnimating(true)
    
    // Simple AI: choose random move
    const moveIndex = Math.floor(Math.random() * currentOpponentPokemon.moves.length)
    const move = currentOpponentPokemon.moves[moveIndex]
    
    // Show move animation
    setMoveAnimation({ move: move.name, type: move.type })
    setBattleLog(prev => [...prev, `${currentOpponentPokemon.name} used ${move.name}!`])
    
    // Wait for move animation
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMoveAnimation(null)
    
    const damage = calculateDamage(currentOpponentPokemon, currentPlayerPokemon, moveIndex)
    
    if (damage > 0) {
      // Show damage animation
      setDamageAnimation({ target: 'player', damage })
      setShakeTarget('player')
      
      // Wait for damage animation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Apply damage
      const newPlayerHp = Math.max(0, currentPlayerPokemon.currentHp - damage)
      setCurrentPlayerPokemon(prev => prev ? { ...prev, currentHp: newPlayerHp } : null)
      
      setBattleLog(prev => [...prev, `It dealt ${damage} damage!`])
      
      // Clear animations
      setDamageAnimation(null)
      setShakeTarget(null)

      // Check if player fainted
      if (newPlayerHp === 0) {
        setBattleLog(prev => [...prev, `${currentPlayerPokemon.name} fainted!`])
        setIsAnimating(false)
        
        // Battle lost
        setTimeout(() => {
          onBattleEnd({
            winner: 'opponent',
            turns: battleLog.length,
            playerPokemonRemaining: 0,
            opponentPokemonRemaining: 1,
            experienceGained: 0,
            battleLog: battleLog
          })
        }, 2000)
        return
      }
    } else {
      setBattleLog(prev => [...prev, 'It had no effect!'])
    }

    setIsAnimating(false)
    setIsPlayerTurn(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Battle Arena</h2>
          <p className="text-sm text-gray-600">Turn {Math.floor(battleLog.length / 2) + 1}</p>
        </div>
        <div></div>
      </div>

      {/* Battle Field */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opponent Pokemon */}
        <Card>
          <CardContent className="p-6 relative">
            <div className="text-center">
              <Badge variant="destructive" className="mb-2">Opponent</Badge>
              <h3 className="text-xl font-bold capitalize mb-2">
                {currentOpponentPokemon?.name} (Lv.{currentOpponentPokemon?.level})
              </h3>
              
              {/* HP Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>HP</span>
                  <span>
                    {currentOpponentPokemon?.currentHp}/{currentOpponentPokemon?.maxHp}
                  </span>
                </div>
                <Progress 
                  value={currentOpponentPokemon ? 
                    (currentOpponentPokemon.currentHp / currentOpponentPokemon.maxHp) * 100 : 0
                  }
                  className="h-3"
                />
              </div>

              {/* Pokemon Image with animations */}
              <motion.div 
                className="w-48 h-48 mx-auto relative mb-4"
                animate={shakeTarget === 'opponent' ? {
                  x: [-5, 5, -5, 5, 0],
                  transition: { duration: 0.5 }
                } : {}}
              >
                {currentOpponentPokemon && (
                  <Image
                    src={currentOpponentPokemon.sprite}
                    alt={currentOpponentPokemon.name}
                    fill
                    className="object-contain"
                    sizes="192px"
                  />
                )}
              </motion.div>

              {/* Types */}
              <div className="flex justify-center gap-2">
                {currentOpponentPokemon?.types.map(type => (
                  <Badge key={type} variant="outline" className="capitalize">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Damage Animation */}
            <AnimatePresence>
              {damageAnimation?.target === 'opponent' && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.5 }}
                  animate={{ opacity: 1, y: -40, scale: 1 }}
                  exit={{ opacity: 0, y: -60, scale: 0.5 }}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold shadow-lg"
                >
                  -{damageAnimation.damage}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Player Pokemon */}
        <Card>
          <CardContent className="p-6 relative">
            <div className="text-center">
              <Badge className="mb-2">Your Pokemon</Badge>
              <h3 className="text-xl font-bold capitalize mb-2">
                {currentPlayerPokemon?.name} (Lv.{currentPlayerPokemon?.level})
              </h3>
              
              {/* HP Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>HP</span>
                  <span>
                    {currentPlayerPokemon?.currentHp}/{currentPlayerPokemon?.maxHp}
                  </span>
                </div>
                <Progress 
                  value={currentPlayerPokemon ? 
                    (currentPlayerPokemon.currentHp / currentPlayerPokemon.maxHp) * 100 : 0
                  }
                  className="h-3"
                />
              </div>

              {/* Pokemon Image with animations */}
              <motion.div 
                className="w-48 h-48 mx-auto relative mb-4"
                animate={shakeTarget === 'player' ? {
                  x: [-5, 5, -5, 5, 0],
                  transition: { duration: 0.5 }
                } : {}}
              >
                {currentPlayerPokemon && (
                  <Image
                    src={currentPlayerPokemon.sprite}
                    alt={currentPlayerPokemon.name}
                    fill
                    className="object-contain"
                    sizes="192px"
                  />
                )}
              </motion.div>

              {/* Types */}
              <div className="flex justify-center gap-2">
                {currentPlayerPokemon?.types.map(type => (
                  <Badge key={type} variant="outline" className="capitalize">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Damage Animation */}
            <AnimatePresence>
              {damageAnimation?.target === 'player' && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.5 }}
                  animate={{ opacity: 1, y: -40, scale: 1 }}
                  exit={{ opacity: 0, y: -60, scale: 0.5 }}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold shadow-lg"
                >
                  -{damageAnimation.damage}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Move Animation Overlay */}
      <AnimatePresence>
        {moveAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-lg p-6 shadow-xl text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              </motion.div>
              <h3 className="text-2xl font-bold capitalize mb-2">{moveAnimation.move}</h3>
              <Badge className="capitalize">{moveAnimation.type} Type</Badge>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battle Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moves */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Move</h3>
              <div className="grid grid-cols-2 gap-3">
                {currentPlayerPokemon?.moves.map((move, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      disabled={!isPlayerTurn || move.currentPp === 0 || isAnimating}
                      onClick={() => handlePlayerMove(index)}
                      className="h-auto p-4 text-left w-full"
                    >
                      <div>
                        <div className="font-semibold">{move.name}</div>
                        <div className="text-xs text-gray-500">
                          {move.type} • {move.power > 0 ? `${move.power} power` : 'Status'} • {move.currentPp}/{move.pp} PP
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {!isPlayerTurn && !isAnimating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center text-sm text-gray-600"
                >
                  Waiting for opponent...
                </motion.div>
              )}
              
              {isAnimating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center text-sm text-blue-600 font-semibold"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Battle in progress...
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Battle Log */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Battle Log
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto space-y-1">
                <AnimatePresence>
                  {battleLog.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-sm p-2 rounded ${
                        message.includes('used') ? 'bg-blue-100 text-blue-800' :
                        message.includes('damage') ? 'bg-red-100 text-red-800' :
                        message.includes('fainted') ? 'bg-gray-100 text-gray-800 font-semibold' :
                        'bg-white'
                      }`}
                    >
                      {message}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 