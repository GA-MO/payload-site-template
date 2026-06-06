import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: "Select your inquiry",
  },
  render: (args) => (
    <Select {...args}>
      <option value="general">General Inquiry</option>
      <option value="project">New Project</option>
      <option value="career">Career</option>
      <option value="press">Press</option>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelectedValue: Story = {
  args: { defaultValue: "general" },
};

export const NoPlaceholder: Story = {
  args: { placeholder: undefined, defaultValue: "general" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const PhonePrefix: Story = {
  args: { placeholder: undefined, defaultValue: "+66" },
  decorators: [
    (Story) => (
      <div className="w-24">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Select {...args}>
      <option value="+66">(+66)</option>
      <option value="+1">(+1)</option>
      <option value="+44">(+44)</option>
      <option value="+81">(+81)</option>
    </Select>
  ),
};
