"use client"

import { useCoverImage } from "@/hooks/use-cover-image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"
import { useEdgeStore } from "@/lib/edgestore"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { deleteEdgeStoreFileByUrl } from "@/lib/edgestore-file"
import { SingleImageDropzone } from "../single-image-dropzone"
import { toast } from "sonner"

export const CoverImageModal = () => {
  const params = useParams()
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const update = useMutation(api.documents.update)
  const document = useQuery(
    api.documents.getById,
    coverImage.isOpen
      ? { documentId: params.documentId as Id<"documents"> }
      : "skip",
  )

  const [isSubmitting, setSubmitting] = useState(false)
  const [file, setFile] = useState<File>()

  const onClose = () => {
    setFile(undefined)
    setSubmitting(false)
    coverImage.onClose()

  }
  const onChange = async (file?: File) => {
    if (!file) return

    setSubmitting(true)
    setFile(file)

    try {
      const res = await edgestore.publicFiles.upload({ file })

      if (document?.coverImage) {
        await deleteEdgeStoreFileByUrl(
          edgestore.publicFiles,
          document.coverImage,
        )
      }

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      })

      onClose()
    } catch {
      toast.error("Failed to update cover image")
      setSubmitting(false)
      setFile(undefined)
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
        <div className="flex justify-center px-1">
          <SingleImageDropzone
            value={file}
            onChange={onChange}
            disabled={isSubmitting}
            isUploading={isSubmitting}
          />
        </div>
      </DialogContent>     

    </Dialog>
  )
}