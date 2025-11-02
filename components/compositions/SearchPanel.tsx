import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";

// Define the types for the component's props
interface SearchPanelProps {
  onSubmit: (searchTerm: string) => void;
}

export function SearchPanel({ onSubmit }: SearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await performSearch();
  };

  const performSearch = async () => {
    setIsSearching(true);
    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    onSubmit(searchTerm);
    setIsSearching(false);
  };

  const handleClear = async () => {
    setSearchTerm("");
    setIsSearching(true);
    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 200));
    onSubmit(""); // Clear search results
    setIsSearching(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
      <div className="relative w-full">
        <Input
          id="search"
          type="search"
          placeholder="Find your favorite Pokémon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isSearching}
          className="pl-4 pr-20 [&::-webkit-search-cancel-button]:hidden"
        />

        {/* Custom Clear Button */}
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute inset-y-0 right-10 h-full px-3"
            onClick={handleClear}
            disabled={isSearching}
            aria-label="Clear search"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            )}
          </Button>
        )}

        {/* Submit Search Button */}
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 h-full px-3"
          disabled={isSearching}
          aria-label="Search"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </div>
    </form>
  );
}
