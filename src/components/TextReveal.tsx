"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";
import { MOTION } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

type TextRevealTrigger = "scroll" | "load";

type TextRevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  tilt?: number;
  trigger?: TextRevealTrigger;
  start?: string;
  once?: boolean;
  className?: string;
};

export function TextReveal({
  children,
  as = "p",
  delay = 0,
  duration = MOTION.duration,
  ease = MOTION.ease,
  stagger = MOTION.stagger,
  tilt = 4,
  trigger = "scroll",
  start = MOTION.start,
  once = true,
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Reduced-motion: the branch never runs, so the text is never split or
      // hidden — it renders as plain, fully-visible copy.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // aria: "none" keeps the real text in the accessibility tree instead of
        // GSAP's default aria-label, which is prohibited on a plain <p>.
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          aria: "none",
        });

        const from: gsap.TweenVars = {
          yPercent: 100,
          rotate: tilt,
          opacity: 0,
          transformOrigin: "0% 100%",
        };

        const to: gsap.TweenVars = {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration,
          delay,
          ease,
          stagger,
        };

        gsap.set(split.lines, from);

        if (trigger === "scroll") {
          gsap.to(split.lines, {
            ...to,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: once
                ? "play none none none"
                : "play none none reverse",
            },
          });
        } else {
          gsap.to(split.lines, to);
        }

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [trigger, once, tilt, stagger] },
  );

  const Tag = as;

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
