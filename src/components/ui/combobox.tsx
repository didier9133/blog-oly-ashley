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
import { getSubcategories } from "@/app/[locale]/actions/posts";
import { useTranslations } from "next-intl";

const DICTIONARY = {
  //recipes
  "Comfort Food": "comfort-food",
  "Quick and Easy": "quick-easy",
  Healthy: "healthy",
  Vegan: "vegan",
  Venezuelan: "venezuelan",

  //blog
  Reflections: "reflections",
  Rituals: "rituals",
  Letters: "letters",
  Thoughts: "thoughts",
};

export function ComboboxDemo({
  categoryId,
  categoryName,
}: {
  categoryId: number;
  categoryName: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [subCategories, setSubCategories] = React.useState<
    { id: number; categoryId: number; name: string }[]
  >([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("categories");
  const t_subcategories = useTranslations(
    `subcategories.${categoryName.toLowerCase()}`
  );

  React.useEffect(() => {
    if (value) {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("category", value);
      router.replace(`?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
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
          className="max-w-[350px] w-full justify-between dark:hover:text-white"
        >
          {value
            ? subCategories.find((sub) => sub.id.toString() === value)?.name
              ? t_subcategories(
                  DICTIONARY[
                    subCategories
                      .find((sub) => sub.id.toString() === value)
                      ?.name.replace(/&/g, "and") as keyof typeof DICTIONARY
                  ]
                )
              : t("select")
            : `${t("select")}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={`${t("search")}...`} />
          <CommandList>
            <CommandEmpty>{t("empty")}</CommandEmpty>
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
                  {t_subcategories(
                    DICTIONARY[
                      sub.name.replace(/&/g, "and") as keyof typeof DICTIONARY
                    ]
                  )}

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
