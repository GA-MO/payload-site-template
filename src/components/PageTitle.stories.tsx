import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PageTitle } from './PageTitle'

const meta = {
  title: 'Components/PageTitle',
  component: PageTitle,
  parameters: { layout: 'padded' },
  args: {
    children: 'Career'
  },
  argTypes: {
    children: { control: 'text' }
  }
} satisfies Meta<typeof PageTitle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongPhrase: Story = {
  args: { children: 'Borrow our pencil' }
}

export const WithMargin: Story = {
  args: { children: 'Career', className: 'mb-16' }
}
