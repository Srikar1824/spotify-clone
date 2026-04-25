import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMusic } from '../utils/MusicContext';
import { Play, Pause, Clock, MoreHorizontal, Heart, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaylistDetails = () => {
  const { id } = useParams();
  const { playlists, songs, currentSong, isPlaying, playSong, togglePlay, toggleFavorite, favorites } = useMusic();
  const [isSticky, setIsSticky] = useState(false);

  // For demonstration, we'll use all songs if it's a featured playlist or specific songs for user playlists
  const displaySongs = id.startsWith('p') ? songs.filter(s => s.language === playlists.find(p => p.id === id)?.language) : songs.slice(0, 5);
  const playlist = playlists.find(p => p.id === id) || { name: 'Your Playlist', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop' };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative -m-8"
    >
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-black pointer-events-none h-[500px]" />
      
      <div className="relative p-8 pt-20">
        <header className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8 mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-52 h-52 md:w-60 md:h-60 shadow-2xl rounded-lg overflow-hidden flex-shrink-0"
          >
            <img src={playlist.cover || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop'} alt={playlist.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col space-y-4 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">Playlist</span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-lg leading-tight">
              {playlist.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sm font-bold">
              <img src="https://ui-avatars.com/api/?name=Vikas&background=1DB954&color=fff" className="w-6 h-6 rounded-full" alt="Vikas" />
              <span className="hover:underline cursor-pointer">Vikas</span>
              <span className="text-white/60">• {displaySongs.length} songs, approx. 45 min</span>
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex items-center space-x-8 mb-8">
          <button 
            onClick={() => displaySongs[0] && playSong(displaySongs[0])}
            className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl group"
          >
            <Play fill="black" size={24} className="ml-1 group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex items-center space-x-6">
            <Heart size={32} className="text-spotify-gray hover:text-white cursor-pointer transition-colors" />
            <Download size={32} className="text-spotify-gray hover:text-white cursor-pointer transition-colors" />
            <MoreHorizontal size={32} className="text-spotify-gray hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Sticky Header */}
        <div className={`sticky top-[64px] z-30 -mx-8 px-12 py-2 mb-4 border-b border-white/5 transition-colors ${isSticky ? 'bg-black/90 backdrop-blur-md border-white/10' : 'bg-transparent'}`}>
          <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 text-spotify-gray text-xs font-bold uppercase tracking-widest">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <div className="flex justify-end"><Clock size={16} /></div>
          </div>
        </div>

        {/* Song List */}
        <div className="space-y-1">
          {displaySongs.map((song, index) => {
            const isThisCurrent = currentSong?.id === song.id;
            return (
              <motion.div 
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => playSong(song)}
                className={`grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2.5 rounded-md group cursor-pointer items-center transition-all ${isThisCurrent ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center justify-center">
                  {isThisCurrent && isPlaying ? (
                    <div className="flex items-end space-x-0.5 h-3">
                      <div className="w-0.5 bg-spotify-green animate-bounce" style={{ animationDelay: '0s', height: '100%' }} />
                      <div className="w-0.5 bg-spotify-green animate-bounce" style={{ animationDelay: '0.2s', height: '70%' }} />
                      <div className="w-0.5 bg-spotify-green animate-bounce" style={{ animationDelay: '0.4s', height: '90%' }} />
                    </div>
                  ) : (
                    <span className={`text-sm ${isThisCurrent ? 'text-spotify-green' : 'text-spotify-gray group-hover:text-white'}`}>{index + 1}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={song.cover} alt={song.title} className="w-10 h-10 rounded shadow-lg flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate ${isThisCurrent ? 'text-spotify-green' : 'text-white'}`}>{song.title}</span>
                    <span className="text-xs text-spotify-gray group-hover:text-white truncate transition-colors">{song.artist}</span>
                  </div>
                </div>

                <span className="text-sm text-spotify-gray group-hover:text-white truncate transition-colors">{song.album}</span>

                <div className="flex items-center justify-end space-x-4">
                   <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${favorites.includes(song.id) ? 'text-spotify-green opacity-100' : 'text-spotify-gray hover:text-white'}`}
                  >
                    <Heart size={16} fill={favorites.includes(song.id) ? 'currentColor' : 'none'} />
                  </button>
                  <span className="text-xs text-spotify-gray tabular-nums">{formatTime(song.duration)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistDetails;