import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Add your Pokémon type variants here
        grass:
          "border-transparent bg-pokemon-grass text-white hover:bg-pokemon-grass/90",
        fire: "border-transparent bg-pokemon-fire text-white hover:bg-pokemon-fire/90",
        water:
          "border-transparent bg-pokemon-water text-white hover:bg-pokemon-water/90",
        electric:
          "border-transparent bg-pokemon-electric text-pokemon-dark hover:bg-pokemon-electric/90", // Assuming dark text for better contrast
        poison:
          "border-transparent bg-pokemon-poison text-white hover:bg-pokemon-poison/90",
        normal:
          "border-transparent bg-pokemon-normal text-white hover:bg-pokemon-normal/90",
        ice: "border-transparent bg-pokemon-ice text-pokemon-dark hover:bg-pokemon-ice/90",
        fighting:
          "border-transparent bg-pokemon-fighting text-white hover:bg-pokemon-fighting/90",
        ground:
          "border-transparent bg-pokemon-ground text-white hover:bg-pokemon-ground/90",
        flying:
          "border-transparent bg-pokemon-flying text-white hover:bg-pokemon-flying/90",
        psychic:
          "border-transparent bg-pokemon-psychic text-white hover:bg-pokemon-psychic/90",
        bug: "border-transparent bg-pokemon-bug text-white hover:bg-pokemon-bug/90",
        rock: "border-transparent bg-pokemon-rock text-white hover:bg-pokemon-rock/90",
        ghost:
          "border-transparent bg-pokemon-ghost text-white hover:bg-pokemon-ghost/90",
        dragon:
          "border-transparent bg-pokemon-dragon text-white hover:bg-pokemon-dragon/90",
        dark: "border-transparent bg-pokemon-dark text-white hover:bg-pokemon-dark/90",
        steel:
          "border-transparent bg-pokemon-steel text-white hover:bg-pokemon-steel/90",
        fairy:
          "border-transparent bg-pokemon-fairy text-pokemon-dark hover:bg-pokemon-fairy/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
