import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dropdown } from "./Dropdown";

const SERVICES = [
  { value: "branding", label: "Branding" },
  { value: "strategy", label: "Strategy" },
  { value: "campaign", label: "Campaign" },
  { value: "digital", label: "Digital" },
  { value: "packaging", label: "Packaging" },
];

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: { layout: "centered" },
  args: {
    options: SERVICES,
    placeholder: "Select your service",
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const WithSelectedValue: Story = {
  args: { defaultValue: "branding" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const InHeading: Story = {
  render: (args) => (
    <h2 className="max-w-[28rem] text-[2.5rem] leading-[1.15] text-typo-primary">
      Borrow our pencil to craft your <Dropdown {...args} />
    </h2>
  ),
};

export const InHeadingWithValue: Story = {
  args: { defaultValue: "branding", placeholder: "Select your service" },
  render: (args) => (
    <h2 className="max-w-[28rem] text-[2.5rem] leading-[1.15] text-typo-primary">
      Borrow our pencil to craft your <Dropdown {...args} />
    </h2>
  ),
};

export const InParagraph: Story = {
  render: (args) => (
    <p className="max-w-md text-[1.125rem] leading-[1.5] text-typo-primary">
      We can help you build a <Dropdown {...args} /> that resonates with your
      audience.
    </p>
  ),
};
