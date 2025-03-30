import React from "react";
import { cn } from "@/lib/utils"; // optional: if you want to merge classNames

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-2xl border bg-white shadow-md", className)}>
      {children}
    </div>
  );
}
