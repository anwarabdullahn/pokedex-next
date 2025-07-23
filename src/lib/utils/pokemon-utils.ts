// Pokemon-related utility functions

/**
 * Maximum Pokemon ID that has reliable sprite support
 * This covers all main series Pokemon through Gen 9
 */
export const MAX_POKEMON_ID = 1010

/**
 * Check if a Pokemon ID has reliable sprite support
 */
export function isValidPokemonId(id: number): boolean {
  return id > 0 && id <= MAX_POKEMON_ID
}

/**
 * Generate sprite URL for a Pokemon with proper fallbacks
 */
export function getPokemonSpriteUrl(id: number, preferOfficial = true): string {
  // Always return placeholder for invalid IDs
  if (!isValidPokemonId(id)) {
    return '/placeholder-pokemon.svg'
  }

  if (preferOfficial) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }
  
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

/**
 * Generate safe sprite URL with fallback handling
 */
export function getSafePokemonSprite(pokemon: { 
  id: number
  sprites?: {
    other?: {
      'official-artwork'?: {
        front_default?: string | null
      }
    }
    front_default?: string | null
  }
}): string {
  // Check if ID is valid first
  if (!isValidPokemonId(pokemon.id)) {
    return '/placeholder-pokemon.svg'
  }

  // Try official artwork first
  if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
    return pokemon.sprites.other['official-artwork'].front_default
  }

  // Try regular sprite
  if (pokemon.sprites?.front_default) {
    return pokemon.sprites.front_default
  }

  // Generate URL based on ID
  return getPokemonSpriteUrl(pokemon.id, true)
}

/**
 * Filter out Pokemon with unsupported IDs
 */
export function filterValidPokemon<T extends { id: number }>(pokemon: T[]): T[] {
  return pokemon.filter(p => isValidPokemonId(p.id))
}

/**
 * Check if a Pokemon name indicates a special form that might not have sprites
 */
export function isSpecialForm(name: string): boolean {
  const specialFormIndicators = [
    '-gmax',      // Gigantamax forms
    '-totem',     // Totem Pokemon
    '-starter',   // Starter variants
    '-cap',       // Cap Pikachu
    '-cosplay',   // Cosplay forms
    '-libre',     // Pikachu Libre
    '-phd',       // Pikachu PhD
    '-belle',     // Pikachu Belle
    '-rockstar',  // Pikachu Rock Star
    '-popstar',   // Pikachu Pop Star
    '-dapper',    // Dapper forms
    '-bloodmoon', // Bloodmoon Ursaluna
    '-wellspring-mask', // Ogerpon forms
    '-hearthflame-mask',
    '-cornerstone-mask',
    '-glide-mode', // Miraidon forms
    '-drive-mode',
    '-aquatic-mode',
    '-low-power-mode'
  ]

  return specialFormIndicators.some(indicator => name.includes(indicator))
}

/**
 * Enhanced Pokemon filtering that removes problematic forms
 */
export function filterDisplayablePokemon<T extends { id: number; name: string }>(pokemon: T[]): T[] {
  return pokemon.filter(p => {
    // Filter by valid ID range
    if (!isValidPokemonId(p.id)) return false
    
    // Filter out known problematic special forms
    if (isSpecialForm(p.name)) return false
    
    return true
  })
} 