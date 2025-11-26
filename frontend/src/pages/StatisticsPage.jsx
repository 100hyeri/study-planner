import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Sector } from 'recharts';
import { Clock, TrendingUp, Target, Flame, Home } from 'lucide-react';
import { getWeeklyStats, getCategoryStats, getGoalHistory } from '../api/statsApi';

const StatisticsPage = ({ onBack, userId = 1 }) => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [goalHistory, setGoalHistory] = useState([]);
  const [period, setPeriod] = useState(7);
  const [loading, setLoading] = useState(true);

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const stats = await getWeeklyStats(userId, period);
      if (stats && stats.length > 0) {
        setData(stats.map(item => ({ ...item, goal: 180 })));
      } else {
        setData([]);
      }
      const catStats = await getCategoryStats(userId, period);
      setCategoryData(catStats || []);
      const goals = await getGoalHistory(userId);
      setGoalHistory(goals || []);
      setLoading(false);
    };
    loadData();
  }, [userId, period]);

  // 통계 계산
  const totalStudyTime = data.reduce((acc, cur) => acc + cur.minutes, 0);
  const avgStudyTime = data.length > 0 ? Math.round(totalStudyTime / data.length) : 0;
  const achievementRate = data.length > 0 ? Math.round((data.filter(d => d.minutes >= d.goal).length / data.length) * 100) : 0;

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

  // 원형 그래프 커스텀 라벨 (카테고리명 + %)
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#374151" fontSize={14} fontWeight="bold">
          {payload.category}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>{`${(percent * 100).toFixed(0)}%`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={10}>
          {`${value} tasks`}
        </text>
      </g>
    );
  };
  
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb] text-gray-900 overflow-hidden">
      
      {/* 1. 배너 (헤더) */}
      <header className="flex justify-between items-center py-3 px-6 bg-white border-b border-gray-200 shrink-0 h-14">
        {/* 로고 클릭 시 홈으로 이동 */}
        <div 
          onClick={onBack} 
          className="text-xl font-black tracking-wider text-indigo-600 cursor-pointer hover:opacity-80"
        >
          PLANNER. <span className="text-gray-400 text-xs font-medium ml-2">STATISTICS</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('overview')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>분석</button>
            <button onClick={() => setActiveTab('goals')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'goals' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>목표</button>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500" title="홈으로 돌아가기">
            <Home size={18} />
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 (스크롤 없이 꽉 차게) */}
      <div className="flex-1 p-4 w-full max-w-7xl mx-auto h-full overflow-hidden flex flex-col">
        
        {activeTab === 'overview' ? (
          <div className="flex flex-col h-full gap-4">
            
            {/* 상단: 기간 선택 & 요약 카드 */}
            <div className="shrink-0">
              <div className="flex justify-end mb-2">
                <div className="flex bg-white border border-gray-200 p-0.5 rounded-md">
                  <button onClick={() => setPeriod(7)} className={`px-2 py-0.5 text-[10px] font-bold rounded ${period === 7 ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}>Weekly</button>
                  <button onClick={() => setPeriod(30)} className={`px-2 py-0.5 text-[10px] font-bold rounded ${period === 30 ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}>Monthly</button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                  <div className="text-gray-400 text-[10px] font-bold mb-1 flex items-center gap-1"><Clock size={12}/> TOTAL</div>
                  <p className="text-lg font-black text-gray-800">{formatTime(totalStudyTime)}</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                  <div className="text-gray-400 text-[10px] font-bold mb-1 flex items-center gap-1"><TrendingUp size={12}/> AVG</div>
                  <p className="text-lg font-black text-gray-800">{formatTime(avgStudyTime)}</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                  <div className="text-gray-400 text-[10px] font-bold mb-1 flex items-center gap-1"><Target size={12}/> SUCCESS</div>
                  <p className="text-lg font-black text-indigo-600">{achievementRate}%</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                  <div className="text-gray-400 text-[10px] font-bold mb-1 flex items-center gap-1"><Flame size={12}/> TOP</div>
                  <p className="text-lg font-black text-orange-500 truncate w-full px-2">{categoryData.length > 0 ? categoryData[0].category : '-'}</p>
                </div>
              </div>
            </div>

            {/* 하단: 그래프 영역 (높이 자동 조절) */}
            <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
              {/* 활동 그래프 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-bold text-gray-700 mb-4 shrink-0">Study Activity</h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                      <XAxis dataKey="date" tick={{fontSize:10}} axisLine={false} tickLine={false} dy={10} interval={period === 30 ? 4 : 0} />
                      <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill:'transparent'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                      <Bar dataKey="minutes" fill="#6366f1" radius={[4,4,4,4]} barSize={period === 30 ? 8 : 24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 카테고리 그래프 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full md:w-1/3 flex flex-col min-h-0">
                <h3 className="text-sm font-bold text-gray-700 mb-2 shrink-0">Category Ratio</h3>
                <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={categoryData} 
                          cx="50%" cy="50%" 
                          innerRadius={40} 
                          outerRadius={60} 
                          dataKey="count"
                          onMouseEnter={onPieEnter}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-xs text-gray-400">데이터 없음</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          // 탭 2: 목표 이력 (스크롤 가능)
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-gray-700 mb-4 shrink-0">Goal History</h3>
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-500 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">목표</th>
                    <th className="px-4 py-3">기간</th>
                    <th className="px-4 py-3 text-center">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {goalHistory.length > 0 ? goalHistory.map((goal) => (
                    <tr key={goal.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{goal.title}</td>
                      <td className="px-4 py-3 text-gray-500">{goal.start_date?.slice(0,10)} ~ {goal.end_date?.slice(0,10)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${goal.status === 'ongoing' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                          {goal.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="text-center py-8 text-gray-400">기록 없음</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* 플로팅 홈 버튼 */}
      <button 
        onClick={onBack}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
        title="플래너로 돌아가기"
      >
        <Home size={20} />
      </button>
    </div>
  );
};

export default StatisticsPage;