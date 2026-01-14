/**
 * Landing Page Demo Index
 *
 * Showcases all landing page variations with descriptions
 * and quick navigation to each one.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LandingVariation {
  id: number;
  name: string;
  description: string;
  style: string;
  colors: {
    from: string;
    to: string;
  };
  features: string[];
}

const variations: LandingVariation[] = [
  {
    id: 1,
    name: "Modern & Clean",
    description: "Minimalist design with generous whitespace, clean typography, and subtle animations. Professional and sophisticated.",
    style: "Minimalist",
    colors: { from: "#f8fafc", to: "#e2e8f0" },
    features: ["Clean typography", "Subtle animations", "Professional feel", "Trust-focused"],
  },
  {
    id: 2,
    name: "Vibrant & Playful",
    description: "Bold, colorful design inspired by Pokemon's energetic spirit. Dynamic layouts with fun interactive elements.",
    style: "Playful",
    colors: { from: "#fbbf24", to: "#ef4444" },
    features: ["Bold gradients", "Interactive set explorer", "Fun animations", "Energetic feel"],
  },
  {
    id: 3,
    name: "Premium Dark Theme",
    description: "Luxurious dark aesthetic with gold accents. Emphasizes rarity and collectible value for serious collectors.",
    style: "Luxury",
    colors: { from: "#1a1a1a", to: "#0a0a0a" },
    features: ["Dark theme", "Gold accents", "Gallery style", "Collector-focused"],
  },
  {
    id: 4,
    name: "Magazine Editorial",
    description: "Editorial magazine-style layout with large typography, asymmetric grids, and story-driven presentation.",
    style: "Editorial",
    colors: { from: "#ffffff", to: "#f1f5f9" },
    features: ["Large typography", "Asymmetric grid", "Story-driven", "Visual hierarchy"],
  },
  {
    id: 5,
    name: "Interactive Showcase",
    description: "Immersive full-screen experience with 3D card effects, horizontal scrolling, and smooth animations.",
    style: "Immersive",
    colors: { from: "#0f172a", to: "#020617" },
    features: ["3D card effects", "Horizontal scroll", "Dark immersive", "Interactive"],
  },
];

export default function LandingDemoIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-14 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Landing Page Demos</h1>
              <p className="text-sm text-muted-foreground">
                5 unique variations to explore
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">
              Design Showcase
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Style
            </h2>
            <p className="text-lg text-muted-foreground">
              Each landing page variation offers a unique approach to showcasing your Pokemon card collection.
              From minimalist and clean to bold and immersive — find the perfect fit for your brand.
            </p>
          </div>
        </div>
      </section>

      {/* Variations Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {variations.map((variation, index) => (
              <Link
                key={variation.id}
                href={`/landing-demo/${variation.id}`}
                className="group block"
              >
                <div className="relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-primary/50">
                  <div className="grid md:grid-cols-12 gap-0">
                    {/* Preview section */}
                    <div
                      className="md:col-span-4 aspect-video md:aspect-auto md:min-h-[280px] relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${variation.colors.from}, ${variation.colors.to})`,
                      }}
                    >
                      {/* Decorative elements */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl font-black opacity-10 text-foreground">
                          {variation.id.toString().padStart(2, "0")}
                        </div>
                      </div>
                      {/* Style badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full">
                          {variation.style}
                        </span>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="md:col-span-8 p-6 md:p-8">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="text-sm text-muted-foreground mb-1 block">
                              Variation {variation.id}
                            </span>
                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                              {variation.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                            View Demo
                            <svg
                              className="w-4 h-4 transition-transform group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 flex-1">
                          {variation.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {variation.features.map((feature) => (
                            <span
                              key={feature}
                              className="inline-block bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Quick Navigation</h3>
              <p className="text-muted-foreground">
                Jump directly to any variation
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {variations.map((v) => (
                <Link key={v.id} href={`/landing-demo/${v.id}`}>
                  <Button variant="outline" size="sm">
                    {v.id}. {v.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
