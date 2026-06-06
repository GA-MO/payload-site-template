import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  args: {
    variant: "external",
    size: "lg",
    showArrow: true,
    arrow: "diagonal",
    text: "Text message",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["external", "internal", "primary"],
    },
    size: {
      control: "inline-radio",
      options: ["lg", "md"],
    },
    arrow: {
      control: "inline-radio",
      options: ["right", "left", "up", "down", "diagonal"],
    },
    showArrow: { control: "boolean" },
    text: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExternalLg: Story = {};

export const ExternalMd: Story = {
  args: { size: "md" },
};

export const InternalLg: Story = {
  args: { variant: "internal" },
};

export const InternalMd: Story = {
  args: { variant: "internal", size: "md" },
};

export const WithoutArrow: Story = {
  args: { showArrow: false },
};

// The Submit case: primary text + swipe underline on hover, no arrow.
export const PrimarySubmit: Story = {
  args: { variant: "primary", showArrow: false, text: "Submit" },
};

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="text-xs uppercase tracking-wide text-typo-secondary">
          External — link ที่ไป external site
        </div>
        <div className=" items-center gap-8">
          <div className="flex w-16 shrink-0 text-xs text-typo-secondary">
            Default
          </div>
          <br />
          <Button variant="external" size="lg" text="Text message" />
          <br />
          <Button variant="external" size="md" text="Text message" />
        </div>
        <div className="text-xs text-typo-secondary">
          (Hover styles ทำงานเมื่อ hover ปุ่ม)
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="text-xs uppercase tracking-wide text-typo-secondary">
          Internal — link ที่อยู่ในเว็บเรา
        </div>
        <div className=" items-center gap-8">
          <div className="flex w-16 shrink-0 text-xs text-typo-secondary">
            Default
          </div>
          <br />
          <Button variant="internal" size="lg" text="Text message" />
          <br />
          <Button variant="internal" size="md" text="Text message" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="text-xs uppercase tracking-wide text-typo-secondary">
          Primary — text-link สีหลัก เส้นวิ่งตอน hover (เช่น Submit)
        </div>
        <div className="flex items-center gap-8">
          <Button variant="primary" showArrow={false} text="Submit" />
          <Button variant="external" showArrow={false} text="Read more" />
        </div>
        <div className="text-xs text-typo-secondary">
          (เลื่อนเมาส์เข้า-ออก เส้นจะวิ่งซ้าย→ขวาทั้งสองทาง)
        </div>
      </section>
    </div>
  ),
};
