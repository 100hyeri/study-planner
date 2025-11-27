import React, { useState } from 'react';
import { MonitorPlay, Search, ExternalLink, X } from 'lucide-react';
import { searchYoutubeVideos } from '../../api/youtubeApi'; 

const LectureSearch = ({ isGoalMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e, queryOverride = null) => {
    if (e) e.preventDefault();
    const query = queryOverride || searchQuery;
    if (!query.trim()) return;
    setIsLoading(true);
    setResults([]);
    const videoData = await searchYoutubeVideos(query, 10);
    setResults(videoData);
    setIsLoading(false);
  };

  const handleClear = () => { setSearchQuery(''); setResults([]); setIsLoading(false); };
  const openVideo = (videoId) => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');

  const containerClass = isGoalMode ? 'bg-[#1C1C1E] border-gray-800 shadow-md' : 'bg-white border-gray-100 shadow-sm';
  const textClass = isGoalMode ? 'text-white' : 'text-gray-800';
  const iconClass = isGoalMode ? 'text-[#3B82F6]' : 'text-indigo-500';
  const subTextClass = isGoalMode ? 'text-[#A1A1AA]' : 'text-indigo-400';
  const inputClass = isGoalMode ? 'bg-[#2C2C2E] border-transparent text-white focus:ring-1 focus:ring-[#3B82F6] placeholder-[#A1A1AA]' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-500';
  const tagClass = isGoalMode ? 'bg-[#2C2C2E] text-gray-400 hover:bg-gray-600 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600';

  return (
    <div className={`${containerClass} rounded-xl p-3 border text-center w-full h-full flex flex-col transition-all duration-500`}>
      <div className={`flex items-center gap-2 mb-2 border-b pb-1 shrink-0 ${isGoalMode ? 'border-gray-800' : 'border-gray-900'}`}>
        <h3 className={`font-bold text-xs tracking-wide ${textClass}`}>강의 검색</h3>
        <MonitorPlay size={12} className={iconClass}/>
      </div>
      
      <form onSubmit={handleSearch} className="relative mt-2 mb-2 shrink-0">
        <input type="text" placeholder="강의 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none border transition-colors ${inputClass}`} />
        {(searchQuery || results.length > 0) && (
          <button type="button" onClick={handleClear} className={`absolute right-8 top-1.5 hover:text-red-500 transition-colors ${subTextClass}`}><X size={12} /></button>
        )}
        <button type="submit" className={`absolute right-3 top-1.5 hover:text-white ${subTextClass}`}><Search size={12} /></button>
      </form>
        
      <div className="flex-1 overflow-y-auto px-1 custom-scrollbar min-h-0">
        {isLoading ? <p className={`text-center text-[10px] py-4 ${subTextClass}`}>검색 중...</p> : results.length > 0 ? (
          <div className="text-xs space-y-2 pb-2">
            {results.map((video) => (
              <div key={video.videoId} onClick={() => openVideo(video.videoId)} className={`w-full text-left py-1.5 px-2 rounded transition-colors flex items-center justify-between gap-2 cursor-pointer border-b ${isGoalMode ? 'hover:bg-[#2C2C2E] border-gray-800' : 'hover:bg-indigo-50 border-gray-100'}`}>
                <img src={video.thumbnail} alt="thumbnail" className="w-10 h-10 object-cover rounded shrink-0"/>
                <span className={`truncate text-[11px] font-medium text-left ${textClass}`}>{video.title}</span>
                <ExternalLink size={10} className={iconClass} shrink-0 />
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-2 pb-2">
            <p className={`text-[10px] font-medium mb-2 ${subTextClass}`}>추천 검색어</p>
            <div className="flex flex-wrap gap-1 justify-center">
                {['#정보처리기사', '#토익', '#React강의', '#CS면접'].map(tag => (
                    <button key={tag} onClick={(e) => handleSearch(e, tag.substring(1))} className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${tagClass}`}>{tag}</button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureSearch;