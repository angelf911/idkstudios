// ------------------------------------------------------------------------------------------------------ 
// Spotify API integration
async function fetchSpotifyPlaylist(playlistId, accessToken) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
  
      // Map Spotify tracks to your player format
      const spotifyTracks = data.items
        .filter(item => item.track.preview_url) // Only include tracks with preview URLs
        .map(item => ({
          music: item.track.preview_url, // Spotify's preview URL (30 seconds)
          img: item.track.album.images[0]?.url || "https://via.placeholder.com/150",
          songName: item.track.name,
          artistName: item.track.artists.map(artist => artist.name).join(", "),
        }));
  
      // Add Spotify tracks to your current playlist
      songs.push(...spotifyTracks);
      console.log("Spotify tracks added:", spotifyTracks);
  
      // Reinitialize the player with the updated song list
      initializePlayer();
  
    } catch (error) {
      console.error("Error fetching Spotify playlist:", error);
    }
  }
  
  // Initialize the player with Spotify tracks
  const playlistId = "5H6uHOPurS7SimEbh2Snyo"; // Replace with your Spotify playlist ID
  const accessToken = "BQBCOQxekPT_ejvqeeq9GxCwicK29j9GwJvozgWGwG26Qpn4E5HqtNg5ffyxNszCNiJAfBn5p337wslcZP_GCCgN7UTuKi5jtvFteq0xK3G7wVd5bVQ"; // Replace with your Spotify API access token
  fetchSpotifyPlaylist(playlistId, accessToken);
  
  // Existing player initialization
  const trackCover = document.querySelector("#track_cover");
  const trackArtist = document.querySelector("#track_artist");
  const trackTitle = document.querySelector("#track_title");
  const playPauseBtn = document.querySelector("#play_pause");
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");
  const currentTrack = document.querySelector("#audio-player");
  const trackRange = document.querySelector("#range");
  const vol = document.querySelector("#vol");
  const currentMins = document.querySelector("#current_time_mins");
  const currentSecs = document.querySelector("#current_time_secs");
  const trackmins = document.querySelector("#track_mins");
  const tracksecs = document.querySelector("#track_secs");
  
  let isPlaying = false;
  let trackIndex = 0;
  
  // Define songs directly in the script
  const songs = [
    // Your existing songs array remains unchanged
    // Add your hardcoded songs here
  ];
  
  // Fisher-Yates Shuffle Algorithm
  function shuffleSongs() {
    for (let i = songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
  }
  
  // Load a track
  function loadTrack(index) {
    const song = songs[index];
    if (!song) return;
  
    currentTrack.src = song.music;
    currentTrack.load();
  
    // Check if the cover image is valid
    if (song.img && song.img.trim() !== "") {
      trackCover.src = song.img.trim();
    } else {
      trackCover.src = "https://idkstudios.s3.us-east-2.amazonaws.com/images/covers/error.png"; // Default cover
    }
  
    trackTitle.textContent = song.songName;
    trackArtist.textContent = song.artistName;
  
    resetProgress();
  }
  
  // Update progress bar dynamically
  function updateProgress() {
    if (!isNaN(currentTrack.duration)) {
      trackRange.max = currentTrack.duration;
      trackRange.value = currentTrack.currentTime;
  
      const mins = Math.floor(currentTrack.currentTime / 60).toString().padStart(2, "0");
      const secs = Math.floor(currentTrack.currentTime % 60).toString().padStart(2, "0");
      const durationMins = Math.floor(currentTrack.duration / 60).toString().padStart(2, "0");
      const durationSecs = Math.floor(currentTrack.duration % 60).toString().padStart(2, "0");
  
      currentMins.textContent = mins;
      currentSecs.textContent = secs;
      trackmins.textContent = durationMins;
      tracksecs.textContent = durationSecs;
    }
  }
  
  // Reset progress
  function resetProgress() {
    trackRange.value = 0;
    currentMins.textContent = "00";
    currentSecs.textContent = "00";
    trackmins.textContent = "00";
    tracksecs.textContent = "00";
  }
  
  // Play or pause the track
  function playPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }
  
  function play() {
    if (!currentTrack.src) return;
    currentTrack.play().then(() => {
      isPlaying = true;
      playPauseBtn.src = "https://idkstudios.s3.us-east-2.amazonaws.com/images/icons/music/pause.png";
    });
  }
  
  function pause() {
    currentTrack.pause();
    isPlaying = false;
    playPauseBtn.src = "https://idkstudios.s3.us-east-2.amazonaws.com/images/icons/music/play.png";
  }
  
  // Play the next track
  function next() {
    trackIndex = (trackIndex + 1) % songs.length;
    loadTrack(trackIndex);
    play();
  }
  
  // Play the previous track
  function prev() {
    trackIndex = (trackIndex - 1 + songs.length) % songs.length;
    loadTrack(trackIndex);
    play();
  }
  
  // Seek within the track
  function seek() {
    currentTrack.currentTime = trackRange.value;
  }
  
  // Adjust volume
  function volume() {
    currentTrack.volume = vol.value / 10;
  }
  
  // Initialize the player
  function initializePlayer() {
    shuffleSongs(); // Shuffle songs
    loadTrack(trackIndex); // Load the first track
  
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    playPauseBtn.addEventListener("click", playPause);
    trackRange.addEventListener("input", seek);
    vol.addEventListener("input", volume);
  
    currentTrack.addEventListener("timeupdate", updateProgress);
    currentTrack.addEventListener("ended", next);
  }
  
  // Run the player
  initializePlayer();
  
  
  
  // ------------------------------------------------------------------------------------------------------ 
  