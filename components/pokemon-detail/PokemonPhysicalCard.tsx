import { Pokemon } from "pokenode-ts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PokemonPhysicalCardProps {
  pokemon: Pokemon;
}

export default function PokemonPhysicalCard({ pokemon }: PokemonPhysicalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Physical Characteristics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{pokemon.height / 10}m</p>
            <p className="text-sm text-muted-foreground">Height</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{pokemon.weight / 10}kg</p>
            <p className="text-sm text-muted-foreground">Weight</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}