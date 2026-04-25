import React from 'react';
import { useMusic } from '../utils/MusicContext';
import SongCard from '../components/SongCard';
import { Heart, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const Library = () => {
  const { songs, favorites, playlists } = useMusic();

  const likedSongs = songs.filter(song => favorites.includes(song.id));

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex items-end space-x-6 pb-6 border-b border-white/10">
        <div className="w-48 h-48 bg-gradient-to-br from-indigo-700 to-blue-300 rounded shadow-2xl flex items-center justify-center">
          <Heart size={80} fill="white" className="text-white" />
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest">Playlist</span>
          <h1 className="text-7xl font-black tracking-tighter">Liked Songs</h1>
          <div className="flex items-center space-x-1 text-sm font-medium">
            <img src="https://ui-avatars.com/api/?name=Vikas&background=1DB954&color=fff" className="w-6 h-6 rounded-full" alt="User" />
            <span className="hover:underline cursor-pointer">Vikas</span>
            <span className="text-spotify-gray">• {likedSongs.length} songs</span>
          </div>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {likedSongs.length > 0 ? (
            likedSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music size={32} className="text-spotify-gray" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Songs you like will appear here</h2>
              <p className="text-spotify-gray mb-6">Save songs by tapping the heart icon.</p>
              <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                Find songs
              </button>
            </div>
          )}
        </div>
      </section>

      {playlists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {playlists.map((playlist) => (
              <motion.div 
                key={playlist.id}
                whileHover={{ scale: 1.02 }}
                className="bg-spotify-lightBlack/40 hover:bg-spotify-hover p-4 rounded-lg transition-colors group cursor-pointer"
              >
                <div className="aspect-square bg-spotify-darkGray rounded-md shadow-2xl flex items-center justify-center mb-4 overflow-hidden relative">
                   <Music size={48} className="text-spotify-gray group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-bold text-sm truncate">{playlist.name}</h3>
                <p className="text-xs text-spotify-gray">Playlist • Vikas</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Library;