const CLIENT_ID = 'da410ebac74d4575b3462400cef1264d'; 
const CLIENT_SECRET = '99f712460439450b9339dce64895f2d1';

let accessToken = '';

const getAccessToken = async () => {
  if (accessToken) return accessToken;

  // Check if credentials are still placeholders
  if (CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID') {
    console.log('ℹ️ Spotify credentials not configured. Using local song data.');
    console.log('💡 Tip: Add your Spotify API credentials in src/utils/spotify.js to enable live search');
    return null;
  }

  try {
    const response = await fetch('/spotify-api-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    const text = await response.text();
    console.log("Spotify Token Raw Response:", text);
    
    try {
      const data = JSON.parse(text);
      if (data.access_token) {
        accessToken = data.access_token;
        return accessToken;
      }
    } catch (e) {
      console.error("JSON Parse Error for Spotify Token:", e);
    }
    return null;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return null;
  }
};


export const searchTracks = async (query, limit = 10) => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`/spotify-api-search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Spotify Search API error (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();
    if (!data.tracks || !data.tracks.items) return null;

    return data.tracks.items
      .map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        cover: track.album.images[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
        audioUrl: track.preview_url,
        duration: Math.floor(track.duration_ms / 1000),
        language: query.toLowerCase().includes('bollywood') || query.toLowerCase().includes('hindi') ? 'Hindi' : 
                  query.toLowerCase().includes('telugu') ? 'Telugu' : 'English',
        trending: track.popularity > 70
      }));
  } catch (error) {
    console.error("Error searching Spotify tracks:", error);
    return null;
  }
};


export const fetchInitialSongs = async () => {
  const queries = [
    'bollywood hits',
    'english top hits',
    'telugu songs'
  ];
  const results = await Promise.all(queries.map(q => searchTracks(q, 8)));
  
  // Flatten and filter out nulls
  const tracks = results.filter(r => r !== null).flat();
  
  return tracks;
};