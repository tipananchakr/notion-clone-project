import { Button } from "@/components/ui/button"
import { Logo } from "./Logo"

export const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50">
      <Logo/>
      <div className="md:ml-auto md:justify-end  flex items-center justify-between gap-x-2 text-muted-foreground">
        <Button variant={"ghost"}>
          Privacy Policy
        </Button>
        <Button variant={"ghost"}>
          Terms & Conditions
        </Button>
      
      </div>
      
    </div>
  )
}