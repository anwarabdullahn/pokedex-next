import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PokemonStat } from '@/lib/types/pokemon'

interface PokemonStatsProps {
  stats: PokemonStat[]
  className?: string
}

// Helper function to get stat color based on value
function getStatColor(value: number): string {
  if (value >= 120) return 'bg-green-500'
  if (value >= 90) return 'bg-blue-500'
  if (value >= 60) return 'bg-yellow-500'
  if (value >= 30) return 'bg-orange-500'
  return 'bg-red-500'
}

// Helper function to format stat names
function formatStatName(statName: string): string {
  const statMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed'
  }
  return statMap[statName] || statName
}

export function PokemonStats({ stats, className }: PokemonStatsProps) {
  // Calculate total stats
  const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  const maxStat = Math.max(...stats.map(stat => stat.base_stat))
  const minStat = Math.min(...stats.map(stat => stat.base_stat))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Base Stats</span>
          <span className="text-sm font-normal text-gray-600">
            Total: {totalStats}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => {
          const percentage = (stat.base_stat / 255) * 100 // 255 is theoretical max for most stats
          
          return (
            <div key={stat.stat.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium min-w-20">
                  {formatStatName(stat.stat.name)}
                </span>
                <span className="font-mono text-gray-600">
                  {stat.base_stat}
                </span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                {/* Custom colored overlay */}
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getStatColor(stat.base_stat)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )
        })}

        {/* Stats summary */}
        <div className="pt-4 border-t grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-green-600">{maxStat}</div>
            <div className="text-gray-600">Highest</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">{minStat}</div>
            <div className="text-gray-600">Lowest</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 