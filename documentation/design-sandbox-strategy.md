# Design Sandbox Strategy

## Overview

The design sandbox is a dedicated area within the application for rapid design iteration and exploration. It allows for creating, viewing, and comparing multiple design variations of UI components without affecting the production codebase.

## Purpose

- **Rapid Prototyping**: Quickly create multiple design variations without worrying about breaking existing functionality
- **Easy Comparison**: Toggle between different design approaches to evaluate which works best
- **Client Review**: Provide a centralized location for stakeholders to review and provide feedback on design options
- **Design Documentation**: Serve as a living style guide showing different approaches to common UI patterns

## Structure

Location: `src/app/design-sandbox/`

Each UI component or pattern gets its own subdirectory with a `page.tsx` file that contains:

1. **Multiple Variants**: At least 4 different design approaches for the component
2. **Variant Switcher**: A dropdown/selector at the top of the page to toggle between variants
3. **Descriptive Labels**: Clear naming for each variant (e.g., "Compact Grid", "Card with Image", "Detailed List View")
4. **Realistic Data**: Use actual or realistic mock data to see how designs perform with real content

## Implementation Pattern

### Standard Page Structure

```tsx
"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ComponentVariantsPage() {
  const [variant, setVariant] = useState("variant1");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Component Name Variants</h1>
        <p className="text-muted-foreground mb-4">
          Brief description of what this component does and where it's used.
        </p>

        {/* Variant Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Select Variant:</label>
          <Select value={variant} onValueChange={setVariant}>
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="variant1">Variant 1: Descriptive Name</SelectItem>
              <SelectItem value="variant2">Variant 2: Descriptive Name</SelectItem>
              <SelectItem value="variant3">Variant 3: Descriptive Name</SelectItem>
              <SelectItem value="variant4">Variant 4: Descriptive Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Variant Display */}
      {variant === "variant1" && <Variant1Component />}
      {variant === "variant2" && <Variant2Component />}
      {variant === "variant3" && <Variant3Component />}
      {variant === "variant4" && <Variant4Component />}
    </div>
  );
}
```

## Current Sandbox Pages

### 1. Card Display Variants (`/design-sandbox/card-display`)
Explores different ways to display Pokemon cards in search results and listing pages.

**Variants:**
- Compact grid with minimal information
- Card-based layout with hover effects
- List view with detailed information
- Large card showcase with prominent imagery

### 2. Badge Variants (`/design-sandbox/badges`)
Different approaches to displaying Rarity and Condition badges throughout the application.

**Variants:**
- Pill badges with solid colors
- Outlined badges with subtle backgrounds
- Icon + text badges
- Minimalist text-only badges

### 3. Card Details Page (`/design-sandbox/card-details`)
Various layouts for the individual card details/view page.

**Variants:**
- Split view (image left, details right)
- Centered hero image with details below
- Tabbed interface for different information sections
- Compact side-by-side with quick actions

## Design Guidelines

When creating variants in the design sandbox:

1. **Stay Consistent with Brand**: Keep the modern, clean, professional aesthetic aligned with the landing page
2. **Accessibility First**: Ensure all variants meet accessibility standards (contrast, focus states, semantic HTML)
3. **Mobile Responsive**: Design variants should work well on mobile, tablet, and desktop
4. **Real Data**: Use actual component props and data structures to ensure designs work with production data
5. **Performance**: Keep variants performant - they should render quickly even with multiple cards/items

## Benefits

- **Faster Iteration**: Create multiple designs without affecting production code
- **Better Decision Making**: Side-by-side comparison helps choose the best approach
- **Team Collaboration**: Easy for designers, developers, and stakeholders to review together
- **Reduced Risk**: Test designs in isolation before implementing in production
- **Design System Evolution**: Variants can inform future component library decisions

## Usage

1. Navigate to `/design-sandbox/{component-name}` in your browser
2. Use the variant selector dropdown to switch between designs
3. Test interactions, responsive behavior, and visual hierarchy
4. Gather feedback from team and stakeholders
5. Once a variant is chosen, implement it in the production codebase

## Future Enhancements

- Add side-by-side comparison mode
- Include variant metadata (pros/cons, use cases)
- Add performance metrics for each variant
- Export variants as screenshots for presentations
- Link to Figma designs or design specifications
