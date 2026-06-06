import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { CookieBanner } from "./CookieBanner";

const STORY_KEY = "storybook-cookie-consent";

const meta = {
  title: "Components/CookieBanner",
  component: CookieBanner,
  parameters: { layout: "fullscreen" },
  args: {
    storageKey: STORY_KEY,
    description:
      "We use cookies to improve your experience and analyze site traffic.",
    acceptLabel: "Accept",
    declineLabel: "Decline",
    onAccept: fn(),
    onDecline: fn(),
  },
  argTypes: {
    description: { control: "text" },
    acceptLabel: { control: "text" },
    declineLabel: { control: "text" },
    storageKey: { control: "text" },
  },
  beforeEach: () => {
    localStorage.removeItem(STORY_KEY);
  },
} satisfies Meta<typeof CookieBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Thai: Story = {
  args: {
    description:
      "เว็บไซต์นี้ใช้คุกกี้เพื่อเพิ่มประสิทธิภาพการใช้งานและวิเคราะห์การเข้าชมเว็บไซต์",
    acceptLabel: "ยอมรับทั้งหมด",
    declineLabel: "ปฏิเสธ",
  },
};
