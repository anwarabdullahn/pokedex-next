import { useQuery } from '@tanstack/react-query'
import { 
  fetchPokemonList, 
  fetchPokemon, 
  fetchPokemonSpecies, 
  fetchFilteredPokemon,
  fetchEvolutionChain
} from '@/lib/api/pokemon'
import { useState, useEffect } from 'react'

// Simple debounce function inline
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for fetching Pokemon list with pagination
export function usePokemonList(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: () => fetchPokemonList(limit, offset),
  })
}

// Hook for fetching filtered Pokemon with search and type filtering
export function useFilteredPokemon(
  limit = 20, 
  offset = 0, 
  typeFilter?: string, 
  searchQuery?: string
) {
  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  return useQuery({
    queryKey: ['filtered-pokemon', limit, offset, typeFilter, debouncedSearchQuery],
    queryFn: () => fetchFilteredPokemon(limit, offset, typeFilter, debouncedSearchQuery),
  })
}

// Hook for fetching individual Pokemon
export function usePokemon(identifier: string | number) {
  return useQuery({
    queryKey: ['pokemon', identifier],
    queryFn: () => fetchPokemon(identifier),
    enabled: !!identifier,
  })
}

// Hook for fetching Pokemon species data
export function usePokemonSpecies(id: number) {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
    enabled: !!id,
  })
}

// Hook for fetching evolution chain
export function useEvolutionChain(evolutionChainUrl?: string) {
  return useQuery({
    queryKey: ['evolution-chain', evolutionChainUrl],
    queryFn: () => fetchEvolutionChain(evolutionChainUrl!),
    enabled: !!evolutionChainUrl,
  })
} 