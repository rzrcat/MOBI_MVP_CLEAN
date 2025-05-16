"use strict";
(() => {
var exports = {};
exports.id = 8446;
exports.ids = [8446,2888,660];
exports.modules = {

/***/ 536:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_page_2Ftest_mission_tracker_preferredRegion_absolutePagePath_private_next_pages_2Ftest_mission_tracker_tsx_absoluteAppPath_next_2Fdist_2Fpages_2F_app_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_),
  getServerSideProps: () => (/* binding */ getServerSideProps),
  getStaticPaths: () => (/* binding */ getStaticPaths),
  getStaticProps: () => (/* binding */ getStaticProps),
  reportWebVitals: () => (/* binding */ reportWebVitals),
  routeModule: () => (/* binding */ routeModule),
  unstable_getServerProps: () => (/* binding */ unstable_getServerProps),
  unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),
  unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),
  unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),
  unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)
});

// NAMESPACE OBJECT: ./src/pages/test-mission-tracker.tsx
var test_mission_tracker_namespaceObject = {};
__webpack_require__.r(test_mission_tracker_namespaceObject);
__webpack_require__.d(test_mission_tracker_namespaceObject, {
  "default": () => (TestMissionTracker)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages/module.js
var pages_module = __webpack_require__(23185);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(35244);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/helpers.js
var helpers = __webpack_require__(57182);
// EXTERNAL MODULE: ./node_modules/next/dist/pages/_document.js
var _document = __webpack_require__(29259);
var _document_default = /*#__PURE__*/__webpack_require__.n(_document);
// EXTERNAL MODULE: ./node_modules/next/dist/pages/_app.js
var _app = __webpack_require__(52624);
var _app_default = /*#__PURE__*/__webpack_require__.n(_app);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(85893);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(16689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "zustand"
var external_zustand_ = __webpack_require__(75671);
// EXTERNAL MODULE: external "zustand/middleware"
var middleware_ = __webpack_require__(74265);
;// CONCATENATED MODULE: ./src/features/tracker/constants/missionTasks.ts
const MISSION_TASKS = [
    // === 일일 ===
    // 계정 단위
    {
        id: "daily-cashshop-free",
        title: "캐시샵 매일 무료 상품",
        description: "(계정 1회) 캐시샵에서 매일 무료 상품 1회 수령. 갱신한 아이템 목록은 계정 공유",
        type: "daily",
        scope: "account",
        maxCompletions: 1,
        category: "캐시샵"
    },
    {
        id: "daily-gem-chest",
        title: "조각난 보석 보물상자",
        description: "(계정 1회) 캐시샵 - 골드 - 조각난 보석 보물상자",
        type: "daily",
        scope: "account",
        maxCompletions: 1,
        category: "캐시샵"
    },
    // 캐릭터 단위
    {
        id: "daily-dungeon",
        title: "요일 던전",
        description: "요일별 전용 던전 1회 클리어",
        type: "daily",
        scope: "character",
        maxCompletions: 1,
        category: "던전"
    },
    {
        id: "daily-blackhole",
        title: "검은 구멍",
        description: "30분 단위로 생성",
        type: "daily",
        scope: "character",
        maxCompletions: 3,
        category: "사냥터"
    },
    {
        id: "daily-summon-barrier",
        title: "불길한 소환의 결계",
        description: "불길한 소환의 결계 2회 클리어 (3시간 간격 입장)",
        type: "daily",
        scope: "character",
        maxCompletions: 2,
        category: "사냥터"
    },
    {
        id: "daily-tower",
        title: "망령의 탑",
        description: "망령의 탑 1회 클리어",
        type: "daily",
        scope: "character",
        maxCompletions: 1,
        category: "던전"
    },
    // 사냥터 구역 보스 (늑대의 숲, 여신의 뜰, 얼음협곡) - 통합 카드만 남김
    {
        id: "daily-huntboss-wolf",
        title: "늑대의 숲 보스",
        description: "늑대의 숲 보스 각 난이도별 1회 처치",
        type: "daily",
        scope: "character",
        maxCompletions: 3,
        category: "사냥터",
        difficulties: [
            {
                key: "normal",
                label: "일반",
                missionId: "daily-huntboss-wolf-normal"
            },
            {
                key: "hard",
                label: "어려움",
                missionId: "daily-huntboss-wolf-hard"
            },
            {
                key: "very",
                label: "매우 어려움",
                missionId: "daily-huntboss-wolf-very"
            }
        ]
    },
    {
        id: "daily-huntboss-goddess",
        title: "여신의 뜰 보스",
        description: "여신의 뜰 보스 각 난이도별 1회 처치",
        type: "daily",
        scope: "character",
        maxCompletions: 3,
        category: "사냥터",
        difficulties: [
            {
                key: "normal",
                label: "일반",
                missionId: "daily-huntboss-goddess-normal"
            },
            {
                key: "hard",
                label: "어려움",
                missionId: "daily-huntboss-goddess-hard"
            },
            {
                key: "very",
                label: "매우 어려움",
                missionId: "daily-huntboss-goddess-very"
            }
        ]
    },
    {
        id: "daily-huntboss-ice",
        title: "얼음협곡 보스",
        description: "얼음협곡 보스 각 난이도별 1회 처치",
        type: "daily",
        scope: "character",
        maxCompletions: 3,
        category: "사냥터",
        difficulties: [
            {
                key: "normal",
                label: "일반",
                missionId: "daily-huntboss-ice-normal"
            },
            {
                key: "hard",
                label: "어려움",
                missionId: "daily-huntboss-ice-hard"
            },
            {
                key: "very",
                label: "매우 어려움",
                missionId: "daily-huntboss-ice-very"
            }
        ]
    },
    // === 주간 ===
    {
        id: "weekly-fieldboss-peri",
        title: "필드보스 - 페리",
        description: "필드보스 페리 1회 처치",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "사냥터"
    },
    {
        id: "weekly-fieldboss-krab",
        title: "필드보스 - 크라브바흐",
        description: "필드보스 크라브바흐 1회 처치",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "사냥터"
    },
    {
        id: "weekly-fieldboss-krama",
        title: "필드보스 - 크라마",
        description: "필드보스 크라마 1회 처치",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "사냥터"
    },
    {
        id: "weekly-token-exchange",
        title: "마물 퇴치증표 교환",
        description: "티르코네일, 던바튼, 콜헨에서 마물 퇴치증표 1회 교환",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "교환"
    },
    {
        id: "weekly-raid-glass",
        title: "레이드 - 글라스 기브넨",
        description: "레이드(입문) 글라스 기브넨 1회 클리어",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "레이드"
    },
    {
        id: "weekly-abyss-ruin",
        title: "어비스 던전 - 가라앉은 유적",
        description: "어비스 던전 가라앉은 유적 1회 클리어",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "던전"
    },
    {
        id: "weekly-abyss-altar",
        title: "어비스 던전 - 무너진 제단",
        description: "어비스 던전 무너진 제단 1회 클리어",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "던전"
    },
    {
        id: "weekly-abyss-hall",
        title: "어비스 던전 - 파멸의 전당",
        description: "어비스 던전 파멸의 전당 1회 클리어",
        type: "weekly",
        scope: "character",
        maxCompletions: 1,
        category: "던전"
    }
];

;// CONCATENATED MODULE: ./src/shared/store/useCharacterTaskStore.ts



const useCharacterTaskStore = (0,external_zustand_.create)()((0,middleware_.persist)((set, get)=>({
        characterMissionProgress: {},
        getMissionProgress: (characterId, missionId)=>{
            const charData = get().characterMissionProgress[characterId] || {};
            if (charData[missionId]) return charData[missionId];
            return {
                completionCount: 0,
                isComplete: false
            };
        },
        checkMission: (characterId, missionId)=>{
            set((state)=>{
                const charData = state.characterMissionProgress[characterId] || {};
                const mission = MISSION_TASKS.find((m)=>m.id === missionId);
                if (!mission) return {};
                const prev = charData[missionId] || {
                    completionCount: 0,
                    isComplete: false
                };
                const newCount = Math.min(prev.completionCount + 1, mission.maxCompletions);
                return {
                    characterMissionProgress: {
                        ...state.characterMissionProgress,
                        [characterId]: {
                            ...charData,
                            [missionId]: {
                                completionCount: newCount,
                                isComplete: newCount >= mission.maxCompletions
                            }
                        }
                    }
                };
            });
        },
        resetAllMissions: (characterId)=>{
            set((state)=>{
                const resetData = {};
                MISSION_TASKS.forEach((m)=>{
                    resetData[m.id] = {
                        completionCount: 0,
                        isComplete: false
                    };
                    if (m.difficulties) {
                        m.difficulties.forEach((d)=>{
                            resetData[d.missionId] = {
                                completionCount: 0,
                                isComplete: false
                            };
                        });
                    }
                });
                return {
                    characterMissionProgress: {
                        ...state.characterMissionProgress,
                        [characterId]: resetData
                    }
                };
            });
        },
        setMissionCount: (characterId, missionId, count)=>{
            set((state)=>{
                const charData = state.characterMissionProgress[characterId] || {};
                let mission = MISSION_TASKS.find((m)=>m.id === missionId);
                let maxCompletions = mission?.maxCompletions ?? 1;
                if (!mission) {
                    mission = MISSION_TASKS.find((m)=>m.difficulties?.some((d)=>d.missionId === missionId));
                    maxCompletions = 1;
                }
                if (!mission) return {};
                const newCount = Math.max(0, Math.min(count, maxCompletions));
                return {
                    characterMissionProgress: {
                        ...state.characterMissionProgress,
                        [characterId]: {
                            ...charData,
                            [missionId]: {
                                completionCount: newCount,
                                isComplete: newCount >= maxCompletions
                            }
                        }
                    }
                };
            });
        },
        setMultipleMissionCounts: (characterId, updates)=>{
            set((state)=>{
                const charData = state.characterMissionProgress[characterId] || {};
                const newCharData = {
                    ...charData
                };
                updates.forEach(({ missionId, count })=>{
                    let mission = MISSION_TASKS.find((m)=>m.id === missionId);
                    let maxCompletions = mission?.maxCompletions ?? 1;
                    if (!mission) {
                        mission = MISSION_TASKS.find((m)=>m.difficulties?.some((d)=>d.missionId === missionId));
                        maxCompletions = 1;
                    }
                    if (!mission) return;
                    const newCount = Math.max(0, Math.min(count, maxCompletions));
                    newCharData[missionId] = {
                        completionCount: newCount,
                        isComplete: newCount >= maxCompletions
                    };
                });
                return {
                    characterMissionProgress: {
                        ...state.characterMissionProgress,
                        [characterId]: newCharData
                    }
                };
            });
        }
    }), {
    name: "character-mission-progress"
}));

;// CONCATENATED MODULE: ./src/features/tracker/utils/missionUtils.ts

/**
 * 미션을 카테고리별로 그룹화하는 함수
 *
 * @param missions - 그룹화할 미션 태스크 배열
 * @returns {Record<string, MissionTask[]>} 카테고리별로 그룹화된 미션 객체
 */ function groupMissionsByCategory(missions) {
    const grouped = {};
    missions.forEach((m)=>{
        const cat = m.category || "기타";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(m);
    });
    return grouped;
}
/**
 * 미션 목록의 진행률을 계산하는 함수
 *
 * @param missions - 진행률을 계산할 미션 배열
 * @param getMissionProgress - 개별 미션의 완료 상태를 가져오는 함수
 * @returns {{total: number, completed: number, percent: number}} 진행률 정보
 */ function calculateMissionProgress(missions, getMissionProgress) {
    const total = missions.length;
    const completed = missions.filter((m)=>getMissionProgress(m.id).isComplete).length;
    return {
        total,
        completed,
        percent: total ? Math.round(completed / total * 100) : 0
    };
}
/**
 * ThemeColor 타입에 따른 테마 관련 클래스 생성
 *
 * @param themeColor - 테마 색상 문자열
 * @returns {{cardBorder: string, cardTitle: string, cardCategory: string, isDefaultColor: boolean}} 테마 클래스 객체
 */ function getThemeClasses(themeColor) {
    const isDefaultColor = [
        "blue",
        "green",
        "purple",
        "pink",
        "orange",
        "gray"
    ].includes(themeColor);
    return {
        cardBorder: isDefaultColor ? `border-${themeColor}-200` : "",
        cardTitle: isDefaultColor ? `text-${themeColor}-700` : "",
        cardCategory: isDefaultColor ? `border-l-4 pl-2 border-${themeColor}-200 text-${themeColor}-700` : "border-l-4 pl-2",
        isDefaultColor
    };
}
/**
 * 일/주간 미션 구분 함수
 *
 * @returns {{dailyMissions: MissionTask[], weeklyMissions: MissionTask[], dailyByCategory: Record<string, MissionTask[]>, weeklyByCategory: Record<string, MissionTask[]>}} 구분된 미션 객체
 */ function getMissionsByType() {
    const dailyMissions = MISSION_TASKS.filter((m)=>m.type === "daily");
    const weeklyMissions = MISSION_TASKS.filter((m)=>m.type === "weekly");
    return {
        dailyMissions,
        weeklyMissions,
        dailyByCategory: groupMissionsByCategory(dailyMissions),
        weeklyByCategory: groupMissionsByCategory(weeklyMissions)
    };
}
/**
 * 다음 일일 숙제 초기화 시각(매일 06:00)
 * @param 기준시각 (Date)
 * @returns Date 객체
 */ function getNextDailyReset(base = new Date()) {
    const reset = new Date(base);
    reset.setHours(6, 0, 0, 0);
    if (base >= reset) {
        // 이미 오늘 6시가 지났으면 내일 6시
        reset.setDate(reset.getDate() + 1);
    }
    return reset;
}
/**
 * 다음 주간 숙제 초기화 시각(매주 월요일 06:00)
 * @param 기준시각 (Date)
 * @returns Date 객체
 */ function getNextWeeklyReset(base = new Date()) {
    const reset = new Date(base);
    reset.setHours(6, 0, 0, 0);
    // 월요일(1)까지 며칠 남았는지 계산
    const day = reset.getDay(); // 0:일, 1:월, ...
    const daysUntilMonday = (8 - day) % 7 || 7;
    if (day > 1 || day === 1 && base >= reset) {
        // 이미 이번주 월요일 6시가 지났으면 다음주 월요일 6시
        reset.setDate(reset.getDate() + daysUntilMonday);
    } else if (day < 1 || day === 1 && base < reset) {
        // 이번주 월요일 6시가 아직 안 지났으면 이번주 월요일 6시
        reset.setDate(reset.getDate() + (1 - day + 7) % 7);
    }
    return reset;
}
/**
 * 일일 숙제 초기화 필요 여부
 * @param lastReset (Date|string|null)
 * @returns boolean
 */ function isDailyResetDue(lastReset) {
    if (!lastReset) return true;
    const last = typeof lastReset === "string" ? new Date(lastReset) : lastReset;
    const now = new Date();
    const todayReset = new Date(now);
    todayReset.setHours(6, 0, 0, 0);
    return last < todayReset && now >= todayReset;
}
/**
 * 주간 숙제 초기화 필요 여부
 * @param lastReset (Date|string|null)
 * @returns boolean
 */ function isWeeklyResetDue(lastReset) {
    if (!lastReset) return true;
    const last = typeof lastReset === "string" ? new Date(lastReset) : lastReset;
    const now = new Date();
    // 이번주 월요일 6시
    const monday = new Date(now);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day + 6) % 7);
    monday.setHours(6, 0, 0, 0);
    return last < monday && now >= monday;
}

;// CONCATENATED MODULE: ./src/features/tracker/hooks/useMissionProgress.ts
/* __next_internal_client_entry_do_not_use__ useMissionProgress auto */ 

/**
 * 캐릭터별 미션 진행 상태 관리를 위한 커스텀 훅
 * 미션 상태 관리와 계산 로직을 재사용할 수 있게 합니다.
 *
 * @param characterId - 캐릭터 ID
 * @returns {Object} 미션 데이터, 진행률, 상태 관리 함수들을 포함하는 객체
 */ function useMissionProgress(characterId) {
    const { getMissionProgress, resetAllMissions, setMissionCount, setMultipleMissionCounts } = useCharacterTaskStore();
    // 미션 타입별 분류
    const { dailyMissions, weeklyMissions, dailyByCategory, weeklyByCategory } = getMissionsByType();
    // 미션 진행률 계산 함수
    const getProgress = (missions)=>{
        return calculateMissionProgress(missions, (missionId)=>getMissionProgress(characterId, missionId));
    };
    // 일일/주간 미션 진행률
    const dailyProgress = getProgress(dailyMissions);
    const weeklyProgress = getProgress(weeklyMissions);
    return {
        // 미션 데이터
        dailyMissions,
        weeklyMissions,
        dailyByCategory,
        weeklyByCategory,
        // 진행률
        dailyProgress,
        weeklyProgress,
        // 상태 조회 및 업데이트 함수
        getMissionProgress: (missionId)=>getMissionProgress(characterId, missionId),
        resetAllMissions: ()=>resetAllMissions(characterId),
        setMissionCount: (missionId, count)=>setMissionCount(characterId, missionId, count),
        setMultipleMissionCounts: (updates)=>setMultipleMissionCounts(characterId, updates)
    };
}

// EXTERNAL MODULE: ./src/features/tracker/components/molecules/MissionCard.tsx + 1 modules
var MissionCard = __webpack_require__(8020);
// EXTERNAL MODULE: ./src/features/tracker/components/molecules/MultiProgressMissionCard.tsx
var MultiProgressMissionCard = __webpack_require__(20100);
// EXTERNAL MODULE: ./src/features/tracker/components/molecules/DifficultyMissionCard.tsx
var DifficultyMissionCard = __webpack_require__(97930);
// EXTERNAL MODULE: ./src/features/tracker/constants/styles.ts
var styles = __webpack_require__(50789);
;// CONCATENATED MODULE: ./src/features/tracker/components/organisms/MissionTracker.tsx
/* __next_internal_client_entry_do_not_use__ MissionTracker auto */ 








/**
 * 미션 트래커 컴포넌트
 * 캐릭터별 일일/주간 미션 진행 상태를 표시하는 상위 컴포넌트입니다.
 * 단일 미션, 다회차 미션, 난이도별 미션을 모두 관리합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.characterId - 캐릭터 ID
 * @param props.themeColor - 테마 색상 (기본값: 'blue')
 * @param props.showDaily - 일일 미션 표시 여부 (기본값: true)
 * @param props.showWeekly - 주간 미션 표시 여부 (기본값: true)
 */ function MissionTracker({ characterId, themeColor = "blue", showDaily = true, showWeekly = true }) {
    const { dailyMissions, weeklyMissions, dailyProgress, weeklyProgress, getMissionProgress, setMissionCount, setMultipleMissionCounts } = useMissionProgress(characterId);
    const colorClasses = (0,styles/* getThemeColorClasses */.C)(themeColor);
    const resetAllMissions = useCharacterTaskStore((s)=>s.resetAllMissions);
    external_react_default().useEffect(()=>{
        if (!characterId) return;
        // 캐릭터별로 lastDailyReset, lastWeeklyReset 관리
        const dailyKey = `lastDailyReset_${characterId}`;
        const weeklyKey = `lastWeeklyReset_${characterId}`;
        const lastDailyReset = localStorage.getItem(dailyKey);
        const lastWeeklyReset = localStorage.getItem(weeklyKey);
        let didReset = false;
        if (isDailyResetDue(lastDailyReset)) {
            resetAllMissions(characterId);
            localStorage.setItem(dailyKey, new Date().toISOString());
            didReset = true;
        }
        if (isWeeklyResetDue(lastWeeklyReset)) {
            resetAllMissions(characterId);
            localStorage.setItem(weeklyKey, new Date().toISOString());
            didReset = true;
        }
        // 최초 진입 시 last*Reset이 없으면 오늘 날짜로 저장
        if (!lastDailyReset && !didReset) {
            localStorage.setItem(dailyKey, new Date().toISOString());
        }
        if (!lastWeeklyReset && !didReset) {
            localStorage.setItem(weeklyKey, new Date().toISOString());
        }
    }, [
        characterId,
        resetAllMissions
    ]);
    // 난이도별 미션인지 확인하는 함수
    const isDifficultyMission = (mission)=>{
        return !!mission.difficulties && mission.difficulties.length > 0;
    };
    // 다회차 미션인지 확인하는 함수
    const isMultiProgressMission = (mission)=>{
        return mission.maxCompletions > 1 && !isDifficultyMission(mission);
    };
    // 수동 초기화 핸들러
    const handleManualReset = (type)=>{
        resetAllMissions(characterId);
        const now = new Date().toISOString();
        if (type === "daily") {
            localStorage.setItem(`lastDailyReset_${characterId}`, now);
        } else {
            localStorage.setItem(`lastWeeklyReset_${characterId}`, now);
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "space-y-6",
        children: [
            showDaily && /*#__PURE__*/ (0,jsx_runtime.jsxs)("section", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mb-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: `text-lg font-bold ${colorClasses.textTitle}`,
                                children: "일일 미션"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "text-sm",
                                        children: [
                                            dailyProgress.completed,
                                            "/",
                                            dailyProgress.total,
                                            " (",
                                            dailyProgress.percent,
                                            "%)"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx_runtime.jsx("button", {
                                        className: "ml-2 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 border border-gray-300",
                                        onClick: ()=>handleManualReset("daily"),
                                        children: "초기화"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                        children: dailyMissions.map((mission)=>{
                            if (isDifficultyMission(mission)) {
                                return /*#__PURE__*/ jsx_runtime.jsx(DifficultyMissionCard/* DifficultyMissionCard */.f, {
                                    mission: mission,
                                    themeColor: themeColor,
                                    themeClasses: colorClasses,
                                    getMissionProgress: getMissionProgress,
                                    setMissionCount: setMissionCount,
                                    setMultipleMissionCounts: setMultipleMissionCounts
                                }, mission.id);
                            } else if (isMultiProgressMission(mission)) {
                                return /*#__PURE__*/ jsx_runtime.jsx(MultiProgressMissionCard/* MultiProgressMissionCard */.M, {
                                    mission: mission,
                                    progress: getMissionProgress(mission.id),
                                    themeColor: themeColor,
                                    themeClasses: colorClasses,
                                    onSetMissionCount: setMissionCount
                                }, mission.id);
                            } else {
                                return /*#__PURE__*/ jsx_runtime.jsx(MissionCard/* MissionCard */.O, {
                                    mission: mission,
                                    progress: getMissionProgress(mission.id),
                                    themeColor: themeColor,
                                    themeClasses: colorClasses,
                                    onSetMissionCount: setMissionCount
                                }, mission.id);
                            }
                        })
                    })
                ]
            }),
            showWeekly && /*#__PURE__*/ (0,jsx_runtime.jsxs)("section", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mb-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: `text-lg font-bold ${colorClasses.textTitle}`,
                                children: "주간 미션"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "text-sm",
                                        children: [
                                            weeklyProgress.completed,
                                            "/",
                                            weeklyProgress.total,
                                            " (",
                                            weeklyProgress.percent,
                                            "%)"
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx_runtime.jsx("button", {
                                        className: "ml-2 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 border border-gray-300",
                                        onClick: ()=>handleManualReset("weekly"),
                                        children: "초기화"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                        children: weeklyMissions.map((mission)=>{
                            if (isDifficultyMission(mission)) {
                                return /*#__PURE__*/ jsx_runtime.jsx(DifficultyMissionCard/* DifficultyMissionCard */.f, {
                                    mission: mission,
                                    themeColor: themeColor,
                                    themeClasses: colorClasses,
                                    getMissionProgress: getMissionProgress,
                                    setMissionCount: setMissionCount,
                                    setMultipleMissionCounts: setMultipleMissionCounts
                                }, mission.id);
                            } else if (isMultiProgressMission(mission)) {
                                return /*#__PURE__*/ jsx_runtime.jsx(MultiProgressMissionCard/* MultiProgressMissionCard */.M, {
                                    mission: mission,
                                    progress: getMissionProgress(mission.id),
                                    themeColor: themeColor,
                                    themeClasses: colorClasses,
                                    onSetMissionCount: setMissionCount
                                }, mission.id);
                            } else {
                                return /*#__PURE__*/ jsx_runtime.jsx(MissionCard/* MissionCard */.O, {
                                    mission: mission,
                                    progress: getMissionProgress(mission.id),
                                    themeColor: themeColor,
                                    themeClasses: colorClasses,
                                    onSetMissionCount: setMissionCount
                                }, mission.id);
                            }
                        })
                    })
                ]
            })
        ]
    });
}

;// CONCATENATED MODULE: ./src/pages/test-mission-tracker.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 

function TestMissionTracker() {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        style: {
            padding: 40
        },
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                children: "MissionTracker 단독 테스트"
            }),
            /*#__PURE__*/ jsx_runtime.jsx(MissionTracker, {
                characterId: "test-character"
            })
        ]
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2Ftest-mission-tracker&preferredRegion=&absolutePagePath=private-next-pages%2Ftest-mission-tracker.tsx&absoluteAppPath=next%2Fdist%2Fpages%2F_app&absoluteDocumentPath=next%2Fdist%2Fpages%2F_document&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



// Import the app and document modules.
// @ts-expect-error - replaced by webpack/turbopack loader

// @ts-expect-error - replaced by webpack/turbopack loader

// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

const PagesRouteModule = pages_module.PagesRouteModule;
// Re-export the component (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_page_2Ftest_mission_tracker_preferredRegion_absolutePagePath_private_next_pages_2Ftest_mission_tracker_tsx_absoluteAppPath_next_2Fdist_2Fpages_2F_app_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "default"));
// Re-export methods.
const getStaticProps = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "getStaticProps");
const getStaticPaths = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "getStaticPaths");
const getServerSideProps = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "getServerSideProps");
const config = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "config");
const reportWebVitals = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "reportWebVitals");
// Re-export legacy methods.
const unstable_getStaticProps = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "unstable_getStaticProps");
const unstable_getStaticPaths = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "unstable_getStaticPaths");
const unstable_getStaticParams = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "unstable_getStaticParams");
const unstable_getServerProps = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "unstable_getServerProps");
const unstable_getServerSideProps = (0,helpers/* hoist */.l)(test_mission_tracker_namespaceObject, "unstable_getServerSideProps");
// Create and export the route module that will be consumed.
const routeModule = new PagesRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES,
        page: "/test-mission-tracker",
        pathname: "/test-mission-tracker",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    components: {
        App: (_app_default()),
        Document: (_document_default())
    },
    userland: test_mission_tracker_namespaceObject
});

//# sourceMappingURL=pages.js.map

/***/ }),

/***/ 43076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 94140:
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 89716:
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 33100:
/***/ ((module) => {

module.exports = require("next/dist/server/render.js");

/***/ }),

/***/ 76368:
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 56724:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 18743:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 78524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 59232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 16689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 75671:
/***/ ((module) => {

module.exports = require("zustand");

/***/ }),

/***/ 74265:
/***/ ((module) => {

module.exports = require("zustand/middleware");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [9259,2624,5855,5893,3825,6295,789,7930,100,8020], () => (__webpack_exec__(536)));
module.exports = __webpack_exports__;

})();