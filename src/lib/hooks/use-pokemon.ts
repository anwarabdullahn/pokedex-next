import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { 
  fetchPokemonList, 
  fetchPokemon, 
  fetchPokemonBatch, 
  fetchPokemonSpecies,
  fetchFilteredPokemon
} from '@/lib/api/pokemon'

// Hook for fetching Pokemon list with pagination
export function usePokemonList(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['pokemon-list', limit],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(limit, pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      const url = new URL(lastPage.next)
      return parseInt(url.searchParams.get('offset') || '0')
    },
    initialPageParam: 0,
  })
}

// Hook for fetching a single Pokemon's details
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

// Hook for fetching a batch of Pokemon (for displaying in grids)
export function usePokemonBatch(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['pokemon-batch', limit, offset],
    queryFn: async () => {
      const listResponse = await fetchPokemonList(limit, offset)
      return fetchPokemonBatch(listResponse.results)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// NEW: Hook for filtered Pokemon with proper pagination
export function useFilteredPokemon(
  limit = 20, 
  offset = 0, 
  typeFilter?: string, 
  searchQuery?: string
) {
  return useQuery({
    queryKey: ['filtered-pokemon', limit, offset, typeFilter, searchQuery],
    queryFn: () => fetchFilteredPokemon(limit, offset, typeFilter, searchQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Cache type-specific results longer since they don't change often
    gcTime: typeFilter && typeFilter !== 'all' ? 15 * 60 * 1000 : 10 * 60 * 1000,
  })
} 