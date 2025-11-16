import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  children: React.ReactNode
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  destructive?: boolean
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = ({ children, asChild, ...props }: DropdownMenuTriggerProps) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
        const childProps = children.props as any
        childProps.onClick?.(e)
      },
    } as any)
  }

  return (
    <button {...props} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}>
      {children}
    </button>
  )
}

const DropdownMenuContent = ({ children, align = "end", className, ...props }: DropdownMenuContentProps) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md mt-1",
        "animate-in fade-in-0 zoom-in-95",
        alignmentClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, destructive, className, onClick, ...props }: DropdownMenuItemProps) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext)

  return (
    <button
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors w-full text-left",
        destructive
          ? "text-destructive hover:bg-destructive hover:text-destructive-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        setIsOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
