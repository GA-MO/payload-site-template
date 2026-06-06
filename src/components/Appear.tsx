"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";
import { MOTION } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export type AppearEffect =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur";

type AppearTrigger = "scroll" | "load";

const FROM: Record<AppearEffect, gsap.TweenVars> = {
  "fade": { opacity: 0 },
  "slide-up": { opacity: 0, y: MOTION.distance },
  "slide-down": { opacity: 0, y: -MOTION.distance },
  "slide-left": { opacity: 0, x: MOTION.distance },
  "slide-right": { opacity: 0, x: -MOTION.distance },
  "scale": { opacity: 0, scale: 0.94 },
  "blur": { opacity: 0, filter: "blur(12px)" },
};

const TO: Record<AppearEffect, gsap.TweenVars> = {
  "fade": { opacity: 1 },
  "slide-up": { opacity: 1, y: 0 },
  "slide-down": { opacity: 1, y: 0 },
  "slide-left": { opacity: 1, x: 0 },
  "slide-right": { opacity: 1, x: 0 },
  "scale": { opacity: 1, scale: 1 },
  "blur": { opacity: 1, filter: "blur(0px)" },
};

// Opt-in focus-pull: layer a defocus on top of the chosen effect. Off by
// default so card grids (many images) stay cheap.
function buildVars(effect: AppearEffect, blur: boolean) {
  const from = { ...FROM[effect] };
  const to = { ...TO[effect] };
  if (blur && effect !== "blur") {
    from.filter = `blur(${MOTION.blur}px)`;
    to.filter = "blur(0px)";
  }
  return { from, to };
}

type CommonProps = {
  effect?: AppearEffect;
  delay?: number;
  duration?: number;
  ease?: string;
  trigger?: AppearTrigger;
  start?: string;
  once?: boolean;
  blur?: boolean;
  className?: string;
};

type AppearProps = CommonProps & {
  children: ReactNode;
};

export function Appear({
  children,
  effect = "slide-up",
  delay = 0,
  duration = MOTION.duration,
  ease = MOTION.ease,
  trigger = "scroll",
  start = MOTION.start,
  once = true,
  blur = false,
  className,
}: AppearProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = ref.current;
      if (!target) return;
      const { from, to } = buildVars(effect, blur);

      // Reduced-motion: the branch never runs, so we never hide the element —
      // it just stays at its natural visible state.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(target, from);

        const base: gsap.TweenVars = { ...to, duration, delay, ease };

        if (trigger === "scroll") {
          gsap.to(target, {
            ...base,
            scrollTrigger: {
              trigger: target,
              start,
              toggleActions: once
                ? "play none none none"
                : "play none none reverse",
            },
          });
        } else {
          gsap.to(target, base);
        }
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [effect, trigger, once, blur] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

type AppearGroupProps = CommonProps & {
  children: ReactNode;
  stagger?: number;
};

export function AppearGroup({
  children,
  effect = "slide-up",
  delay = 0,
  duration = MOTION.duration,
  ease = MOTION.ease,
  trigger = "scroll",
  start = MOTION.start,
  once = true,
  stagger = MOTION.stagger,
  blur = false,
  className,
}: AppearGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = ref.current;
      if (!container) return;
      const items = Array.from(container.children) as HTMLElement[];
      if (items.length === 0) return;
      const { from, to } = buildVars(effect, blur);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, from);

        const base: gsap.TweenVars = { ...to, duration, delay, stagger, ease };

        if (trigger === "scroll") {
          gsap.to(items, {
            ...base,
            scrollTrigger: {
              trigger: container,
              start,
              toggleActions: once
                ? "play none none none"
                : "play none none reverse",
            },
          });
        } else {
          gsap.to(items, base);
        }
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [effect, trigger, once, stagger, blur] },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
