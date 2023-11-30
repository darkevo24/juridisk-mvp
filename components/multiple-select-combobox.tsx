"use client"

import * as React from "react"
import { ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UseRefinementListProps, useRefinementList } from "react-instantsearch"
import { ScrollArea } from "./ui/scroll-area"

interface CustomProps {
  fieldName: string
}

export default function Combobox({
  ...props
}: UseRefinementListProps & CustomProps) {
  const { items, refine, canRefine } = useRefinementList({
    attribute: props.attribute,
    limit: props.limit,
  })
  const refinedItems = items.filter((item) => item.isRefined)
  const refinedValues = refinedItems.map((item) => item.value)
  const [open, setOpen] = React.useState(false)
  const updateState = (currentValue: string) => {
    if (canRefine) refine(currentValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {refinedItems.length ? (
            <span className="line-clamp-1 text-left w-full">
              {`${refinedValues[0]}${
                refinedValues.length > 1
                  ? " + " + Number(refinedValues.length - 1).toString()
                  : ""
              }`}
            </span>
          ) : (
            `Select ${props.fieldName}...`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <Command>
          <CommandInput placeholder={`Search ${props.fieldName}...`} />
          <CommandEmpty>No framework found.</CommandEmpty>
          {!!refinedItems.length && (
            <>
              <CommandGroup heading="Selected">
                {refinedItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => updateState(item.value)}
                    className="justify-between"
                  >
                    <span>{item.label}</span>
                    <X className={"mr-2 h-4 w-4"} />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          <CommandGroup heading="Options">
            <ScrollArea className="w-full h-80">
              {items
                .filter((item) => !refinedValues.includes(item.value))
                .map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => updateState(item.value)}
                  >
                    {item.label}
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
