"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"


function Error() {
  return (
    <div className="flex flex-col items-center h-full justify-center space-y-4">
      <Image
        src={'/hero.svg'}
        alt="Error image"
        height={100}
        width={100}
        className="dark"
      />
      <h2 className="text-xl font-medium">Something went wrong!</h2>
      <Button asChild>
        <Link href={"/documents"}>
          Go back
        </Link>
      </Button>
    </div>
  )
}

export default Error