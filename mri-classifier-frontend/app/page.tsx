"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import Motivation from "@/components/sections/Motivation";
import Methodology from "@/components/sections/Methodology";
import ModelsGrid from "@/components/sections/ModelsGrid";
import Results from "@/components/sections/Results";
import { paperResults } from "@/lib/modelResults";

export default function Home() {
  const [activeModel, setActiveModel] = useState("Xception");

  return (
    <div className="flex flex-col min-h-screen bg-bg-deep text-text-primary">
      <Hero />
      <Motivation />
      <Methodology />
      <ModelsGrid
        models={paperResults}
        activeModel={activeModel}
        onSelectModel={setActiveModel}
      />
      <Results
        models={paperResults}
        activeModel={activeModel}
        onSelectModel={setActiveModel}
      />
    </div>
  );
}
