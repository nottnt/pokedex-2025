// app/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainerSchema, TrainerFormData } from "@/lib/validation/trainerSchema";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PokemonTrainerForm() {
  const [serverError, setServerError] = useState("");

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      name: "",
      age: 10,
      region: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TrainerFormData) => {
      const res = await fetch("/api/trainer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
      }

      return res.json();
    },
    onError: (err: any) => {
      setServerError(err.message);
    },
  });

  const onSubmit = (data: TrainerFormData) => {
    setServerError("");
    mutation.mutate(data);
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pokemon Trainer Registration</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ash Ketchum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="Kanto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ash@pokemon.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && <p className="text-red-600">{serverError}</p>}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Register"}
          </Button>
        </form>
      </Form>

      {mutation.isSuccess && (
        <p className="mt-4 text-green-600">Trainer registered successfully!</p>
      )}
    </main>
  );
}
