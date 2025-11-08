import Image from "next/image";
import { Pokemon } from "pokenode-ts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PokemonSpritesCardProps {
  pokemon: Pokemon;
}

export default function PokemonSpritesCard({ pokemon }: PokemonSpritesCardProps) {
  const sprites = [
    {
      src: pokemon.sprites.front_default,
      alt: `${pokemon.name} front`,
      label: "Front"
    },
    {
      src: pokemon.sprites.back_default,
      alt: `${pokemon.name} back`,
      label: "Back"
    },
    {
      src: pokemon.sprites.front_shiny,
      alt: `${pokemon.name} shiny front`,
      label: "Shiny Front"
    },
    {
      src: pokemon.sprites.back_shiny,
      alt: `${pokemon.name} shiny back`,
      label: "Shiny Back"
    }
  ].filter(sprite => sprite.src); // Only show sprites that exist

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {sprites.map((sprite, index) => (
            <div key={index} className="space-y-2">
              <div className="relative h-24 bg-muted rounded-lg">
                <Image
                  src={sprite.src!}
                  alt={sprite.alt}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {sprite.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}