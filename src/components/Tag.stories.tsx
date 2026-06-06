import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag } from "./Tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  args: {
    mobile: false,
    text: "Brand Philosophy",
  },
  argTypes: {
    mobile: { control: "boolean" },
    text: { control: "text" },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  args: { mobile: true },
};

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="text-xs uppercase tracking-wide text-typo-secondary">
        Desktop / Mobile
      </div>
      <div className="flex items-center gap-3">
        <Tag text="Brand Philosophy" />
        <Tag text="Studio" mobile />
      </div>
    </div>
  ),
};
