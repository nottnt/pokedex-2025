import Image from "next/image";
import { Pokemon } from "pokenode-ts";

import { Card, CardContent } from "@/components/ui/card";

interface PokemonImageCardProps {
  pokemon: Pokemon;
}

export default function PokemonImageCard({ pokemon }: PokemonImageCardProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="relative w-full h-80 mb-4">
          <Image
            src={
              pokemon.sprites.other?.["official-artwork"]?.front_default ||
              pokemon.sprites.front_default ||
              "/images/pokemon-placeholder.png"
            }
            alt={pokemon.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
          <p className="text-muted-foreground">
            #{pokemon.id.toString().padStart(3, "0")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}