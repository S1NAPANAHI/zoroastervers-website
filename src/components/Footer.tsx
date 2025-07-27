'use client';
import Newsletter from './Newsletter';

export default function Footer() {
  return (
    <footer className="glass-dark border-t border-[#484848] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Newsletter Section */}
          <div className="md:col-span-2">
            <Newsletter />
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#dcddde] mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/books" className="block text-[#b3b3b3] hover:text-[#a855f7] transition-colors">📚 Books</a>
              <a href="/characters" className="block text-[#b3b3b3] hover:text-[#a855f7] transition-colors">👥 Characters</a>
              <a href="/locations" className="block text-[#b3b3b3] hover:text-[#a855f7] transition-colors">🗺️ Locations</a>
              <a href="/timeline" className="block text-[#b3b3b3] hover:text-[#a855f7] transition-colors">⏰ Timeline</a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-[#484848] mt-8 pt-8 text-center">
          <p className="text-[#b3b3b3] flex items-center justify-center space-x-2">
            <span>© 2024 Novel Worldbuilding Hub</span>
            <span>•</span>
            <span>Built with ❤️ for storytellers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
