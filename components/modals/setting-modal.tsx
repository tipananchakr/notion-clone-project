"use client"

import { useSetting } from "@/hooks/use-setting"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { ModeToggle } from "../mode-toggle"

export const SettingModal = () => {
  const isOpen = useSetting((store) => store.isOpen)
  const onClose = useSetting((store) => store.onClose)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-medium">
            My settings
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>
              Appearance
            </Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Motion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>

    </Dialog>
  )
}