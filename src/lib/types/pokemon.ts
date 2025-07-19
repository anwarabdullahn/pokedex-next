// Core Pokemon API Types
export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  species: NamedAPIResource;
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  past_types?: PokemonTypePast[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  forms: NamedAPIResource[];
  game_indices: VersionGameIndex[];
  cries: PokemonCries;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other?: {
    dream_world: {
      front_default: string | null;
      front_female: string | null;
    };
    home: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null;
    };
  };
  versions?: Record<string, Record<string, PokemonSprites>>; // Game version sprites
}

export interface PokemonCries {
  latest: string;
  legacy: string;
}

export interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonTypePast {
  generation: NamedAPIResource;
  types: PokemonType[];
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersion[];
}

export interface PokemonMoveVersion {
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
  level_learned_at: number;
}

export interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: PokemonHeldItemVersion[];
}

export interface PokemonHeldItemVersion {
  version: NamedAPIResource;
  rarity: number;
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

// Pokemon Species
export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: NamedAPIResource;
  pokedex_numbers: PokemonSpeciesDexEntry[];
  egg_groups: NamedAPIResource[];
  color: NamedAPIResource;
  shape: NamedAPIResource;
  evolves_from_species: NamedAPIResource | null;
  evolution_chain: APIResource;
  habitat: NamedAPIResource | null;
  generation: NamedAPIResource;
  names: Name[];
  pal_park_encounters: PalParkEncounterArea[];
  flavor_text_entries: FlavorText[];
  form_descriptions: Description[];
  genera: Genus[];
  varieties: PokemonSpeciesVariety[];
}

export interface PokemonSpeciesDexEntry {
  entry_number: number;
  pokedex: NamedAPIResource;
}

export interface PalParkEncounterArea {
  base_score: number;
  rate: number;
  area: NamedAPIResource;
}

export interface PokemonSpeciesVariety {
  is_default: boolean;
  pokemon: NamedAPIResource;
}

// Evolution Chain
export interface EvolutionChain {
  id: number;
  baby_trigger_item: NamedAPIResource | null;
  chain: ChainLink;
}

export interface ChainLink {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionDetail {
  item: NamedAPIResource | null;
  trigger: NamedAPIResource;
  gender: number | null;
  held_item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: NamedAPIResource | null;
  turn_upside_down: boolean;
}

// Type Information
export interface Type {
  id: number;
  name: string;
  damage_relations: TypeRelations;
  past_damage_relations: TypeRelationsPast[];
  game_indices: GenerationGameIndex[];
  generation: NamedAPIResource;
  move_damage_class: NamedAPIResource | null;
  names: Name[];
  pokemon: TypePokemon[];
  moves: NamedAPIResource[];
}

export interface TypeRelations {
  no_damage_to: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  double_damage_from: NamedAPIResource[];
}

export interface TypeRelationsPast {
  generation: NamedAPIResource;
  damage_relations: TypeRelations;
}

export interface TypePokemon {
  slot: number;
  pokemon: NamedAPIResource;
}

export interface GenerationGameIndex {
  game_index: number;
  generation: NamedAPIResource;
}

// Move Information
export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number | null;
  priority: number;
  power: number | null;
  contest_combos: ContestComboSets | null;
  contest_type: NamedAPIResource | null;
  contest_effect: APIResource | null;
  damage_class: NamedAPIResource;
  effect_entries: VerboseEffect[];
  effect_changes: AbilityEffectChange[];
  learned_by_pokemon: NamedAPIResource[];
  flavor_text_entries: MoveFlavorText[];
  generation: NamedAPIResource;
  machines: MachineVersionDetail[];
  meta: MoveMetaData | null;
  names: Name[];
  past_values: PastMoveStatValues[];
  stat_changes: MoveStatChange[];
  super_contest_effect: APIResource | null;
  target: NamedAPIResource;
  type: NamedAPIResource;
}

export interface ContestComboSets {
  normal: ContestComboDetail;
  super: ContestComboDetail;
}

export interface ContestComboDetail {
  use_before: NamedAPIResource[] | null;
  use_after: NamedAPIResource[] | null;
}

export interface MoveFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface MoveMetaData {
  ailment: NamedAPIResource;
  category: NamedAPIResource;
  min_hits: number | null;
  max_hits: number | null;
  min_turns: number | null;
  max_turns: number | null;
  drain: number;
  healing: number;
  crit_rate: number;
  ailment_chance: number;
  flinch_chance: number;
  stat_chance: number;
}

export interface MoveStatChange {
  change: number;
  stat: NamedAPIResource;
}

export interface PastMoveStatValues {
  accuracy: number | null;
  effect_chance: number | null;
  power: number | null;
  pp: number | null;
  effect_entries: VerboseEffect[];
  type: NamedAPIResource | null;
  version_group: NamedAPIResource;
}

export interface MachineVersionDetail {
  machine: APIResource;
  version_group: NamedAPIResource;
}

// Common API Resource Types
export interface APIResource {
  url: string;
}

export interface NamedAPIResource extends APIResource {
  name: string;
}

export interface Description {
  description: string;
  language: NamedAPIResource;
}

export interface Effect {
  effect: string;
  language: NamedAPIResource;
}

export interface VerboseEffect {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

export interface FlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface Name {
  name: string;
  language: NamedAPIResource;
}

export interface Genus {
  genus: string;
  language: NamedAPIResource;
}

export interface AbilityEffectChange {
  effect_entries: VerboseEffect[];
  version_group: NamedAPIResource;
}

// Paginated Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Simplified Types for UI Components
export interface SimplePokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

// Battle System Types
export interface BattlePokemon {
  id: number;
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  types: string[];
  moves: BattleMove[];
  sprite: string;
  status?: StatusCondition;
}

export interface BattleMove {
  id: number;
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  maxPp: number;
  damageClass: 'physical' | 'special' | 'status';
  priority: number;
}

export interface StatusCondition {
  name: 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep';
  turnsRemaining?: number;
}

export interface BattleState {
  playerPokemon: BattlePokemon;
  opponentPokemon: BattlePokemon;
  turn: 'player' | 'opponent';
  battleLog: string[];
  winner?: 'player' | 'opponent';
  isOngoing: boolean;
}

export interface Team {
  id: string;
  name: string;
  pokemon: BattlePokemon[];
  createdAt: Date;
  updatedAt: Date;
}

// Pokemon Type Colors (for UI)
export const TYPE_COLORS = {
  normal: '#A3A3A3',
  fire: '#ff6b35',
  water: '#4a90e2',
  electric: '#f5a623',
  grass: '#7ed321',
  ice: '#50c9e7',
  fighting: '#dc2626',
  poison: '#9333ea',
  ground: '#d97706',
  flying: '#06b6d4',
  psychic: '#d63384',
  bug: '#84cc16',
  rock: '#78716c',
  ghost: '#6366f1',
  dragon: '#7b68ee',
  dark: '#424242',
  steel: '#6b7280',
  fairy: '#ec4899',
} as const;

export type PokemonTypeName = keyof typeof TYPE_COLORS; 