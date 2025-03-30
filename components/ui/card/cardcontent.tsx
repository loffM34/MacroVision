import React from "react";
import { cn } from "@/lib/utils"; // optional: helps merge classNames

type CardContentProps = {
  className?: string;
  children: React.ReactNode;
};

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
