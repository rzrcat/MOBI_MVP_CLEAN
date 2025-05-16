"use strict";
exports.id = 7930;
exports.ids = [7930];
exports.modules = {

/***/ 97930:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: () => (/* binding */ DifficultyMissionCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _features_tracker_components_atoms_SegmentedProgressBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(86295);
/* harmony import */ var _features_tracker_components_atoms_MissionTooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3825);
/* harmony import */ var _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(50789);
/* __next_internal_client_entry_do_not_use__ DifficultyMissionCard auto */ 




/**
 * 난이도별 미션 카드 컴포넌트
 * 사냥터 보스와 같이 난이도별로 분리된 미션을 하나의 통합 카드로 표시합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.mission - 미션 정보 (난이도 정보 포함)
 * @param props.themeColor - 테마 색상
 * @param props.themeClasses - 테마 클래스 객체
 * @param props.getMissionProgress - 미션 진행 상태 조회 함수
 * @param props.setMissionCount - 미션 상태 변경 함수
 * @param props.setMultipleMissionCounts - 여러 미션 상태 일괄 변경 함수
 * @returns 난이도별 미션 카드 컴포넌트
 */ function DifficultyMissionCard({ mission, themeColor, themeClasses, getMissionProgress, setMissionCount, setMultipleMissionCounts }) {
    // 난이도별 진행 상태 확인
    const progresses = mission.difficulties.map((d)=>getMissionProgress(d.missionId));
    const completedCount = progresses.filter((p)=>p.isComplete).length;
    const allComplete = completedCount === mission.difficulties.length;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: [
            _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__/* .TRACKER_STYLES */ ._.cardBase,
            themeClasses.cardBorder,
            allComplete ? _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__/* .TRACKER_STYLES */ ._.cardDone : "",
            "justify-between min-h-[3.5rem]"
        ].join(" "),
        style: themeColor === "custom" ? {
            borderColor: themeColor
        } : {},
        tabIndex: 0,
        onClick: ()=>{
            setMultipleMissionCounts(mission.difficulties ? mission.difficulties.map((d)=>({
                    missionId: d.missionId,
                    count: allComplete ? 0 : 1
                })) : []);
        },
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex flex-col items-center min-w-[3.5rem]",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_features_tracker_components_atoms_SegmentedProgressBar__WEBPACK_IMPORTED_MODULE_2__/* .SegmentedProgressBar */ .t, {
                        total: mission.difficulties.length,
                        completed: completedCount,
                        color: [
                            "blue",
                            "green",
                            "purple",
                            "pink",
                            "orange",
                            "gray"
                        ].includes(themeColor) ? themeColor : "custom",
                        customColor: ![
                            "blue",
                            "green",
                            "purple",
                            "pink",
                            "orange",
                            "gray"
                        ].includes(themeColor) ? themeColor : undefined,
                        onClick: (idx)=>{
                            if (mission.difficulties && idx < mission.difficulties.length) {
                                // 일반 다회차 미션과 동일하게 idx까지 모두 체크/해제
                                const checkedCount = progresses.filter((p)=>p.isComplete).length;
                                const newCount = checkedCount === idx + 1 ? idx : idx + 1;
                                mission.difficulties.forEach((d, i)=>{
                                    setMissionCount(d.missionId, i < newCount ? 1 : 0);
                                });
                            }
                        }
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        className: "text-xs text-gray-400 mt-0.5",
                        children: [
                            completedCount,
                            "/",
                            mission.difficulties.length
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex-1 min-w-0 flex flex-col gap-0.5",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: [
                            _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__/* .TRACKER_STYLES */ ._.cardTitleText,
                            allComplete ? "line-through text-gray-400" : ""
                        ].join(" "),
                        children: mission.title
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        className: _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__/* .TRACKER_STYLES */ ._.cardDescText,
                        children: [
                            mission.description,
                            mission.description ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_features_tracker_components_atoms_MissionTooltip__WEBPACK_IMPORTED_MODULE_3__/* .MissionTooltip */ ._, {
                                description: mission.description
                            }) : null
                        ]
                    })
                ]
            })
        ]
    }, mission.id);
}


/***/ })

};
;