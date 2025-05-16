"use strict";
exports.id = 8020;
exports.ids = [8020];
exports.modules = {

/***/ 8020:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  O: () => (/* binding */ MissionCard)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(85893);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(16689);
// EXTERNAL MODULE: ./src/features/tracker/components/atoms/MissionTooltip.tsx
var MissionTooltip = __webpack_require__(3825);
// EXTERNAL MODULE: ./src/features/tracker/constants/styles.ts
var styles = __webpack_require__(50789);
;// CONCATENATED MODULE: ./src/shared/ui/atoms/CheckStampIcon.tsx


function CheckStampIcon({ size = 32, color = "#FFD600", bg = "rgba(0,0,0,0.2)" }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("svg", {
        width: size,
        height: size,
        viewBox: "0 0 48 48",
        fill: "none",
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("circle", {
                cx: "24",
                cy: "24",
                r: "20",
                fill: bg
            }),
            /*#__PURE__*/ jsx_runtime.jsx("circle", {
                cx: "24",
                cy: "24",
                r: "20",
                stroke: color,
                strokeWidth: "4",
                fill: "none"
            }),
            /*#__PURE__*/ jsx_runtime.jsx("path", {
                d: "M16 25L22 31L33 18",
                stroke: color,
                strokeWidth: "4",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        ]
    });
}

;// CONCATENATED MODULE: ./src/features/tracker/components/molecules/MissionCard.tsx
/* __next_internal_client_entry_do_not_use__ MissionCard auto */ 




/**
 * 미션 카드 컴포넌트
 * 1회 완료형 미션을 표시하는 카드 컴포넌트입니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.mission - 미션 정보
 * @param props.progress - 미션 진행 상태
 * @param props.themeColor - 테마 색상
 * @param props.themeClasses - 테마 클래스 객체
 * @param props.onSetMissionCount - 미션 상태 변경 핸들러
 * @returns 미션 카드 컴포넌트
 */ function MissionCard({ mission, progress, themeColor, themeClasses, onSetMissionCount }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: [
            styles/* TRACKER_STYLES */._.cardBase,
            themeClasses.cardBorder,
            progress.isComplete ? styles/* TRACKER_STYLES */._.cardDone : ""
        ].join(" "),
        style: themeColor === "custom" ? {
            borderColor: themeColor
        } : {},
        tabIndex: 0,
        onClick: ()=>{
            const newCount = progress.isComplete ? 0 : 1;
            onSetMissionCount(mission.id, newCount);
        },
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("div", {
                className: "flex items-center justify-center w-8 h-8",
                children: progress.isComplete ? /*#__PURE__*/ jsx_runtime.jsx(CheckStampIcon, {
                    size: 32
                }) : /*#__PURE__*/ jsx_runtime.jsx("span", {
                    className: `w-6 h-6 flex-none rounded-full border-2 border-gray-300 flex items-center justify-center`
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex-1 min-w-0 flex flex-col gap-0.5",
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx("span", {
                        className: [
                            styles/* TRACKER_STYLES */._.cardTitleText,
                            progress.isComplete ? "line-through text-gray-400" : ""
                        ].join(" "),
                        children: mission.title
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        className: styles/* TRACKER_STYLES */._.cardDescText,
                        children: [
                            mission.description,
                            mission.description ? /*#__PURE__*/ jsx_runtime.jsx(MissionTooltip/* MissionTooltip */._, {
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