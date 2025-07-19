'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Star, Swords, RotateCcw, Home } from 'lucide-react'
import { BattleResult } from '@/lib/types/battle'

interface BattleResultScreenProps {
  result: BattleResult
  onBattleAgain: () => void
  onNewBattle: () => void
  onGoHome: () => void
}

export function BattleResultScreen({ 
  result, 
  onBattleAgain, 
  onNewBattle, 
  onGoHome 
}: BattleResultScreenProps) {
  const isVictory = result.winner === 'player'
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4"
    >
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 text-center">
          {/* Victory/Defeat Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 200,
              delay: 0.2 
            }}
            className="mb-6"
          >
            {isVictory ? (
              <div className="relative">
                <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Star className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </div>
            ) : (
              <Swords className="w-24 h-24 mx-auto text-gray-500" />
            )}
          </motion.div>

          {/* Result Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className={`text-4xl font-bold mb-4 ${
              isVictory ? 'text-green-600' : 'text-red-600'
            }`}>
              {isVictory ? 'Victory!' : 'Defeat!'}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {isVictory 
                ? 'Congratulations! You won the battle!' 
                : 'Better luck next time! Keep training!'
              }
            </p>
          </motion.div>

          {/* Battle Statistics */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{result.turns}</div>
              <div className="text-sm text-blue-800">Turns</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {result.playerPokemonRemaining}
              </div>
              <div className="text-sm text-green-800">Your Pokémon</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                {result.opponentPokemonRemaining}
              </div>
              <div className="text-sm text-red-800">Opponent Pokémon</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {result.experienceGained}
              </div>
              <div className="text-sm text-purple-800">EXP Gained</div>
            </div>
          </motion.div>

          {/* Achievements */}
          {isVictory && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="mb-6"
            >
              <div className="flex justify-center gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Medal className="w-4 h-4" />
                  Battle Won
                </Badge>
                {result.turns <= 5 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Quick Victory
                  </Badge>
                )}
                {result.experienceGained >= 100 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    High EXP
                  </Badge>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={onBattleAgain} size="lg" className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Battle Again
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={onNewBattle} 
                variant="outline" 
                size="lg" 
                className="flex items-center gap-2"
              >
                <Swords className="w-5 h-5" />
                New Battle
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={onGoHome} 
                variant="outline" 
                size="lg" 
                className="flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Home
              </Button>
            </motion.div>
          </motion.div>

          {/* Confetti Animation for Victory */}
          {isVictory && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -100, 
                    x: Math.random() * window.innerWidth,
                    opacity: 1 
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    opacity: 0,
                    rotate: Math.random() * 360 
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 5 + 3
                  }}
                  className={`absolute w-3 h-3 ${
                    ['bg-yellow-400', 'bg-blue-400', 'bg-red-400', 'bg-green-400', 'bg-purple-400'][
                      Math.floor(Math.random() * 5)
                    ]
                  } rounded-full`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
} 