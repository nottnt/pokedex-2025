import { Pokemon } from "pokenode-ts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PokemonAbilitiesCardProps {
  pokemon: Pokemon;
}

export default function PokemonAbilitiesCard({ pokemon }: PokemonAbilitiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Abilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {pokemon.abilities.map((ability) => (
            <div
              key={ability.ability.name}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <span className="capitalize font-medium">
                {ability.ability.name.replace("-", " ")}
              </span>
              {ability.is_hidden && (
                <Badge variant="secondary" className="text-xs">
                  Hidden
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}