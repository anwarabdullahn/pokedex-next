import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SimplePokemon, PokemonTypeName } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// CVA for card hover effects - simplified without type-specific colors for homepage
const cardVariants = cva(
  "transition-all duration-200 hover:scale-105 cursor-pointer group hover:shadow-lg hover:shadow-blue-500/25"
)

interface PokemonCardProps {
  pokemon: SimplePokemon
  className?: string
}

export function PokemonCard({ pokemon, className }: PokemonCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling
    
    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      sprite: pokemon.sprite
    })
  }

  return (
    <div className="relative group">
      <Link href={`/pokemon/${pokemon.id}`}>
        <Card className={cn(cardVariants(), className)}>
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

                      {/* Consistent message for all cards */}
          <div className="flex gap-1 justify-center flex-wrap min-h-[1.5rem]">
            <div className="text-xs text-gray-500">
              Click to view details
            </div>
          </div>
          </CardContent>
        </Card>
      </Link>
      
      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavoriteClick}
        className={`absolute top-2 left-2 w-8 h-8 p-0 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
          isFavorite(pokemon.id) ? 'opacity-100' : ''
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorite(pokemon.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
      </Button>
    </div>
  )
}

// Separate component for type badges with CVA styling
function PokemonTypeBadges({ types }: { types: string[] }) {
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

  return (
    <>
      {types.map((type) => (
        <Badge
          key={type}
          className={typeBadgeVariants({ type: type as PokemonTypeName })}
          variant="secondary"
        >
          {type}
        </Badge>
      ))}
    </>
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
        </div>
      </CardContent>
    </Card>
  )
} 