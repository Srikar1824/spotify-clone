import React, { useState } from 'react';
import { useMusic } from '../utils/MusicContext';
import SongCard from '../components/SongCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const { 
    filteredSongs, loading, searchQuery, setSearchQuery, 
    languageFilter, setLanguageFilter 
  } = useMusic();

  const languages = ['All', 'Hindi', 'English', 'Telugu'];

  const categories = [
    { name: 'Pop', color: 'bg-pink-600' },
    { name: 'Hip-Hop', color: 'bg-orange-600' },
    { name: 'Indie', color: 'bg-green-700' },
    { name: 'Rock', color: 'bg-red-700' },
    { name: 'Dance', color: 'bg-blue-600' },
    { name: 'Electronic', color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Search Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md pt-4 pb-6 z-10 -mx-8 px-8">
        <div className="relative group max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={24} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full pl-12 pr-12 py-3.5 bg-white text-black rounded-full text-lg font-medium focus:ring-4 focus:ring-white/20 outline-none transition-all placeholder:text-gray-500 shadow-2xl"
            autoFocus
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Language Filters */}
        <div className="flex space-x-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguageFilter(lang)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                languageFilter === lang 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {searchQuery || languageFilter !== 'All' ? (
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Results for "${searchQuery}"` : `${languageFilter} Hits`}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {loading ? (
              <LoadingSkeleton count={6} />
            ) : filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl font-bold">No results found</p>
                <p className="text-spotify-gray mt-2">Try a different keyword or check your filters.</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-2xl font-bold mb-6">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.name}
                className={`${cat.color} aspect-video rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98] group`}
              >
                <h3 className="text-2xl font-bold tracking-tight">{cat.name}</h3>
                <div className="absolute -right-4 -bottom-2 w-24 h-24 bg-white/20 rotate-12 group-hover:rotate-[25deg] transition-transform rounded shadow-xl" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};


export default Search;