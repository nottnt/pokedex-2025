import { Pokemon } from "pokenode-ts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PokemonTypeName } from "@/types/common";

interface PokemonTypesCardProps {
  pokemon: Pokemon;
}

export default function PokemonTypesCard({ pokemon }: PokemonTypesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {pokemon.types?.map((pokemonType) => (
            <Badge
              key={pokemonType.type.name}
              variant={pokemonType.type.name as PokemonTypeName}
              className="text-sm px-3 py-1"
            >
              {pokemonType.type.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}