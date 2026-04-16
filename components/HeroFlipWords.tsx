import React from "react";
import { FlipWords } from "@/components/ui/flip-words";

export function HeroFlipWords() {
  const words = ["Timeless", "Luxury", "Bespoke"];

  return (
    <FlipWords 
        words={words} 
        duration={3000}
        className="font-bold" 
    />
  );
}
