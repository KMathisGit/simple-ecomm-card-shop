import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette } from "lucide-react";

export default function DesignSandboxPage() {
  const sandboxPages = [
    {
      title: "Card Display Variants",
      description:
        "Table-like row layouts for displaying Pokemon cards in search results. Features scannable information with stock, conditions, and pricing data.",
      href: "/design-sandbox/card-display",
      variants: 4,
    },
    {
      title: "Badge Variants",
      description:
        "Different approaches to displaying Rarity and Condition badges. From solid color pills to minimalist text-only styles.",
      href: "/design-sandbox/badges",
      variants: 4,
    },
    {
      title: "Card Details Page Variants",
      description:
        "Layouts for the individual card details/view page. Features split hero layout and card-first design with clean, professional aesthetics.",
      href: "/design-sandbox/card-details",
      variants: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Design Exploration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Design Sandbox
          </h1>
          <p className="text-lg text-muted-foreground">
            A dedicated space for rapid design iteration and exploration.
            Compare multiple design variations side-by-side to find the perfect
            approach for each UI component.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sandboxPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group block rounded-2xl border bg-card p-6 transition-all hover:shadow-xl hover:border-primary/50"
            >
              <div className="mb-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                  {page.variants} Variants
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {page.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {page.description}
                </p>
              </div>
              <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                View Variants
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Documentation Link */}
        <div className="mt-12 rounded-2xl border bg-muted/30 p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Design Sandbox Strategy</h3>
          <p className="text-muted-foreground mb-4">
            Learn about the methodology and best practices for using the design
            sandbox effectively.
          </p>
          <Button variant="outline" asChild>
            <Link href="/documentation/design-sandbox-strategy.md">
              Read Documentation
            </Link>
          </Button>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
