import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Check } from "lucide-react";

export default function DesignSandboxPage() {
  const sandboxPages = [
    {
      title: "Badge Components",
      description:
        "Reusable RarityBadge and ConditionBadge components with outlined style and subtle backgrounds. Used throughout the application for consistent card status display.",
      href: "/design-sandbox/badges",
      status: "Production",
    },
    {
      title: "Card Row Component",
      description:
        "Compact row-based layout for displaying cards in search results. Features stock count, conditions available, rarity badges, and starting price.",
      href: "/design-sandbox/card-display",
      status: "Production",
    },
    {
      title: "Card Detail Component",
      description:
        "Split hero layout for individual card pages. Card image on left, condition selector and add to cart on right. Professional aesthetic with full purchase functionality.",
      href: "/design-sandbox/card-details",
      status: "Production",
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
              Component Library
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Design Sandbox
          </h1>
          <p className="text-lg text-muted-foreground">
            A dedicated space for viewing production-ready UI components.
            These components are used throughout the application and are
            documented here for reference.
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
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 dark:bg-green-950 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300 mb-3">
                  <Check className="h-3 w-3" />
                  {page.status}
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {page.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {page.description}
                </p>
              </div>
              <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                View Component
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Documentation Link */}
        <div className="mt-12 rounded-2xl border bg-muted/30 p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Component Documentation</h3>
          <p className="text-muted-foreground mb-4">
            Learn about the methodology and best practices for using these
            components effectively in your implementation.
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
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
