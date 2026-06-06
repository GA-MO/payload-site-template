import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DropdownField } from './DropdownField'

const SERVICES = [
  { value: 'branding', label: 'Branding' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'digital', label: 'Digital' },
  { value: 'packaging', label: 'Packaging' }
]

const meta = {
  title: 'Components/DropdownField',
  component: DropdownField,
  parameters: { layout: 'padded' },
  args: {
    options: SERVICES,
    placeholder: 'Select your service'
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof DropdownField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelectedValue: Story = {
  args: { defaultValue: 'branding' }
}

export const WithError: Story = {
  args: { error: 'Please select a service' }
}
