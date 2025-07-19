import { Pokemon, PokemonListItem, PaginatedResponse, SimplePokemon, Type } from '@/lib/types/pokemon'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

// Cache for all Pokemon list (to avoid repeated fetches)
let allPokemonCache: PokemonListItem[] | null = null
// Cache for type data (to avoid repeated type fetches)
const typeDataCache: Record<string, Type> = {}

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
  
  const data = await response.json()
  // Cache the results
  allPokemonCache = data.results
  return data
}

// Get cached Pokemon list or fetch if not cached
export async function getAllPokemonList(): Promise<PokemonListItem[]> {
  if (allPokemonCache) {
    return allPokemonCache
  }
  
  const data = await fetchAllPokemon()
  return data.results
}

// Fetch Pokemon by type with caching
export async function fetchPokemonByType(typeName: string): Promise<Type> {
  if (typeDataCache[typeName]) {
    return typeDataCache[typeName]
  }
  
  const response = await fetch(`${POKEAPI_BASE_URL}/type/${typeName}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon of type: ${typeName}`)
  }
  
  const data = await response.json()
  typeDataCache[typeName] = data
  return data
}

// NEW: Get ALL Pokemon types data at once (for comprehensive type mapping)
export async function fetchAllTypesData(): Promise<Record<string, string[]>> {
  const typeNames = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]
  
  const typeMapping: Record<string, string[]> = {}
  
  // Fetch all types in parallel
  const typePromises = typeNames.map(async (typeName) => {
    const typeData = await fetchPokemonByType(typeName)
    return { typeName, typeData }
  })
  
  const typeResults = await Promise.all(typePromises)
  
  // Build reverse mapping: pokemon ID -> types
  typeResults.forEach(({ typeName, typeData }) => {
    typeData.pokemon.forEach((pokemonEntry) => {
      const pokemonId = getPokemonIdFromUrl(pokemonEntry.pokemon.url)
      if (!typeMapping[pokemonId]) {
        typeMapping[pokemonId] = []
      }
      typeMapping[pokemonId].push(typeName)
    })
  })
  
  return typeMapping
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

// OPTIMIZED: Create SimplePokemon from list data with types from type mapping
export function createSimplePokemonFromListItem(
  item: PokemonListItem, 
  typeMapping?: Record<string, string[]>
): SimplePokemon {
  const id = getPokemonIdFromUrl(item.url)
  return {
    id,
    name: item.name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    types: typeMapping?.[id] || [] // Use type mapping if available
  }
}

// OPTIMIZED: Fetch multiple Pokemon details ONLY when we need types for filtering
export async function fetchPokemonBatch(pokemonList: PokemonListItem[]): Promise<SimplePokemon[]> {
  // Only fetch if we actually need type information for filtering
  const promises = pokemonList.map(async (item) => {
    const id = getPokemonIdFromUrl(item.url)
    const pokemon = await fetchPokemon(id)
    return transformToSimplePokemon(pokemon)
  })
  
  return Promise.all(promises)
}

// NEW: Optimized batch creation with type mapping
export async function createPokemonBatchFromListWithTypes(
  pokemonList: PokemonListItem[]
): Promise<SimplePokemon[]> {
  // Get type mapping for these specific Pokemon
  const typeMapping = await fetchAllTypesData()
  return pokemonList.map(item => createSimplePokemonFromListItem(item, typeMapping))
}

// NEW: Optimized batch creation without types (super fast)
export function createPokemonBatchFromList(pokemonList: PokemonListItem[]): SimplePokemon[] {
  return pokemonList.map(item => createSimplePokemonFromListItem(item))
}

// NEW: Get paginated Pokemon with smart type loading
export async function fetchFilteredPokemon(
  limit = 20,
  offset = 0,
  typeFilter?: string,
  searchQuery?: string
): Promise<{ pokemon: SimplePokemon[], total: number, hasMore: boolean }> {
  
  // If we have search query, we need to search through ALL Pokemon
  if (searchQuery && searchQuery.trim()) {
    return handleSearchWithPagination(limit, offset, typeFilter, searchQuery.trim())
  }
  
  // If only type filter (no search), use type-specific endpoint
  if (typeFilter && typeFilter !== 'all') {
    return handleTypeFilterWithPagination(limit, offset, typeFilter)
  }
  
  // No filters - SUPER OPTIMIZED: use simple list without any type data
  const response = await fetchPokemonList(limit, offset)
  const pokemonData = createPokemonBatchFromList(response.results)
  
  return {
    pokemon: pokemonData,
    total: response.count,
    hasMore: !!response.next
  }
}

// Handle search functionality with proper pagination
async function handleSearchWithPagination(
  limit: number,
  offset: number,
  typeFilter?: string,
  searchQuery?: string
): Promise<{ pokemon: SimplePokemon[], total: number, hasMore: boolean }> {
  let pokemonList: PokemonListItem[]
  
  // If we also have a type filter, get Pokemon of that type first
  if (typeFilter && typeFilter !== 'all') {
    const typeData = await fetchPokemonByType(typeFilter)
    pokemonList = typeData.pokemon.map(p => ({
      name: p.pokemon.name,
      url: p.pokemon.url
    }))
  } else {
    // Get all Pokemon for search
    pokemonList = await getAllPokemonList()
  }
  
  // Filter by search query
  const filteredList = pokemonList.filter(pokemon => {
    const pokemonId = getPokemonIdFromUrl(pokemon.url)
    return (
      pokemon.name.toLowerCase().includes(searchQuery!.toLowerCase()) ||
      pokemonId.toString().includes(searchQuery!)
    )
  })
  
  // Apply pagination to filtered results
  const paginatedList = filteredList.slice(offset, offset + limit)
  
  // For search results, we need type information, so we fetch individual Pokemon
  const pokemonData = await fetchPokemonBatch(paginatedList)
  
  return {
    pokemon: pokemonData,
    total: filteredList.length,
    hasMore: offset + limit < filteredList.length
  }
}

// Handle type filter with pagination
async function handleTypeFilterWithPagination(
  limit: number,
  offset: number,
  typeFilter: string
): Promise<{ pokemon: SimplePokemon[], total: number, hasMore: boolean }> {
  const typeData = await fetchPokemonByType(typeFilter)
  const typePokemonList = typeData.pokemon.map(p => ({
    name: p.pokemon.name,
    url: p.pokemon.url
  }))
  
  // Apply pagination to type results
  const paginatedList = typePokemonList.slice(offset, offset + limit)
  
  // OPTIMIZED: Create Pokemon with type info directly from type data
  const pokemonData = paginatedList.map(item => {
    const id = getPokemonIdFromUrl(item.url)
    return {
      id,
      name: item.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      types: [typeFilter] // We know the type from the filter!
    }
  })
  
  return {
    pokemon: pokemonData,
    total: typePokemonList.length,
    hasMore: offset + limit < typePokemonList.length
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