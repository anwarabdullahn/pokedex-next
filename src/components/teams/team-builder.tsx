'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, X, Search, Save, Shuffle, Loader2 } from 'lucide-react'
import { usePokemon } from '@/lib/hooks/use-pokemon'
import { useFilteredPokemon } from '@/lib/hooks/use-pokemon'
import { PokemonTypeName, TYPE_COLORS } from '@/lib/types/pokemon'
import { cva } from 'class-variance-authority'
import Image from 'next/image'

interface TeamPokemon {
  id: number
  name: string
  types: string[]
  sprite: string
  stats: {
    hp: number
    attack: number
    defense: number
    'special-attack': number
    'special-defense': number
    speed: number
  }
}

// CVA for type badges
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

export function TeamBuilder() {
  const [team, setTeam] = useState<(TeamPokemon | null)[]>(Array(6).fill(null))
  const [teamName, setTeamName] = useState('')
  const [isSelectingPokemon, setIsSelectingPokemon] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [allPokemon, setAllPokemon] = useState<Array<{ id: number, name: string, types: string[], sprite: string }>>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMorePokemon, setHasMorePokemon] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [queryKey, setQueryKey] = useState(0) // Force refresh key
  const observerRef = useRef<HTMLDivElement>(null)

  const POKEMON_PER_PAGE = 40

  // Use a single query for current data - only when dialog is open
  const { 
    data: currentResults, 
    isLoading: currentLoading,
    refetch
  } = useFilteredPokemon(
    POKEMON_PER_PAGE, 
    currentPage * POKEMON_PER_PAGE, 
    undefined, 
    searchQuery,
    isSelectingPokemon, // Only fetch when dialog is open
    queryKey // Force refresh key
  )

  // Handle new data
  useEffect(() => {
    if (currentResults) {
      if (searchQuery) {
        // For search, replace all results
        setAllPokemon(currentResults.pokemon)
        setHasMorePokemon(false) // No infinite scroll during search
      } else {
        // For infinite loading, append or replace
        if (currentPage === 0) {
          setAllPokemon(currentResults.pokemon)
        } else {
          setAllPokemon(prev => [...prev, ...currentResults.pokemon])
        }
        setHasMorePokemon(currentResults.hasMore)
      }
      setIsLoadingMore(false)
    }
  }, [currentResults, searchQuery, currentPage])

  // Simplified initial load when dialog opens
  useEffect(() => {
    if (isSelectingPokemon && !searchQuery) {
      console.log('Dialog opened, ensuring data load. Current state:', {
        allPokemonLength: allPokemon.length,
        currentPage,
        currentLoading,
        hasMorePokemon
      })
      
      // If we have no Pokemon and aren't loading, trigger a load
      if (allPokemon.length === 0 && !currentLoading) {
        console.log('Triggering manual load - no Pokemon and not loading')
        setCurrentPage(0)
        setHasMorePokemon(true)
        setQueryKey(prev => prev + 1) // Force refresh
      }
    }
  }, [isSelectingPokemon, searchQuery, allPokemon.length, currentLoading, currentPage, hasMorePokemon])

  // Reset when search changes
  useEffect(() => {
    setCurrentPage(0)
    setAllPokemon([])
    setHasMorePokemon(true)
  }, [searchQuery])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isSelectingPokemon) return // Only observe when dialog is open

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('Intersection observed:', {
            isIntersecting: entry.isIntersecting,
            hasMorePokemon,
            currentLoading,
            isLoadingMore,
            searchQuery,
            currentPage
          })
          
          if (entry.isIntersecting && hasMorePokemon && !currentLoading && !isLoadingMore && !searchQuery) {
            console.log('Triggering load more - setting page to:', currentPage + 1)
            setIsLoadingMore(true)
            setCurrentPage(prev => prev + 1)
          }
        })
      },
      { 
        threshold: 0.1,
        root: null, // Use viewport as root
        rootMargin: '20px' // Trigger a bit before reaching the bottom
      }
    )

    const currentObserver = observerRef.current
    if (currentObserver) {
      console.log('Observing element:', currentObserver)
      observer.observe(currentObserver)
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver)
      }
    }
  }, [hasMorePokemon, currentLoading, isLoadingMore, searchQuery, currentPage, isSelectingPokemon])

  const addPokemonToTeam = useCallback((pokemon: { id: number, name: string, types: string[], sprite: string }, slotIndex: number) => {
    const teamPokemon: TeamPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types || [],
      sprite: pokemon.sprite,
      stats: {
        hp: 100, // We'll fetch real stats later
        attack: 100,
        defense: 100,
        'special-attack': 100,
        'special-defense': 100,
        speed: 100
      }
    }

    setTeam(prev => {
      const newTeam = [...prev]
      newTeam[slotIndex] = teamPokemon
      return newTeam
    })
    setIsSelectingPokemon(false)
    setSearchQuery('')
  }, [])

  const removePokemonFromTeam = useCallback((slotIndex: number) => {
    setTeam(prev => {
      const newTeam = [...prev]
      newTeam[slotIndex] = null
      return newTeam
    })
  }, [])

  const saveTeam = useCallback(() => {
    if (!teamName.trim()) {
      alert('Please enter a team name')
      return
    }

    const nonEmptyTeam = team.filter(pokemon => pokemon !== null)
    if (nonEmptyTeam.length === 0) {
      alert('Please add at least one Pokémon to your team')
      return
    }

    // Save to localStorage (we'll implement proper storage later)
    const savedTeams = JSON.parse(localStorage.getItem('pokemon-teams') || '[]')
    const newTeam = {
      id: Date.now(),
      name: teamName,
      pokemon: nonEmptyTeam,
      createdAt: new Date().toISOString()
    }
    
    savedTeams.push(newTeam)
    localStorage.setItem('pokemon-teams', JSON.stringify(savedTeams))
    
    alert(`Team "${teamName}" saved successfully!`)
    setTeamName('')
  }, [team, teamName])

  const randomizeTeam = useCallback(() => {
    // Generate random team (placeholder - we'd use real Pokemon data)
    const randomIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 151) + 1)
    // This is a simplified version - we'd fetch real Pokemon data here
    alert('Random team generation coming soon!')
  }, [])

  const openPokemonSelector = useCallback((slotIndex: number) => {
    console.log('Opening Pokemon selector for slot:', slotIndex)
    setSelectedSlot(slotIndex)
    
    // Reset all state when opening dialog to ensure fresh data
    setSearchQuery('')
    setCurrentPage(0)
    setAllPokemon([])
    setHasMorePokemon(true)
    setIsLoadingMore(false)
    setQueryKey(prev => prev + 1) // Force query refresh
    
    setIsSelectingPokemon(true)
    
    // Force refetch after a brief delay to ensure state is updated
    setTimeout(() => {
      console.log('Force refetching query after dialog open')
      refetch()
    }, 100)
  }, [refetch])

  const closePokemonSelector = useCallback(() => {
    setIsSelectingPokemon(false)
    // Don't reset data immediately, let it stay cached
  }, [])

  return (
    <div className="space-y-6">
      {/* Team Name Input */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Team Name</label>
          <Input
            placeholder="Enter team name..."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <Button 
          onClick={saveTeam}
          disabled={team.every(p => p === null)}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Team
        </Button>
        <Button 
          variant="outline" 
          onClick={randomizeTeam}
          className="flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random
        </Button>
      </div>

      {/* Team Slots */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {team.map((pokemon, index) => (
          <TeamSlot
            key={index}
            pokemon={pokemon}
            slotNumber={index + 1}
            onAdd={() => openPokemonSelector(index)}
            onRemove={() => removePokemonFromTeam(index)}
          />
        ))}
      </div>

      {/* Team Summary */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Team Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Total Pokémon</div>
              <div className="font-semibold">{team.filter(p => p !== null).length}/6</div>
            </div>
            <div>
              <div className="text-gray-500">Unique Types</div>
              <div className="font-semibold">
                {new Set(team.filter(p => p !== null).flatMap(p => p!.types)).size}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Team Balance</div>
              <div className="font-semibold">
                {team.filter(p => p !== null).length >= 3 ? 'Good' : 'Needs More'}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Battle Ready</div>
              <div className="font-semibold">
                {team.filter(p => p !== null).length >= 1 ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pokemon Selection Dialog */}
      <Dialog open={isSelectingPokemon} onOpenChange={(open) => {
        if (!open) {
          closePokemonSelector()
        }
        // Don't handle the true case here - let openPokemonSelector handle opening
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Pokémon for Slot {selectedSlot + 1}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-96" onScrollCapture={(e) => {
              // Alternative scroll detection
              const target = e.currentTarget
              const scrollTop = target.scrollTop
              const scrollHeight = target.scrollHeight
              const clientHeight = target.clientHeight
              
              // Check if near bottom (within 100px)
              if (scrollTop + clientHeight >= scrollHeight - 100 && 
                  hasMorePokemon && 
                  !currentLoading && 
                  !isLoadingMore && 
                  !searchQuery) {
                console.log('Scroll triggered load more')
                setIsLoadingMore(true)
                setCurrentPage(prev => prev + 1)
              }
            }}>
              {(currentLoading && allPokemon.length === 0) ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading Pokémon...
                </div>
              ) : allPokemon.length === 0 && !currentLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">No Pokémon loaded</div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        console.log('Manual load button clicked - forcing refetch')
                        setCurrentPage(0)
                        setHasMorePokemon(true)
                        setQueryKey(prev => prev + 1)
                        refetch() // Force refetch the query
                      }}
                      variant="outline"
                    >
                      Load Pokémon
                    </Button>
                    <div className="text-xs text-gray-400">
                      Debug: Query enabled: {isSelectingPokemon.toString()}, Page: {currentPage}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allPokemon.map((pokemon) => (
                      <div
                        key={pokemon.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => addPokemonToTeam(pokemon, selectedSlot)}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 relative">
                            <Image
                              src={pokemon.sprite}
                              alt={pokemon.name}
                              fill
                              className="object-contain"
                              sizes="64px"
                            />
                          </div>
                          <div className="font-medium text-sm capitalize mb-1">
                            {pokemon.name}
                          </div>
                          <div className="flex justify-center gap-1">
                            {pokemon.types.map(type => (
                              <Badge 
                                key={type}
                                className={typeBadgeVariants({ type: type as PokemonTypeName })}
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Infinite scroll trigger */}
                  {!searchQuery && hasMorePokemon && (
                    <div className="h-20 flex items-center justify-center">
                      <div ref={observerRef} className="w-full h-10 flex items-center justify-center">
                        {isLoadingMore ? (
                          <div className="text-center">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Loading more...</div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400">
                            Scroll for more Pokémon (Page {currentPage + 1})
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Search results info */}
                  {searchQuery && allPokemon.length === 0 && !currentLoading && (
                    <div className="text-center py-8 text-gray-500">
                      No Pokémon found matching &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}

                  {/* End of results */}
                  {!hasMorePokemon && !searchQuery && allPokemon.length > 0 && (
                    <div className="text-center py-4 text-xs text-gray-400">
                      You&apos;ve seen all {allPokemon.length} Pokémon!
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TeamSlot({ 
  pokemon, 
  slotNumber, 
  onAdd, 
  onRemove 
}: { 
  pokemon: TeamPokemon | null
  slotNumber: number
  onAdd: () => void
  onRemove: () => void
}) {
  if (!pokemon) {
    return (
      <Card className="aspect-square">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAdd}
            className="w-full h-full flex flex-col items-center justify-center gap-2 min-h-24"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">Slot {slotNumber}</span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="aspect-square relative group">
      <CardContent className="p-3 h-full flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="w-12 h-12 mx-auto mb-2 relative">
            <Image
              src={pokemon.sprite}
              alt={pokemon.name}
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
          <div className="font-medium text-xs capitalize mb-1">
            {pokemon.name}
          </div>
          <div className="flex justify-center gap-1">
            {pokemon.types.slice(0, 2).map(type => (
              <Badge 
                key={type}
                className={`${typeBadgeVariants({ type: type as PokemonTypeName })} text-[10px] px-1 py-0`}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 