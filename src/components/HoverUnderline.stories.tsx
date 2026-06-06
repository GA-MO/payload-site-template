import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HoverUnderline } from './HoverUnderline'

// HoverUnderline is a bare decorative bar — it only animates inside a
// `group relative` parent, so every story supplies one.
const meta = {
  title: 'Components/HoverUnderline',
  component: HoverUnderline,
  parameters: { layout: 'centered' }
} satisfies Meta<typeof HoverUnderline>

export default meta

type Story = StoryObj<typeof meta>

export const OnText: Story = {
  render: () => (
    <span className="group relative inline-block cursor-pointer text-lg text-typo-primary">
      Hover me — the line swipes through
      <HoverUnderline />
    </span>
  )
}

export const OnButton: Story = {
  render: () => (
    <button type="button" className="group relative inline-flex cursor-pointer text-lg text-typo-primary">
      Submit
      <HoverUnderline />
    </button>
  )
}

export const Behaviour: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-typo-secondary">
        Enters left→right on hover; on mouse-out it keeps travelling the same way
        (collapses rightward) instead of retracting.
      </p>
      <span className="group relative inline-block cursor-pointer text-lg text-typo-primary">
        Move the cursor on and off
        <HoverUnderline />
      </span>
    </div>
  )
}
