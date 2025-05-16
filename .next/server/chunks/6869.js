"use strict";
exports.id = 6869;
exports.ids = [6869];
exports.modules = {

/***/ 71862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tv: () => (/* binding */ runeGlowColors),
/* harmony export */   kW: () => (/* binding */ gradeColors),
/* harmony export */   sD: () => (/* binding */ RuneBadge)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ gradeColors,runeGlowColors,RuneBadge auto */ 

const gradeColors = {
    고급: "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400",
    레어: "bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400",
    엘리트: "bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400",
    에픽: "bg-gradient-to-r from-pink-500 to-pink-600 border-pink-400",
    전설: "bg-gradient-to-r from-red-500 to-red-600 border-red-400"
};
const runeGlowColors = {
    고급: "shadow-blue-400/50",
    레어: "shadow-purple-400/50",
    엘리트: "shadow-yellow-400/50",
    에픽: "shadow-pink-400/50",
    전설: "shadow-red-400/50"
};
function RuneBadge({ children, variant = "class", gradeType }) {
    if (variant === "grade" && gradeType) {
        const gradeColor = gradeColors[gradeType] || "bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400";
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: `text-xs px-2 py-1 rounded-full text-white ${gradeColor}`,
            children: children
        });
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
        className: "text-xs bg-gray-200 rounded-full px-2 py-0.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        children: children
    });
}


/***/ }),

/***/ 48328:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ fetchRuneById),
  n: () => (/* binding */ fetchRunes)
});

// EXTERNAL MODULE: ./node_modules/drizzle-orm/better-sqlite3/driver.js + 20 modules
var driver = __webpack_require__(55679);
// EXTERNAL MODULE: external "better-sqlite3"
var external_better_sqlite3_ = __webpack_require__(85890);
var external_better_sqlite3_default = /*#__PURE__*/__webpack_require__.n(external_better_sqlite3_);
// EXTERNAL MODULE: ./src/db/schema.ts
var schema = __webpack_require__(84677);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/expressions/conditions.js
var conditions = __webpack_require__(60466);
;// CONCATENATED MODULE: ./src/lib/games/mabinogi_mobile/runes.ts




const sqlite = new (external_better_sqlite3_default())("./dev.db");
const db = (0,driver/* drizzle */.t)(sqlite);
async function getRunes() {
    const result = await db.select().from(schema/* runes */.OK);
    // comments는 별도 쿼리로 가져오거나, join으로 확장 가능
    return result.map((rune)=>{
        const runeObj = {
            id: rune.id,
            createdAt: new Date(rune.createdAt),
            updatedAt: new Date(rune.updatedAt),
            name: rune.name,
            category: rune.category,
            grade: rune.grade,
            classes: JSON.parse(rune.classes),
            effect: rune.effect,
            obtainMethod: JSON.parse(rune.obtainMethod),
            recommendedCombinations: JSON.parse(rune.recommendedCombinations),
            notes: JSON.parse(rune.notes),
            tradeable: Boolean(rune.tradeable)
        };
        // 옵셔널 필드 처리
        if (rune.duration) runeObj.duration = rune.duration;
        if (rune.cooldown) runeObj.cooldown = rune.cooldown;
        if (rune.imageUrl) runeObj.imageUrl = rune.imageUrl;
        if (rune.stats) runeObj.stats = JSON.parse(rune.stats);
        if (rune.description) runeObj.description = rune.description;
        if (rune.usage) runeObj.usage = rune.usage;
        if (rune.weight) runeObj.weight = rune.weight;
        if (rune.curseRate) runeObj.curseRate = rune.curseRate;
        if (rune.epicAchievement) {
            runeObj.epicAchievement = JSON.parse(rune.epicAchievement);
        }
        return runeObj;
    });
}
async function getRune(id) {
    const rune = await db.select().from(schema/* runes */.OK).where((0,conditions.eq)(schema/* runes */.OK.id, id));
    if (!rune[0]) return null;
    const r = rune[0];
    const runeObj = {
        id: r.id,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
        name: r.name,
        category: r.category,
        grade: r.grade,
        classes: JSON.parse(r.classes),
        effect: r.effect,
        obtainMethod: JSON.parse(r.obtainMethod),
        recommendedCombinations: JSON.parse(r.recommendedCombinations),
        notes: JSON.parse(r.notes),
        tradeable: Boolean(r.tradeable)
    };
    // 옵셔널 필드 처리
    if (r.duration) runeObj.duration = r.duration;
    if (r.cooldown) runeObj.cooldown = r.cooldown;
    if (r.imageUrl) runeObj.imageUrl = r.imageUrl;
    if (r.stats) runeObj.stats = JSON.parse(r.stats);
    if (r.description) runeObj.description = r.description;
    if (r.usage) runeObj.usage = r.usage;
    if (r.weight) runeObj.weight = r.weight;
    if (r.curseRate) runeObj.curseRate = r.curseRate;
    if (r.epicAchievement) {
        runeObj.epicAchievement = JSON.parse(r.epicAchievement);
    }
    return runeObj;
}

;// CONCATENATED MODULE: ./src/features/codex/api/runesApi.ts

async function fetchRunes() {
    try {
        const runes = await getRunes();
        return runes;
    } catch (error) {
        ;
        throw error;
    }
}
async function fetchRuneById(id) {
    try {
        const rune = await getRune(id);
        return rune;
    } catch (error) {
        ;
        throw error;
    }
}


/***/ })

};
;