import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: { layout: "centered" },
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "Inner page" },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoLevels: Story = {
  args: {
    items: [{ label: "Home", href: "/" }, { label: "Work" }],
  },
};

export const DeepNested: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "Projects", href: "/work/projects" },
      { label: "Brand Philosophy" },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: "›",
  },
};

export const AllLinks: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
    ],
  },
};
