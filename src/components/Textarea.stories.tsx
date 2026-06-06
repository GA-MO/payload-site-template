import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./Textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: "Message",
    rows: 4,
  },
  argTypes: {
    rows: { control: { type: "number", min: 1, step: 1 } },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue:
      "We'd love to learn more about your project. Please share a brief description, timeline, and any references.",
  },
};

export const Tall: Story = {
  args: { rows: 8 },
};

export const Disabled: Story = {
  args: { disabled: true },
};
