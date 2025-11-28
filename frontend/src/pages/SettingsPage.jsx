import React, { useState } from 'react';
import { User, Lock, Download, LogOut, ChevronRight, X, Check, UserX } from 'lucide-react';
import Header from '../components/layout/Header';
import { updateUserInfo, deleteUserAccount } from '../api/authApi';
import { getGoalHistory } from '../api/statsApi';

const SettingsPage = ({ onBack, username = 'tester', onLogout, userId = 1, onStatsClick }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'nickname' or 'password'
    const [inputValue, setInputValue] = useState('');

    // 햑습 목표 기록을 JSON 파일로 백업
    const handleBackup = async () => {
        if (window.confirm('나의 학습 목표 기록을 파일로 저장하시겠습니까?')) {
            try {
                const data = await getGoalHistory(userId);
                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `study_backup_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                alert("백업 중 오류가 발생했습니다.");
            }
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setInputValue('');
        setIsModalOpen(true);
    };

    // 회원 정보 수정 (DB 연동)
    const handleUpdate = async () => {
        if (!inputValue.trim()) return alert("내용을 입력해주세요.");

        try {
            let res;
            if (modalType === 'nickname') {
                res = await updateUserInfo(userId, inputValue, null);
            } else {
                res = await updateUserInfo(userId, null, inputValue);
            }

            if (res && res.message.includes('수정되었습니다')) {
                alert("성공적으로 변경되었습니다. 다시 로그인해주세요.");
                onLogout(); // 정보 변경 후 재로그인 유도 (안전장치)
            } else {
                alert("변경 실패: " + (res.message || '오류가 발생했습니다.'));
            }
        } catch (e) {
            alert("서버 오류가 발생했습니다.");
        }
    };

    const handleLogoutClick = () => {
        if (window.confirm('정말 로그아웃 하시겠습니까?')) {
            onLogout();
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('정말 탈퇴하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            try {
                const res = await deleteUserAccount(userId);
                if (res && res.message.includes('완료')) {
                    alert('탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
                    onLogout(); // 로그아웃 처리하여 첫 화면으로 이동
                } else {
                    alert('탈퇴 실패: ' + (res.message || '오류가 발생했습니다.'));
                }
            } catch (e) {
                alert('처리 중 오류가 발생했습니다.');
            }
        }
    };

    const sectionClass = "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6";
    const itemClass = "flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer";
    const labelClass = "text-sm font-medium text-gray-700 flex items-center gap-3";
    const iconBoxClass = "w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500";

    return (
        <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden transition-colors duration-500 relative">
            <Header
                isGoalMode={false}
                isSettingsPage={true}
                onLogoClick={onBack}
                onStatsClick={onStatsClick}
                onLogout={handleLogoutClick}
                username={username}
            />

            <div className="flex-1 px-8 py-6 w-full max-w-3xl mx-auto h-full overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">설정</h2>

                {/* 계정 관리 섹션 */}
                <div className="mb-2 px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">계정 관리</div>
                <div className={sectionClass}>
                    <div className={itemClass} onClick={() => openModal('nickname')}>
                        <div className={labelClass}>
                            <div className={iconBoxClass}><User size={16} /></div>
                            <span>닉네임 변경</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-xs text-indigo-600 font-bold">{username}</span>
                            <ChevronRight size={16} />
                        </div>
                    </div>
                    <div className={itemClass} onClick={() => openModal('password')}>
                        <div className={labelClass}>
                            <div className={iconBoxClass}><Lock size={16} /></div>
                            <span>비밀번호 변경</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                </div>

                {/* 데이터 섹션 */}
                <div className="mb-2 px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">데이터</div>
                <div className={sectionClass}>
                    <div className={itemClass} onClick={handleBackup}>
                        <div className={labelClass}>
                            <div className={iconBoxClass}><Download size={16} /></div>
                            <span>학습 목표 기록 백업 (JSON)</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                </div>

                {/* 기타 섹션 */}
                <div className="mb-2 px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">기타</div>
                <div className={sectionClass}>
                    <div className={itemClass} onClick={handleLogoutClick}>
                        <div className={labelClass}>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-red-500">
                                <LogOut size={16} />
                            </div>
                            <span>로그아웃</span>
                        </div>
                    </div>

                    {/*회원 탈퇴 버튼 */}
                    <div className={itemClass} onClick={handleDeleteAccount}>
                        <div className={`${labelClass} text-red-500`}>
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                <UserX size={16} />
                            </div>
                            <span>회원 탈퇴</span>
                        </div>
                    </div>
                </div>


                <div className="text-center text-xs text-gray-400 mt-8 mb-8">
                    https://github.com/100hyeri/study-planner
                </div>
            </div>

            {/* 정보 수정 모달 */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in px-4">
                    <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-gray-100 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-gray-900 tracking-tight">
                                {modalType === 'nickname' ? '닉네임 변경' : '비밀번호 변경'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                {modalType === 'nickname' ? '새로운 닉네임' : '새로운 비밀번호'}
                            </label>
                            <input
                                type={modalType === 'password' ? 'password' : 'text'}
                                placeholder={modalType === 'nickname' ? '닉네임을 입력하세요' : '비밀번호를 입력하세요'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={16} /> 변경하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;