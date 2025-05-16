"use strict";
exports.id = 4677;
exports.ids = [4677];
exports.modules = {

/***/ 84677:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OK: () => (/* binding */ runes),
/* harmony export */   bQ: () => (/* binding */ gameServers)
/* harmony export */ });
/* unused harmony exports runeComments, runeGuides, gameEvents, runesRelations, runeCommentsRelations */
/* harmony import */ var drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40821);
/* harmony import */ var drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9921);
/* harmony import */ var drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(77294);
/* harmony import */ var drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42946);
/* harmony import */ var drizzle_orm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2260);


const runes = (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_0__/* .sqliteTable */ .Px)("Rune", {
    id: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("id").primaryKey(),
    createdAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("createdAt", {
        mode: "timestamp"
    }).notNull(),
    updatedAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("updatedAt", {
        mode: "timestamp"
    }).notNull(),
    name: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("name").notNull(),
    category: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("category").notNull(),
    grade: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("grade").notNull(),
    classes: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("classes").notNull(),
    effect: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("effect").notNull(),
    duration: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("duration"),
    cooldown: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("cooldown"),
    obtainMethod: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("obtainMethod").notNull(),
    imageUrl: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("imageUrl"),
    recommendedCombinations: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("recommendedCombinations").notNull(),
    stats: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("stats"),
    description: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("description"),
    usage: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("usage"),
    notes: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("notes").notNull(),
    tradeable: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("tradeable", {
        mode: "boolean"
    }).notNull().default(true),
    weight: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("weight"),
    curseRate: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_3__/* .real */ .kw)("curseRate"),
    epicAchievement: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("epicAchievement")
});
const runeComments = (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_0__/* .sqliteTable */ .Px)("RuneComment", {
    id: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("id").primaryKey(),
    runeId: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("runeId").notNull(),
    userId: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("userId").notNull(),
    userName: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("userName").notNull(),
    content: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("content").notNull(),
    createdAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("createdAt", {
        mode: "timestamp"
    }).notNull(),
    updatedAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("updatedAt", {
        mode: "timestamp"
    }).notNull(),
    isBlinded: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("isBlinded", {
        mode: "boolean"
    }).notNull().default(false),
    likes: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("likes").notNull().default(0)
});
const runeGuides = (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_0__/* .sqliteTable */ .Px)("RuneGuide", {
    id: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("id").primaryKey(),
    runeId: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("runeId").notNull().unique(),
    title: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("title").notNull(),
    content: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("content").notNull(),
    obtainMethods: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("obtainMethods").notNull(),
    recommendedParty: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("recommendedParty"),
    tips: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("tips").notNull(),
    updatedAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("updatedAt", {
        mode: "timestamp"
    }).notNull()
});
const gameServers = (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_0__/* .sqliteTable */ .Px)("GameServer", {
    id: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("id").primaryKey(),
    game: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("game").notNull(),
    name: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("name").notNull(),
    status: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("status").notNull(),
    population: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("population").notNull(),
    region: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("region").notNull(),
    maintenanceMessage: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("maintenanceMessage"),
    maintenanceEndTime: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("maintenanceEndTime"),
    lastChecked: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("lastChecked", {
        mode: "timestamp"
    }).notNull(),
    createdAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("createdAt", {
        mode: "timestamp"
    }).notNull(),
    updatedAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("updatedAt", {
        mode: "timestamp"
    }).notNull()
});
const gameEvents = (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_0__/* .sqliteTable */ .Px)("GameEvent", {
    id: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("id").primaryKey(),
    game: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("game").notNull(),
    title: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("title").notNull(),
    description: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("description").notNull(),
    startDate: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("startDate", {
        mode: "timestamp"
    }).notNull(),
    endDate: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("endDate", {
        mode: "timestamp"
    }).notNull(),
    imageUrl: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("imageUrl"),
    url: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("url"),
    rewards: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("rewards"),
    isSpecial: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("isSpecial", {
        mode: "boolean"
    }).notNull().default(false),
    category: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_1__/* .text */ .fL)("category").notNull(),
    createdAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("createdAt", {
        mode: "timestamp"
    }).notNull(),
    updatedAt: (0,drizzle_orm_sqlite_core__WEBPACK_IMPORTED_MODULE_2__/* .integer */ ._L)("updatedAt", {
        mode: "timestamp"
    }).notNull()
});
// 관계 정의 (예시)
const runesRelations = (0,drizzle_orm__WEBPACK_IMPORTED_MODULE_4__/* .relations */ .lE)(runes, ({ many })=>({
        comments: many(runeComments, {
            relationName: "RuneToRuneComment"
        })
    }));
const runeCommentsRelations = (0,drizzle_orm__WEBPACK_IMPORTED_MODULE_4__/* .relations */ .lE)(runeComments, ({ one })=>({
        rune: one(runes, {
            fields: [
                runeComments.runeId
            ],
            references: [
                runes.id
            ],
            relationName: "RuneToRuneComment"
        })
    }));


/***/ })

};
;