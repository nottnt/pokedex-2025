import { Pokemon } from "pokenode-ts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PokemonStatsCardProps {
  pokemon: Pokemon;
}

export default function PokemonStatsCard({ pokemon }: PokemonStatsCardProps) {
  const formatStatName = (statName: string) => {
    return statName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pokemon.stats.map((stat) => (
          <div key={stat.stat.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium capitalize">
                {formatStatName(stat.stat.name)}
              </span>
              <span className="text-sm font-bold">{stat.base_stat}</span>
            </div>
            <Progress value={(stat.base_stat / 200) * 100} className="h-2" />
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="text-lg font-bold">
              {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}