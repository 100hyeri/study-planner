const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const searchYoutubeVideos = async (query, maxResults = 10) => {
  if (!API_KEY) {
    alert("YouTube API Key가 설정되지 않았습니다. .env 파일을 확인하세요.");
    return [];
  }

  // snippet 파트를 요청하여 메타데이터 수신
  const searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`;
  
  try {
    const response = await fetch(searchUrl);
    if (!response.ok) return [];
    const data = await response.json();

    // UI 렌더링에 꼭 필요한 정보만 추출하여 리턴
    return data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
    })).filter(item => item.videoId);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};