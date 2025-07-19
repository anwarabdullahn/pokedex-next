import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PokemonAbility } from '@/lib/types/pokemon'
import { Eye, EyeOff } from 'lucide-react'

interface PokemonAbilitiesProps {
  abilities: PokemonAbility[]
  className?: string
}

export function PokemonAbilities({ abilities, className }: PokemonAbilitiesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Abilities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {abilities.map((ability, index) => (
          <div key={`${ability.ability.name}-${index}`} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={ability.is_hidden ? "secondary" : "default"}
                className="capitalize"
              >
                {ability.is_hidden && <EyeOff className="w-3 h-3 mr-1" />}
                {!ability.is_hidden && <Eye className="w-3 h-3 mr-1" />}
                {ability.ability.name.replace('-', ' ')}
              </Badge>
              {ability.is_hidden && (
                <span className="text-xs text-gray-500">(Hidden Ability)</span>
              )}
            </div>
            
            {/* Placeholder for ability description - would fetch from ability endpoint */}
            <p className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
              {ability.is_hidden 
                ? "This is a hidden ability that can only be obtained through special means."
                : "A standard ability for this Pokemon species."
              }
            </p>
          </div>
        ))}
        
        {abilities.length === 0 && (
          <p className="text-gray-500 text-center py-4">No abilities data available</p>
        )}
      </CardContent>
    </Card>
  )
} 