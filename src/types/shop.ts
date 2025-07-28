// Hierarchical Shop Type Definitions
export interface Issue {
  id: string;
  title: string;
  wordCount: number; // ~40,000 words
  price: number; // Cheapest tier
  releaseDate: string;
  content: string; // Digital content or download link
  coverImage: string;
  description: string;
  arcId: string;
  status: 'published' | 'pre-order' | 'coming-soon';
  tags: string[];
  chapterCount: number;
  previewText: string;
}

export interface Arc {
  id: string;
  title: string;
  description: string;
  price: number; // Bundle price for all issues
  issueIds: string[];
  sagaId: string;
  orderIndex: number;
  isComplete: boolean;
  bundleDiscount: number; // Percentage discount vs individual
  estimatedReadTime: string;
  coverImage: string;
}

export interface Saga {
  id: string;
  title: string;
  description: string;
  price: number;
  arcIds: string[];
  volumeId: string;
  orderIndex: number;
  estimatedLength: string; // e.g., "12 arcs, ~480K words total"
  themes: string[];
  coverImage: string;
}

export interface Volume {
  id: string;
  title: string;
  description: string;
  price: number;
  sagaIds: string[];
  bookId: string;
  physicalAvailable: boolean;
  digitalBundle: boolean;
  coverImage: string;
  totalWordCount: number;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  price: number; // Most expensive, complete collection
  volumeIds: string[];
  isComplete: boolean;
  totalWordCount: number;
  author: string;
  series: string;
  physicalEdition?: {
    hardcover: boolean;
    paperback: boolean;
    specialEdition: boolean;
    preOrderAvailable: boolean;
  };
  coverImage: string;
  releaseYear: number;
}

export interface TreeNode {
  id: string;
  title: string;
  type: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  price: number;
  children?: TreeNode[];
  isExpanded?: boolean;
  description: string;
  coverImage: string;
  savings?: number;
  bundleInfo?: {
    individualPrice: number;
    bundlePrice: number;
    discount: number;
  };
  // Add rating info
  rating?: {
    average: number;
    count: number;
  };
}

export interface CartItem {
  id: string;
  type: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  title: string;
  price: number;
  quantity: number;
  coverImage: string;
  description: string;
}

export interface PurchaseOption {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  savings?: string;
  type: 'individual' | 'bundle' | 'subscription';
  items: string[];
  recommended?: boolean;
}

export interface BundleRecommendation {
  title: string;
  description: string;
  savings: string;
  price: number;
  originalPrice: number;
  type: 'arc' | 'saga' | 'volume' | 'book';
  items: string[];
}

export type ViewMode = 'tree' | 'grid' | 'list';
export type FilterLevel = 'all' | 'books' | 'volumes' | 'sagas' | 'arcs' | 'issues';
export type SortBy = 'release' | 'price' | 'title' | 'popularity';
