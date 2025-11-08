"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { usePokemonForm } from "@/hooks/usePokemonForm";
import { Badge } from "@/components/ui/badge";
import { PokemonType } from "pokenode-ts";
import { PokemonTypeName, PokedexUpdateMode } from "@/types/common";

interface PokemonCardProps {
  name: string;
  imageUrl: string;
  id: number;
  pokedexUpdateMode?: PokedexUpdateMode;
  addPokemonToPokedex?: (id: number, name: string) => void;
  removePokemonFromPokedex?: (id: number, name: string) => void;
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

export default function PokemonCard({
  name,
  imageUrl,
  id,
  addPokemonToPokedex,
  removePokemonFromPokedex,
  pokedexUpdateMode = PokedexUpdateMode.ADD,
}: PokemonCardProps) {
  const { data: session } = useSession();
  const trainerId = session?.user?.trainer?._id as string;
  const { data: pokemonForm, isLoading } = usePokemonForm(id);

  return (
    <Link href={`/pokemon/${id}`} className="block">
      {/* MODIFICATION: Added has-[] variants to revert hover effect */}
      <div className="bg-white hover:bg-secondary hover:text-primary has-[.pokeball-image:hover]:bg-white has-[.pokeball-image:hover]:text-inherit cursor-pointer shadow-lg rounded-lg overflow-hidden p-2 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
        <div className="p-2 flex justify-end">
          {trainerId && pokedexUpdateMode === PokedexUpdateMode.ADD && (
            <Image
              src={"/images/pokéball.webp"}
              alt={"pokéball"}
              width="24"
              height="24"
              className="pokeball-image cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-20"
              onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
                e.preventDefault();
                e.stopPropagation();
                addPokemonToPokedex?.(id, name);
              }}
            />
          )}
          {trainerId && pokedexUpdateMode === PokedexUpdateMode.REMOVE && (
            <Image
              src={"/images/pokéball-open.webp"}
              alt={"pokéball-open"}
              width="30"
              height="30"
              className="pokeball-image cursor-pointer hover:animate-bounce"
              onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
                e.preventDefault();
                e.stopPropagation();
                removePokemonFromPokedex?.(id, name);
              }}
            />
          )}
        </div>
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
    </Link>
  );
}
