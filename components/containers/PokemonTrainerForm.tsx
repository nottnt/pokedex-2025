// app/page.tsx
"use client";

import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trainerSchema, TrainerFormData } from "@/lib/validation/trainer";
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

export default function PokemonTrainerForm() {
  const { data: session } = useSession();
  const params = useParams();
  const trainerId = params.id?.[0];

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      name: "",
      age: "",
      region: "",
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

      toast.success("Register Successful!", {
        description: "Trainer registered successfully!",
      });

      return res.json();
    },
    onError: (err: any) => {
      toast.error("Register Failed!", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: TrainerFormData) => {
    mutation.mutate({
      ...data,
      userId: session?.user?.id,
    });
  };

  React.useEffect(() => {
    if (trainerId) {
      //TODO: get trainer data by id
    }
  }, []);

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
                  <Input placeholder="Satoshi" {...field} />
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
                  <Input type="number" placeholder="10" {...field} />
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

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Register"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
