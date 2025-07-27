import BookStore from '@/components/BookStore';

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background image overlay */}
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#dcddde] mb-4 glow-text">
            📚 My Books
          </h1>
          <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto">
            Explore my published works and discover the worlds I've created. Each book is a gateway to adventure, mystery, and unforgettable characters.
          </p>
        </div>

        {/* Navigation breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-[#b3b3b3]">
            <a href="/" className="hover:text-[#a855f7] transition-colors">Home</a>
            <span>›</span>
            <span className="text-[#dcddde]">Books</span>
          </nav>
        </div>

        {/* Book Store Component */}
        <BookStore />

        {/* Additional sections can be added here */}
        <div className="mt-12 glass-dark p-6 glow-card">
          <h2 className="text-2xl font-bold text-[#dcddde] mb-4">📖 Coming Soon</h2>
          <p className="text-[#b3b3b3] mb-4">
            I'm currently working on the next installment in this series. Sign up for my newsletter to be the first to know when it's available!
          </p>
          <div className="flex items-center space-x-4">
            <div className="glass p-4 rounded-lg">
              <h3 className="text-lg font-bold text-[#dcddde]">Book 4: The Return</h3>
              <p className="text-sm text-[#b3b3b3]">Expected: Fall 2024</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              <p className="text-xs text-[#b3b3b3] mt-1">65% Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
