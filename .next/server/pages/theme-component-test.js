"use strict";
(() => {
var exports = {};
exports.id = 281;
exports.ids = [281,2888,660];
exports.modules = {

/***/ 76108:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_page_2Ftheme_component_test_preferredRegion_absolutePagePath_private_next_pages_2Ftheme_component_test_tsx_absoluteAppPath_next_2Fdist_2Fpages_2F_app_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_),
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

// NAMESPACE OBJECT: ./src/pages/theme-component-test.tsx
var theme_component_test_namespaceObject = {};
__webpack_require__.r(theme_component_test_namespaceObject);
__webpack_require__.d(theme_component_test_namespaceObject, {
  "default": () => (theme_component_test)
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
// EXTERNAL MODULE: external "zustand"
var external_zustand_ = __webpack_require__(75671);
// EXTERNAL MODULE: external "zustand/middleware"
var middleware_ = __webpack_require__(74265);
;// CONCATENATED MODULE: ./src/store/useComponentThemeStore.ts


// 기본 컴포넌트 테마 설정
const defaultComponentTheme = {
    backgroundColor: "transparent",
    textColor: "inherit",
    borderColor: "transparent",
    borderWidth: "0",
    borderRadius: "0",
    padding: "0",
    margin: "0",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    custom: {}
};
// Zustand 스토어 생성
const useComponentThemeStore = (0,external_zustand_.create)()((0,middleware_.persist)((set, get)=>({
        // 컴포넌트 테마 설정 맵
        themes: {},
        // 컴포넌트 테마 설정 업데이트
        setComponentTheme: (componentId, theme)=>set((state)=>({
                    themes: {
                        ...state.themes,
                        [componentId]: {
                            ...state.themes[componentId] || defaultComponentTheme,
                            ...theme
                        }
                    }
                })),
        // 컴포넌트 테마 설정 제거
        removeComponentTheme: (componentId)=>set((state)=>{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [componentId]: removed, ...rest } = state.themes;
                return {
                    themes: rest
                };
            }),
        // 컴포넌트 테마 설정 초기화
        resetComponentTheme: (componentId)=>set((state)=>({
                    themes: {
                        ...state.themes,
                        [componentId]: {
                            ...defaultComponentTheme
                        }
                    }
                })),
        // 모든 컴포넌트 테마 설정 초기화
        resetAllThemes: ()=>set({
                themes: {}
            }),
        // 컴포넌트 테마 설정 가져오기
        getComponentTheme: (componentId)=>{
            const { themes } = get();
            return themes[componentId];
        },
        // 속성별 테마 설정 업데이트
        setComponentProperty: (componentId, property, value)=>set((state)=>({
                    themes: {
                        ...state.themes,
                        [componentId]: {
                            ...state.themes[componentId] || defaultComponentTheme,
                            [property]: value
                        }
                    }
                })),
        // 커스텀 속성 설정
        setCustomProperty: (componentId, property, value)=>set((state)=>{
                const currentTheme = state.themes[componentId] || defaultComponentTheme;
                const currentCustom = currentTheme.custom || {};
                return {
                    themes: {
                        ...state.themes,
                        [componentId]: {
                            ...currentTheme,
                            custom: {
                                ...currentCustom,
                                [property]: value
                            }
                        }
                    }
                };
            })
    }), {
    name: "component-theme-storage"
}));

;// CONCATENATED MODULE: ./src/components/core/ThemeableComponent.tsx
/* __next_internal_client_entry_do_not_use__ ThemeableComponent,ThemeEditButton,withTheming auto */ 


const ThemeableComponent = ({ componentId, children, className = "", style = {} })=>{
    // 컴포넌트의 테마 정보 가져오기
    const { getComponentTheme } = useComponentThemeStore();
    const theme = getComponentTheme(componentId);
    // 테마 설정이 없으면 기본 스타일로 렌더링
    if (!theme) {
        return /*#__PURE__*/ jsx_runtime.jsx("div", {
            id: componentId,
            className: className,
            style: style,
            children: children
        });
    }
    // 테마 설정을 스타일 객체로 변환
    const themeStyles = {
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        borderColor: theme.borderColor,
        borderWidth: theme.borderWidth,
        borderRadius: theme.borderRadius,
        padding: theme.padding,
        margin: theme.margin,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
        fontWeight: theme.fontWeight,
        ...style
    };
    // 커스텀 속성이 있으면 CSS 변수로 적용
    const customStyles = {};
    if (theme.custom) {
        Object.entries(theme.custom).forEach(([key, value])=>{
            customStyles[`--${key}`] = value;
        });
    }
    return /*#__PURE__*/ jsx_runtime.jsx("div", {
        id: componentId,
        className: `themeable-component ${className}`,
        style: {
            ...themeStyles,
            ...customStyles
        },
        "data-component-id": componentId,
        children: children
    });
};
const ThemeEditButton = ({ componentId, onEdit })=>{
    return /*#__PURE__*/ _jsx("button", {
        className: "theme-edit-button absolute top-0 right-0 bg-blue-500 text-white p-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity",
        onClick: ()=>onEdit(componentId),
        children: "편집"
    });
};
// 사용 예시: 컴포넌트를 테마 적용 가능하게 만들기
const withTheming = (Component, componentId)=>{
    const ThemedComponent = (props)=>/*#__PURE__*/ jsx_runtime.jsx(ThemeableComponent, {
            componentId: componentId,
            children: /*#__PURE__*/ jsx_runtime.jsx(Component, {
                ...props
            })
        });
    ThemedComponent.displayName = `Themed(${Component.displayName || Component.name || "Component"})`;
    return ThemedComponent;
};

;// CONCATENATED MODULE: external "react-dom"
const external_react_dom_namespaceObject = require("react-dom");
;// CONCATENATED MODULE: ./src/utils/common/classNames.ts
/**
 * ClassValue에 대한 타입 정의
 */ /**
 * 클래스 이름을 조건부로 결합하기 위한 유틸리티 함수
 * @param classes 적용할 클래스 값 목록
 * @returns 결합된 클래스 이름 문자열
 */ function classNames(...classes) {
    const result = [];
    for (const item of classes){
        if (!item) continue;
        if (typeof item === "string") {
            result.push(item);
        } else if (typeof item === "object") {
            Object.entries(item).forEach(([key, value])=>{
                if (value) {
                    result.push(key);
                }
            });
        }
    }
    return result.join(" ");
}

;// CONCATENATED MODULE: ./src/shared/ui/molecules/ColorPicker.tsx




// 기본 팔레트 색상
const PALETTE_COLORS = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#800000",
    "#808080",
    "#A52A2A",
    "#FFC0CB",
    "#FFD700",
    "#C0C0C0",
    "#4B0082",
    "#FF4500",
    "#32CD32",
    "#BA55D3",
    "#20B2AA",
    "#FF69B4",
    "#CD853F",
    "#4682B4",
    "#DDA0DD",
    "#F0E68C",
    "#E6E6FA",
    "#98FB98",
    "#87CEEB",
    "#D8BFD8",
    "#FF6347",
    "#40E0D0",
    "#EE82EE",
    "#F5DEB3",
    "#6495ED"
];
function hexToRgb(hex) {
    try {
        // 유효한 hex인지 확인
        if (!hex || typeof hex !== "string") return [
            0,
            0,
            0
        ];
        let c = hex.replace("#", "");
        // 3자리 또는 6자리 hex가 아니면 기본값 반환
        if (c.length === 3) {
            c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        } else if (c.length !== 6) {
            return [
                0,
                0,
                0
            ];
        }
        // 유효한 16진수 문자인지 확인
        if (!/^[0-9A-Fa-f]{6}$/.test(c)) return [
            0,
            0,
            0
        ];
        const num = parseInt(c, 16);
        const r = num >> 16 & 255;
        const g = num >> 8 & 255;
        const b = num & 255;
        // NaN 확인 및 범위 제한
        return [
            isNaN(r) ? 0 : Math.max(0, Math.min(255, r)),
            isNaN(g) ? 0 : Math.max(0, Math.min(255, g)),
            isNaN(b) ? 0 : Math.max(0, Math.min(255, b))
        ];
    } catch  {
        return [
            0,
            0,
            0
        ]; // 오류 발생 시 검은색 반환
    }
}
function rgbToHex(r, g, b) {
    try {
        // NaN이나 undefined 값을 0으로 대체
        const rVal = isNaN(r) ? 0 : Math.max(0, Math.min(255, Math.round(r)));
        const gVal = isNaN(g) ? 0 : Math.max(0, Math.min(255, Math.round(g)));
        const bVal = isNaN(b) ? 0 : Math.max(0, Math.min(255, Math.round(b)));
        return "#" + [
            rVal,
            gVal,
            bVal
        ].map((x)=>x.toString(16).padStart(2, "0")).join("").toUpperCase();
    } catch  {
        return "#000000"; // 오류 발생 시 검은색 반환
    }
}
// Spectrum(스펙트럼) 컴포넌트: 첨부 이미지 스타일로 리팩토링
function Spectrum({ value, onChange }) {
    // HSV 상태 관리
    const [hue, setHue] = (0,external_react_.useState)(270); // 0~360
    const [s, setS] = (0,external_react_.useState)(0.7); // 0~1
    const [v, setV] = (0,external_react_.useState)(0.8); // 0~1
    const spectrumRef = (0,external_react_.useRef)(null);
    const hueRef = (0,external_react_.useRef)(null);
    const isDraggingRef = (0,external_react_.useRef)(false);
    const prevValueRef = (0,external_react_.useRef)(value || "#000000");
    // HSV → RGB 변환
    function hsvToRgb(h, s, v) {
        const f = (n, k = (n + h / 60) % 6)=>v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        return [
            Math.round(f(5) * 255),
            Math.round(f(3) * 255),
            Math.round(f(1) * 255)
        ];
    }
    // RGB → HEX
    function rgbToHex2([r, g, b]) {
        try {
            // NaN이나 undefined 값을 0으로 대체
            const rVal = isNaN(r) ? 0 : Math.max(0, Math.min(255, Math.round(r)));
            const gVal = isNaN(g) ? 0 : Math.max(0, Math.min(255, Math.round(g)));
            const bVal = isNaN(b) ? 0 : Math.max(0, Math.min(255, Math.round(b)));
            return "#" + [
                rVal,
                gVal,
                bVal
            ].map((x)=>x.toString(16).padStart(2, "0")).join("").toUpperCase();
        } catch  {
            return "#000000"; // 오류 발생 시 검은색 반환
        }
    }
    // HEX → HSV 변환
    function hexToHsv(hex) {
        try {
            // 유효한 hex인지 확인
            if (!hex || typeof hex !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                return [
                    0,
                    0,
                    0
                ];
            }
            const [r, g, b] = hexToRgb(hex);
            if (r === 0 && g === 0 && b === 0) return [
                0,
                0,
                0
            ];
            const rNorm = r / 255;
            const gNorm = g / 255;
            const bNorm = b / 255;
            const max = Math.max(rNorm, gNorm, bNorm);
            const min = Math.min(rNorm, gNorm, bNorm);
            let h = 0;
            let v = max;
            const d = max - min;
            let s = max === 0 ? 0 : d / max;
            if (max === min) {
                h = 0; // 무채색
            } else {
                switch(max){
                    case rNorm:
                        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
                        break;
                    case gNorm:
                        h = (bNorm - rNorm) / d + 2;
                        break;
                    case bNorm:
                        h = (rNorm - gNorm) / d + 4;
                        break;
                }
                h = Math.round(h * 60);
            }
            // 값 범위 제한
            h = isNaN(h) ? 0 : Math.max(0, Math.min(360, h));
            s = isNaN(s) ? 0 : Math.max(0, Math.min(1, s));
            v = isNaN(v) ? 0 : Math.max(0, Math.min(1, v));
            return [
                h,
                s,
                v
            ];
        } catch  {
            // 오류 발생 시 기본값 반환
            return [
                0,
                0,
                0
            ];
        }
    }
    // value(hex) → HSV/alpha 동기화 (외부에서 value가 변경될 때만)
    (0,external_react_.useEffect)(()=>{
        // 값 유효성 검사 추가
        const safeValue = value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000";
        // 이전 값과 다르고, 드래그 중이 아닐 때만 동기화
        if (prevValueRef.current !== safeValue && !isDraggingRef.current) {
            const [h, s_, v_] = hexToHsv(safeValue);
            setHue(h);
            setS(s_);
            setV(v_);
            prevValueRef.current = safeValue;
        }
    }, [
        value
    ]);
    // 색상 값이 변경될 때마다 부모에게 알림 (디바운스)
    const updateColorRef = (0,external_react_.useRef)(null);
    (0,external_react_.useEffect)(()=>{
        if (isDraggingRef.current) {
            // 드래그 중에만 색상 업데이트
            if (updateColorRef.current) {
                clearTimeout(updateColorRef.current);
            }
            updateColorRef.current = setTimeout(()=>{
                const rgb = hsvToRgb(hue, s, v);
                const hex = rgbToHex2(rgb);
                if (hex !== prevValueRef.current) {
                    prevValueRef.current = hex;
                    onChange(hex);
                }
            }, 20); // 20ms 디바운스
        }
        return ()=>{
            if (updateColorRef.current) {
                clearTimeout(updateColorRef.current);
            }
        };
    }, [
        hue,
        s,
        v,
        onChange
    ]);
    // 스펙트럼(색상 선택) 클릭/드래그
    function handleSpectrumSelect(e) {
        e.preventDefault(); // 기본 동작 방지
        e.stopPropagation(); // 이벤트 버블링 방지
        isDraggingRef.current = true;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        setS(x / rect.width);
        setV(1 - y / rect.height);
    }
    // Hue 슬라이더 클릭/드래그
    function handleHueSelect(e) {
        e.preventDefault(); // 기본 동작 방지
        e.stopPropagation(); // 이벤트 버블링 방지
        isDraggingRef.current = true;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setHue(x / rect.width * 360);
    }
    // 마우스 업 이벤트 처리
    (0,external_react_.useEffect)(()=>{
        const handleMouseUp = ()=>{
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                // 마우스를 놓았을 때 최종 색상 적용
                const rgb = hsvToRgb(hue, s, v);
                const hex = rgbToHex2(rgb);
                if (hex !== prevValueRef.current) {
                    prevValueRef.current = hex;
                    onChange(hex);
                }
            }
        };
        window.addEventListener("mouseup", handleMouseUp);
        return ()=>{
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [
        hue,
        s,
        v,
        onChange
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "w-full max-w-[220px] mx-auto",
        onClick: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("div", {
                ref: spectrumRef,
                className: "relative w-full aspect-square rounded-lg overflow-hidden cursor-crosshair",
                style: {
                    backgroundImage: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%)), linear-gradient(to top, #000, transparent)`,
                    height: "160px"
                },
                onClick: handleSpectrumSelect,
                onMouseDown: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    handleSpectrumSelect(e);
                },
                onMouseMove: (e)=>{
                    if (e.buttons === 1) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSpectrumSelect(e);
                    }
                },
                children: /*#__PURE__*/ jsx_runtime.jsx("div", {
                    className: "absolute w-4 h-4 rounded-full border-2 border-white shadow",
                    style: {
                        left: `${s * 100}%`,
                        top: `${(1 - v) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        boxShadow: "0 0 0 1px #007AFF"
                    }
                })
            }),
            /*#__PURE__*/ jsx_runtime.jsx("div", {
                ref: hueRef,
                className: "relative w-full h-4 mt-2 rounded-full overflow-hidden cursor-pointer",
                style: {
                    background: "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)"
                },
                onClick: handleHueSelect,
                onMouseDown: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    handleHueSelect(e);
                },
                onMouseMove: (e)=>{
                    if (e.buttons === 1) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleHueSelect(e);
                    }
                },
                children: /*#__PURE__*/ jsx_runtime.jsx("div", {
                    className: "absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow",
                    style: {
                        left: `${hue / 360 * 100}%`,
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        boxShadow: "0 0 0 1px #007AFF"
                    }
                })
            })
        ]
    });
}
const ColorPicker = ({ value, onChange, onClose, label, id, className })=>{
    const [hex, setHex] = (0,external_react_.useState)(value?.split(":")[0] || "#000000");
    const [rgb, setRgb] = (0,external_react_.useState)(hexToRgb(value?.split(":")[0] || "#000000"));
    const [showPicker, setShowPicker] = (0,external_react_.useState)(false);
    const pickerRef = (0,external_react_.useRef)(null);
    const triggerRef = (0,external_react_.useRef)(null);
    const [pickerPosition, setPickerPosition] = (0,external_react_.useState)({
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
    });
    const [isDragging, setIsDragging] = (0,external_react_.useState)(false);
    const [dragOffset, setDragOffset] = (0,external_react_.useState)({
        x: 0,
        y: 0
    });
    // 컴포넌트가 마운트될 때 피커 표시하지 않도록 변경
    (0,external_react_.useEffect)(()=>{
    // 아무 작업도 하지 않음 - 사용자가 직접 클릭해야 표시되도록 함
    }, []);
    // 드래그 시작 핸들러
    const handleDragStart = (e)=>{
        if (e.target instanceof HTMLElement && e.target.closest(".picker-header")) {
            setIsDragging(true);
            const rect = pickerRef.current?.getBoundingClientRect();
            if (rect) {
                setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        }
    };
    // 터치 드래그 시작 핸들러 추가
    const handleTouchDragStart = (e)=>{
        if (e.target instanceof HTMLElement && e.target.closest(".picker-header")) {
            setIsDragging(true);
            const rect = pickerRef.current?.getBoundingClientRect();
            if (rect && e.touches[0]) {
                setDragOffset({
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                });
            }
        }
    };
    // 드래그 중 핸들러
    (0,external_react_.useEffect)(()=>{
        const handleMouseMove = (e)=>{
            if (isDragging && pickerRef.current) {
                e.preventDefault();
                const x = e.clientX - dragOffset.x;
                const y = e.clientY - dragOffset.y;
                // 화면 밖으로 나가지 않도록 제한
                const rect = pickerRef.current.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;
                const posX = Math.max(0, Math.min(x, maxX));
                const posY = Math.max(0, Math.min(y, maxY));
                setPickerPosition({
                    left: posX + "px",
                    top: posY + "px",
                    transform: "none"
                });
            }
        };
        const handleMouseUp = ()=>{
            setIsDragging(false);
        };
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
        return ()=>{
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [
        isDragging,
        dragOffset
    ]);
    // 외부 클릭 시 피커 닫기
    (0,external_react_.useEffect)(()=>{
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target) && triggerRef.current && !triggerRef.current.contains(event.target)) {
                // 피커 요소나 트리거 외부를 클릭했을 때만 닫기
                setShowPicker(false);
                if (onClose) {
                    onClose();
                }
            }
        }
        if (showPicker) {
            // 즉시 이벤트 리스너 추가
            document.addEventListener("mouseup", handleClickOutside);
            document.addEventListener("click", handleClickOutside);
            return ()=>{
                document.removeEventListener("mouseup", handleClickOutside);
                document.removeEventListener("click", handleClickOutside);
            };
        }
        return ()=>{};
    }, [
        showPicker,
        onClose
    ]);
    (0,external_react_.useEffect)(()=>{
        // 값 유효성 검사 추가
        const safeValue = value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000";
        setHex(safeValue);
        setRgb(hexToRgb(safeValue));
    }, [
        value
    ]);
    // 열릴 때 초기 위치 설정
    (0,external_react_.useEffect)(()=>{
        if (showPicker && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // 화면 경계 내에 위치하도록 조정
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const pickerWidth = 280; // ColorPicker의 대략적인 너비
            const pickerHeight = 480; // ColorPicker의 대략적인 높이
            let leftPos = rect.left + rect.width / 2;
            let topPos = rect.bottom + 10;
            // 오른쪽 경계 확인
            if (leftPos + pickerWidth / 2 > screenWidth) {
                leftPos = screenWidth - pickerWidth - 10;
            }
            // 왼쪽 경계 확인
            if (leftPos - pickerWidth / 2 < 0) {
                leftPos = pickerWidth / 2 + 10;
            }
            // 하단 경계 확인
            if (topPos + pickerHeight > screenHeight) {
                topPos = rect.top - pickerHeight - 10; // 위쪽에 표시
            }
            setPickerPosition({
                left: leftPos + "px",
                top: topPos + "px",
                transform: "translateX(-50%)"
            });
        }
    }, [
        showPicker
    ]);
    // 색상 변경 핸들러 업데이트
    const handleColorChange = (newHex)=>{
        if (!newHex || newHex === hex) return; // 동일한 색상이면 아무 작업도 하지 않음
        setHex(newHex);
        setRgb(hexToRgb(newHex));
        try {
            onChange(newHex);
        } catch (error) {
            ;
        }
    };
    // HEX 입력 핸들러
    const handleHex = (e)=>{
        let val = e.target.value;
        if (!val.startsWith("#")) val = "#" + val;
        setHex(val);
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            setRgb(hexToRgb(val));
            handleColorChange(val);
        }
    };
    // RGB 입력 핸들러
    const handleRgb = (idx, v)=>{
        const n = Math.max(0, Math.min(255, Number(v.replace(/\D/g, ""))));
        const next = [
            ...rgb
        ];
        next[idx] = n;
        setRgb(next);
        const newHex = rgbToHex(next[0], next[1], next[2]);
        setHex(newHex);
        handleColorChange(newHex);
    };
    // 스포이드
    const handleEyedropper = async ()=>{
        // @ts-expect-error: EyeDropper는 최신 브라우저에서만 지원되는 비표준 API입니다.
        if (window.EyeDropper) {
            // @ts-expect-error: EyeDropper는 최신 브라우저에서만 지원되는 비표준 API입니다.
            const eye = new window.EyeDropper();
            try {
                const result = await eye.open();
                setHex(result.sRGBHex);
                setRgb(hexToRgb(result.sRGBHex));
                handleColorChange(result.sRGBHex);
            } catch  {}
        }
    };
    // 팔레트에 색상 추가
    const handleAddToPalette = ()=>{
        if (PALETTE_COLORS.includes(hex.toUpperCase())) return;
        setRgb(hexToRgb(hex));
        handleColorChange(hex);
    };
    // 렌더링 부분 수정
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        id: id,
        className: classNames("relative inline-block", className),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                ref: triggerRef,
                className: classNames("flex items-center gap-2 cursor-pointer py-1 px-2 border hover:bg-gray-50 rounded text-sm transition-all", {
                    "border-blue-500": showPicker
                }),
                onClick: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPicker((prev)=>!prev);
                },
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                        className: "w-5 h-5 rounded-full shadow-sm",
                        style: {
                            backgroundColor: hex || "#000000",
                            borderColor: hex ? "transparent" : "#ccc"
                        }
                    }),
                    label && /*#__PURE__*/ jsx_runtime.jsx("span", {
                        className: "whitespace-nowrap truncate max-w-[120px] xs:max-w-none text-xs xs:text-sm",
                        children: label
                    })
                ]
            }),
            showPicker && /*#__PURE__*/ (0,external_react_dom_namespaceObject.createPortal)(/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                ref: pickerRef,
                className: classNames("fixed z-[9999] shadow-xl rounded-lg border border-gray-200 p-2 sm:p-3 bg-white w-[260px] sm:w-[280px]", {
                    "translate-x-0 translate-y-0": true
                }),
                style: {
                    left: pickerPosition.left,
                    top: pickerPosition.top,
                    transform: pickerPosition.transform,
                    position: "fixed",
                    pointerEvents: "auto"
                },
                onMouseDown: (e)=>{
                    // 클릭 이벤트가 상위로 전파되지 않도록 막음
                    e.stopPropagation();
                    e.preventDefault();
                },
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                        className: "absolute top-1 right-1 p-1 hover:bg-gray-100 rounded-full cursor-pointer",
                        onClick: (e)=>{
                            e.stopPropagation();
                            setShowPicker(false);
                            if (onClose) {
                                onClose();
                            }
                        },
                        children: /*#__PURE__*/ jsx_runtime.jsx("svg", {
                            width: "14",
                            height: "14",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: /*#__PURE__*/ jsx_runtime.jsx("path", {
                                d: "M18 6L6 18M6 6l12 12"
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                        className: "picker-header absolute top-0 left-0 right-0 h-8 cursor-move flex items-center justify-center text-gray-400 text-xs",
                        onMouseDown: handleDragStart,
                        onTouchStart: handleTouchDragStart,
                        children: /*#__PURE__*/ jsx_runtime.jsx("div", {
                            className: "w-8 h-1 bg-gray-200 rounded-full mt-1"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-3 space-y-2",
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex gap-2 mb-3 items-center justify-between",
                                children: [
                                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                                        className: "w-8 h-8 rounded-full shadow-sm",
                                        style: {
                                            backgroundColor: hex || "#000000"
                                        }
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex flex-1 gap-1 text-xs",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime.jsx("input", {
                                                type: "text",
                                                className: "w-full rounded border px-1 py-1 text-center font-mono focus:border-blue-500 focus:outline-none uppercase",
                                                value: hex,
                                                onChange: handleHex,
                                                maxLength: 7
                                            }),
                                            /*#__PURE__*/ jsx_runtime.jsx("button", {
                                                onClick: handleEyedropper,
                                                className: "border text-gray-700 hover:bg-gray-100 p-1 rounded",
                                                title: "색상 추출 도구",
                                                children: /*#__PURE__*/ jsx_runtime.jsx("svg", {
                                                    width: "16",
                                                    height: "16",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ jsx_runtime.jsx("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 1.5,
                                                        d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                                    })
                                                })
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx("div", {
                                className: "flex gap-1.5 mb-2",
                                children: [
                                    "R",
                                    "G",
                                    "B"
                                ].map((label, idx)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime.jsx("div", {
                                                className: "text-xs text-gray-500 mb-0.5",
                                                children: label
                                            }),
                                            /*#__PURE__*/ jsx_runtime.jsx("input", {
                                                className: "w-full border rounded p-1 text-center text-xs",
                                                type: "number",
                                                min: "0",
                                                max: "255",
                                                value: rgb[idx],
                                                onChange: (e)=>handleRgb(idx, e.target.value)
                                            })
                                        ]
                                    }, label))
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx("div", {
                                className: classNames("flex flex-col gap-1"),
                                children: /*#__PURE__*/ jsx_runtime.jsx(Spectrum, {
                                    value: hex,
                                    onChange: (selectedHex)=>handleColorChange(selectedHex)
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "text-xs text-gray-500 mb-1 flex justify-between",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime.jsx("span", {
                                                children: "색상 팔레트"
                                            }),
                                            /*#__PURE__*/ jsx_runtime.jsx("button", {
                                                onClick: handleAddToPalette,
                                                className: "text-blue-500 text-xs hover:underline",
                                                children: "저장"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                                        className: "grid grid-cols-9 gap-1",
                                        children: PALETTE_COLORS.slice(0, 36).map((color)=>/*#__PURE__*/ jsx_runtime.jsx("div", {
                                                className: "aspect-square rounded-sm cursor-pointer border hover:scale-110 transition-all",
                                                style: {
                                                    backgroundColor: color
                                                },
                                                onClick: ()=>handleColorChange(color)
                                            }, color))
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }), document.body)
        ]
    });
};

;// CONCATENATED MODULE: ./src/components/core/ComponentThemeEditor.tsx
/* __next_internal_client_entry_do_not_use__ ComponentThemeEditor auto */ 



const ComponentThemeEditor = ({ componentId, onClose })=>{
    const { getComponentTheme, setComponentTheme } = useComponentThemeStore();
    // 현재 컴포넌트의 테마 설정 가져오기
    const theme = getComponentTheme(componentId) || {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        borderColor: "#e5e7eb",
        borderWidth: "1px",
        borderRadius: "0.375rem",
        padding: "1rem",
        margin: "0",
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit"
    };
    const [formValues, setFormValues] = (0,external_react_.useState)(theme);
    // 테마 변경 핸들러
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormValues((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    // 색상 선택기에서 색상 변경 처리
    const handleColorChange = (name, value)=>{
        setFormValues((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    // 폼 제출 핸들러
    const handleSubmit = (e)=>{
        e.preventDefault();
        setComponentTheme(componentId, formValues);
        onClose();
    };
    // 모달 외부 클릭 처리
    const handleOutsideClick = (e)=>{
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return /*#__PURE__*/ jsx_runtime.jsx("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        onClick: handleOutsideClick,
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex justify-between items-center mb-4",
                    children: [
                        /*#__PURE__*/ jsx_runtime.jsx("h2", {
                            className: "text-xl font-bold",
                            children: "컴포넌트 테마 설정"
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx("button", {
                            onClick: onClose,
                            className: "text-gray-500 hover:text-gray-700",
                            children: "✕"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "배경 색상"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(ColorPicker, {
                                            value: formValues.backgroundColor || "",
                                            onChange: (color)=>handleColorChange("backgroundColor", color)
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "텍스트 색상"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(ColorPicker, {
                                            value: formValues.textColor || "",
                                            onChange: (color)=>handleColorChange("textColor", color)
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "테두리 색상"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(ColorPicker, {
                                            value: formValues.borderColor || "",
                                            onChange: (color)=>handleColorChange("borderColor", color)
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "테두리 두께"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            name: "borderWidth",
                                            value: formValues.borderWidth,
                                            onChange: handleChange,
                                            className: "w-full p-2 border rounded",
                                            placeholder: "예: 1px, 0.25rem"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "모서리 반경"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            name: "borderRadius",
                                            value: formValues.borderRadius,
                                            onChange: handleChange,
                                            className: "w-full p-2 border rounded",
                                            placeholder: "예: 0.375rem, 6px"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "패딩"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            name: "padding",
                                            value: formValues.padding,
                                            onChange: handleChange,
                                            className: "w-full p-2 border rounded",
                                            placeholder: "예: 1rem, 16px"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "마진"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            name: "margin",
                                            value: formValues.margin,
                                            onChange: handleChange,
                                            className: "w-full p-2 border rounded",
                                            placeholder: "예: 1rem, 16px"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "폰트 패밀리"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("select", {
                                            name: "fontFamily",
                                            value: formValues.fontFamily,
                                            onChange: handleChange,
                                            className: "w-full p-2 border rounded",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "inherit",
                                                    children: "상속 (기본값)"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "'Nanum Square Neo', sans-serif",
                                                    children: "나눔스퀘어 네오"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "'CookieRun', sans-serif",
                                                    children: "쿠키런"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "'Pretendard', sans-serif",
                                                    children: "프리텐다드"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "'SUIT', sans-serif",
                                                    children: "SUIT"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "system-ui, sans-serif",
                                                    children: "시스템 기본"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "폰트 사이즈"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            name: "fontSize",
                                            value: formValues.fontSize,
                                            onChange: handleChange,
                                            className: "w-full p-2 border rounded",
                                            placeholder: "예: 1rem, 16px, inherit"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "폰트 두께"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("select", {
                                            name: "fontWeight",
                                            value: formValues.fontWeight,
                                            onChange: handleChange,
                                            className: "w-full p-2 border rounded",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "inherit",
                                                    children: "상속 (기본값)"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "normal",
                                                    children: "보통"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "bold",
                                                    children: "굵게"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "300",
                                                    children: "얇게 (300)"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "400",
                                                    children: "일반 (400)"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "500",
                                                    children: "중간 (500)"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "600",
                                                    children: "약간 굵게 (600)"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "700",
                                                    children: "굵게 (700)"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx("option", {
                                                    value: "800",
                                                    children: "매우 굵게 (800)"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex space-x-2 justify-end pt-4 border-t",
                            children: [
                                /*#__PURE__*/ jsx_runtime.jsx("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border rounded hover:bg-gray-100",
                                    children: "취소"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("button", {
                                    type: "submit",
                                    className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                                    children: "적용"
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};

;// CONCATENATED MODULE: ./src/pages/theme-component-test.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 





// 테마 적용 가능한 샘플 컴포넌트들
const SampleCard = ({ title, description })=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "p-4 border rounded",
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("h3", {
                className: "text-lg font-bold mb-2",
                children: title
            }),
            /*#__PURE__*/ jsx_runtime.jsx("p", {
                children: description
            })
        ]
    });
// 컴포넌트에 테마 적용 가능하도록 래핑
const ThemedCard = withTheming(SampleCard, "sample-card-component");
const ComponentThemeTest = ()=>{
    const [editingComponent, setEditingComponent] = (0,external_react_.useState)(null);
    const openThemeEditor = (componentId)=>{
        setEditingComponent(componentId);
    };
    const closeThemeEditor = ()=>{
        setEditingComponent(null);
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "container mx-auto p-6",
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("h1", {
                className: "text-3xl font-bold mb-6",
                children: "컴포넌트 테마 설정 테스트"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: "text-xl font-bold mb-4",
                                children: "기본 컴포넌트 테마"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "relative group mb-4",
                                children: [
                                    /*#__PURE__*/ jsx_runtime.jsx("button", {
                                        onClick: ()=>openThemeEditor("custom-component-1"),
                                        className: "absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10",
                                        children: "테마 설정"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(ThemeableComponent, {
                                        componentId: "custom-component-1",
                                        className: "p-4 border rounded",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime.jsx("h3", {
                                                className: "text-lg font-bold mb-2",
                                                children: "테마 설정 가능한 컴포넌트"
                                            }),
                                            /*#__PURE__*/ jsx_runtime.jsx("p", {
                                                children: "이 컴포넌트의 스타일을 사용자 지정할 수 있습니다."
                                            }),
                                            /*#__PURE__*/ jsx_runtime.jsx("button", {
                                                className: "mt-3 bg-blue-500 text-white px-3 py-1 rounded",
                                                children: "버튼 예제"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: "text-xl font-bold mb-4",
                                children: "HOC로 래핑된 컴포넌트"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ jsx_runtime.jsx("button", {
                                        onClick: ()=>openThemeEditor("sample-card-component"),
                                        className: "absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10",
                                        children: "테마 설정"
                                    }),
                                    /*#__PURE__*/ jsx_runtime.jsx(ThemedCard, {
                                        title: "HOC로 래핑된 컴포넌트",
                                        description: "컴포넌트를 withTheming HOC로 감싸서 테마 설정이 가능합니다."
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "bg-gray-100 p-4 rounded-lg mb-8",
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx("h2", {
                        className: "text-xl font-bold mb-2",
                        children: "사용 방법"
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("pre", {
                        className: "bg-gray-800 text-white p-4 rounded overflow-x-auto",
                        children: `// 직접 ThemeableComponent 사용
<ThemeableComponent componentId="my-custom-component">
  <div>내 컨텐츠</div>
</ThemeableComponent>

// 또는 HOC 사용
const MyComponent = ({ title }) => <div>{title}</div>;
const ThemedComponent = withTheming(MyComponent, 'my-component-id');

// 사용
<ThemedComponent title="제목" />
`
                    })
                ]
            }),
            editingComponent && /*#__PURE__*/ jsx_runtime.jsx(ComponentThemeEditor, {
                componentId: editingComponent,
                onClose: closeThemeEditor
            })
        ]
    });
};
/* harmony default export */ const theme_component_test = (ComponentThemeTest);

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2Ftheme-component-test&preferredRegion=&absolutePagePath=private-next-pages%2Ftheme-component-test.tsx&absoluteAppPath=next%2Fdist%2Fpages%2F_app&absoluteDocumentPath=next%2Fdist%2Fpages%2F_document&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



// Import the app and document modules.
// @ts-expect-error - replaced by webpack/turbopack loader

// @ts-expect-error - replaced by webpack/turbopack loader

// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

const PagesRouteModule = pages_module.PagesRouteModule;
// Re-export the component (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_page_2Ftheme_component_test_preferredRegion_absolutePagePath_private_next_pages_2Ftheme_component_test_tsx_absoluteAppPath_next_2Fdist_2Fpages_2F_app_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "default"));
// Re-export methods.
const getStaticProps = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "getStaticProps");
const getStaticPaths = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "getStaticPaths");
const getServerSideProps = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "getServerSideProps");
const config = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "config");
const reportWebVitals = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "reportWebVitals");
// Re-export legacy methods.
const unstable_getStaticProps = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "unstable_getStaticProps");
const unstable_getStaticPaths = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "unstable_getStaticPaths");
const unstable_getStaticParams = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "unstable_getStaticParams");
const unstable_getServerProps = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "unstable_getServerProps");
const unstable_getServerSideProps = (0,helpers/* hoist */.l)(theme_component_test_namespaceObject, "unstable_getServerSideProps");
// Create and export the route module that will be consumed.
const routeModule = new PagesRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES,
        page: "/theme-component-test",
        pathname: "/theme-component-test",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    components: {
        App: (_app_default()),
        Document: (_document_default())
    },
    userland: theme_component_test_namespaceObject
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
var __webpack_exports__ = __webpack_require__.X(0, [9259,2624,5855,5893], () => (__webpack_exec__(76108)));
module.exports = __webpack_exports__;

})();