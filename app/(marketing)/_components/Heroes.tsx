import Image from "next/image"

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
          <Image
            src="/hero.svg"
            fill
            alt="document"
          />
        </div>
        <div className="relative h-[300px] w-[300px] hidden md:block">
          <Image
            fill
            src={"/paper.svg"}
            alt="paper"
          />
        </div>
      </div>
    </div>
  )
}