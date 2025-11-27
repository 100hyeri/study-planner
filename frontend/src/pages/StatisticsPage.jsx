import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Sector } from 'recharts';
import { CheckCircle, Activity, Trophy, Tag, Calendar } from 'lucide-react';
import Header from '../components/layout/Header';
import { getWeeklyStats, getCategoryStats, getGoalHistory } from '../api/statsApi';

const StatisticsPage = ({ onBack, userId = 1, username, onSettingsClick, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [goalHistory, setGoalHistory] = useState([]);
  const [period, setPeriod] = useState('weekly'); 
  const [loading, setLoading] = useState(true);

  // 데이터 로딩: 통계 및 목표 이력
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const stats = await getWeeklyStats(userId, period);
      if (stats && stats.length > 0) {
        const goalVal = period === 'monthly' ? 6000 : 180; 
        setData(stats.map(item => ({ ...item, goal: goalVal })));
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

  const totalTasks = categoryData.reduce((acc, cur) => acc + cur.count, 0);
  const daysInPeriod = period === 'monthly' ? 30 : 7;
  const avgTasks = (totalTasks / daysInPeriod).toFixed(1); 

  // 계획 달성률 계산 (월간: 활동 여부, 주간: 목표 달성 여부)
  const achievementRate = data.length > 0 
    ? Math.round((data.filter(d => period === 'monthly' ? d.minutes > 0 : d.isSuccess).length / data.length) * 100) 
    : 0;

  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    if (period === 'monthly') {
      const [y, m] = tickItem.split('-');
      return `${parseInt(m)}월`;
    } else {
      const date = new Date(tickItem);
      return `${date.getMonth() + 1}.${date.getDate()}`;
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

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
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#111827" fontSize={14} fontWeight="bold">
          {payload.category}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#374151" fontSize={12}>{`${(percent * 100).toFixed(0)}%`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#9ca3af" fontSize={10}>{`${value} 건`}</text>
      </g>
    );
  };
  
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => setActiveIndex(index);

  const statusMap = { ongoing: '진행 중', success: '달성', fail: '실패' };
  const getStatusBadgeClass = (status) => {
    if (status === 'ongoing') return 'bg-blue-50 text-blue-600 border-blue-100';
    if (status === 'success') return 'bg-green-50 text-green-600 border-green-100';
    if (status === 'fail') return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-gray-100 text-gray-500 border-gray-200';
  };

  const bgClass = 'bg-gray-50';
  const cardClass = 'bg-white border border-gray-200 shadow-sm rounded-xl';

  return (
    <div className={`h-screen flex flex-col ${bgClass} text-gray-900 overflow-hidden transition-colors duration-500`}>
      <Header 
        isGoalMode={false} 
        isStatsPage={true} 
        onLogoClick={onBack} 
        onLogout={() => {
            if(window.confirm('로그아웃 하시겠습니까?')) {
                onLogout();
            }
        }} 
        username={username}
        onSettingsClick={onSettingsClick}
      />

      <div className="flex-1 px-8 py-6 w-full max-w-6xl mx-auto h-full overflow-hidden flex flex-col">
        {/* 상단 컨트롤 바 */}
        <div className="shrink-0 flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
            <div className="flex items-center gap-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">나의 활동 분석</h2>
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('overview')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>분석</button>
                    <button onClick={() => setActiveTab('goals')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'goals' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>목표</button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="flex items-center gap-2 bg-white border border-gray-200 px-1 py-1 rounded-lg shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 px-2 flex items-center gap-1"><Calendar size={12} /> 기간</span>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <button onClick={() => setPeriod('weekly')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${period === 'weekly' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>주간</button>
                    <button onClick={() => setPeriod('monthly')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${period === 'monthly' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>월간</button>
                </div>
            )}
        </div>

        {activeTab === 'overview' ? (
          <div className="flex flex-col h-full gap-4 min-h-0">
            {/* 요약 카드 */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
                {[
                    { title: '총 완료', icon: <CheckCircle size={14}/>, value: `${totalTasks}건`, color: 'text-gray-900' },
                    { title: '일 평균', icon: <Activity size={14}/>, value: `${avgTasks}건`, color: 'text-gray-900' },
                    { title: '계획 달성', icon: <Trophy size={14}/>, value: `${achievementRate}%`, color: 'text-indigo-600' },
                    { title: '주요 활동', icon: <Tag size={14}/>, value: categoryData.length > 0 ? categoryData[0].category : '-', color: 'text-orange-500' }
                ].map((item, idx) => (
                    <div key={idx} className={`${cardClass} p-4 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow`}>
                        <div className="text-gray-400 text-[10px] font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wide">{item.icon} {item.title}</div>
                        <p className={`text-xl font-black ${item.color} truncate w-full`}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* 그래프 영역 */}
            <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
              {/* 집중 시간 리포트 (막대 그래프) */}
              <div className={`${cardClass} p-5 flex-1 flex flex-col min-h-0`}>
                <h3 className="text-sm font-bold text-gray-800 mb-6 shrink-0 flex items-center gap-2"><span className="w-1 h-4 bg-indigo-500 rounded-full"></span>집중 시간 리포트</h3>
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                      <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{fontSize:11, fill:'#6b7280'}} axisLine={false} tickLine={false} dy={10} interval={0} />
                      <YAxis tick={{fontSize:11, fill:'#6b7280'}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill:'#f3f4f6'}} contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize:'12px', padding:'12px'}} />
                      <Bar dataKey="minutes" fill="#6366f1" radius={[4,4,4,4]} barSize={period === 'monthly' ? 20 : 32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 활동 비율 (파이 차트) */}
              <div className={`${cardClass} p-5 w-full md:w-1/3 flex flex-col min-h-0`}>
                <h3 className="text-sm font-bold text-gray-800 mb-2 shrink-0 flex items-center gap-2"><span className="w-1 h-4 bg-emerald-500 rounded-full"></span>활동 비율</h3>
                <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="count" onMouseEnter={onPieEnter} paddingAngle={2}>
                          {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (<div className="text-center text-gray-400"><p className="text-xs">데이터가 없습니다.</p></div>)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 목표 히스토리 탭 */
          <div className={`${cardClass} p-0 h-full flex flex-col overflow-hidden`}>
            <div className="p-5 border-b border-gray-100 shrink-0">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><span className="w-1 h-4 bg-orange-500 rounded-full"></span>목표 히스토리</h3>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-400 uppercase bg-gray-50 sticky top-0 font-medium">
                  <tr><th className="px-4 py-3 rounded-l-lg">목표</th><th className="px-4 py-3">기간</th><th className="px-4 py-3 text-center rounded-r-lg">상태</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {goalHistory.length > 0 ? goalHistory.map((goal) => (
                    <tr key={goal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-800">{goal.title}</td>
                      <td className="px-4 py-3.5 text-gray-500 font-medium">{goal.start_date?.slice(0,10)} ~ {goal.end_date?.slice(0,10)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(goal.status)}`}>
                          {statusMap[goal.status] || goal.status}
                        </span>
                      </td>
                    </tr>
                  )) : (<tr><td colSpan="3" className="text-center py-10 text-gray-400">기록이 없습니다.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;