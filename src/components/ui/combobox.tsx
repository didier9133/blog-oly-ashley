"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { getSubcategories } from "@/app/actions/posts";

export function ComboboxDemo({ categoryId }: { categoryId: number }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [subCategories, setSubCategories] = React.useState<
    { id: number; categoryId: number; name: string }[]
  >([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (value) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", value);
      router.replace(`?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      router.replace(`?${params.toString()}`);
    }
  }, [value, router, searchParams]);

  React.useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await getSubcategories({ categoryId });
        setSubCategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([]);
      }
    };
    if (categoryId) {
      fetchSubCategories();
    }
  }, [categoryId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="max-w-[350px] w-full justify-between"
        >
          {value
            ? subCategories.find((sub) => sub.id.toString() === value)?.name
            : "Select Category..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {subCategories.map((sub) => (
                <CommandItem
                  key={sub.id}
                  value={sub.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {sub.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === sub.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
