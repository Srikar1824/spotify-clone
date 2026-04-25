import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchInitialSongs } from './spotify';
import mockData from './data.json';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('spotify-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('spotify-playlists');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem('spotify-recently-played');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');

  const audioRef = useRef(null);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        setLoading(true);
        
        // 1. Try Spotify API
        const spotifySongs = await fetchInitialSongs();
        
        if (spotifySongs && spotifySongs.length > 0) {
          setSongs(spotifySongs);
          if (!currentSong) setCurrentSong(spotifySongs[0]);
        } else {
          // 2. Fallback to local data
          console.log("📦 Using local song database");
          setSongs(mockData.songs);
          if (!currentSong && mockData.songs.length > 0) setCurrentSong(mockData.songs[0]);
        }
      } catch (error) {
        console.error("Error loading music:", error);
        // Final fallback
        setSongs(mockData.songs);
        if (!currentSong && mockData.songs.length > 0) setCurrentSong(mockData.songs[0]);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadMusic();
  }, []);


  useEffect(() => {
    localStorage.setItem('spotify-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('spotify-playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('spotify-recently-played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Handle song change - load and play new audio
  useEffect(() => {
    if (currentSong && audioRef.current) {
      console.log("Loading song:", currentSong.title, "URL:", currentSong.audioUrl);
      audioRef.current.pause();
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      }
    }
  }, [currentSong]);

  // Sync isPlaying state with the audio element
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentSong?.audioUrl) {
        console.log("Playing:", currentSong?.title, currentSong?.audioUrl);
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume with the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playSong = (song) => {
    console.log("Selected Song:", song);
    setCurrentSong(song);
    setIsPlaying(true);
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 10);
    });
  };

  const playNext = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const toggleFavorite = (songId) => {
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === 'All' || song.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const value = {
    songs,
    filteredSongs,
    loading,
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    setVolume,
    favorites,
    playlists,
    recentlyPlayed,
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    togglePlay,
    playSong,
    playNext,
    playPrevious,
    seek,
    toggleFavorite,
    createPlaylist
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        onLoadedMetadata={handleTimeUpdate}
        controls
        crossOrigin="anonymous"
      />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};