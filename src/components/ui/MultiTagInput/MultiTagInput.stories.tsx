import type { Meta, StoryObj } from '@storybook/react';
import MultiTagInput from './MultiTagInput';

const meta: Meta<typeof MultiTagInput> = {
  title: 'UI/MultiTagInput',
  component: MultiTagInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onTagsChange: { action: 'tags changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTags = [
  {
    id: 1,
    name: 'protagonist',
    description: 'Main character of the story',
    category: 'role',
    color: '#3b82f6',
    icon: '🦸',
    usage_count: 15,
  },
  {
    id: 2,
    name: 'brave',
    description: 'Shows courage in dangerous situations',
    category: 'personality',
    color: '#ef4444',
    icon: '⚔️',
    usage_count: 8,
  },
];

export const Default: Story = {
  args: {
    selectedTags: [],
    onTagsChange: (tags) => console.log('Tags changed:', tags),
    placeholder: 'Search and select tags...',
    maxTags: 10,
    allowCreate: true,
  },
};

export const WithSelectedTags: Story = {
  args: {
    selectedTags: mockTags,
    onTagsChange: (tags) => console.log('Tags changed:', tags),
    placeholder: 'Search and select tags...',
    maxTags: 10,
    allowCreate: true,
  },
};

export const MaxTagsReached: Story = {
  args: {
    selectedTags: new Array(5).fill(0).map((_, i) => ({
      id: i + 1,
      name: `tag-${i + 1}`,
      category: 'custom',
      usage_count: i + 1,
    })),
    onTagsChange: (tags) => console.log('Tags changed:', tags),
    placeholder: 'Search and select tags...',
    maxTags: 5,
    allowCreate: true,
  },
};

export const NoCreateAllowed: Story = {
  args: {
    selectedTags: [],
    onTagsChange: (tags) => console.log('Tags changed:', tags),
    placeholder: 'Search existing tags only...',
    maxTags: 10,
    allowCreate: false,
  },
};
