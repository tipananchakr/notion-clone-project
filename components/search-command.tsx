"use client"

import { api } from "@/convex/_generated/api"
import { useSearch } from "@/hooks/use-search"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { File } from "lucide-react"

export const SearchCommand = () => {
  const { user } = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)

  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  const onselect = (id: string) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle])


  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Command>
        <CommandInput
          placeholder={`Search ${user?.fullName}'s Motion...`}
        />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Documents">
            {documents?.map((document) => (
              <CommandItem
                key={document._id}
                value={`${document._id}-${document.title}`}
                title={`${document.title}`}
                onSelect={() => onselect(document._id)}
              >

                {document.icon ? (
                  <p className="mr-2 text-[18px]">
                    {document.icon}
                  </p>
                ) : (
                  <File
                    className="mr-2 h-4 w-4"
                  />
                )}

                <span>{document.title}</span>

              </CommandItem>
            ))}

          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

