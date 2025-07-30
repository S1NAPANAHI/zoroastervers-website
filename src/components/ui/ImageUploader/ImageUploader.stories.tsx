import type { Meta, StoryObj } from '@storybook/react';
import ImageUploader from './ImageUploader';

const meta: Meta<typeof ImageUploader> = {
  title: 'Components/ImageUploader',
  component: ImageUploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onUpload: { action: 'uploaded' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onUpload: (url: string) => console.log('Uploaded:', url),
  },
};

export const WithExistingImage: Story = {
  args: {
    onUpload: (url: string) => console.log('Uploaded:', url),
    avatarUrl: 'https://via.placeholder.com/150',
  },
};

export const Loading: Story = {
  args: {
    onUpload: (url: string) => console.log('Uploaded:', url),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the uploading state when an image is being processed.',
      },
    },
  },
};
