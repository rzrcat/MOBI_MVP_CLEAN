"use strict";
exports.id = 100;
exports.ids = [100];
exports.modules = {

/***/ 20100:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ MultiProgressMissionCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _features_tracker_components_atoms_SegmentedProgressBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(86295);
/* harmony import */ var _features_tracker_components_atoms_MissionTooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3825);
/* harmony import */ var _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(50789);
/* __next_internal_client_entry_do_not_use__ MultiProgressMissionCard auto */ 




/**
 * 다회차 진행 미션 카드 컴포넌트
 * 1개 이상의 완료 횟수가 필요한 미션을 표시하며, 세그먼트 단위로 진행 상태를 시각화합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.mission - 미션 정보
 * @param props.progress - 미션 진행 상태 (완료 횟수와 완료 여부)
 * @param props.themeColor - 테마 색상
 * @param props.themeClasses - 테마 클래스 객체
 * @param props.onSetMissionCount - 미션 상태 변경 핸들러
 * @returns 다회차 진행 미션 카드 컴포넌트
 */ function MultiProgressMissionCard({ mission, progress, themeColor, themeClasses, onSetMissionCount }) {
    const { cardBorder } = themeClasses;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: [
            _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__/* .TRACKER_STYLES */ ._.cardBase,
            cardBorder,
            progress.isComplete ? _features_tracker_constants_styles__WEBPACK_IMPORTED_MODULE_4__/* .TRACKER_STYLES */ ._.cardDone : "",
            "justify-between min-h-[3.5rem]"
        ].join(" "),
        style: themeColor === "custom" ? {
            borderColor: themeColor
        } : {},
        tabIndex: 0,
        onClick: ()=>{
            const newCount = progress.isComplete ? 0 : mission.maxCompletions;
            onSetMissionCount(mission.id, newCount);
        },
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex flex-col items-center min-w-[3.5rem]",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_features_tracker_components_atoms_SegmentedProgressBar__WEBPACK_IMPORTED_MODULE_2__/* .SegmentedProgressBar */ .t, {
                        total: mission.maxCompletions,
                        completed: progress.completionCount,
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
                            // 인덱스까지 모두 체크하거나, 이미 해당 인덱스까지 체크되어 있으면 인덱스-1까지 체크
                            const newCount = progress.completionCount === idx + 1 ? idx : idx + 1;
                            onSetMissionCount(mission.id, newCount);
                        }
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        className: "text-xs text-gray-400 mt-0.5",
                        children: [
                            progress.completionCount,
                            "/",
                            mission.maxCompletions
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
                            progress.isComplete ? "line-through text-gray-400" : ""
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