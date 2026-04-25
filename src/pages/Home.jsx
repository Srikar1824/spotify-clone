import React from 'react';
import { useMusic } from '../utils/MusicContext';
import SongCard from '../components/SongCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import TrendingCarousel from '../components/TrendingCarousel';
import { motion } from 'framer-motion';

const Home = () => {
  const { songs, recentlyPlayed, loading, playSong } = useMusic();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const SongSection = ({ title, data }) => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold hover:underline cursor-pointer">{title}</h2>
        <span className="text-xs font-bold text-spotify-gray hover:underline cursor-pointer uppercase tracking-widest">Show all</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {data.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="space-y-12 p-8">
        <div className="h-10 w-48 bg-white/5 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-6 gap-6">
          <LoadingSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-700">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            {greeting()}
          </h1>
        </div>
        
        {/* Quick Access Grid - Spotify Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-10">
          {songs.slice(0, 6).map((song) => (
            <motion.div 
              key={song.id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-4 bg-white/5 rounded-md overflow-hidden cursor-pointer transition-all group border border-white/5 shadow-md hover:shadow-xl"
              onClick={() => playSong(song)}
            >
              <div className="relative w-20 h-20 shadow-xl flex-shrink-0">
                <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>
              <span className="font-bold text-sm truncate pr-4">{song.title}</span>
              <div className="ml-auto mr-4">
                <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl transform translate-y-2 group-hover:translate-y-0 active:scale-95 active:bg-spotify-green/80">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-10">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-bold hover:underline cursor-pointer">Trending Now</h2>
             <span className="text-xs font-bold text-spotify-gray hover:underline cursor-pointer uppercase tracking-widest">Show all</span>
           </div>
           <TrendingCarousel />
        </div>
      </section>

      {recentlyPlayed.length > 0 && (
        <SongSection title="Recently Played" data={recentlyPlayed} />
      )}

      <SongSection title="Your Top Mixes" data={songs.slice().sort(() => Math.random() - 0.5).slice(0, 6)} />
      
      <SongSection title="Hindi Top Hits" data={songs.filter(s => s.language === 'Hindi')} />
      <SongSection title="English Top Hits" data={songs.filter(s => s.language === 'English')} />
      <SongSection title="Telugu Top Hits" data={songs.filter(s => s.language === 'Telugu')} />
      
      <section className="bg-gradient-to-t from-spotify-green/10 to-transparent p-8 rounded-3xl border border-white/5">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <img 
            src="https://images.unsplash.com/photo-1531366930499-81d5f20dd0e2?auto=format&fit=crop&w=400&h=400&q=80" 
            className="w-48 h-48 rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" 
            alt="Liked Songs"
          />
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black mb-2">Listen to your Liked Songs</h2>
            <p className="text-spotify-gray mb-6 text-lg">Your favorite music, all in one place. Perfectly curated for your mood.</p>
            <button className="bg-white text-black font-black px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg">
              Go to Library
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};



export default Home;