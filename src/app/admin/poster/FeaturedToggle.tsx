"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { togglePosterFeatured } from "@/app/actions";
import { toast } from "sonner";

export function FeaturedToggle({ id, isFeatured }: { id: string; isFeatured: boolean }) {
  const [pending, startTransition] = useTransition();
  const [localValue, setLocalValue] = useState(isFeatured);

  const handleToggle = (checked: boolean) => {
    setLocalValue(checked); // Update immediately
    startTransition(async () => {
      try {
        await togglePosterFeatured(id, checked);
        toast.success(`Poster marked as ${checked ? "Featured" : "Not Featured"}`);
      } catch {
        toast.error("Failed to update poster status");
        setLocalValue(!checked); // Rollback on failure
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={localValue}
        onCheckedChange={handleToggle}
        disabled={pending}
        className={pending ? "opacity-50 pointer-events-none" : ""}
      />
      {pending && (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
