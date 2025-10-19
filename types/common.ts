export type PokemonTypeName =
  | "grass"
  | "fire"
  | "water"
  | "electric"
  | "poison"
  | "normal"
  | "ice"
  | "fighting"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export enum PokedexUpdateMode {
  ADD = "add",
  REMOVE = "remove",
}

export enum AuthProvider {
  GOOGLE = "google",
  CREDENTIALS = "credentials",
}

export enum AuthMode {
  LOGIN = "login",
  SIGNUP = "signup",
  REQUEST_VERIFICATION = "requestVerification",
}
