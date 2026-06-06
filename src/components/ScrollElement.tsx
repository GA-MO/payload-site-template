"use client";

import { Element } from "react-scroll";
import type { ReactNode } from "react";

export function ScrollElement({
  name,
  id,
  className,
  children,
}: {
  name: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Element name={name} id={id} className={className}>
      {children}
    </Element>
  );
}
