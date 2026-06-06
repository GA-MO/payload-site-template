import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextReveal } from "./TextReveal";

const meta = {
  title: "Components/TextReveal",
  component: TextReveal,
  parameters: { layout: "fullscreen" },
  args: {
    children: null,
    duration: 0.9,
    delay: 0,
    stagger: 0.12,
    tilt: 4,
    trigger: "scroll",
    start: "top 85%",
    once: true,
  },
  argTypes: {
    duration: { control: { type: "number", min: 0.1, step: 0.1 } },
    delay: { control: { type: "number", min: 0, step: 0.1 } },
    stagger: { control: { type: "number", min: 0, step: 0.02 } },
    tilt: { control: { type: "number", min: 0, max: 30, step: 1 } },
    trigger: { control: "select", options: ["scroll", "load"] },
    once: { control: "boolean" },
  },
} satisfies Meta<typeof TextReveal>;

export default meta;

type Story = StoryObj<typeof meta>;

const COPY =
  "We borrow our pencil to craft your branding. Every line is drawn with intent, every word placed to tilt your story upward into view.";

export const Paragraph: Story = {
  render: (args) => (
    <div className="min-h-[200vh]">
      <section className="flex h-screen items-center justify-center text-typo-muted">
        <p>Scroll down to trigger reveal ↓</p>
      </section>
      <section className="flex h-screen items-start justify-center px-8 pt-32">
        <TextReveal
          {...args}
          className="max-w-180 text-3xl leading-[1.4] text-typo-primary"
        >
          {COPY}
        </TextReveal>
      </section>
    </div>
  ),
};

export const Heading: Story = {
  args: { trigger: "load" },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center px-8">
      <TextReveal
        {...args}
        as="h1"
        className="max-w-240 text-6xl leading-[1.1] text-typo-primary"
      >
        Borrow our pencil to craft your Branding
      </TextReveal>
    </div>
  ),
};

export const OnLoad: Story = {
  args: { trigger: "load" },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center px-8">
      <TextReveal
        {...args}
        className="max-w-180 text-2xl leading-normal text-typo-secondary"
      >
        {COPY}
      </TextReveal>
    </div>
  ),
};
