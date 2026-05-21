"use client"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const DocumentPage = () => {
  const {user} = useUser()
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={"/hero.svg"}
        alt="document"
        height={100}
        width={100}
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Motion
      </h2>
      <Button>
        <PlusCircle className="h-4 w-4 mr-2"/>
        Create a note
      </Button>
    </div>
  )
}

export default DocumentPage