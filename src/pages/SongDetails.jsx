import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusic } from '../utils/MusicContext';
import { ChevronLeft, Play, Pause, Heart, Share2, MoreHorizontal } from 'lucide-react';

const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { songs, currentSong, isPlaying, playSong, togglePlay, favorites, toggleFavorite } = useMusic();

  const song = songs.find(s => s.id === id);
  
  if (!song) return <div className="text-center py-20">Song not found</div>;

  const isCurrent = currentSong?.id === song.id;
  const showPause = isCurrent && isPlaying;
  const isLiked = favorites.includes(song.id);

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else playSong(song);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
      >
        <ChevronLeft size={32} />
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-end space-y-8 md:space-y-0 md:space-x-10">
        <div className="w-64 h-64 md:w-80 md:h-80 shadow-2xl relative group">
          <img 
            src={song.cover} 
            alt={song.title} 
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        </div>

        <div className="flex flex-col space-y-4 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-spotify-gray">Single</span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter">{song.title}</h1>
          
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-xl font-bold">
              <span className="hover:underline cursor-pointer">{song.artist}</span>
              <span className="text-spotify-gray text-sm">• {song.album} • 2024</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-6 pt-4">
            <button 
              onClick={handlePlay}
              className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
            >
              {showPause ? <Pause fill="black" size={32} /> : <Play fill="black" size={32} className="ml-1" />}
            </button>
            <button 
              onClick={() => toggleFavorite(song.id)}
              className={`transition-colors ${isLiked ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'}`}
            >
              <Heart size={40} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <Share2 size={32} className="text-spotify-gray hover:text-white cursor-pointer transition-colors" />
            <MoreHorizontal size={32} className="text-spotify-gray hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      <div className="mt-16 pb-20">
        <h2 className="text-2xl font-bold mb-6">Lyrics</h2>
        <div className="p-8 bg-white/5 rounded-xl text-2xl font-bold text-spotify-gray space-y-4">
          <p className="hover:text-white transition-colors cursor-default">I'm thinking 'bout the way things used to be</p>
          <p className="hover:text-white transition-colors cursor-default text-white">Back when you were mine and I was free</p>
          <p className="hover:text-white transition-colors cursor-default">Now I'm just a ghost inside this city</p>
          <p className="hover:text-white transition-colors cursor-default">Looking for a light, looking for some pity</p>
          <p className="text-sm pt-4 font-normal">... (Lyrics are for demonstration only)</p>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;