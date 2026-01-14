/**
 * Landing Page Variation 1: Modern & Clean
 *
 * Design philosophy:
 * - Minimalist approach with generous whitespace
 * - Clean typography hierarchy
 * - Subtle animations and hover states
 * - Professional, sophisticated feel
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cardSets } from "@/lib/data/sets";
import { Button } from "@/components/ui/button";
import { SetCard } from "@/components/landing";

export default function LandingVariation1() {
  const [selectedSet, setSelectedSet] = useState(cardSets[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * cardSets.length);
    setSelectedSet(cardSets[randomIndex]);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Now shipping worldwide
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Collect the classics.
              <br />
              <span className="text-muted-foreground">Own the originals.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover the Pokemon trading cards that stood the test of time.
              Every card is inspected, graded, and verified by the experts.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-8">
                Browse All Cards
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8">
                View Sets
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Marquee section */}
        <div className="relative w-full overflow-hidden py-8">
          {/* Left fade overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee" style={{ width: 'max-content' }}>
            {/* Three copies of the image for seamless loop on ultra-wide screens */}
            <img
              src="/hero-carousel.webp"
              alt="Pokemon cards showcase"
              className="h-48 w-auto max-w-none shrink-0"
            />
            <img
              src="/hero-carousel.webp"
              alt=""
              aria-hidden="true"
              className="h-48 w-auto max-w-none shrink-0"
            />
            <img
              src="/hero-carousel.webp"
              alt=""
              aria-hidden="true"
              className="h-48 w-auto max-w-none shrink-0"
            />
          </div>
        </div>

        {/* Marquee animation styles */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `}</style>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
            {[
              { value: "5", label: "Original Sets" },
              { value: "441+", label: "Unique Cards" },
              { value: "10,000+", label: "Cards in Stock" },
              { value: "100%", label: "Expert Graded & Verified" },
            ].map((stat) => (
              <div key={stat.label} className="py-8 md:py-12 text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sets Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by Set
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our collection of classic Pokemon card sets. Each set offers
              unique artwork, rare finds, and nostalgic favorites.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardSets.map((set) => (
              <SetCard key={set.id} set={set} variant="default" showAllPacks />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Set */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Set
          </h2>
          <SetCard set={selectedSet} variant="featured" />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Collectors
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              We take authenticity seriously. Every card in our inventory is
              carefully inspected and graded by our expert team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Verified Authentic",
                  description: "Every card is inspected for authenticity before listing.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  title: "Condition Graded",
                  description: "Clear condition ratings from Mint to Poor on every card.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  ),
                },
                {
                  title: "Secure Shipping",
                  description: "Protected packaging ensures your cards arrive safely.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Collection Today
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of collectors who trust us for authentic Pokemon cards.
          </p>
          <Button size="lg" variant="secondary" className="text-base px-8">
            Browse All Cards
          </Button>
        </div>
      </section>
    </div>
  );
}
