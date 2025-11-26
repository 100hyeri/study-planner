import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Search, Play, Pause, SkipBack, SkipForward, X, XCircle } from 'lucide-react';
import { searchYoutubeVideos } from '../../api/youtubeApi'; 

const MusicPlayer = ({ isGoalMode }) => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]); 
  const [currentVideo, setCurrentVideo] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null); 
  const progressInterval = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = () => {};
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (currentVideo && window.YT) {
      if (playerRef.current && playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById(currentVideo.videoId);
        setIsPlaying(true);
      } else {
        createPlayer(currentVideo.videoId);
      }
    }
  }, [currentVideo]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
          setDuration(playerRef.current.getDuration());
        }
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const createPlayer = (videoId) => {
    playerRef.current = new window.YT.Player('youtube-player-instance', {
      height: '100%', width: '100%', videoId: videoId,
      playerVars: { 'autoplay': 1, 'controls': 0, 'enablejsapi': 1, 'rel': 0, 'fs': 0 },
      events: {
        'onReady': (event) => { event.target.setVolume(volume); setIsPlaying(true); setDuration(event.target.getDuration()); },
        'onStateChange': (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
          if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
          if (event.data === window.YT.PlayerState.ENDED) { setIsPlaying(false); handleNext(); }
        }
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setResults([]);
    const videoData = await searchYoutubeVideos(searchQuery, 10);
    setResults(videoData);
    setIsLoading(false);
  };

  const handleSelectVideo = (video, index) => {
    setCurrentVideo(video);
    setCurrentIndex(index);
  };

  const handleStopAndClear = () => {
    if (playerRef.current) { playerRef.current.stopVideo(); playerRef.current.destroy(); playerRef.current = null; }
    setCurrentVideo(null); setCurrentIndex(-1); setIsPlaying(false); setCurrentTime(0); setResults([]); setSearchQuery('');
  };

  const handlePrev = () => {
    if (results.length === 0 || currentIndex === -1) return;
    if (currentTime > 3 && playerRef.current) { playerRef.current.seekTo(0); return; }
    const newIndex = (currentIndex - 1 + results.length) % results.length;
    handleSelectVideo(results[newIndex], newIndex);
  };

  const handleNext = () => {
    if (results.length === 0 || currentIndex === -1) return;
    const newIndex = (currentIndex + 1) % results.length;
    handleSelectVideo(results[newIndex], newIndex);
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) playerRef.current.seekTo(newTime, true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) setIsMuted(false);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      if (newVolume > 0 && playerRef.current.unMute) playerRef.current.unMute();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false); setVolume(prevVolume);
      if (playerRef.current) { playerRef.current.unMute(); playerRef.current.setVolume(prevVolume); }
    } else {
      setPrevVolume(volume); setIsMuted(true); setVolume(0);
      if (playerRef.current) playerRef.current.mute();
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // [Theme Update] Goal: Deep Black & Blue Accent
  const containerClass = isGoalMode ? 'bg-[#1C1C1E] border-gray-800 shadow-lg' : 'bg-white border-gray-100 shadow-sm';
  const textClass = isGoalMode ? 'text-white' : 'text-gray-800';
  const iconClass = isGoalMode ? 'text-[#3B82F6]' : 'text-indigo-600';
  const subTextClass = isGoalMode ? 'text-gray-400' : 'text-gray-400';
  const inputClass = isGoalMode ? 'bg-[#2C2C2E] border-transparent text-white placeholder-gray-500 focus:ring-1 focus:ring-[#3B82F6]' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white';
  const rangeClass = isGoalMode ? 'bg-gray-700 accent-[#3B82F6]' : 'bg-gray-200 accent-gray-800';

  return (
    <div className={`${containerClass} rounded-lg p-3 border shrink-0 w-full relative transition-all duration-500`}>
      
      <div className="flex items-center gap-2 mb-2">
        <h3 className={`font-extrabold text-xs tracking-tight ${textClass}`}>TODAY'S BGM</h3>
        <Music size={12} className={iconClass} />
        <div className="flex items-center gap-1 ml-1">
          <button onClick={toggleMute} className={`${subTextClass} hover:text-white focus:outline-none`}>
            {isMuted || volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
          <input 
            type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}
            className={`w-16 h-1 rounded-lg appearance-none cursor-pointer ${rangeClass}`}
          />
        </div>
      </div>

      <div className="min-h-[30px]">
        {currentVideo ? (
          <div className="flex flex-col gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#3B82F6] animate-pulse' : 'bg-gray-500'}`}></div>
              <span className={`text-[11px] font-bold truncate flex-1 ${textClass}`}>{currentVideo.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className={`text-[9px] w-6 text-right shrink-0 ${subTextClass}`}>{formatDuration(currentTime)}</span>
                <input 
                  type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek}
                  className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer min-w-0 ${rangeClass}`}
                />
                <span className={`text-[9px] w-6 shrink-0 ${subTextClass}`}>{formatDuration(duration)}</span>
              </div>
              <div className={`flex items-center gap-2 shrink-0 ${subTextClass}`}>
                <button onClick={handlePrev} className="hover:text-white transition-colors"><SkipBack size={12} /></button>
                <button onClick={togglePlayPause} className={`transition-colors ${isGoalMode ? 'text-[#3B82F6] hover:text-white' : 'text-indigo-600 hover:text-indigo-800'}`}>
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                </button>
                <button onClick={handleNext} className="hover:text-white transition-colors"><SkipForward size={12} /></button>
                <button onClick={handleStopAndClear} className="hover:text-red-500 ml-1 transition-colors"><X size={12} /></button>
              </div>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[10px] ${subTextClass}`}>검색 결과 ({results.length})</span>
              <button onClick={() => {setResults([]); setSearchQuery('');}} className={`${subTextClass} hover:text-red-500`}><X size={12} /></button>
            </div>
            <div className="max-h-32 overflow-y-auto custom-scrollbar pr-1 space-y-1">
              {results.map((video, index) => (
                <div 
                  key={video.videoId} 
                  onClick={() => handleSelectVideo(video, index)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border border-transparent transition-all ${isGoalMode ? 'hover:bg-[#2C2C2E] hover:border-[#3B82F6]/50' : 'hover:bg-gray-50 hover:border-gray-100'}`}
                >
                  <img src={video.thumbnail} alt="thumb" className="w-10 h-8 object-cover rounded bg-gray-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium truncate ${textClass}`}>{video.title}</p>
                    <p className={`text-[10px] truncate ${subTextClass}`}>{video.channelTitle}</p>
                  </div>
                  <Play size={12} className={iconClass} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="mt-1">
            <div className="relative">
              <input 
                type="text" placeholder="노래 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-md px-3 py-2 text-xs focus:outline-none border transition-colors ${inputClass}`}
              />
              <button type="submit" className={`absolute right-2.5 top-2 transition-colors ${subTextClass} hover:text-white`}>
                {isLoading ? <div className="animate-spin h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full"></div> : <Search size={14} />}
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none"><div id="youtube-player-instance"></div></div>
    </div>
  );
};

export default MusicPlayer;