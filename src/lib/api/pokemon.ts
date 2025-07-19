import { Pokemon, PokemonListItem, PaginatedResponse, SimplePokemon, Type } from '@/lib/types/pokemon'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

// Fetch list of Pokemon with pagination
export async function fetchPokemonList(
  limit = 20,
  offset = 0
): Promise<PaginatedResponse<PokemonListItem>> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list')
  }
  
  return response.json()
}

// Fetch all Pokemon (for better filtering) - cached heavily
export async function fetchAllPokemon(): Promise<PaginatedResponse<PokemonListItem>> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=10000`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch all Pokemon')
  }
  
  return response.json()
}

// Fetch Pokemon by type
export async function fetchPokemonByType(typeName: string): Promise<Type> {
  const response = await fetch(`${POKEAPI_BASE_URL}/type/${typeName}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon of type: ${typeName}`)
  }
  
  return response.json()
}

// Fetch detailed Pokemon data by ID or name
export async function fetchPokemon(identifier: string | number): Promise<Pokemon> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${identifier}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${identifier}`)
  }
  
  return response.json()
}

// Fetch Pokemon species data (for descriptions, evolution chain, etc.)
export async function fetchPokemonSpecies(id: number) {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species: ${id}`)
  }
  
  return response.json()
}

// Fetch evolution chain
export async function fetchEvolutionChain(url: string) {
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to fetch evolution chain')
  }
  
  return response.json()
}

// Helper function to get Pokemon ID from URL
export function getPokemonIdFromUrl(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//)
  return matches ? parseInt(matches[1], 10) : 0
}

// Transform Pokemon data to simplified format for lists
export function transformToSimplePokemon(pokemon: Pokemon): SimplePokemon {
  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.other?.['official-artwork']?.front_default || 
            pokemon.sprites.front_default || 
            '/placeholder-pokemon.png',
    types: pokemon.types.map(type => type.type.name)
  }
}

// Fetch multiple Pokemon details for a list (used for homepage)
export async function fetchPokemonBatch(pokemonList: PokemonListItem[]): Promise<SimplePokemon[]> {
  const promises = pokemonList.map(async (item) => {
    const id = getPokemonIdFromUrl(item.url)
    const pokemon = await fetchPokemon(id)
    return transformToSimplePokemon(pokemon)
  })
  
  return Promise.all(promises)
}

// NEW: Get paginated Pokemon with proper type filtering
export async function fetchFilteredPokemon(
  limit = 20,
  offset = 0,
  typeFilter?: string,
  searchQuery?: string
): Promise<{ pokemon: SimplePokemon[], total: number, hasMore: boolean }> {
  
  // If no filters, use simple pagination
  if (!typeFilter || typeFilter === 'all') {
    const response = await fetchPokemonList(limit, offset)
    const pokemonData = await fetchPokemonBatch(response.results)
    
    // Apply search filter if provided
    let filteredPokemon = pokemonData
    if (searchQuery) {
      filteredPokemon = pokemonData.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.id.toString().includes(searchQuery)
      )
    }
    
    return {
      pokemon: filteredPokemon,
      total: response.count,
      hasMore: !!response.next
    }
  }
  
  // For type filtering, get all Pokemon of that type first
  const typeData = await fetchPokemonByType(typeFilter)
  const typePokemonList = typeData.pokemon.map(p => ({
    name: p.pokemon.name,
    url: p.pokemon.url
  }))
  
  // Apply search filter to type results
  let filteredList = typePokemonList
  if (searchQuery) {
    filteredList = typePokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  // Apply pagination to filtered results
  const paginatedList = filteredList.slice(offset, offset + limit)
  const pokemonData = await fetchPokemonBatch(paginatedList)
  
  return {
    pokemon: pokemonData,
    total: filteredList.length,
    hasMore: offset + limit < filteredList.length
  }
}

// Search Pokemon by name (client-side filtering for now)
export function searchPokemonByName(pokemonList: SimplePokemon[], query: string): SimplePokemon[] {
  if (!query.trim()) return pokemonList
  
  const lowercaseQuery = query.toLowerCase()
  return pokemonList.filter(pokemon => 
    pokemon.name.toLowerCase().includes(lowercaseQuery) ||
    pokemon.id.toString().includes(query)
  )
}

// Filter Pokemon by type
export function filterPokemonByType(pokemonList: SimplePokemon[], type: string): SimplePokemon[] {
  if (!type || type === 'all') return pokemonList
  
  return pokemonList.filter(pokemon => 
    pokemon.types.includes(type.toLowerCase())
  )
} 