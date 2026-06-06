import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextLink } from './TextLink'

const meta = {
  title: 'Components/TextLink',
  component: TextLink,
  parameters: { layout: 'centered' },
  args: {
    children: 'View the case study',
    href: '#'
  },
  argTypes: {
    children: { control: 'text' }
  }
} satisfies Meta<typeof TextLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PlainText: Story = {
  args: { href: undefined, children: 'Just the underline, no link' }
}

export const InParagraph: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <p className="max-w-md text-lg text-typo-primary">
      We build brands with intent. <TextLink href="#">Read our philosophy</TextLink> or{' '}
      <TextLink href="#">get in touch</TextLink> to start a project.
    </p>
  )
}
