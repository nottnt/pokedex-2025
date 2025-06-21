import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

// Define the types for the component's props
interface SearchPanelProps {
  onSubmit: (searchTerm: string) => void;
}

export function SearchPanel({ onSubmit }: SearchPanelProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
      <div className="relative w-full">
        <Input
          id="search"
          type="search"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4 pr-20 [&::-webkit-search-cancel-button]:hidden"
        />

        {/* Custom Clear Button */}
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute inset-y-0 right-10 h-full px-3"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
        )}

        {/* Submit Search Button */}
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 h-full px-3"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </form>
  );
}
