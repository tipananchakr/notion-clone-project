"use client"

import { useCoverImage } from "@/hooks/use-cover-image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"
import { useEdgeStore } from "@/lib/edgestore"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { SingleImageDropzone } from "../single-image-dropzone"

export const CoverImageModal = () => {
  const params = useParams()
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const update = useMutation(api.documents.update)

  const [isSubmitting, setSubmitting] = useState(false)
  const [file, setFile] = useState<File>()

  const onClose = () => {
    setFile(undefined)
    setSubmitting(false)
    coverImage.onClose()

  }
  const onChange = async (file?: File) => {
    if (file) {
      setSubmitting(true)
      setFile(file)

      const res = await edgestore.publicFiles.upload({file})

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url
      })

      onClose()
    }
  }

  return (
    <Dialog 
      open={coverImage.isOpen}
      onOpenChange={coverImage.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Cover Image
          </DialogTitle>
        </DialogHeader>
        <SingleImageDropzone 
          value={file} 
          onChange={onChange} 
          disabled={isSubmitting}
          isUploading={isSubmitting}
        />
      </DialogContent>     

    </Dialog>
  )
}