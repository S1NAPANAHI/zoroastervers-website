import { TreeNode } from '@/types/shop';

// Comprehensive shop data: 5 Books × 4 Volumes × Multiple Sagas/Arcs/Issues
export const shopData: TreeNode[] = [
  {
    id: 'book-1',
    title: 'Book 1: The Awakening',
    type: 'book',
    price: 159.99,
    description: 'The birth of crystal magic and the dawn of a new age - Complete 4-volume collection',
    coverImage: '/covers/book-1.jpg',
    bundleInfo: {
      individualPrice: 199.96,
      bundlePrice: 159.99,
      discount: 20
    },
    children: [
      {
        id: 'volume-1-1',
        title: 'Volume 1: First Light',
        type: 'volume',
        price: 49.99,
        description: 'The discovery of crystal magic begins',
        coverImage: '/covers/book1-vol1.jpg',
        bundleInfo: {
          individualPrice: 59.96,
          bundlePrice: 49.99,
          discount: 17
        },
        children: [
          {
            id: 'saga-1-1-1',
            title: 'Saga 1: Dawn Breaking',
            type: 'saga',
            price: 29.99,
            description: 'The morning everything changed',
            coverImage: '/covers/book1-vol1-saga1.jpg',
            children: [
              {
                id: 'arc-1-1-1-1',
                title: 'Arc 1: Strange Signals',
                type: 'arc',
                price: 14.99,
                description: 'Mysterious phenomena across the realms',
                coverImage: '/covers/book1-vol1-saga1-arc1.jpg',
                children: [
                  {
                    id: 'issue-1-1-1-1-1',
                    title: 'Issue 1: The Morning Watch',
                    type: 'issue',
                    price: 4.99,
                    description: '~40,000 words - A routine morning turns extraordinary',
                    coverImage: '/covers/book1-vol1-saga1-arc1-issue1.jpg'
                  },
                  {
                    id: 'issue-1-1-1-1-2',
                    title: 'Issue 2: Ripples of Power',
                    type: 'issue',
                    price: 4.99,
                    description: '~40,000 words - Energy spreads across the land',
                    coverImage: '/covers/book1-vol1-saga1-arc1-issue2.jpg'
                  },
                  {
                    id: 'issue-1-1-1-1-3',
                    title: 'Issue 3: The Calling',
                    type: 'issue',
                    price: 4.99,
                    description: '~40,000 words - Heroes are drawn together',
                    coverImage: '/covers/book1-vol1-saga1-arc1-issue3.jpg'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'volume-1-2',
        title: 'Volume 2: Crystal Heart',
        type: 'volume',
        price: 49.99,
        description: 'The discovery of the Prime Crystal',
        coverImage: '/covers/book1-vol2.jpg',
        bundleInfo: {
          individualPrice: 59.96,
          bundlePrice: 49.99,
          discount: 17
        }
      },
      {
        id: 'volume-1-3',
        title: 'Volume 3: Rising Cities',
        type: 'volume',
        price: 49.99,
        description: 'The first crystal-powered civilizations',
        coverImage: '/covers/book1-vol3.jpg',
        bundleInfo: {
          individualPrice: 59.96,
          bundlePrice: 49.99,
          discount: 17
        }
      },
      {
        id: 'volume-1-4',
        title: 'Volume 4: Age of Wonder',
        type: 'volume',
        price: 49.99,
        description: 'The golden age of crystal magic',
        coverImage: '/covers/book1-vol4.jpg',
        bundleInfo: {
          individualPrice: 59.96,
          bundlePrice: 49.99,
          discount: 17
        }
      }
    ]
  },
  {
    id: 'book-2',
    title: 'Book 2: Shattered Realms',
    type: 'book',
    price: 169.99,
    description: 'The Great Fracture tears reality apart - Complete 4-volume collection',
    coverImage: '/covers/book-2.jpg',
    bundleInfo: {
      individualPrice: 199.96,
      bundlePrice: 169.99,
      discount: 15
    },
    children: [
      {
        id: 'volume-2-1',
        title: 'Volume 1: The Great Fracture',
        type: 'volume',
        price: 49.99,
        description: 'Reality breaks apart',
        coverImage: '/covers/book2-vol1.jpg'
      },
      {
        id: 'volume-2-2',
        title: 'Volume 2: Scattered Survivors',
        type: 'volume',
        price: 49.99,
        description: 'Finding hope in chaos',
        coverImage: '/covers/book2-vol2.jpg'
      },
      {
        id: 'volume-2-3',
        title: 'Volume 3: Realm Wars',
        type: 'volume',
        price: 49.99,
        description: 'Conflicts erupt between surviving realms',
        coverImage: '/covers/book2-vol3.jpg'
      },
      {
        id: 'volume-2-4',
        title: 'Volume 4: Lost Alliance',
        type: 'volume',
        price: 49.99,
        description: 'A desperate pact to prevent collapse',
        coverImage: '/covers/book2-vol4.jpg'
      }
    ]
  },
  {
    id: 'book-3',
    title: 'Book 3: Convergence',
    type: 'book',
    price: 179.99,
    description: 'Ancient prophecies and the path to reunification - Complete 4-volume collection',
    coverImage: '/covers/book-3.jpg',
    bundleInfo: {
      individualPrice: 199.96,
      bundlePrice: 179.99,
      discount: 10
    },
    children: [
      {
        id: 'volume-3-1',
        title: 'Volume 1: Prophecy Revealed',
        type: 'volume',
        price: 49.99,
        description: 'Ancient texts speak of convergence',
        coverImage: '/covers/book3-vol1.jpg'
      },
      {
        id: 'volume-3-2',
        title: 'Volume 2: Crystal Network',
        type: 'volume',
        price: 49.99,
        description: 'Realms reconnect through crystal technology',
        coverImage: '/covers/book3-vol2.jpg'
      },
      {
        id: 'volume-3-3',
        title: 'Volume 3: Shadow Emergence',
        type: 'volume',
        price: 49.99,
        description: 'A new realm appears from the void',
        coverImage: '/covers/book3-vol3.jpg'
      },
      {
        id: 'volume-3-4',
        title: 'Volume 4: Rising Darkness',
        type: 'volume',
        price: 49.99,
        description: 'The Shadow Expanse reveals its intentions',
        coverImage: '/covers/book3-vol4.jpg'
      }
    ]
  },
  {
    id: 'book-4',
    title: 'Book 4: The Crystal War',
    type: 'book',
    price: 189.99,
    description: 'The ultimate battle between light and shadow - Complete 4-volume collection',
    coverImage: '/covers/book-4.jpg',
    bundleInfo: {
      individualPrice: 199.96,
      bundlePrice: 189.99,
      discount: 5
    },
    children: [
      {
        id: 'volume-4-1',
        title: 'Volume 1: War Declaration',
        type: 'volume',
        price: 49.99,
        description: 'The Shadow Expanse declares war',
        coverImage: '/covers/book4-vol1.jpg'
      },
      {
        id: 'volume-4-2',
        title: 'Volume 2: Siege of Prime',
        type: 'volume',
        price: 49.99,
        description: 'The origin world under assault',
        coverImage: '/covers/book4-vol2.jpg'
      },
      {
        id: 'volume-4-3',
        title: 'Volume 3: Heroes Rise',
        type: 'volume',
        price: 49.99,
        description: 'Crystal Heroes emerge to defend the realms',
        coverImage: '/covers/book4-vol3.jpg'
      },
      {
        id: 'volume-4-4',
        title: 'Volume 4: Final Convergence',
        type: 'volume',
        price: 49.99,
        description: 'All realms unite for the ultimate battle',
        coverImage: '/covers/book4-vol4.jpg'
      }
    ]
  },
  {
    id: 'book-5',
    title: 'Book 5: Infinite Paths',
    type: 'book',
    price: 199.99,
    description: 'The dawn of infinite possibilities - Complete 4-volume collection',
    coverImage: '/covers/book-5.jpg',
    bundleInfo: {
      individualPrice: 199.96,
      bundlePrice: 199.99,
      discount: 0
    },
    children: [
      {
        id: 'volume-5-1',
        title: 'Volume 1: New Dawn',
        type: 'volume',
        price: 49.99,
        description: 'A new age begins with transformed realms',
        coverImage: '/covers/book5-vol1.jpg'
      },
      {
        id: 'volume-5-2',
        title: 'Volume 2: Unity Forged',
        type: 'volume',
        price: 49.99,
        description: 'Former enemies become neighbors',
        coverImage: '/covers/book5-vol2.jpg'
      },
      {
        id: 'volume-5-3',
        title: 'Volume 3: Infinite Horizons',
        type: 'volume',
        price: 49.99,
        description: 'Exploration beyond known dimensions',
        coverImage: '/covers/book5-vol3.jpg'
      },
      {
        id: 'volume-5-4',
        title: 'Volume 4: Endless Dreams',
        type: 'volume',
        price: 49.99,
        description: 'Every dream becomes possible reality',
        coverImage: '/covers/book5-vol4.jpg'
      }
    ]
  }
];

// Flatten function to get all items of a specific type
export const getAllItemsByType = (type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'): TreeNode[] => {
  const results: TreeNode[] = [];
  
  const traverse = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.type === type) {
        results.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  };
  
  traverse(shopData);
  return results;
};

// Get filtered and sorted data
export const getFilteredData = (
  filterLevel: 'all' | 'books' | 'volumes' | 'sagas' | 'arcs' | 'issues',
  sortBy: 'release' | 'price' | 'title' | 'popularity'
): TreeNode[] => {
  let data: TreeNode[];
  
  if (filterLevel === 'all') {
    data = shopData;
  } else {
    const typeMap = {
      'books': 'book',
      'volumes': 'volume', 
      'sagas': 'saga',
      'arcs': 'arc',
      'issues': 'issue'
    } as const;
    
    data = getAllItemsByType(typeMap[filterLevel]);
  }
  
  // Sort the data
  return [...data].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'popularity':
        // Mock popularity based on reverse price (higher price = more popular)
        return b.price - a.price;
      case 'release':
      default:
        // Mock release order based on ID
        return a.id.localeCompare(b.id);
    }
  });
};
