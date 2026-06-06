import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Appear, AppearGroup, type AppearEffect } from "./Appear";

const EFFECTS: AppearEffect[] = [
  "fade",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "scale",
  "blur",
];

const meta = {
  title: "Components/Appear",
  component: Appear,
  parameters: { layout: "fullscreen" },
  args: {
    children: null,
    effect: "slide-up",
    duration: 0.8,
    delay: 0,
    trigger: "scroll",
    start: "top 80%",
    once: true,
  },
  argTypes: {
    effect: { control: "select", options: EFFECTS },
    trigger: { control: "select", options: ["scroll", "load"] },
    duration: { control: { type: "number", min: 0.1, step: 0.1 } },
    delay: { control: { type: "number", min: 0, step: 0.1 } },
    once: { control: "boolean" },
  },
} satisfies Meta<typeof Appear>;

export default meta;

type Story = StoryObj<typeof meta>;

const ScrollFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[200vh]">
    <section className="flex h-screen items-center justify-center text-typo-muted">
      <p>Scroll down to trigger reveal ↓</p>
    </section>
    <section className="flex h-screen items-start justify-center pt-20">
      {children}
    </section>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <ScrollFrame>
      <Appear {...args}>
        <h1 className="text-5xl leading-[1.15] text-typo-primary">
          Borrow our pencil to craft your Branding
        </h1>
      </Appear>
    </ScrollFrame>
  ),
};

export const OnLoad: Story = {
  args: { trigger: "load" },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center">
      <Appear {...args}>
        <h1 className="text-5xl leading-[1.15] text-typo-primary">
          Hello, world.
        </h1>
      </Appear>
    </div>
  ),
};

export const Stagger: Story = {
  render: (args) => (
    <ScrollFrame>
      <AppearGroup
        effect={args.effect}
        duration={args.duration}
        trigger={args.trigger}
        start={args.start}
        once={args.once}
        stagger={0.12}
        className="grid w-240 max-w-full grid-cols-3 gap-6"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-4/5 bg-base-100"
          />
        ))}
      </AppearGroup>
    </ScrollFrame>
  ),
};

export const EffectGallery: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex flex-col gap-16 px-12 py-24">
      <section className="flex h-screen items-center justify-center text-typo-muted">
        <p>Scroll down to see each effect ↓</p>
      </section>
      {EFFECTS.map((effect) => (
        <section
          key={effect}
          className="flex min-h-[60vh] items-center justify-center"
        >
          <Appear effect={effect} duration={0.9}>
            <h2 className="text-4xl leading-[1.2] text-typo-primary">
              {effect}
            </h2>
          </Appear>
        </section>
      ))}
    </div>
  ),
};

export const DelayChain: Story = {
  render: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Appear effect="slide-up" trigger="load" delay={0}>
        <p className="text-typo-muted">First.</p>
      </Appear>
      <Appear effect="slide-up" trigger="load" delay={0.2}>
        <h1 className="text-5xl text-typo-primary">Second, bigger.</h1>
      </Appear>
      <Appear effect="slide-up" trigger="load" delay={0.5}>
        <p className="text-typo-secondary">Third, after a beat.</p>
      </Appear>
    </div>
  ),
};

export const Repeat: Story = {
  args: { once: false },
  render: (args) => (
    <div className="flex flex-col">
      <section className="flex h-screen items-center justify-center text-typo-muted">
        <p>Scroll down ↓</p>
      </section>
      <section className="flex h-screen items-start justify-center pt-20">
        <Appear {...args}>
          <h2 className="text-4xl text-typo-primary">
            I replay every time you scroll back to me
          </h2>
        </Appear>
      </section>
      <section className="flex h-screen items-center justify-center text-typo-muted">
        <p>Scroll back up ↑</p>
      </section>
    </div>
  ),
};
