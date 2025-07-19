import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SimplePokemon, PokemonTypeName } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

// CVA for Pokemon type badges - this is where CVA shines!
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

// CVA for card hover effects based on primary type
const cardVariants = cva(
  "transition-all duration-200 hover:scale-105 cursor-pointer group",
  {
    variants: {
      primaryType: {
        normal: "hover:shadow-lg hover:shadow-pokemon-normal/25",
        fire: "hover:shadow-lg hover:shadow-pokemon-fire/25",
        water: "hover:shadow-lg hover:shadow-pokemon-water/25",
        electric: "hover:shadow-lg hover:shadow-pokemon-electric/25",
        grass: "hover:shadow-lg hover:shadow-pokemon-grass/25",
        ice: "hover:shadow-lg hover:shadow-pokemon-ice/25",
        fighting: "hover:shadow-lg hover:shadow-pokemon-fighting/25",
        poison: "hover:shadow-lg hover:shadow-pokemon-poison/25",
        ground: "hover:shadow-lg hover:shadow-pokemon-ground/25",
        flying: "hover:shadow-lg hover:shadow-pokemon-flying/25",
        psychic: "hover:shadow-lg hover:shadow-pokemon-psychic/25",
        bug: "hover:shadow-lg hover:shadow-pokemon-bug/25",
        rock: "hover:shadow-lg hover:shadow-pokemon-rock/25",
        ghost: "hover:shadow-lg hover:shadow-pokemon-ghost/25",
        dragon: "hover:shadow-lg hover:shadow-pokemon-dragon/25",
        dark: "hover:shadow-lg hover:shadow-pokemon-dark/25",
        steel: "hover:shadow-lg hover:shadow-pokemon-steel/25",
        fairy: "hover:shadow-lg hover:shadow-pokemon-fairy/25",
      }
    },
    defaultVariants: {
      primaryType: "normal"
    }
  }
)

interface PokemonCardProps {
  pokemon: SimplePokemon
  className?: string
}

export function PokemonCard({ pokemon, className }: PokemonCardProps) {
  const primaryType = pokemon.types[0] as PokemonTypeName

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card className={cn(
        cardVariants({ primaryType }),
        className
      )}>
        <CardContent className="p-4">
          {/* Pokemon Image */}
          <div className="relative aspect-square mb-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
            <Image
              src={pokemon.sprite}
              alt={pokemon.name}
              fill
              className="object-contain p-2 group-hover:scale-110 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Pokemon ID Badge */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs font-mono">
                #{pokemon.id.toString().padStart(3, '0')}
              </Badge>
            </div>
          </div>

          {/* Pokemon Name */}
          <h3 className="font-semibold text-lg capitalize mb-2 text-center">
            {pokemon.name}
          </h3>

          {/* Type Badges - This is where CVA really shines! */}
          <div className="flex gap-1 justify-center flex-wrap">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                className={typeBadgeVariants({ type: type as PokemonTypeName })}
                variant="secondary"
              >
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Loading skeleton for Pokemon cards
export function PokemonCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="flex gap-1 justify-center">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
} 