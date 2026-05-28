"use client"

import { Cover } from "@/components/cover"
import { Toolbar } from "@/components/toolbar"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { useParams } from "next/navigation"

function DocumentIdPage() {

  const params = useParams()
  const documentId = params.documentId as Id<"documents">

  const document = useQuery(api.documents.getById, {
    documentId: documentId
  })

  if (document === undefined) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (document === null) {
    return (
      <div>Not Found</div>
    )
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage}/>
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default DocumentIdPage