// Battle System Types

export interface BattlePokemon {
  id: number
  name: string
  types: string[]
  sprite: string
  level: number
  currentHp: number
  maxHp: number
  stats: {
    hp: number
    attack: number
    defense: number
    'special-attack': number
    'special-defense': number
    speed: number
  }
  moves: BattleMove[]
  status?: StatusCondition
}

export interface BattleMove {
  id: number
  name: string
  type: string
  power: number
  accuracy: number
  pp: number
  currentPp: number
  category: 'physical' | 'special' | 'status'
  description?: string
}

export interface StatusCondition {
  type: 'poison' | 'burn' | 'freeze' | 'paralysis' | 'sleep' | 'confusion'
  turnsRemaining?: number
}

export interface BattleState {
  phase: 'setup' | 'team-selection' | 'battle' | 'result'
  turn: number
  currentPlayer: 'player' | 'opponent'
  playerTeam: BattlePokemon[]
  opponentTeam: BattlePokemon[]
  activePokemon: {
    player: BattlePokemon | null
    opponent: BattlePokemon | null
  }
  battleLog: string[]
  winner?: 'player' | 'opponent' | 'draw'
}

export interface BattleSetupConfig {
  battleType: 'single' | 'double' | 'triple'
  opponentType: 'ai' | 'random' | 'custom'
  difficulty: 'easy' | 'medium' | 'hard'
  rules: {
    levelCap?: number
    allowLegendaries: boolean
    turnTimeLimit?: number
  }
}

export interface BattleAction {
  type: 'move' | 'switch' | 'item' | 'run'
  moveId?: number
  targetPokemonIndex?: number
  itemId?: number
}

export interface DamageCalculation {
  damage: number
  isCritical: boolean
  effectiveness: number
  message: string
}

export interface BattleResult {
  winner: 'player' | 'opponent' | 'draw'
  turns: number
  playerPokemonRemaining: number
  opponentPokemonRemaining: number
  experienceGained: number
  battleLog: string[]
} 