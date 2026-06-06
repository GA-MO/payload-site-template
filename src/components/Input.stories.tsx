import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: "Name",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "Thawatchai",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Email",
  },
};

export const Optional: Story = {
  args: {
    placeholder: "Your company (optional)",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Name",
    disabled: true,
  },
};
