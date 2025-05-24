"use client";

import Image from "next/image";

import { usePokemonForm } from "@/hooks/usePokemonForm";

interface PokemonCardProps {
  name: string;
  imageUrl: string;
  id: number;
}

export default function PokemonCard({ name, imageUrl, id }: PokemonCardProps) {
  const { data: pokemonForm, isLoading } = usePokemonForm(id);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold capitalize">{name}</h2>
      </div>
    </div>
  );
}
