"use strict";
exports.id = 3825;
exports.ids = [3825];
exports.modules = {

/***/ 3825:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ MissionTooltip)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ MissionTooltip auto */ 

/**
 * 미션 정보 툴팁 컴포넌트
 * 미션에 대한 추가 설명을 툴팁으로 표시합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.description - 툴팁에 표시할 설명 텍스트
 * @returns 툴팁 컴포넌트
 */ function MissionTooltip({ description }) {
    const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
        className: "relative inline-block align-middle",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                className: "ml-1 text-blue-400 cursor-pointer select-none",
                onMouseEnter: ()=>setShow(true),
                onMouseLeave: ()=>setShow(false),
                onClick: ()=>setShow((v)=>!v),
                children: "?"
            }),
            show && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-pre-line",
                children: description
            })
        ]
    });
}


/***/ })

};
;