'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useCart } from '@/app/contexts/CartContext'
import { CartItem } from '@/types/shop';
import { formatPrice } from '@/lib/utils';
import InlineRating from '../../reviews/InlineRating';
import ReviewPanel from '../../reviews/ReviewPanel';
import EasterEggContainer from '../../admin/EasterEggContainer';
import InlineEditableField from '@/components/ui/InlineEditableField';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BookStore() {
  const [selectedFormat, setSelectedFormat] = useState<{[key: number]: string}>({});
  const [reviewModalOpen, setReviewModalOpen] = useState<{itemId: number, itemType: string, itemTitle: string} | null>(null);
  const { addToCart } = useCart();
  
  // Fetch books from API using SWR
  const { data: booksData, error, isLoading } = useSWR('/api/admin/books', fetcher);
  
  // Fallback to mock data if API fails or is loading
  const books = booksData || [
    {
      id: '1',
      title: "Book 1: The Beginning",
      description: "Where our adventure starts and heroes are forged in the fires of destiny...",
      formats: [
        { type: "eBook", price: 9.99, link: "https://amazon.com/book1-ebook" },
        { type: "Paperback", price: 14.99, link: "https://amazon.com/book1-paperback" },
        { type: "Hardcover", price: 24.99, link: "https://amazon.com/book1-hardcover" }
      ],
      rating: 4.8,
      reviews: 1247,
      cover: "📘"
    },
    {
      id: '2',
      title: "Book 2: The Journey",
      description: "The plot thickens as our heroes venture into uncharted territories...",
      formats: [
        { type: "eBook", price: 9.99, link: "https://amazon.com/book2-ebook" },
        { type: "Paperback", price: 14.99, link: "https://amazon.com/book2-paperback" },
        { type: "Hardcover", price: 24.99, link: "https://amazon.com/book2-hardcover" }
      ],
      rating: 4.9,
      reviews: 892,
      cover: "📗"
    },
    {
      id: '3',
      title: "Book 3: The End",
      description: "The epic conclusion that will leave you breathless and wanting more...",
      formats: [
        { type: "eBook", price: 9.99, link: "https://amazon.com/book3-ebook" },
        { type: "Paperback", price: 14.99, link: "https://amazon.com/book3-paperback" },
        { type: "Hardcover", price: 24.99, link: "https://amazon.com/book3-hardcover" }
      ],
      rating: 5.0,
      reviews: 634,
      cover: "📕"
    }
  ];

  const handleFormatSelect = (bookIndex: number, format: string) => {
    setSelectedFormat(prev => ({ ...prev, [bookIndex]: format }));
  };

const handleAddToCart = (bookIndex: number) => {
    const book = books[bookIndex];
    const selectedType = selectedFormat[bookIndex] || book.formats[0].type;
    const format = book.formats.find(f => f.type === selectedType);
    const cartItem: CartItem = {
      id: book.id,
      type: 'book',
      title: book.title,
      price: format.price,
      quantity: 1,
      coverImage: book.cover,
      description: book.description
    };
    addToCart(cartItem);
  };

  return (
    <div className="glass-dark p-6 glow-card">
      <h2 className="text-3xl font-bold mb-6 text-[#dcddde] flex items-center">
        📚 Buy My Books
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div key={index} className="glass p-6 glow-card hover:scale-105 transition-all duration-300">
            {/* Book Cover with Easter Eggs */}
            <EasterEggContainer
              itemId={index + 1}
              itemType="book"
              className="w-full h-48 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg mb-4 flex items-center justify-center"
            >
              <span className="text-6xl">{book.cover}</span>
            </EasterEggContainer>
            
            {/* Book Info with Inline Editable Fields */}
            <div className="mb-4">
              <InlineEditableField
                id={`book-${book.id || index}`}
                value={book.title}
                apiEndpoint={`/api/books/${book.id || index}`}
                fieldName="title"
                className="text-xl font-bold text-[#dcddde] mb-2 block"
                placeholder="Enter book title..."
              />
              <InlineEditableField
                id={`book-desc-${book.id || index}`}
                value={book.description || ''}
                apiEndpoint={`/api/books/${book.id || index}`}
                fieldName="description"
                className="text-[#b3b3b3] text-sm"
                placeholder="Enter book description..."
                multiline
              />
            </div>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <InlineRating 
                itemId={index + 1} 
                itemType="book" 
                onClick={() => setReviewModalOpen({itemId: index + 1, itemType: 'book', itemTitle: book.title})} 
                size="md"
              />
              <button 
                onClick={() => setReviewModalOpen({itemId: index + 1, itemType: 'book', itemTitle: book.title})}
                className="ml-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Reviews
              </button>
            </div>
            
            {/* Format Selection */}
            <div className="mb-4">
              <p className="text-[#dcddde] text-sm font-medium mb-2">Format:</p>
              <div className="flex flex-wrap gap-2">
                {book.formats.map((format, formatIndex) => (
                  <button
                    key={formatIndex}
                    onClick={() => handleFormatSelect(index, format.type)}
                    className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                      (selectedFormat[index] || book.formats[0].type) === format.type
                        ? 'neon-button-blue'
                        : 'glass border border-[#484848] text-[#b3b3b3] hover:border-[#a855f7]'
                    }`}
                  >
                    {format.type}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price and Buy Button */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#a855f7]">
                {formatPrice(books[index].formats.find(f => f.type === (selectedFormat[index] || books[index].formats[0].type))?.price || books[index].formats[0].price)}
              </span>
              <button
                onClick={() => handleAddToCart(index)}
                className="neon-button text-sm px-4 py-2"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bundle Offer */}
      <div className="glass mt-6 p-6 text-center">
        <h3 className="text-xl font-bold text-[#dcddde] mb-2">📦 Complete Series Bundle</h3>
        <p className="text-[#b3b3b3] mb-4">Get all three books at a discounted price!</p>
        <div className="flex items-center justify-center space-x-4">
          <span className="text-lg text-[#b3b3b3] line-through">{formatPrice(44.97)}</span>
          <span className="text-2xl font-bold text-[#a855f7]">{formatPrice(34.99)}</span>
          <button 
            onClick={() => {
              const bundleItem: CartItem = {
                id: 'bundle-complete-series',
                type: 'book',
                title: 'Complete Series Bundle',
                price: 34.99,
                quantity: 1,
                coverImage: '📦',
                description: 'All three books at a discounted price'
              };
              addToCart(bundleItem);
            }}
            className="neon-button-green px-6 py-2"
          >
            Add Bundle to Cart & Save 22%
          </button>
        </div>
      </div>
      
      {/* Review Panel Modal */}
      {reviewModalOpen && (
        <ReviewPanel 
          itemId={reviewModalOpen.itemId} 
          itemType={reviewModalOpen.itemType} 
          itemTitle={reviewModalOpen.itemTitle} 
          onClose={() => setReviewModalOpen(null)} 
        />
      )}
    </div>
  );
}
