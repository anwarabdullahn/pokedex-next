import { useState, useEffect, useCallback } from 'react'

interface FavoritePokemon {
  id: number
  name: string
  types: string[]
  sprite: string
  addedAt: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemon-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error parsing favorites:', error)
      }
    }
  }, [])

  // Save to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: FavoritePokemon[]) => {
    setFavorites(newFavorites)
    localStorage.setItem('pokemon-favorites', JSON.stringify(newFavorites))
  }, [])

  const addToFavorites = useCallback((pokemon: {
    id: number
    name: string
    types: string[]
    sprite: string
  }) => {
    const newFavorite: FavoritePokemon = {
      ...pokemon,
      addedAt: new Date().toISOString()
    }
    
    const updatedFavorites = [...favorites, newFavorite]
    saveFavorites(updatedFavorites)
  }, [favorites, saveFavorites])

  const removeFromFavorites = useCallback((pokemonId: number) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== pokemonId)
    saveFavorites(updatedFavorites)
  }, [favorites, saveFavorites])

  const toggleFavorite = useCallback((pokemon: {
    id: number
    name: string
    types: string[]
    sprite: string
  }) => {
    const isFavorite = favorites.some(fav => fav.id === pokemon.id)
    
    if (isFavorite) {
      removeFromFavorites(pokemon.id)
    } else {
      addToFavorites(pokemon)
    }
  }, [favorites, addToFavorites, removeFromFavorites])

  const isFavorite = useCallback((pokemonId: number) => {
    return favorites.some(fav => fav.id === pokemonId)
  }, [favorites])

  const getFavoriteCount = useCallback(() => {
    return favorites.length
  }, [favorites.length])

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoriteCount
  }
} 