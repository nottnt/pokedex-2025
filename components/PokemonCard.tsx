"use client";

import Image from "next/image";

import { usePokemonForm } from "@/hooks/usePokemonForm";
import { Badge } from "@/components/ui/badge";
import { PokemonType } from "pokenode-ts";
import { PokemonTypeName } from "@/types/common";

interface PokemonCardProps {
  name: string;
  imageUrl: string;
  id: number;
}

interface PokemonTypeBadgeProps {
  id: number;
  pokemonTypes?: PokemonType[];
}

const PokemonTypeBadge = ({ id, pokemonTypes }: PokemonTypeBadgeProps) => {
  return (
    <div className="p-2 text-center">
      {pokemonTypes?.map((pokemonType: PokemonType) => (
        <Badge
          key={`${id}-${pokemonType.type.name}`}
          variant={pokemonType.type.name as PokemonTypeName}
          className="m-1"
        >
          {pokemonType.type.name}
        </Badge>
      ))}
    </div>
  );
};

export default function PokemonCard({ name, imageUrl, id }: PokemonCardProps) {
  const { data: pokemonForm, isLoading } = usePokemonForm(id);

  return (
    <div className="bg-white hover:bg-secondary hover:text-primary cursor-pointer shadow-lg rounded-lg overflow-hidden p-2">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-2 text-center">
        <h2 className="text-xl font-bold capitalize">{name}</h2>
      </div>
      <PokemonTypeBadge pokemonTypes={pokemonForm?.types} id={id} />
    </div>
  );
}
