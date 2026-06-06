import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ArrowDiagonal,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} from "./Arrow";

const meta: Meta = {
  title: "Icons/Arrow",
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-wide text-typo-secondary">
          Default (24px)
        </div>
        <div className="flex items-center gap-4">
          <ArrowRight />
          <ArrowLeft />
          <ArrowUp />
          <ArrowDown />
          <ArrowDiagonal />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-wide text-typo-secondary">
          Sizes (16 / 20 / 24 / 32 px)
        </div>
        <div className="flex items-end gap-4">
          <ArrowRight size={16} />
          <ArrowRight size={20} />
          <ArrowRight size={24} />
          <ArrowRight size={32} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-wide text-typo-secondary">
          Colors (currentColor)
        </div>
        <div className="flex items-center gap-4">
          <ArrowRight className="text-typo-primary" />
          <ArrowRight className="text-typo-secondary" />
          <ArrowRight className="text-typo-muted" />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-wide text-typo-secondary">
          Disabled (opacity-20)
        </div>
        <div className="flex items-center gap-4">
          <ArrowRight className="opacity-20" />
          <ArrowLeft className="opacity-20" />
          <ArrowUp className="opacity-20" />
          <ArrowDown className="opacity-20" />
          <ArrowDiagonal className="opacity-20" />
        </div>
      </section>
    </div>
  ),
};

export const Right: Story = {
  render: () => <ArrowRight />,
  parameters: { layout: "centered" },
};

export const Left: Story = {
  render: () => <ArrowLeft />,
  parameters: { layout: "centered" },
};

export const Up: Story = {
  render: () => <ArrowUp />,
  parameters: { layout: "centered" },
};

export const Down: Story = {
  render: () => <ArrowDown />,
  parameters: { layout: "centered" },
};

export const Diagonal: Story = {
  render: () => <ArrowDiagonal />,
  parameters: { layout: "centered" },
};
