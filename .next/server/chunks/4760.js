"use strict";
exports.id = 4760;
exports.ids = [4760];
exports.modules = {

/***/ 79322:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ auth)
/* harmony export */ });
/* harmony import */ var _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3135);

// 단순한 인증 미들웨어 역할을 하는 함수
const auth = async ()=>{
    try {
        const { data, error } = await _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__/* .supabase */ .O.auth.getSession();
        if (error || !data.session) {
            return null;
        }
        // 사용자 정보 반환
        return {
            user: {
                id: data.session.user.id,
                name: data.session.user.user_metadata?.name || data.session.user.email?.split("@")[0] || "익명",
                email: data.session.user.email,
                isAdmin: data.session.user.email?.endsWith("@admin.com") || false
            }
        };
    } catch (e) {
        ;
        return null;
    }
};


/***/ }),

/***/ 22156:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   db: () => (/* binding */ db)
/* harmony export */ });
/* harmony import */ var _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3135);

// 가상 데이터베이스 인터페이스 정의
const db = {
    // 룬 관련 쿼리
    runeComment: {
        findMany: async ({ where, orderBy })=>{
            const { data, error } = await _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__/* .supabase */ .O.from("rune_comments").select("*").eq("runeId", where.runeId).order(orderBy.createdAt === "desc" ? "created_at" : "created_at", {
                ascending: orderBy.createdAt !== "desc"
            });
            if (error) throw error;
            return data || [];
        },
        findUnique: async ({ where })=>{
            const { data, error } = await _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__/* .supabase */ .O.from("rune_comments").select("*").eq("id", where.id).single();
            if (error) return null;
            return data;
        },
        create: async ({ data })=>{
            const { data: result, error } = await _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__/* .supabase */ .O.from("rune_comments").insert([
                {
                    rune_id: data.runeId,
                    user_id: data.userId,
                    user_name: data.userName,
                    content: data.content,
                    created_at: new Date().toISOString()
                }
            ]).select().single();
            if (error) throw error;
            return result;
        },
        update: async ({ where, data })=>{
            const { data: result, error } = await _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__/* .supabase */ .O.from("rune_comments").update({
                content: data.content,
                updated_at: data.updatedAt?.toISOString(),
                is_blinded: data.isBlinded
            }).eq("id", where.id).select().single();
            if (error) throw error;
            return result;
        },
        delete: async ({ where })=>{
            const { error } = await _lib_supabase_supabaseClient__WEBPACK_IMPORTED_MODULE_0__/* .supabase */ .O.from("rune_comments").delete().eq("id", where.id);
            if (error) throw error;
            return true;
        }
    }
};


/***/ }),

/***/ 3135:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* binding */ supabase)
/* harmony export */ });
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53066);
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.com";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "temp-key";
// 개발 환경에서 환경 변수가 없을 때 경고 표시만 하고 진행합니다
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    ;
}
const supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);


/***/ })

};
;