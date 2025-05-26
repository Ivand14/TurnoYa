import * as React from "react";
import * as TogglePrimitives from "@radix-ui/react-toggle";

import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

const TrashButton = React.forwardRef<
  React.ElementRef<typeof TogglePrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitives.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitives.Root
    className={cn(
      "inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-transparent transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2",
      className
    )}
    {...props}
    ref={ref}
  >
    <Trash className="h-20 w-4" />
  </TogglePrimitives.Root>
));

TrashButton.displayName = "TrashButton";

export { TrashButton };
