'use client'

import { useFilteredPokemon } from '@/lib/hooks/use-pokemon'
import { PokemonCard, PokemonCardSkeleton } from './pokemon-card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

interface PokemonGridProps {
  searchQuery?: string
  typeFilter?: string
  className?: string
}

export function PokemonGrid({ searchQuery, typeFilter, className }: PokemonGridProps) {
  const [limit] = useState(20)
  const [offset, setOffset] = useState(0)

  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useFilteredPokemon(limit, offset, typeFilter, searchQuery)

  const pokemonList = data?.pokemon || []
  const total = data?.total || 0
  const hasMore = data?.hasMore || false

  // Show types when we have search/filter
  const hasFilters = !!(searchQuery || (typeFilter && typeFilter !== 'all'))
  const showTypes = hasFilters

  const handleLoadMore = () => {
    setOffset(prev => prev + limit)
  }

  const handleLoadPrevious = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }

  // Reset offset when filters change
  const resetPagination = () => {
    setOffset(0)
  }

  // Reset pagination when search or type filter changes
  useEffect(() => {
    resetPagination()
  }, [searchQuery, typeFilter])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold">Failed to load Pokemon</h3>
        <p className="text-gray-600 text-center max-w-md">
          There was an error loading the Pokemon data. Please check your internet connection and try again.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Results summary */}
      {!isLoading && (
        <div className="mb-4 text-sm text-gray-600">
          {typeFilter && typeFilter !== 'all' ? (
            <span>
              Showing {offset + 1}-{Math.min(offset + limit, total)} of {total} {typeFilter} type Pokemon
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          ) : (
            <span>
              Showing {offset + 1}-{Math.min(offset + pokemonList.length, total)} of {total} Pokemon
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          )}
        </div>
      )}



      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Loading skeletons */}
        {isLoading && 
          Array.from({ length: limit }).map((_, index) => (
            <PokemonCardSkeleton key={index} />
          ))
        }

        {/* Pokemon cards */}
        {pokemonList.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon} 
            showTypes={showTypes}
          />
        ))}
      </div>

      {/* No results message */}
      {!isLoading && pokemonList.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No Pokemon found</h3>
          <p className="text-gray-600">
            {searchQuery || (typeFilter && typeFilter !== 'all')
              ? "Try adjusting your search or filter criteria."
              : "No Pokemon data available."
            }
          </p>
        </div>
      )}

      {/* Pagination controls */}
      {!isLoading && pokemonList.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button 
            onClick={handleLoadPrevious}
            disabled={offset === 0}
            variant="outline"
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
          </span>
          
          <Button 
            onClick={handleLoadMore}
            disabled={!hasMore}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 