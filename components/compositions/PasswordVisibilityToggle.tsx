import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordVisibilityToggleProps {
  show: boolean;
  onToggle: () => void;
  disabled?: boolean;
  ariaLabelBase?: string;
}

export const PasswordVisibilityToggle = ({
  show,
  onToggle,
  disabled = false,
  ariaLabelBase = "password",
}: PasswordVisibilityToggleProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      onClick={onToggle}
      disabled={disabled}
      aria-label={show ? `Hide ${ariaLabelBase}` : `Show ${ariaLabelBase}`}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );
};
