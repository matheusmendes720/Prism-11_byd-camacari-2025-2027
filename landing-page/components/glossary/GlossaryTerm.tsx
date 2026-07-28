'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { glossary } from './glossary-data';

interface GlossaryTermProps {
  term: keyof typeof glossary;
  children?: React.ReactNode;
}

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const definition = glossary[term];
  const id = `glossary-${term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <span
          className="border-b border-dotted border-energy-yellow/50 cursor-help focus:outline-none focus:ring-2 focus:ring-energy-red"
          aria-describedby={id}
          tabIndex={0}
        >
          {children ?? term}
        </span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 max-w-xs rounded-md border border-border-subtle bg-bg-panel p-3 text-sm text-matter-white shadow-electric"
          sideOffset={4}
        >
          <strong className="block font-data text-energy-yellow mb-1">{term}</strong>
          <span className="text-matter-steel">{definition}</span>
          <HoverCard.Arrow className="fill-bg-panel" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
