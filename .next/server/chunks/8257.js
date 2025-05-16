"use strict";
exports.id = 8257;
exports.ids = [8257];
exports.modules = {

/***/ 1385:
/***/ ((module) => {


module.exports = {
    trueFunc: function trueFunc() {
        return true;
    },
    falseFunc: function falseFunc() {
        return false;
    }
};


/***/ }),

/***/ 85065:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.stringify = exports.parse = exports.isTraversal = void 0;
__exportStar(__webpack_require__(20248), exports);
var parse_1 = __webpack_require__(36626);
Object.defineProperty(exports, "isTraversal", ({
    enumerable: true,
    get: function() {
        return parse_1.isTraversal;
    }
}));
Object.defineProperty(exports, "parse", ({
    enumerable: true,
    get: function() {
        return parse_1.parse;
    }
}));
var stringify_1 = __webpack_require__(86317);
Object.defineProperty(exports, "stringify", ({
    enumerable: true,
    get: function() {
        return stringify_1.stringify;
    }
}));


/***/ }),

/***/ 36626:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.parse = exports.isTraversal = void 0;
var types_1 = __webpack_require__(20248);
var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var actionTypes = new Map([
    [
        126 /* Tilde */ ,
        types_1.AttributeAction.Element
    ],
    [
        94 /* Circumflex */ ,
        types_1.AttributeAction.Start
    ],
    [
        36 /* Dollar */ ,
        types_1.AttributeAction.End
    ],
    [
        42 /* Asterisk */ ,
        types_1.AttributeAction.Any
    ],
    [
        33 /* ExclamationMark */ ,
        types_1.AttributeAction.Not
    ],
    [
        124 /* Pipe */ ,
        types_1.AttributeAction.Hyphen
    ]
]);
// Pseudos, whose data property is parsed as well.
var unpackPseudos = new Set([
    "has",
    "not",
    "matches",
    "is",
    "where",
    "host",
    "host-context"
]);
/**
 * Checks whether a specific selector is a traversal.
 * This is useful eg. in swapping the order of elements that
 * are not traversals.
 *
 * @param selector Selector to check.
 */ function isTraversal(selector) {
    switch(selector.type){
        case types_1.SelectorType.Adjacent:
        case types_1.SelectorType.Child:
        case types_1.SelectorType.Descendant:
        case types_1.SelectorType.Parent:
        case types_1.SelectorType.Sibling:
        case types_1.SelectorType.ColumnCombinator:
            return true;
        default:
            return false;
    }
}
exports.isTraversal = isTraversal;
var stripQuotesFromPseudos = new Set([
    "contains",
    "icontains"
]);
// Unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152
function funescape(_, escaped, escapedWhitespace) {
    var high = parseInt(escaped, 16) - 0x10000;
    // NaN means non-codepoint
    return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xd800, high & 0x3ff | 0xdc00);
}
function unescapeCSS(str) {
    return str.replace(reEscape, funescape);
}
function isQuote(c) {
    return c === 39 /* SingleQuote */  || c === 34 /* DoubleQuote */ ;
}
function isWhitespace(c) {
    return c === 32 /* Space */  || c === 9 /* Tab */  || c === 10 /* NewLine */  || c === 12 /* FormFeed */  || c === 13 /* CarriageReturn */ ;
}
/**
 * Parses `selector`, optionally with the passed `options`.
 *
 * @param selector Selector to parse.
 * @param options Options for parsing.
 * @returns Returns a two-dimensional array.
 * The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
 * the second contains the relevant tokens for that selector.
 */ function parse(selector) {
    var subselects = [];
    var endIndex = parseSelector(subselects, "".concat(selector), 0);
    if (endIndex < selector.length) {
        throw new Error("Unmatched selector: ".concat(selector.slice(endIndex)));
    }
    return subselects;
}
exports.parse = parse;
function parseSelector(subselects, selector, selectorIndex) {
    var tokens = [];
    function getName(offset) {
        var match = selector.slice(selectorIndex + offset).match(reName);
        if (!match) {
            throw new Error("Expected name, found ".concat(selector.slice(selectorIndex)));
        }
        var name = match[0];
        selectorIndex += offset + name.length;
        return unescapeCSS(name);
    }
    function stripWhitespace(offset) {
        selectorIndex += offset;
        while(selectorIndex < selector.length && isWhitespace(selector.charCodeAt(selectorIndex))){
            selectorIndex++;
        }
    }
    function readValueWithParenthesis() {
        selectorIndex += 1;
        var start = selectorIndex;
        var counter = 1;
        for(; counter > 0 && selectorIndex < selector.length; selectorIndex++){
            if (selector.charCodeAt(selectorIndex) === 40 /* LeftParenthesis */  && !isEscaped(selectorIndex)) {
                counter++;
            } else if (selector.charCodeAt(selectorIndex) === 41 /* RightParenthesis */  && !isEscaped(selectorIndex)) {
                counter--;
            }
        }
        if (counter) {
            throw new Error("Parenthesis not matched");
        }
        return unescapeCSS(selector.slice(start, selectorIndex - 1));
    }
    function isEscaped(pos) {
        var slashCount = 0;
        while(selector.charCodeAt(--pos) === 92 /* BackSlash */ )slashCount++;
        return (slashCount & 1) === 1;
    }
    function ensureNotTraversal() {
        if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
            throw new Error("Did not expect successive traversals.");
        }
    }
    function addTraversal(type) {
        if (tokens.length > 0 && tokens[tokens.length - 1].type === types_1.SelectorType.Descendant) {
            tokens[tokens.length - 1].type = type;
            return;
        }
        ensureNotTraversal();
        tokens.push({
            type: type
        });
    }
    function addSpecialAttribute(name, action) {
        tokens.push({
            type: types_1.SelectorType.Attribute,
            name: name,
            action: action,
            value: getName(1),
            namespace: null,
            ignoreCase: "quirks"
        });
    }
    /**
     * We have finished parsing the current part of the selector.
     *
     * Remove descendant tokens at the end if they exist,
     * and return the last index, so that parsing can be
     * picked up from here.
     */ function finalizeSubselector() {
        if (tokens.length && tokens[tokens.length - 1].type === types_1.SelectorType.Descendant) {
            tokens.pop();
        }
        if (tokens.length === 0) {
            throw new Error("Empty sub-selector");
        }
        subselects.push(tokens);
    }
    stripWhitespace(0);
    if (selector.length === selectorIndex) {
        return selectorIndex;
    }
    loop: while(selectorIndex < selector.length){
        var firstChar = selector.charCodeAt(selectorIndex);
        switch(firstChar){
            // Whitespace
            case 32 /* Space */ :
            case 9 /* Tab */ :
            case 10 /* NewLine */ :
            case 12 /* FormFeed */ :
            case 13 /* CarriageReturn */ :
                {
                    if (tokens.length === 0 || tokens[0].type !== types_1.SelectorType.Descendant) {
                        ensureNotTraversal();
                        tokens.push({
                            type: types_1.SelectorType.Descendant
                        });
                    }
                    stripWhitespace(1);
                    break;
                }
            // Traversals
            case 62 /* GreaterThan */ :
                {
                    addTraversal(types_1.SelectorType.Child);
                    stripWhitespace(1);
                    break;
                }
            case 60 /* LessThan */ :
                {
                    addTraversal(types_1.SelectorType.Parent);
                    stripWhitespace(1);
                    break;
                }
            case 126 /* Tilde */ :
                {
                    addTraversal(types_1.SelectorType.Sibling);
                    stripWhitespace(1);
                    break;
                }
            case 43 /* Plus */ :
                {
                    addTraversal(types_1.SelectorType.Adjacent);
                    stripWhitespace(1);
                    break;
                }
            // Special attribute selectors: .class, #id
            case 46 /* Period */ :
                {
                    addSpecialAttribute("class", types_1.AttributeAction.Element);
                    break;
                }
            case 35 /* Hash */ :
                {
                    addSpecialAttribute("id", types_1.AttributeAction.Equals);
                    break;
                }
            case 91 /* LeftSquareBracket */ :
                {
                    stripWhitespace(1);
                    // Determine attribute name and namespace
                    var name_1 = void 0;
                    var namespace = null;
                    if (selector.charCodeAt(selectorIndex) === 124 /* Pipe */ ) {
                        // Equivalent to no namespace
                        name_1 = getName(1);
                    } else if (selector.startsWith("*|", selectorIndex)) {
                        namespace = "*";
                        name_1 = getName(2);
                    } else {
                        name_1 = getName(0);
                        if (selector.charCodeAt(selectorIndex) === 124 /* Pipe */  && selector.charCodeAt(selectorIndex + 1) !== 61 /* Equal */ ) {
                            namespace = name_1;
                            name_1 = getName(1);
                        }
                    }
                    stripWhitespace(0);
                    // Determine comparison operation
                    var action = types_1.AttributeAction.Exists;
                    var possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));
                    if (possibleAction) {
                        action = possibleAction;
                        if (selector.charCodeAt(selectorIndex + 1) !== 61 /* Equal */ ) {
                            throw new Error("Expected `=`");
                        }
                        stripWhitespace(2);
                    } else if (selector.charCodeAt(selectorIndex) === 61 /* Equal */ ) {
                        action = types_1.AttributeAction.Equals;
                        stripWhitespace(1);
                    }
                    // Determine value
                    var value = "";
                    var ignoreCase = null;
                    if (action !== "exists") {
                        if (isQuote(selector.charCodeAt(selectorIndex))) {
                            var quote = selector.charCodeAt(selectorIndex);
                            var sectionEnd = selectorIndex + 1;
                            while(sectionEnd < selector.length && (selector.charCodeAt(sectionEnd) !== quote || isEscaped(sectionEnd))){
                                sectionEnd += 1;
                            }
                            if (selector.charCodeAt(sectionEnd) !== quote) {
                                throw new Error("Attribute value didn't end");
                            }
                            value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
                            selectorIndex = sectionEnd + 1;
                        } else {
                            var valueStart = selectorIndex;
                            while(selectorIndex < selector.length && (!isWhitespace(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== 93 /* RightSquareBracket */  || isEscaped(selectorIndex))){
                                selectorIndex += 1;
                            }
                            value = unescapeCSS(selector.slice(valueStart, selectorIndex));
                        }
                        stripWhitespace(0);
                        // See if we have a force ignore flag
                        var forceIgnore = selector.charCodeAt(selectorIndex) | 0x20;
                        // If the forceIgnore flag is set (either `i` or `s`), use that value
                        if (forceIgnore === 115 /* LowerS */ ) {
                            ignoreCase = false;
                            stripWhitespace(1);
                        } else if (forceIgnore === 105 /* LowerI */ ) {
                            ignoreCase = true;
                            stripWhitespace(1);
                        }
                    }
                    if (selector.charCodeAt(selectorIndex) !== 93 /* RightSquareBracket */ ) {
                        throw new Error("Attribute selector didn't terminate");
                    }
                    selectorIndex += 1;
                    var attributeSelector = {
                        type: types_1.SelectorType.Attribute,
                        name: name_1,
                        action: action,
                        value: value,
                        namespace: namespace,
                        ignoreCase: ignoreCase
                    };
                    tokens.push(attributeSelector);
                    break;
                }
            case 58 /* Colon */ :
                {
                    if (selector.charCodeAt(selectorIndex + 1) === 58 /* Colon */ ) {
                        tokens.push({
                            type: types_1.SelectorType.PseudoElement,
                            name: getName(2).toLowerCase(),
                            data: selector.charCodeAt(selectorIndex) === 40 /* LeftParenthesis */  ? readValueWithParenthesis() : null
                        });
                        continue;
                    }
                    var name_2 = getName(1).toLowerCase();
                    var data = null;
                    if (selector.charCodeAt(selectorIndex) === 40 /* LeftParenthesis */ ) {
                        if (unpackPseudos.has(name_2)) {
                            if (isQuote(selector.charCodeAt(selectorIndex + 1))) {
                                throw new Error("Pseudo-selector ".concat(name_2, " cannot be quoted"));
                            }
                            data = [];
                            selectorIndex = parseSelector(data, selector, selectorIndex + 1);
                            if (selector.charCodeAt(selectorIndex) !== 41 /* RightParenthesis */ ) {
                                throw new Error("Missing closing parenthesis in :".concat(name_2, " (").concat(selector, ")"));
                            }
                            selectorIndex += 1;
                        } else {
                            data = readValueWithParenthesis();
                            if (stripQuotesFromPseudos.has(name_2)) {
                                var quot = data.charCodeAt(0);
                                if (quot === data.charCodeAt(data.length - 1) && isQuote(quot)) {
                                    data = data.slice(1, -1);
                                }
                            }
                            data = unescapeCSS(data);
                        }
                    }
                    tokens.push({
                        type: types_1.SelectorType.Pseudo,
                        name: name_2,
                        data: data
                    });
                    break;
                }
            case 44 /* Comma */ :
                {
                    finalizeSubselector();
                    tokens = [];
                    stripWhitespace(1);
                    break;
                }
            default:
                {
                    if (selector.startsWith("/*", selectorIndex)) {
                        var endIndex = selector.indexOf("*/", selectorIndex + 2);
                        if (endIndex < 0) {
                            throw new Error("Comment was not terminated");
                        }
                        selectorIndex = endIndex + 2;
                        // Remove leading whitespace
                        if (tokens.length === 0) {
                            stripWhitespace(0);
                        }
                        break;
                    }
                    var namespace = null;
                    var name_3 = void 0;
                    if (firstChar === 42 /* Asterisk */ ) {
                        selectorIndex += 1;
                        name_3 = "*";
                    } else if (firstChar === 124 /* Pipe */ ) {
                        name_3 = "";
                        if (selector.charCodeAt(selectorIndex + 1) === 124 /* Pipe */ ) {
                            addTraversal(types_1.SelectorType.ColumnCombinator);
                            stripWhitespace(2);
                            break;
                        }
                    } else if (reName.test(selector.slice(selectorIndex))) {
                        name_3 = getName(0);
                    } else {
                        break loop;
                    }
                    if (selector.charCodeAt(selectorIndex) === 124 /* Pipe */  && selector.charCodeAt(selectorIndex + 1) !== 124 /* Pipe */ ) {
                        namespace = name_3;
                        if (selector.charCodeAt(selectorIndex + 1) === 42 /* Asterisk */ ) {
                            name_3 = "*";
                            selectorIndex += 2;
                        } else {
                            name_3 = getName(1);
                        }
                    }
                    tokens.push(name_3 === "*" ? {
                        type: types_1.SelectorType.Universal,
                        namespace: namespace
                    } : {
                        type: types_1.SelectorType.Tag,
                        name: name_3,
                        namespace: namespace
                    });
                }
        }
    }
    finalizeSubselector();
    return selectorIndex;
}


/***/ }),

/***/ 86317:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __spreadArray = (void 0) && (void 0).__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.stringify = void 0;
var types_1 = __webpack_require__(20248);
var attribValChars = [
    "\\",
    '"'
];
var pseudoValChars = __spreadArray(__spreadArray([], attribValChars, true), [
    "(",
    ")"
], false);
var charsToEscapeInAttributeValue = new Set(attribValChars.map(function(c) {
    return c.charCodeAt(0);
}));
var charsToEscapeInPseudoValue = new Set(pseudoValChars.map(function(c) {
    return c.charCodeAt(0);
}));
var charsToEscapeInName = new Set(__spreadArray(__spreadArray([], pseudoValChars, true), [
    "~",
    "^",
    "$",
    "*",
    "+",
    "!",
    "|",
    ":",
    "[",
    "]",
    " ",
    "."
], false).map(function(c) {
    return c.charCodeAt(0);
}));
/**
 * Turns `selector` back into a string.
 *
 * @param selector Selector to stringify.
 */ function stringify(selector) {
    return selector.map(function(token) {
        return token.map(stringifyToken).join("");
    }).join(", ");
}
exports.stringify = stringify;
function stringifyToken(token, index, arr) {
    switch(token.type){
        // Simple types
        case types_1.SelectorType.Child:
            return index === 0 ? "> " : " > ";
        case types_1.SelectorType.Parent:
            return index === 0 ? "< " : " < ";
        case types_1.SelectorType.Sibling:
            return index === 0 ? "~ " : " ~ ";
        case types_1.SelectorType.Adjacent:
            return index === 0 ? "+ " : " + ";
        case types_1.SelectorType.Descendant:
            return " ";
        case types_1.SelectorType.ColumnCombinator:
            return index === 0 ? "|| " : " || ";
        case types_1.SelectorType.Universal:
            // Return an empty string if the selector isn't needed.
            return token.namespace === "*" && index + 1 < arr.length && "name" in arr[index + 1] ? "" : "".concat(getNamespace(token.namespace), "*");
        case types_1.SelectorType.Tag:
            return getNamespacedName(token);
        case types_1.SelectorType.PseudoElement:
            return "::".concat(escapeName(token.name, charsToEscapeInName)).concat(token.data === null ? "" : "(".concat(escapeName(token.data, charsToEscapeInPseudoValue), ")"));
        case types_1.SelectorType.Pseudo:
            return ":".concat(escapeName(token.name, charsToEscapeInName)).concat(token.data === null ? "" : "(".concat(typeof token.data === "string" ? escapeName(token.data, charsToEscapeInPseudoValue) : stringify(token.data), ")"));
        case types_1.SelectorType.Attribute:
            {
                if (token.name === "id" && token.action === types_1.AttributeAction.Equals && token.ignoreCase === "quirks" && !token.namespace) {
                    return "#".concat(escapeName(token.value, charsToEscapeInName));
                }
                if (token.name === "class" && token.action === types_1.AttributeAction.Element && token.ignoreCase === "quirks" && !token.namespace) {
                    return ".".concat(escapeName(token.value, charsToEscapeInName));
                }
                var name_1 = getNamespacedName(token);
                if (token.action === types_1.AttributeAction.Exists) {
                    return "[".concat(name_1, "]");
                }
                return "[".concat(name_1).concat(getActionValue(token.action), '="').concat(escapeName(token.value, charsToEscapeInAttributeValue), '"').concat(token.ignoreCase === null ? "" : token.ignoreCase ? " i" : " s", "]");
            }
    }
}
function getActionValue(action) {
    switch(action){
        case types_1.AttributeAction.Equals:
            return "";
        case types_1.AttributeAction.Element:
            return "~";
        case types_1.AttributeAction.Start:
            return "^";
        case types_1.AttributeAction.End:
            return "$";
        case types_1.AttributeAction.Any:
            return "*";
        case types_1.AttributeAction.Not:
            return "!";
        case types_1.AttributeAction.Hyphen:
            return "|";
        case types_1.AttributeAction.Exists:
            throw new Error("Shouldn't be here");
    }
}
function getNamespacedName(token) {
    return "".concat(getNamespace(token.namespace)).concat(escapeName(token.name, charsToEscapeInName));
}
function getNamespace(namespace) {
    return namespace !== null ? "".concat(namespace === "*" ? "*" : escapeName(namespace, charsToEscapeInName), "|") : "";
}
function escapeName(str, charsToEscape) {
    var lastIdx = 0;
    var ret = "";
    for(var i = 0; i < str.length; i++){
        if (charsToEscape.has(str.charCodeAt(i))) {
            ret += "".concat(str.slice(lastIdx, i), "\\").concat(str.charAt(i));
            lastIdx = i + 1;
        }
    }
    return ret.length > 0 ? ret + str.slice(lastIdx) : str;
}


/***/ }),

/***/ 20248:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AttributeAction = exports.IgnoreCaseMode = exports.SelectorType = void 0;
var SelectorType;
(function(SelectorType) {
    SelectorType["Attribute"] = "attribute";
    SelectorType["Pseudo"] = "pseudo";
    SelectorType["PseudoElement"] = "pseudo-element";
    SelectorType["Tag"] = "tag";
    SelectorType["Universal"] = "universal";
    // Traversals
    SelectorType["Adjacent"] = "adjacent";
    SelectorType["Child"] = "child";
    SelectorType["Descendant"] = "descendant";
    SelectorType["Parent"] = "parent";
    SelectorType["Sibling"] = "sibling";
    SelectorType["ColumnCombinator"] = "column-combinator";
})(SelectorType = exports.SelectorType || (exports.SelectorType = {}));
/**
 * Modes for ignore case.
 *
 * This could be updated to an enum, and the object is
 * the current stand-in that will allow code to be updated
 * without big changes.
 */ exports.IgnoreCaseMode = {
    Unknown: null,
    QuirksMode: "quirks",
    IgnoreCase: true,
    CaseSensitive: false
};
var AttributeAction;
(function(AttributeAction) {
    AttributeAction["Any"] = "any";
    AttributeAction["Element"] = "element";
    AttributeAction["End"] = "end";
    AttributeAction["Equals"] = "equals";
    AttributeAction["Exists"] = "exists";
    AttributeAction["Hyphen"] = "hyphen";
    AttributeAction["Not"] = "not";
    AttributeAction["Start"] = "start";
})(AttributeAction = exports.AttributeAction || (exports.AttributeAction = {}));


/***/ }),

/***/ 78257:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  zD: () => (/* binding */ load)
});

// UNUSED EXPORTS: contains, default, html, merge, parseHTML, root, text, xml

// NAMESPACE OBJECT: ./node_modules/domutils/lib/esm/index.js
var domutils_lib_esm_namespaceObject = {};
__webpack_require__.r(domutils_lib_esm_namespaceObject);
__webpack_require__.d(domutils_lib_esm_namespaceObject, {
  DocumentPosition: () => (DocumentPosition),
  append: () => (append),
  appendChild: () => (appendChild),
  compareDocumentPosition: () => (compareDocumentPosition),
  existsOne: () => (existsOne),
  filter: () => (filter),
  find: () => (find),
  findAll: () => (findAll),
  findOne: () => (findOne),
  findOneChild: () => (findOneChild),
  getAttributeValue: () => (getAttributeValue),
  getChildren: () => (getChildren),
  getElementById: () => (getElementById),
  getElements: () => (getElements),
  getElementsByClassName: () => (getElementsByClassName),
  getElementsByTagName: () => (getElementsByTagName),
  getElementsByTagType: () => (getElementsByTagType),
  getFeed: () => (feeds_getFeed),
  getInnerHTML: () => (getInnerHTML),
  getName: () => (getName),
  getOuterHTML: () => (getOuterHTML),
  getParent: () => (getParent),
  getSiblings: () => (getSiblings),
  getText: () => (getText),
  hasAttrib: () => (hasAttrib),
  hasChildren: () => (hasChildren),
  innerText: () => (innerText),
  isCDATA: () => (isCDATA),
  isComment: () => (isComment),
  isDocument: () => (node_isDocument),
  isTag: () => (node_isTag),
  isText: () => (isText),
  nextElementSibling: () => (nextElementSibling),
  prepend: () => (prepend),
  prependChild: () => (prependChild),
  prevElementSibling: () => (prevElementSibling),
  removeElement: () => (removeElement),
  removeSubsets: () => (removeSubsets),
  replaceElement: () => (replaceElement),
  testElement: () => (testElement),
  textContent: () => (textContent),
  uniqueSort: () => (uniqueSort)
});

// NAMESPACE OBJECT: ./node_modules/cheerio/lib/esm/static.js
var static_namespaceObject = {};
__webpack_require__.r(static_namespaceObject);
__webpack_require__.d(static_namespaceObject, {
  contains: () => (contains),
  html: () => (html),
  merge: () => (merge),
  parseHTML: () => (parseHTML),
  root: () => (root),
  text: () => (static_text),
  xml: () => (xml)
});

// NAMESPACE OBJECT: ./node_modules/cheerio/lib/esm/api/attributes.js
var attributes_namespaceObject = {};
__webpack_require__.r(attributes_namespaceObject);
__webpack_require__.d(attributes_namespaceObject, {
  addClass: () => (addClass),
  attr: () => (attr),
  data: () => (data),
  hasClass: () => (hasClass),
  prop: () => (prop),
  removeAttr: () => (removeAttr),
  removeClass: () => (removeClass),
  toggleClass: () => (toggleClass),
  val: () => (val)
});

// NAMESPACE OBJECT: ./node_modules/cheerio/lib/esm/api/traversing.js
var traversing_namespaceObject = {};
__webpack_require__.r(traversing_namespaceObject);
__webpack_require__.d(traversing_namespaceObject, {
  add: () => (add),
  addBack: () => (addBack),
  children: () => (children),
  closest: () => (closest),
  contents: () => (contents),
  each: () => (each),
  end: () => (end),
  eq: () => (eq),
  filter: () => (traversing_filter),
  filterArray: () => (filterArray),
  find: () => (traversing_find),
  first: () => (first),
  get: () => (get),
  has: () => (has),
  index: () => (index),
  is: () => (traversing_is),
  last: () => (last),
  map: () => (map),
  next: () => (next),
  nextAll: () => (nextAll),
  nextUntil: () => (nextUntil),
  not: () => (not),
  parent: () => (traversing_parent),
  parents: () => (parents),
  parentsUntil: () => (parentsUntil),
  prev: () => (prev),
  prevAll: () => (prevAll),
  prevUntil: () => (prevUntil),
  siblings: () => (siblings),
  slice: () => (slice),
  toArray: () => (toArray)
});

// NAMESPACE OBJECT: ./node_modules/cheerio/lib/esm/api/manipulation.js
var api_manipulation_namespaceObject = {};
__webpack_require__.r(api_manipulation_namespaceObject);
__webpack_require__.d(api_manipulation_namespaceObject, {
  _makeDomArray: () => (_makeDomArray),
  after: () => (after),
  append: () => (manipulation_append),
  appendTo: () => (appendTo),
  before: () => (before),
  clone: () => (clone),
  empty: () => (empty),
  html: () => (manipulation_html),
  insertAfter: () => (insertAfter),
  insertBefore: () => (insertBefore),
  prepend: () => (manipulation_prepend),
  prependTo: () => (prependTo),
  remove: () => (remove),
  replaceWith: () => (replaceWith),
  text: () => (manipulation_text),
  toString: () => (manipulation_toString),
  unwrap: () => (unwrap),
  wrap: () => (wrap),
  wrapAll: () => (wrapAll),
  wrapInner: () => (wrapInner)
});

// NAMESPACE OBJECT: ./node_modules/cheerio/lib/esm/api/css.js
var css_namespaceObject = {};
__webpack_require__.r(css_namespaceObject);
__webpack_require__.d(css_namespaceObject, {
  css: () => (css)
});

// NAMESPACE OBJECT: ./node_modules/cheerio/lib/esm/api/forms.js
var forms_namespaceObject = {};
__webpack_require__.r(forms_namespaceObject);
__webpack_require__.d(forms_namespaceObject, {
  serialize: () => (serialize),
  serializeArray: () => (serializeArray)
});

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/options.js
const defaultOpts = {
    xml: false,
    decodeEntities: true
};
/** Cheerio default options. */ /* harmony default export */ const esm_options = (defaultOpts);
const xmlModeDefault = {
    _useHtmlParser2: true,
    xmlMode: true
};
/**
 * Flatten the options for Cheerio.
 *
 * This will set `_useHtmlParser2` to true if `xml` is set to true.
 *
 * @param options - The options to flatten.
 * @returns The flattened options.
 */ function flatten(options) {
    return (options === null || options === void 0 ? void 0 : options.xml) ? typeof options.xml === "boolean" ? xmlModeDefault : {
        ...xmlModeDefault,
        ...options.xml
    } : options !== null && options !== void 0 ? options : undefined;
} //# sourceMappingURL=options.js.map

;// CONCATENATED MODULE: ./node_modules/domelementtype/lib/esm/index.js
/** Types of elements found in htmlparser2's DOM */ var ElementType;
(function(ElementType) {
    /** Type for the root element of a document */ ElementType["Root"] = "root";
    /** Type for Text */ ElementType["Text"] = "text";
    /** Type for <? ... ?> */ ElementType["Directive"] = "directive";
    /** Type for <!-- ... --> */ ElementType["Comment"] = "comment";
    /** Type for <script> tags */ ElementType["Script"] = "script";
    /** Type for <style> tags */ ElementType["Style"] = "style";
    /** Type for Any tag */ ElementType["Tag"] = "tag";
    /** Type for <![CDATA[ ... ]]> */ ElementType["CDATA"] = "cdata";
    /** Type for <!doctype ...> */ ElementType["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
/**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */ function isTag(elem) {
    return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
// Exports for backwards compatibility
/** Type for the root element of a document */ const Root = ElementType.Root;
/** Type for Text */ const Text = ElementType.Text;
/** Type for <? ... ?> */ const Directive = ElementType.Directive;
/** Type for <!-- ... --> */ const Comment = ElementType.Comment;
/** Type for <script> tags */ const Script = ElementType.Script;
/** Type for <style> tags */ const Style = ElementType.Style;
/** Type for Any tag */ const Tag = ElementType.Tag;
/** Type for <![CDATA[ ... ]]> */ const CDATA = ElementType.CDATA;
/** Type for <!doctype ...> */ const Doctype = ElementType.Doctype;

;// CONCATENATED MODULE: ./node_modules/domhandler/lib/esm/node.js

/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */ class Node {
    constructor(){
        /** Parent of the node */ this.parent = null;
        /** Previous sibling */ this.prev = null;
        /** Next sibling */ this.next = null;
        /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */ this.startIndex = null;
        /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */ this.endIndex = null;
    }
    // Read-write aliases for properties
    /**
     * Same as {@link parent}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */ get parentNode() {
        return this.parent;
    }
    set parentNode(parent) {
        this.parent = parent;
    }
    /**
     * Same as {@link prev}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */ get previousSibling() {
        return this.prev;
    }
    set previousSibling(prev) {
        this.prev = prev;
    }
    /**
     * Same as {@link next}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */ get nextSibling() {
        return this.next;
    }
    set nextSibling(next) {
        this.next = next;
    }
    /**
     * Clone this node, and optionally its children.
     *
     * @param recursive Clone child nodes as well.
     * @returns A clone of the node.
     */ cloneNode(recursive = false) {
        return cloneNode(this, recursive);
    }
}
/**
 * A node that contains some data.
 */ class DataNode extends Node {
    /**
     * @param data The content of the data node
     */ constructor(data){
        super();
        this.data = data;
    }
    /**
     * Same as {@link data}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */ get nodeValue() {
        return this.data;
    }
    set nodeValue(data) {
        this.data = data;
    }
}
/**
 * Text within the document.
 */ class node_Text extends DataNode {
    constructor(){
        super(...arguments);
        this.type = ElementType.Text;
    }
    get nodeType() {
        return 3;
    }
}
/**
 * Comments within the document.
 */ class node_Comment extends DataNode {
    constructor(){
        super(...arguments);
        this.type = ElementType.Comment;
    }
    get nodeType() {
        return 8;
    }
}
/**
 * Processing instructions, including doc types.
 */ class ProcessingInstruction extends DataNode {
    constructor(name, data){
        super(data);
        this.name = name;
        this.type = ElementType.Directive;
    }
    get nodeType() {
        return 1;
    }
}
/**
 * A `Node` that can have children.
 */ class NodeWithChildren extends Node {
    /**
     * @param children Children of the node. Only certain node types can have children.
     */ constructor(children){
        super();
        this.children = children;
    }
    // Aliases
    /** First child of the node. */ get firstChild() {
        var _a;
        return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
    }
    /** Last child of the node. */ get lastChild() {
        return this.children.length > 0 ? this.children[this.children.length - 1] : null;
    }
    /**
     * Same as {@link children}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */ get childNodes() {
        return this.children;
    }
    set childNodes(children) {
        this.children = children;
    }
}
class node_CDATA extends NodeWithChildren {
    constructor(){
        super(...arguments);
        this.type = ElementType.CDATA;
    }
    get nodeType() {
        return 4;
    }
}
/**
 * The root node of the document.
 */ class Document extends NodeWithChildren {
    constructor(){
        super(...arguments);
        this.type = ElementType.Root;
    }
    get nodeType() {
        return 9;
    }
}
/**
 * An element within the DOM.
 */ class Element extends NodeWithChildren {
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */ constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag){
        super(children);
        this.name = name;
        this.attribs = attribs;
        this.type = type;
    }
    get nodeType() {
        return 1;
    }
    // DOM Level 1 aliases
    /**
     * Same as {@link name}.
     * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
     */ get tagName() {
        return this.name;
    }
    set tagName(name) {
        this.name = name;
    }
    get attributes() {
        return Object.keys(this.attribs).map((name)=>{
            var _a, _b;
            return {
                name,
                value: this.attribs[name],
                namespace: (_a = this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
            };
        });
    }
}
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */ function node_isTag(node) {
    return isTag(node);
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */ function isCDATA(node) {
    return node.type === ElementType.CDATA;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */ function isText(node) {
    return node.type === ElementType.Text;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */ function isComment(node) {
    return node.type === ElementType.Comment;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */ function isDirective(node) {
    return node.type === ElementType.Directive;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */ function node_isDocument(node) {
    return node.type === ElementType.Root;
}
/**
 * @param node Node to check.
 * @returns `true` if the node has children, `false` otherwise.
 */ function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */ function cloneNode(node, recursive = false) {
    let result;
    if (isText(node)) {
        result = new node_Text(node.data);
    } else if (isComment(node)) {
        result = new node_Comment(node.data);
    } else if (node_isTag(node)) {
        const children = recursive ? cloneChildren(node.children) : [];
        const clone = new Element(node.name, {
            ...node.attribs
        }, children);
        children.forEach((child)=>child.parent = clone);
        if (node.namespace != null) {
            clone.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
            clone["x-attribsNamespace"] = {
                ...node["x-attribsNamespace"]
            };
        }
        if (node["x-attribsPrefix"]) {
            clone["x-attribsPrefix"] = {
                ...node["x-attribsPrefix"]
            };
        }
        result = clone;
    } else if (isCDATA(node)) {
        const children = recursive ? cloneChildren(node.children) : [];
        const clone = new node_CDATA(children);
        children.forEach((child)=>child.parent = clone);
        result = clone;
    } else if (node_isDocument(node)) {
        const children = recursive ? cloneChildren(node.children) : [];
        const clone = new Document(children);
        children.forEach((child)=>child.parent = clone);
        if (node["x-mode"]) {
            clone["x-mode"] = node["x-mode"];
        }
        result = clone;
    } else if (isDirective(node)) {
        const instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
            instruction["x-name"] = node["x-name"];
            instruction["x-publicId"] = node["x-publicId"];
            instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
    } else {
        throw new Error(`Not implemented yet: ${node.type}`);
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
}
function cloneChildren(childs) {
    const children = childs.map((child)=>cloneNode(child, true));
    for(let i = 1; i < children.length; i++){
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
    }
    return children;
}

;// CONCATENATED MODULE: ./node_modules/domhandler/lib/esm/index.js



// Default options
const esm_defaultOpts = {
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false
};
class esm_DomHandler {
    /**
     * @param callback Called once parsing has completed.
     * @param options Settings for the handler.
     * @param elementCB Callback whenever a tag is closed.
     */ constructor(callback, options, elementCB){
        /** The elements of the DOM */ this.dom = [];
        /** The root element for the DOM */ this.root = new Document(this.dom);
        /** Indicated whether parsing has been completed. */ this.done = false;
        /** Stack of open tags. */ this.tagStack = [
            this.root
        ];
        /** A data node that is still being written to. */ this.lastNode = null;
        /** Reference to the parser instance. Used for location information. */ this.parser = null;
        // Make it possible to skip arguments, for backwards-compatibility
        if (typeof options === "function") {
            elementCB = options;
            options = esm_defaultOpts;
        }
        if (typeof callback === "object") {
            options = callback;
            callback = undefined;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : esm_defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    onparserinit(parser) {
        this.parser = parser;
    }
    // Resets the handler back to starting state
    onreset() {
        this.dom = [];
        this.root = new Document(this.dom);
        this.done = false;
        this.tagStack = [
            this.root
        ];
        this.lastNode = null;
        this.parser = null;
    }
    // Signals the handler that parsing is done
    onend() {
        if (this.done) return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
    }
    onerror(error) {
        this.handleCallback(error);
    }
    onclosetag() {
        this.lastNode = null;
        const elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB) this.elementCB(elem);
    }
    onopentag(name, attribs) {
        const type = this.options.xmlMode ? ElementType.Tag : undefined;
        const element = new Element(name, attribs, undefined, type);
        this.addNode(element);
        this.tagStack.push(element);
    }
    ontext(data) {
        const { lastNode } = this;
        if (lastNode && lastNode.type === ElementType.Text) {
            lastNode.data += data;
            if (this.options.withEndIndices) {
                lastNode.endIndex = this.parser.endIndex;
            }
        } else {
            const node = new node_Text(data);
            this.addNode(node);
            this.lastNode = node;
        }
    }
    oncomment(data) {
        if (this.lastNode && this.lastNode.type === ElementType.Comment) {
            this.lastNode.data += data;
            return;
        }
        const node = new node_Comment(data);
        this.addNode(node);
        this.lastNode = node;
    }
    oncommentend() {
        this.lastNode = null;
    }
    oncdatastart() {
        const text = new node_Text("");
        const node = new node_CDATA([
            text
        ]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
    }
    oncdataend() {
        this.lastNode = null;
    }
    onprocessinginstruction(name, data) {
        const node = new ProcessingInstruction(name, data);
        this.addNode(node);
    }
    handleCallback(error) {
        if (typeof this.callback === "function") {
            this.callback(error, this.dom);
        } else if (error) {
            throw error;
        }
    }
    addNode(node) {
        const parent = this.tagStack[this.tagStack.length - 1];
        const previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
            node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
            node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
            node.prev = previousSibling;
            previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
    }
}
/* harmony default export */ const esm = ((/* unused pure expression or super */ null && (esm_DomHandler)));

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/generated/decode-data-html.js
// Generated using scripts/write-decode-map.ts
/* harmony default export */ const decode_data_html = (new Uint16Array(// prettier-ignore
'ᵁ<\xd5ıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\x00\x00\x00\x00\x00\x00ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms\x7f\x84\x8b\x90\x95\x98\xa6\xb3\xb9\xc8\xcflig耻\xc6䃆P耻&䀦cute耻\xc1䃁reve;䄂Āiyx}rc耻\xc2䃂;䐐r;쀀\ud835\udd04rave耻\xc0䃀pha;䎑acr;䄀d;橓Āgp\x9d\xa1on;䄄f;쀀\ud835\udd38plyFunction;恡ing耻\xc5䃅Ācs\xbe\xc3r;쀀\ud835\udc9cign;扔ilde耻\xc3䃃ml耻\xc4䃄Ѐaceforsu\xe5\xfb\xfeėĜĢħĪĀcr\xea\xf2kslash;或Ŷ\xf6\xf8;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀\ud835\udd05pf;쀀\ud835\udd39eve;䋘c\xf2ēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻\xa9䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻\xc7䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷\xf2ſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀\ud835\udc9epĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀\ud835\udd07Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\x00\x00\x00͔͂\x00Ѕf;쀀\ud835\udd3bƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegra\xecȹoɴ͹\x00\x00ͻ\xbb͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔e\xe5ˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\x00\x00ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\x00ц\x00ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\x00ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀\ud835\udc9frok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻\xd0䃐cute耻\xc9䃉ƀaiyӒӗӜron;䄚rc耻\xca䃊;䐭ot;䄖r;쀀\ud835\udd08rave耻\xc8䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\x00\x00ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀\ud835\udd3csilon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻\xcb䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀\ud835\udd09lledɓ֗\x00\x00֣mallSquare;旼erySmallSquare;斪Ͱֺ\x00ֿ\x00\x00ׄf;쀀\ud835\udd3dAll;戀riertrf;愱c\xf2׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀\ud835\udd0a;拙pf;쀀\ud835\udd3eeater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀\ud835\udca2;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\x00ڲf;愍izontalLine;攀Āctۃۅ\xf2کrok;䄦mpńېۘownHum\xf0įqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻\xcd䃍Āiyܓܘrc耻\xce䃎;䐘ot;䄰r;愑rave耻\xcc䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lie\xf3ϝǴ݉\x00ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀\ud835\udd40a;䎙cr;愐ilde;䄨ǫޚ\x00ޞcy;䐆l耻\xcf䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀\ud835\udd0dpf;쀀\ud835\udd41ǣ߇\x00ߌr;쀀\ud835\udca5rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀\ud835\udd0epf;쀀\ud835\udd42cr;쀀\ud835\udca6րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\x00ࣃbleBracket;柦nǔࣈ\x00࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ight\xe1Μs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀\ud835\udd0fĀ;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊight\xe1οight\xe1ϊf;쀀\ud835\udd43erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂ\xf2ࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀\ud835\udd10nusPlus;戓pf;쀀\ud835\udd44c\xf2੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘\xeb૙eryThi\xee૙tedĀGL૸ଆreaterGreate\xf2ٳessLes\xf3ੈLine;䀊r;쀀\ud835\udd11ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀\ud835\udca9ilde耻\xd1䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻\xd3䃓Āiy෎ීrc耻\xd4䃔;䐞blac;䅐r;쀀\ud835\udd12rave耻\xd2䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀\ud835\udd46enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀\ud835\udcaaash耻\xd8䃘iŬื฼de耻\xd5䃕es;樷ml耻\xd6䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀\ud835\udd13i;䎦;䎠usMinus;䂱Āipຢອncareplan\xe5ڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀\ud835\udcab;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀\ud835\udd14pf;愚cr;쀀\ud835\udcac؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻\xae䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r\xbbཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\x00စbleBracket;柧nǔည\x00နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀\ud835\udd16ortȀDLRUᄪᄴᄾᅉownArrow\xbbОeftArrow\xbb࢚ightArrow\xbb࿝pArrow;憑gma;䎣allCircle;战pf;쀀\ud835\udd4aɲᅭ\x00\x00ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀\ud835\udcaear;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Th\xe1ྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et\xbbሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻\xde䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀\ud835\udd17Āeiቻ኉ǲኀ\x00ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀\ud835\udd4bipleDot;惛Āctዖዛr;쀀\ud835\udcafrok;䅦ૡዷጎጚጦ\x00ጬጱ\x00\x00\x00\x00\x00ጸጽ፷ᎅ\x00᏿ᐄᐊᐐĀcrዻጁute耻\xda䃚rĀ;oጇገ憟cir;楉rǣጓ\x00጖y;䐎ve;䅬Āiyጞጣrc耻\xdb䃛;䐣blac;䅰r;쀀\ud835\udd18rave耻\xd9䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀\ud835\udd4cЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥own\xe1ϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀\ud835\udcb0ilde;䅨ml耻\xdc䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀\ud835\udd19pf;쀀\ud835\udd4dcr;쀀\ud835\udcb1dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀\ud835\udd1apf;쀀\ud835\udd4ecr;쀀\ud835\udcb2Ȁfiosᓋᓐᓒᓘr;쀀\ud835\udd1b;䎞pf;쀀\ud835\udd4fcr;쀀\ud835\udcb3ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻\xdd䃝Āiyᔉᔍrc;䅶;䐫r;쀀\ud835\udd1cpf;쀀\ud835\udd50cr;쀀\ud835\udcb4ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\x00ᕛoWidt\xe8૙a;䎖r;愨pf;愤cr;쀀\ud835\udcb5௡ᖃᖊᖐ\x00ᖰᖶᖿ\x00\x00\x00\x00ᗆᗛᗫᙟ᙭\x00ᚕ᚛ᚲᚹ\x00ᚾcute耻\xe1䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻\xe2䃢te肻\xb4̆;䐰lig耻\xe6䃦Ā;r\xb2ᖺ;쀀\ud835\udd1erave耻\xe0䃠ĀepᗊᗖĀfpᗏᗔsym;愵\xe8ᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\x00\x00ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e\xbbᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢\xbb\xb9arr;捼Āgpᙣᙧon;䄅f;쀀\ud835\udd52΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒ\xf1ᚃing耻\xe5䃥ƀctyᚡᚦᚨr;쀀\ud835\udcb6;䀪mpĀ;e዁ᚯ\xf1ʈilde耻\xe3䃣ml耻\xe4䃤Āciᛂᛈonin\xf4ɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e\xbbᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰s\xe9ᜌno\xf5ēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀\ud835\udd1fg΀costuvwឍឝឳេ៕៛៞ƀaiuបពរ\xf0ݠrc;旯p\xbb፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\x00\x00ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄e\xe5ᑄ\xe5ᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\x00ᠳƲᠯ\x00ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀\ud835\udd53Ā;tᏋᡣom\xbbᏌtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻\xa6䂦Ȁceioᥑᥖᥚᥠr;쀀\ud835\udcb7mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t\xbb᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\x00᧨ᨑᨕᨲ\x00ᨷᩐ\x00\x00᪴\x00\x00᫁\x00\x00ᬡᬮ᭍᭒\x00᯽\x00ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁\xeeړȀaeiu᧰᧻ᨁᨅǰ᧵\x00᧸s;橍on;䄍dil耻\xe7䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻\xb8ƭptyv;榲t脀\xa2;eᨭᨮ䂢r\xe4Ʋr;쀀\ud835\udd20ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark\xbbᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\x00\x00᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟\xbbཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it\xbb᪼ˬ᫇᫔᫺\x00ᬊonĀ;eᫍᫎ䀺Ā;q\xc7\xc6ɭ᫙\x00\x00᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁\xeeᅠeĀmx᫱᫶ent\xbb᫩e\xf3ɍǧ᫾\x00ᬇĀ;dኻᬂot;橭n\xf4Ɇƀfryᬐᬔᬗ;쀀\ud835\udd54o\xe4ɔ脀\xa9;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀\ud835\udcb8Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\x00\x00᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\x00\x00ᯒre\xe3᭳u\xe3᭵ee;拎edge;拏en耻\xa4䂤earrowĀlrᯮ᯳eft\xbbᮀight\xbbᮽe\xe4ᯝĀciᰁᰇonin\xf4Ƿnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍r\xf2΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸\xf2ᄳhĀ;vᱚᱛ怐\xbbऊūᱡᱧarow;椏a\xe3̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻\xb0䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀\ud835\udd21arĀlrᲳᲵ\xbbࣜ\xbbသʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀\xf7;o᳧ᳰntimes;拇n\xf8᳷cy;䑒cɯᴆ\x00\x00ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀\ud835\udd55ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedg\xe5\xfanƀadhᄮᵝᵧownarrow\xf3ᲃarpoonĀlrᵲᵶef\xf4Ჴigh\xf4ᲶŢᵿᶅkaro\xf7གɯᶊ\x00\x00ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀\ud835\udcb9;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃r\xf2Щa\xf2ྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴo\xf4ᲉĀcsḎḔute耻\xe9䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻\xea䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀\ud835\udd22ƀ;rsṐṑṗ檚ave耻\xe8䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et\xbbẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀\ud835\udd56ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on\xbbớ;䏵ȀcsuvỪỳἋἣĀioữḱrc\xbbḮɩỹ\x00\x00ỻ\xedՈantĀglἂἆtr\xbbṝess\xbbṺƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯o\xf4͒ĀahὉὋ;䎷耻\xf0䃰Āmrὓὗl耻\xeb䃫o;悬ƀcipὡὤὧl;䀡s\xf4ծĀeoὬὴctatio\xeeՙnential\xe5չৡᾒ\x00ᾞ\x00ᾡᾧ\x00\x00ῆῌ\x00ΐ\x00ῦῪ \x00 ⁚llingdotse\xf1Ṅy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\x00\x00᾽g;耀ﬀig;耀ﬄ;쀀\ud835\udd23lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\x00ῳf;쀀\ud835\udd57ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\x00⁐β•‥‧‪‬\x00‮耻\xbd䂽;慓耻\xbc䂼;慕;慙;慛Ƴ‴\x00‶;慔;慖ʴ‾⁁\x00\x00⁃耻\xbe䂾;慗;慜5;慘ƶ⁌\x00⁎;慚;慝8;慞l;恄wn;挢cr;쀀\ud835\udcbbࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lan\xf4٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀\ud835\udd24Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox\xbbℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀\ud835\udd58Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\x00↎pro\xf8₞r;楸qĀlqؿ↖les\xf3₈i\xed٫Āen↣↭rtneqq;쀀≩︀\xc5↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽r\xf2ΠȀilmr⇐⇔⇗⇛rs\xf0ᒄf\xbb․il\xf4کĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it\xbb∊lip;怦con;抹r;쀀\ud835\udd25sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀\ud835\udd59bar;怕ƀclt≯≴≸r;쀀\ud835\udcbdas\xe8⇴rok;䄧Ābp⊂⊇ull;恃hen\xbbᱛૡ⊣\x00⊪\x00⊸⋅⋎\x00⋕⋳\x00\x00⋸⌢⍧⍢⍿\x00⎆⎪⎴cute耻\xed䃭ƀ;iyݱ⊰⊵rc耻\xee䃮;䐸Ācx⊼⊿y;䐵cl耻\xa1䂡ĀfrΟ⋉;쀀\ud835\udd26rave耻\xec䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓in\xe5ގar\xf4ܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝do\xf4⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙er\xf3ᕣ\xe3⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀\ud835\udd5aa;䎹uest耻\xbf䂿Āci⎊⎏r;쀀\ud835\udcbenʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\x00⎼cy;䑖l耻\xef䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀\ud835\udd27ath;䈷pf;쀀\ud835\udd5bǣ⏬\x00⏱r;쀀\ud835\udcbfrcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀\ud835\udd28reen;䄸cy;䑅cy;䑜pf;쀀\ud835\udd5ccr;쀀\ud835\udcc0஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼r\xf2৆\xf2Εail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\x00⒪\x00⒱\x00\x00\x00\x00\x00⒵Ⓔ\x00ⓆⓈⓍ\x00⓹ute;䄺mptyv;榴ra\xeeࡌbda;䎻gƀ;dlࢎⓁⓃ;榑\xe5ࢎ;檅uo耻\xab䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝\xeb≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼\xecࢰ\xe2┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□a\xe9⓶arpoonĀdu▯▴own\xbbњp\xbb०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoon\xf3྘quigarro\xf7⇰hreetimes;拋ƀ;qs▋ও◺lan\xf4বʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋ppro\xf8Ⓠot;拖qĀgq♃♅\xf4উgt\xf2⒌\xf4ছi\xedলƀilr♕࣡♚sht;楼;쀀\ud835\udd29Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖r\xf2◁orne\xf2ᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che\xbb⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox\xbb⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽r\xebࣁgƀlmr⛿✍✔eftĀar০✇ight\xe1৲apsto;柼ight\xe1৽parrowĀlr✥✩ef\xf4⓭ight;憬ƀafl✶✹✽r;榅;쀀\ud835\udd5dus;樭imes;樴š❋❏st;戗\xe1ፎƀ;ef❗❘᠀旊nge\xbb❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇r\xf2ࢨorne\xf2ᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀\ud835\udcc1mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹re\xe5◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀\xc5⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻\xaf䂯Āet⡗⡙;時Ā;e⡞⡟朠se\xbb⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻ow\xeeҌef\xf4ए\xf0Ꮡker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle\xbbᘦr;쀀\ud835\udd2ao;愧ƀcdn⢯⢴⣉ro耻\xb5䂵Ȁ;acdᑤ⢽⣀⣄s\xf4ᚧir;櫰ot肻\xb7Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛\xf2−\xf0ઁĀdp⣩⣮els;抧f;쀀\ud835\udd5eĀct⣸⣽r;쀀\ud835\udcc2pos\xbbᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la\xbb˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉ro\xf8඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\x00⧣p肻\xa0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\x00⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸ui\xf6ୣĀei⩊⩎ar;椨\xed஘istĀ;s஠டr;쀀\ud835\udd2bȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lan\xf4௢i\xed௪Ā;rஶ⪁\xbbஷƀAap⪊⪍⪑r\xf2⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹r\xf2⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro\xf7⫁ightarro\xf7⪐ƀ;qs఻⪺⫪lan\xf4ౕĀ;sౕ⫴\xbbశi\xedౝĀ;rవ⫾iĀ;eచథi\xe4ඐĀpt⬌⬑f;쀀\ud835\udd5f膀\xac;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lle\xec୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳u\xe5ಥĀ;cಘ⭸Ā;eಒ⭽\xf1ಘȀAait⮈⮋⮝⮧r\xf2⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow\xbb⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉u\xe5൅;쀀\ud835\udcc3ortɭ⬅\x00\x00⯖ar\xe1⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭\xe5೸\xe5ഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗ\xf1സȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇ\xecௗlde耻\xf1䃱\xe7ృiangleĀlrⱒⱜeftĀ;eచⱚ\xf1దightĀ;eೋⱥ\xf1೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ⴭ\x00ⴸⵈⵠⵥ⵲ⶄᬇ\x00\x00ⶍⶫ\x00ⷈⷎ\x00ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻\xf3䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻\xf4䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀\ud835\udd2cͯ⵹\x00\x00⵼\x00ⶂn;䋛ave耻\xf2䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨr\xf2᪀Āir⶝ⶠr;榾oss;榻n\xe5๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀\ud835\udd60ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨r\xf2᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f\xbbⷿ耻\xaa䂪耻\xba䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧\xf2⸁ash耻\xf8䃸l;折iŬⸯ⸴de耻\xf5䃵esĀ;aǛ⸺s;樶ml耻\xf6䃶bar;挽ૡ⹞\x00⹽\x00⺀⺝\x00⺢⺹\x00\x00⻋ຜ\x00⼓\x00\x00⼫⾼\x00⿈rȀ;astЃ⹧⹲຅脀\xb6;l⹭⹮䂶le\xecЃɩ⹸\x00\x00⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀\ud835\udd2dƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕ma\xf4੶ne;明ƀ;tv⺿⻀⻈䏀chfork\xbb´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎\xf6⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻\xb1ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀\ud835\udd61nd耻\xa3䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷u\xe5໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾ppro\xf8⽃urlye\xf1໙\xf1໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨i\xedໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺\xf0⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴\xef໻rel;抰Āci⿀⿅r;쀀\ud835\udcc5;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀\ud835\udd2epf;쀀\ud835\udd62rime;恗cr;쀀\ud835\udcc6ƀaeo⿸〉〓tĀei⿾々rnion\xf3ڰnt;樖stĀ;e【】䀿\xf1Ἑ\xf4༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがr\xf2Ⴓ\xf2ϝail;検ar\xf2ᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕i\xe3ᅮmptyv;榳gȀ;del࿑らるろ;榒;榥\xe5࿑uo耻\xbb䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞\xeb≝\xf0✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶al\xf3༞ƀabrョリヮr\xf2៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗\xec࿲\xe2ヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜn\xe5Ⴛar\xf4ྩt;断ƀilrㅩဣㅮsht;楽;쀀\ud835\udd2fĀaoㅷㆆrĀduㅽㅿ\xbbѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭa\xe9トarpoonĀduㆻㆿow\xeeㅾp\xbb႒eftĀah㇊㇐rrow\xf3࿪arpoon\xf3Ցightarrows;應quigarro\xf7ニhreetimes;拌g;䋚ingdotse\xf1ἲƀahm㈍㈐㈓r\xf2࿪a\xf2Ց;怏oustĀ;a㈞㈟掱che\xbb㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾r\xebဃƀafl㉇㉊㉎r;榆;쀀\ud835\udd63us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒ar\xf2㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀\ud835\udcc7Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠re\xe5ㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\x00㍺㎤\x00\x00㏬㏰\x00㐨㑈㑚㒭㒱㓊㓱\x00㘖\x00\x00㘳cute;䅛qu\xef➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\x00㋼;檸on;䅡u\xe5ᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓i\xedሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒\xeb∨Ā;oਸ਼਴t耻\xa7䂧i;䀻war;椩mĀin㍩\xf0nu\xf3\xf1t;朶rĀ;o㍶⁕쀀\ud835\udd30Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\x00\x00㎜i\xe4ᑤara\xec⹯耻\xad䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲ar\xf2ᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetm\xe9㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀\ud835\udd64aĀdr㑍ЂesĀ;u㑔㑕晠it\xbb㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍\xf1ᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝\xf1ᆮƀ;afᅻ㒦ְrť㒫ֱ\xbbᅼar\xf2ᅈȀcemt㒹㒾㓂㓅r;쀀\ud835\udcc8tm\xee\xf1i\xec㐕ar\xe6ᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psilo\xeeỠh\xe9⺯s\xbb⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦ppro\xf8㋺urlye\xf1ᇾ\xf1ᇳƀaes㖂㖈㌛ppro\xf8㌚q\xf1㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻\xb9䂹耻\xb2䂲耻\xb3䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨\xeb∮Ā;oਫ਩war;椪lig耻\xdf䃟௡㙑㙝㙠ዎ㙳㙹\x00㙾㛂\x00\x00\x00\x00\x00㛛㜃\x00㜉㝬\x00\x00\x00㞇ɲ㙖\x00\x00㙛get;挖;䏄r\xeb๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀\ud835\udd31Ȁeiko㚆㚝㚵㚼ǲ㚋\x00㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮ppro\xf8዁im\xbbኬs\xf0ኞĀas㚺㚮\xf0዁rn耻\xfe䃾Ǭ̟㛆⋧es膀\xd7;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀\xe1⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀\ud835\udd65rk;櫚\xe1㍢rime;怴ƀaip㜏㜒㝤d\xe5ቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own\xbbᶻeftĀ;e⠀㜾\xf1म;扜ightĀ;e㊪㝋\xf1ၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀\ud835\udcc9;䑆cy;䑛rok;䅧Āio㞋㞎x\xf4᝷headĀlr㞗㞠eftarro\xf7ࡏightarrow\xbbཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶r\xf2ϭar;楣Ācr㟜㟢ute耻\xfa䃺\xf2ᅐrǣ㟪\x00㟭y;䑞ve;䅭Āiy㟵㟺rc耻\xfb䃻;䑃ƀabh㠃㠆㠋r\xf2Ꭽlac;䅱a\xf2ᏃĀir㠓㠘sht;楾;쀀\ud835\udd32rave耻\xf9䃹š㠧㠱rĀlr㠬㠮\xbbॗ\xbbႃlk;斀Āct㠹㡍ɯ㠿\x00\x00㡊rnĀ;e㡅㡆挜r\xbb㡆op;挏ri;旸Āal㡖㡚cr;䅫肻\xa8͉Āgp㡢㡦on;䅳f;쀀\ud835\udd66̀adhlsuᅋ㡸㡽፲㢑㢠own\xe1ᎳarpoonĀlr㢈㢌ef\xf4㠭igh\xf4㠯iƀ;hl㢙㢚㢜䏅\xbbᏺon\xbb㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\x00\x00㣁rnĀ;e㢼㢽挝r\xbb㢽op;挎ng;䅯ri;旹cr;쀀\ud835\udccaƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨\xbb᠓Āam㣯㣲r\xf2㢨l耻\xfc䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠r\xf2ϷarĀ;v㤦㤧櫨;櫩as\xe8ϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖app\xe1␕othin\xe7ẖƀhir㓫⻈㥙op\xf4⾵Ā;hᎷ㥢\xefㆍĀiu㥩㥭gm\xe1㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟et\xe1㚜iangleĀlr㦪㦯eft\xbbथight\xbbၑy;䐲ash\xbbံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨa\xf2ᑩr;쀀\ud835\udd33tr\xe9㦮suĀbp㧯㧱\xbbജ\xbb൙pf;쀀\ud835\udd67ro\xf0໻tr\xe9㦴Ācu㨆㨋r;쀀\ud835\udccbĀbp㨐㨘nĀEe㦀㨖\xbb㥾nĀEe㦒㨞\xbb㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀\ud835\udd34pf;쀀\ud835\udd68Ā;eᑹ㩦at\xe8ᑹcr;쀀\ud835\udcccૣណ㪇\x00㪋\x00㪐㪛\x00\x00㪝㪨㪫㪯\x00\x00㫃㫎\x00㫘ៜ៟tr\xe9៑r;쀀\ud835\udd35ĀAa㪔㪗r\xf2σr\xf2৶;䎾ĀAa㪡㪤r\xf2θr\xf2৫a\xf0✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀\ud835\udd69im\xe5ឲĀAa㫇㫊r\xf2ώr\xf2ਁĀcq㫒ីr;쀀\ud835\udccdĀpt៖㫜r\xe9។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻\xfd䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻\xa5䂥r;쀀\ud835\udd36cy;䑗pf;쀀\ud835\udd6acr;쀀\ud835\udcceĀcm㬦㬩y;䑎l耻\xff䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡tr\xe6ᕟa;䎶r;쀀\ud835\udd37cy;䐶grarr;懝pf;쀀\ud835\udd6bcr;쀀\ud835\udccfĀjn㮅㮇;怍j;怌'.split("").map((c)=>c.charCodeAt(0)))); //# sourceMappingURL=decode-data-html.js.map

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/generated/decode-data-xml.js
// Generated using scripts/write-decode-map.ts
/* harmony default export */ const decode_data_xml = (new Uint16Array(// prettier-ignore
"Ȁaglq	\x15\x18\x1bɭ\x0f\x00\x00\x12p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((c)=>c.charCodeAt(0)))); //# sourceMappingURL=decode-data-xml.js.map

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/decode_codepoint.js
// Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
var _a;
const decodeMap = new Map([
    [
        0,
        65533
    ],
    // C1 Unicode control character reference replacements
    [
        128,
        8364
    ],
    [
        130,
        8218
    ],
    [
        131,
        402
    ],
    [
        132,
        8222
    ],
    [
        133,
        8230
    ],
    [
        134,
        8224
    ],
    [
        135,
        8225
    ],
    [
        136,
        710
    ],
    [
        137,
        8240
    ],
    [
        138,
        352
    ],
    [
        139,
        8249
    ],
    [
        140,
        338
    ],
    [
        142,
        381
    ],
    [
        145,
        8216
    ],
    [
        146,
        8217
    ],
    [
        147,
        8220
    ],
    [
        148,
        8221
    ],
    [
        149,
        8226
    ],
    [
        150,
        8211
    ],
    [
        151,
        8212
    ],
    [
        152,
        732
    ],
    [
        153,
        8482
    ],
    [
        154,
        353
    ],
    [
        155,
        8250
    ],
    [
        156,
        339
    ],
    [
        158,
        382
    ],
    [
        159,
        376
    ]
]);
/**
 * Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
 */ const decode_codepoint_fromCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
(_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
    let output = "";
    if (codePoint > 0xffff) {
        codePoint -= 0x10000;
        output += String.fromCharCode(codePoint >>> 10 & 0x3ff | 0xd800);
        codePoint = 0xdc00 | codePoint & 0x3ff;
    }
    output += String.fromCharCode(codePoint);
    return output;
};
/**
 * Replace the given code point with a replacement character if it is a
 * surrogate or is outside the valid range. Otherwise return the code
 * point unchanged.
 */ function replaceCodePoint(codePoint) {
    var _a;
    if (codePoint >= 0xd800 && codePoint <= 0xdfff || codePoint > 0x10ffff) {
        return 0xfffd;
    }
    return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
/**
 * Replace the code point if relevant, then convert it to a string.
 *
 * @deprecated Use `fromCodePoint(replaceCodePoint(codePoint))` instead.
 * @param codePoint The code point to decode.
 * @returns The decoded code point.
 */ function decodeCodePoint(codePoint) {
    return decode_codepoint_fromCodePoint(replaceCodePoint(codePoint));
} //# sourceMappingURL=decode_codepoint.js.map

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/decode.js



// Re-export for use by eg. htmlparser2


var CharCodes;
(function(CharCodes) {
    CharCodes[CharCodes["NUM"] = 35] = "NUM";
    CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
    CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
    CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
    CharCodes[CharCodes["NINE"] = 57] = "NINE";
    CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
    CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
    CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
    CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
    CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
    CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
    CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */ const TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags) {
    BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
    BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
    BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code) {
    return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
    return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
    return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
/**
 * Checks if the given character is a valid end character for an entity in an attribute.
 *
 * Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
 * See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
 */ function isEntityInAttributeInvalidEnd(code) {
    return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState) {
    EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
    EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
    EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
    EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
    EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var decode_DecodingMode;
(function(DecodingMode) {
    /** Entities in text nodes that can end with any character. */ DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
    /** Only allow entities terminated with a semicolon. */ DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
    /** Entities in attributes have limitations on ending characters. */ DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
})(decode_DecodingMode || (decode_DecodingMode = {}));
/**
 * Token decoder with support of writing partial entities.
 */ class EntityDecoder {
    constructor(/** The tree used to decode entities. */ decodeTree, /**
     * The function that is called when a codepoint is decoded.
     *
     * For multi-byte named entities, this will be called multiple times,
     * with the second codepoint, and the same `consumed` value.
     *
     * @param codepoint The decoded codepoint.
     * @param consumed The number of bytes consumed by the decoder.
     */ emitCodePoint, /** An object that is used to produce errors. */ errors){
        this.decodeTree = decodeTree;
        this.emitCodePoint = emitCodePoint;
        this.errors = errors;
        /** The current state of the decoder. */ this.state = EntityDecoderState.EntityStart;
        /** Characters that were consumed while parsing an entity. */ this.consumed = 1;
        /**
         * The result of the entity.
         *
         * Either the result index of a numeric entity, or the codepoint of a
         * numeric entity.
         */ this.result = 0;
        /** The current index in the decode tree. */ this.treeIndex = 0;
        /** The number of characters that were consumed in excess. */ this.excess = 1;
        /** The mode in which the decoder is operating. */ this.decodeMode = decode_DecodingMode.Strict;
    }
    /** Resets the instance to make it reusable. */ startEntity(decodeMode) {
        this.decodeMode = decodeMode;
        this.state = EntityDecoderState.EntityStart;
        this.result = 0;
        this.treeIndex = 0;
        this.excess = 1;
        this.consumed = 1;
    }
    /**
     * Write an entity to the decoder. This can be called multiple times with partial entities.
     * If the entity is incomplete, the decoder will return -1.
     *
     * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
     * entity is incomplete, and resume when the next string is written.
     *
     * @param string The string containing the entity (or a continuation of the entity).
     * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ write(str, offset) {
        switch(this.state){
            case EntityDecoderState.EntityStart:
                {
                    if (str.charCodeAt(offset) === CharCodes.NUM) {
                        this.state = EntityDecoderState.NumericStart;
                        this.consumed += 1;
                        return this.stateNumericStart(str, offset + 1);
                    }
                    this.state = EntityDecoderState.NamedEntity;
                    return this.stateNamedEntity(str, offset);
                }
            case EntityDecoderState.NumericStart:
                {
                    return this.stateNumericStart(str, offset);
                }
            case EntityDecoderState.NumericDecimal:
                {
                    return this.stateNumericDecimal(str, offset);
                }
            case EntityDecoderState.NumericHex:
                {
                    return this.stateNumericHex(str, offset);
                }
            case EntityDecoderState.NamedEntity:
                {
                    return this.stateNamedEntity(str, offset);
                }
        }
    }
    /**
     * Switches between the numeric decimal and hexadecimal states.
     *
     * Equivalent to the `Numeric character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNumericStart(str, offset) {
        if (offset >= str.length) {
            return -1;
        }
        if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
            this.state = EntityDecoderState.NumericHex;
            this.consumed += 1;
            return this.stateNumericHex(str, offset + 1);
        }
        this.state = EntityDecoderState.NumericDecimal;
        return this.stateNumericDecimal(str, offset);
    }
    addToNumericResult(str, start, end, base) {
        if (start !== end) {
            const digitCount = end - start;
            this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
            this.consumed += digitCount;
        }
    }
    /**
     * Parses a hexadecimal numeric entity.
     *
     * Equivalent to the `Hexademical character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNumericHex(str, offset) {
        const startIdx = offset;
        while(offset < str.length){
            const char = str.charCodeAt(offset);
            if (isNumber(char) || isHexadecimalCharacter(char)) {
                offset += 1;
            } else {
                this.addToNumericResult(str, startIdx, offset, 16);
                return this.emitNumericEntity(char, 3);
            }
        }
        this.addToNumericResult(str, startIdx, offset, 16);
        return -1;
    }
    /**
     * Parses a decimal numeric entity.
     *
     * Equivalent to the `Decimal character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNumericDecimal(str, offset) {
        const startIdx = offset;
        while(offset < str.length){
            const char = str.charCodeAt(offset);
            if (isNumber(char)) {
                offset += 1;
            } else {
                this.addToNumericResult(str, startIdx, offset, 10);
                return this.emitNumericEntity(char, 2);
            }
        }
        this.addToNumericResult(str, startIdx, offset, 10);
        return -1;
    }
    /**
     * Validate and emit a numeric entity.
     *
     * Implements the logic from the `Hexademical character reference start
     * state` and `Numeric character reference end state` in the HTML spec.
     *
     * @param lastCp The last code point of the entity. Used to see if the
     *               entity was terminated with a semicolon.
     * @param expectedLength The minimum number of characters that should be
     *                       consumed. Used to validate that at least one digit
     *                       was consumed.
     * @returns The number of characters that were consumed.
     */ emitNumericEntity(lastCp, expectedLength) {
        var _a;
        // Ensure we consumed at least one digit.
        if (this.consumed <= expectedLength) {
            (_a = this.errors) === null || _a === void 0 ? void 0 : _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
            return 0;
        }
        // Figure out if this is a legit end of the entity
        if (lastCp === CharCodes.SEMI) {
            this.consumed += 1;
        } else if (this.decodeMode === decode_DecodingMode.Strict) {
            return 0;
        }
        this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
        if (this.errors) {
            if (lastCp !== CharCodes.SEMI) {
                this.errors.missingSemicolonAfterCharacterReference();
            }
            this.errors.validateNumericCharacterReference(this.result);
        }
        return this.consumed;
    }
    /**
     * Parses a named entity.
     *
     * Equivalent to the `Named character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNamedEntity(str, offset) {
        const { decodeTree } = this;
        let current = decodeTree[this.treeIndex];
        // The mask is the number of bytes of the value, including the current byte.
        let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
        for(; offset < str.length; offset++, this.excess++){
            const char = str.charCodeAt(offset);
            this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
            if (this.treeIndex < 0) {
                return this.result === 0 || // If we are parsing an attribute
                this.decodeMode === decode_DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
                (valueLength === 0 || // And there should be no invalid characters.
                isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
            }
            current = decodeTree[this.treeIndex];
            valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
            // If the branch is a value, store it and continue
            if (valueLength !== 0) {
                // If the entity is terminated by a semicolon, we are done.
                if (char === CharCodes.SEMI) {
                    return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
                }
                // If we encounter a non-terminated (legacy) entity while parsing strictly, then ignore it.
                if (this.decodeMode !== decode_DecodingMode.Strict) {
                    this.result = this.treeIndex;
                    this.consumed += this.excess;
                    this.excess = 0;
                }
            }
        }
        return -1;
    }
    /**
     * Emit a named entity that was not terminated with a semicolon.
     *
     * @returns The number of characters consumed.
     */ emitNotTerminatedNamedEntity() {
        var _a;
        const { result, decodeTree } = this;
        const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
        this.emitNamedEntityData(result, valueLength, this.consumed);
        (_a = this.errors) === null || _a === void 0 ? void 0 : _a.missingSemicolonAfterCharacterReference();
        return this.consumed;
    }
    /**
     * Emit a named entity.
     *
     * @param result The index of the entity in the decode tree.
     * @param valueLength The number of bytes in the entity.
     * @param consumed The number of characters consumed.
     *
     * @returns The number of characters consumed.
     */ emitNamedEntityData(result, valueLength, consumed) {
        const { decodeTree } = this;
        this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
        if (valueLength === 3) {
            // For multi-byte values, we need to emit the second byte.
            this.emitCodePoint(decodeTree[result + 2], consumed);
        }
        return consumed;
    }
    /**
     * Signal to the parser that the end of the input was reached.
     *
     * Remaining data will be emitted and relevant errors will be produced.
     *
     * @returns The number of characters consumed.
     */ end() {
        var _a;
        switch(this.state){
            case EntityDecoderState.NamedEntity:
                {
                    // Emit a named entity if we have one.
                    return this.result !== 0 && (this.decodeMode !== decode_DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
                }
            // Otherwise, emit a numeric entity if we have one.
            case EntityDecoderState.NumericDecimal:
                {
                    return this.emitNumericEntity(0, 2);
                }
            case EntityDecoderState.NumericHex:
                {
                    return this.emitNumericEntity(0, 3);
                }
            case EntityDecoderState.NumericStart:
                {
                    (_a = this.errors) === null || _a === void 0 ? void 0 : _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
                    return 0;
                }
            case EntityDecoderState.EntityStart:
                {
                    // Return 0 if we have no entity.
                    return 0;
                }
        }
    }
}
/**
 * Creates a function that decodes entities in a string.
 *
 * @param decodeTree The decode tree.
 * @returns A function that decodes entities in a string.
 */ function getDecoder(decodeTree) {
    let ret = "";
    const decoder = new EntityDecoder(decodeTree, (str)=>ret += decode_codepoint_fromCodePoint(str));
    return function decodeWithTrie(str, decodeMode) {
        let lastIndex = 0;
        let offset = 0;
        while((offset = str.indexOf("&", offset)) >= 0){
            ret += str.slice(lastIndex, offset);
            decoder.startEntity(decodeMode);
            const len = decoder.write(str, // Skip the "&"
            offset + 1);
            if (len < 0) {
                lastIndex = offset + decoder.end();
                break;
            }
            lastIndex = offset + len;
            // If `len` is 0, skip the current `&` and continue.
            offset = len === 0 ? lastIndex + 1 : lastIndex;
        }
        const result = ret + str.slice(lastIndex);
        // Make sure we don't keep a reference to the final string.
        ret = "";
        return result;
    };
}
/**
 * Determines the branch of the current node that is taken given the current
 * character. This function is used to traverse the trie.
 *
 * @param decodeTree The trie.
 * @param current The current node.
 * @param nodeIdx The index right after the current node and its value.
 * @param char The current character.
 * @returns The index of the next node, or -1 if no branch is taken.
 */ function determineBranch(decodeTree, current, nodeIdx, char) {
    const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
    const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
    // Case 1: Single branch encoded in jump offset
    if (branchCount === 0) {
        return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
    }
    // Case 2: Multiple branches encoded in jump table
    if (jumpOffset) {
        const value = char - jumpOffset;
        return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
    }
    // Case 3: Multiple branches encoded in dictionary
    // Binary search for the character.
    let lo = nodeIdx;
    let hi = lo + branchCount - 1;
    while(lo <= hi){
        const mid = lo + hi >>> 1;
        const midVal = decodeTree[mid];
        if (midVal < char) {
            lo = mid + 1;
        } else if (midVal > char) {
            hi = mid - 1;
        } else {
            return decodeTree[mid + branchCount];
        }
    }
    return -1;
}
const htmlDecoder = getDecoder(decode_data_html);
const xmlDecoder = getDecoder(decode_data_xml);
/**
 * Decodes an HTML string.
 *
 * @param str The string to decode.
 * @param mode The decoding mode.
 * @returns The decoded string.
 */ function decode_decodeHTML(str, mode = decode_DecodingMode.Legacy) {
    return htmlDecoder(str, mode);
}
/**
 * Decodes an HTML string in an attribute.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */ function decodeHTMLAttribute(str) {
    return htmlDecoder(str, decode_DecodingMode.Attribute);
}
/**
 * Decodes an HTML string, requiring all entities to be terminated by a semicolon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */ function decodeHTMLStrict(str) {
    return htmlDecoder(str, decode_DecodingMode.Strict);
}
/**
 * Decodes an XML string, requiring all entities to be terminated by a semicolon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */ function decode_decodeXML(str) {
    return xmlDecoder(str, decode_DecodingMode.Strict);
} //# sourceMappingURL=decode.js.map

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/generated/encode-html.js
// Generated using scripts/write-encode-map.ts
function restoreDiff(arr) {
    for(let i = 1; i < arr.length; i++){
        arr[i][0] += arr[i - 1][0] + 1;
    }
    return arr;
}
// prettier-ignore
/* harmony default export */ const encode_html = (new Map(/* #__PURE__ */ restoreDiff([
    [
        9,
        "&Tab;"
    ],
    [
        0,
        "&NewLine;"
    ],
    [
        22,
        "&excl;"
    ],
    [
        0,
        "&quot;"
    ],
    [
        0,
        "&num;"
    ],
    [
        0,
        "&dollar;"
    ],
    [
        0,
        "&percnt;"
    ],
    [
        0,
        "&amp;"
    ],
    [
        0,
        "&apos;"
    ],
    [
        0,
        "&lpar;"
    ],
    [
        0,
        "&rpar;"
    ],
    [
        0,
        "&ast;"
    ],
    [
        0,
        "&plus;"
    ],
    [
        0,
        "&comma;"
    ],
    [
        1,
        "&period;"
    ],
    [
        0,
        "&sol;"
    ],
    [
        10,
        "&colon;"
    ],
    [
        0,
        "&semi;"
    ],
    [
        0,
        {
            v: "&lt;",
            n: 8402,
            o: "&nvlt;"
        }
    ],
    [
        0,
        {
            v: "&equals;",
            n: 8421,
            o: "&bne;"
        }
    ],
    [
        0,
        {
            v: "&gt;",
            n: 8402,
            o: "&nvgt;"
        }
    ],
    [
        0,
        "&quest;"
    ],
    [
        0,
        "&commat;"
    ],
    [
        26,
        "&lbrack;"
    ],
    [
        0,
        "&bsol;"
    ],
    [
        0,
        "&rbrack;"
    ],
    [
        0,
        "&Hat;"
    ],
    [
        0,
        "&lowbar;"
    ],
    [
        0,
        "&DiacriticalGrave;"
    ],
    [
        5,
        {
            n: 106,
            o: "&fjlig;"
        }
    ],
    [
        20,
        "&lbrace;"
    ],
    [
        0,
        "&verbar;"
    ],
    [
        0,
        "&rbrace;"
    ],
    [
        34,
        "&nbsp;"
    ],
    [
        0,
        "&iexcl;"
    ],
    [
        0,
        "&cent;"
    ],
    [
        0,
        "&pound;"
    ],
    [
        0,
        "&curren;"
    ],
    [
        0,
        "&yen;"
    ],
    [
        0,
        "&brvbar;"
    ],
    [
        0,
        "&sect;"
    ],
    [
        0,
        "&die;"
    ],
    [
        0,
        "&copy;"
    ],
    [
        0,
        "&ordf;"
    ],
    [
        0,
        "&laquo;"
    ],
    [
        0,
        "&not;"
    ],
    [
        0,
        "&shy;"
    ],
    [
        0,
        "&circledR;"
    ],
    [
        0,
        "&macr;"
    ],
    [
        0,
        "&deg;"
    ],
    [
        0,
        "&PlusMinus;"
    ],
    [
        0,
        "&sup2;"
    ],
    [
        0,
        "&sup3;"
    ],
    [
        0,
        "&acute;"
    ],
    [
        0,
        "&micro;"
    ],
    [
        0,
        "&para;"
    ],
    [
        0,
        "&centerdot;"
    ],
    [
        0,
        "&cedil;"
    ],
    [
        0,
        "&sup1;"
    ],
    [
        0,
        "&ordm;"
    ],
    [
        0,
        "&raquo;"
    ],
    [
        0,
        "&frac14;"
    ],
    [
        0,
        "&frac12;"
    ],
    [
        0,
        "&frac34;"
    ],
    [
        0,
        "&iquest;"
    ],
    [
        0,
        "&Agrave;"
    ],
    [
        0,
        "&Aacute;"
    ],
    [
        0,
        "&Acirc;"
    ],
    [
        0,
        "&Atilde;"
    ],
    [
        0,
        "&Auml;"
    ],
    [
        0,
        "&angst;"
    ],
    [
        0,
        "&AElig;"
    ],
    [
        0,
        "&Ccedil;"
    ],
    [
        0,
        "&Egrave;"
    ],
    [
        0,
        "&Eacute;"
    ],
    [
        0,
        "&Ecirc;"
    ],
    [
        0,
        "&Euml;"
    ],
    [
        0,
        "&Igrave;"
    ],
    [
        0,
        "&Iacute;"
    ],
    [
        0,
        "&Icirc;"
    ],
    [
        0,
        "&Iuml;"
    ],
    [
        0,
        "&ETH;"
    ],
    [
        0,
        "&Ntilde;"
    ],
    [
        0,
        "&Ograve;"
    ],
    [
        0,
        "&Oacute;"
    ],
    [
        0,
        "&Ocirc;"
    ],
    [
        0,
        "&Otilde;"
    ],
    [
        0,
        "&Ouml;"
    ],
    [
        0,
        "&times;"
    ],
    [
        0,
        "&Oslash;"
    ],
    [
        0,
        "&Ugrave;"
    ],
    [
        0,
        "&Uacute;"
    ],
    [
        0,
        "&Ucirc;"
    ],
    [
        0,
        "&Uuml;"
    ],
    [
        0,
        "&Yacute;"
    ],
    [
        0,
        "&THORN;"
    ],
    [
        0,
        "&szlig;"
    ],
    [
        0,
        "&agrave;"
    ],
    [
        0,
        "&aacute;"
    ],
    [
        0,
        "&acirc;"
    ],
    [
        0,
        "&atilde;"
    ],
    [
        0,
        "&auml;"
    ],
    [
        0,
        "&aring;"
    ],
    [
        0,
        "&aelig;"
    ],
    [
        0,
        "&ccedil;"
    ],
    [
        0,
        "&egrave;"
    ],
    [
        0,
        "&eacute;"
    ],
    [
        0,
        "&ecirc;"
    ],
    [
        0,
        "&euml;"
    ],
    [
        0,
        "&igrave;"
    ],
    [
        0,
        "&iacute;"
    ],
    [
        0,
        "&icirc;"
    ],
    [
        0,
        "&iuml;"
    ],
    [
        0,
        "&eth;"
    ],
    [
        0,
        "&ntilde;"
    ],
    [
        0,
        "&ograve;"
    ],
    [
        0,
        "&oacute;"
    ],
    [
        0,
        "&ocirc;"
    ],
    [
        0,
        "&otilde;"
    ],
    [
        0,
        "&ouml;"
    ],
    [
        0,
        "&div;"
    ],
    [
        0,
        "&oslash;"
    ],
    [
        0,
        "&ugrave;"
    ],
    [
        0,
        "&uacute;"
    ],
    [
        0,
        "&ucirc;"
    ],
    [
        0,
        "&uuml;"
    ],
    [
        0,
        "&yacute;"
    ],
    [
        0,
        "&thorn;"
    ],
    [
        0,
        "&yuml;"
    ],
    [
        0,
        "&Amacr;"
    ],
    [
        0,
        "&amacr;"
    ],
    [
        0,
        "&Abreve;"
    ],
    [
        0,
        "&abreve;"
    ],
    [
        0,
        "&Aogon;"
    ],
    [
        0,
        "&aogon;"
    ],
    [
        0,
        "&Cacute;"
    ],
    [
        0,
        "&cacute;"
    ],
    [
        0,
        "&Ccirc;"
    ],
    [
        0,
        "&ccirc;"
    ],
    [
        0,
        "&Cdot;"
    ],
    [
        0,
        "&cdot;"
    ],
    [
        0,
        "&Ccaron;"
    ],
    [
        0,
        "&ccaron;"
    ],
    [
        0,
        "&Dcaron;"
    ],
    [
        0,
        "&dcaron;"
    ],
    [
        0,
        "&Dstrok;"
    ],
    [
        0,
        "&dstrok;"
    ],
    [
        0,
        "&Emacr;"
    ],
    [
        0,
        "&emacr;"
    ],
    [
        2,
        "&Edot;"
    ],
    [
        0,
        "&edot;"
    ],
    [
        0,
        "&Eogon;"
    ],
    [
        0,
        "&eogon;"
    ],
    [
        0,
        "&Ecaron;"
    ],
    [
        0,
        "&ecaron;"
    ],
    [
        0,
        "&Gcirc;"
    ],
    [
        0,
        "&gcirc;"
    ],
    [
        0,
        "&Gbreve;"
    ],
    [
        0,
        "&gbreve;"
    ],
    [
        0,
        "&Gdot;"
    ],
    [
        0,
        "&gdot;"
    ],
    [
        0,
        "&Gcedil;"
    ],
    [
        1,
        "&Hcirc;"
    ],
    [
        0,
        "&hcirc;"
    ],
    [
        0,
        "&Hstrok;"
    ],
    [
        0,
        "&hstrok;"
    ],
    [
        0,
        "&Itilde;"
    ],
    [
        0,
        "&itilde;"
    ],
    [
        0,
        "&Imacr;"
    ],
    [
        0,
        "&imacr;"
    ],
    [
        2,
        "&Iogon;"
    ],
    [
        0,
        "&iogon;"
    ],
    [
        0,
        "&Idot;"
    ],
    [
        0,
        "&imath;"
    ],
    [
        0,
        "&IJlig;"
    ],
    [
        0,
        "&ijlig;"
    ],
    [
        0,
        "&Jcirc;"
    ],
    [
        0,
        "&jcirc;"
    ],
    [
        0,
        "&Kcedil;"
    ],
    [
        0,
        "&kcedil;"
    ],
    [
        0,
        "&kgreen;"
    ],
    [
        0,
        "&Lacute;"
    ],
    [
        0,
        "&lacute;"
    ],
    [
        0,
        "&Lcedil;"
    ],
    [
        0,
        "&lcedil;"
    ],
    [
        0,
        "&Lcaron;"
    ],
    [
        0,
        "&lcaron;"
    ],
    [
        0,
        "&Lmidot;"
    ],
    [
        0,
        "&lmidot;"
    ],
    [
        0,
        "&Lstrok;"
    ],
    [
        0,
        "&lstrok;"
    ],
    [
        0,
        "&Nacute;"
    ],
    [
        0,
        "&nacute;"
    ],
    [
        0,
        "&Ncedil;"
    ],
    [
        0,
        "&ncedil;"
    ],
    [
        0,
        "&Ncaron;"
    ],
    [
        0,
        "&ncaron;"
    ],
    [
        0,
        "&napos;"
    ],
    [
        0,
        "&ENG;"
    ],
    [
        0,
        "&eng;"
    ],
    [
        0,
        "&Omacr;"
    ],
    [
        0,
        "&omacr;"
    ],
    [
        2,
        "&Odblac;"
    ],
    [
        0,
        "&odblac;"
    ],
    [
        0,
        "&OElig;"
    ],
    [
        0,
        "&oelig;"
    ],
    [
        0,
        "&Racute;"
    ],
    [
        0,
        "&racute;"
    ],
    [
        0,
        "&Rcedil;"
    ],
    [
        0,
        "&rcedil;"
    ],
    [
        0,
        "&Rcaron;"
    ],
    [
        0,
        "&rcaron;"
    ],
    [
        0,
        "&Sacute;"
    ],
    [
        0,
        "&sacute;"
    ],
    [
        0,
        "&Scirc;"
    ],
    [
        0,
        "&scirc;"
    ],
    [
        0,
        "&Scedil;"
    ],
    [
        0,
        "&scedil;"
    ],
    [
        0,
        "&Scaron;"
    ],
    [
        0,
        "&scaron;"
    ],
    [
        0,
        "&Tcedil;"
    ],
    [
        0,
        "&tcedil;"
    ],
    [
        0,
        "&Tcaron;"
    ],
    [
        0,
        "&tcaron;"
    ],
    [
        0,
        "&Tstrok;"
    ],
    [
        0,
        "&tstrok;"
    ],
    [
        0,
        "&Utilde;"
    ],
    [
        0,
        "&utilde;"
    ],
    [
        0,
        "&Umacr;"
    ],
    [
        0,
        "&umacr;"
    ],
    [
        0,
        "&Ubreve;"
    ],
    [
        0,
        "&ubreve;"
    ],
    [
        0,
        "&Uring;"
    ],
    [
        0,
        "&uring;"
    ],
    [
        0,
        "&Udblac;"
    ],
    [
        0,
        "&udblac;"
    ],
    [
        0,
        "&Uogon;"
    ],
    [
        0,
        "&uogon;"
    ],
    [
        0,
        "&Wcirc;"
    ],
    [
        0,
        "&wcirc;"
    ],
    [
        0,
        "&Ycirc;"
    ],
    [
        0,
        "&ycirc;"
    ],
    [
        0,
        "&Yuml;"
    ],
    [
        0,
        "&Zacute;"
    ],
    [
        0,
        "&zacute;"
    ],
    [
        0,
        "&Zdot;"
    ],
    [
        0,
        "&zdot;"
    ],
    [
        0,
        "&Zcaron;"
    ],
    [
        0,
        "&zcaron;"
    ],
    [
        19,
        "&fnof;"
    ],
    [
        34,
        "&imped;"
    ],
    [
        63,
        "&gacute;"
    ],
    [
        65,
        "&jmath;"
    ],
    [
        142,
        "&circ;"
    ],
    [
        0,
        "&caron;"
    ],
    [
        16,
        "&breve;"
    ],
    [
        0,
        "&DiacriticalDot;"
    ],
    [
        0,
        "&ring;"
    ],
    [
        0,
        "&ogon;"
    ],
    [
        0,
        "&DiacriticalTilde;"
    ],
    [
        0,
        "&dblac;"
    ],
    [
        51,
        "&DownBreve;"
    ],
    [
        127,
        "&Alpha;"
    ],
    [
        0,
        "&Beta;"
    ],
    [
        0,
        "&Gamma;"
    ],
    [
        0,
        "&Delta;"
    ],
    [
        0,
        "&Epsilon;"
    ],
    [
        0,
        "&Zeta;"
    ],
    [
        0,
        "&Eta;"
    ],
    [
        0,
        "&Theta;"
    ],
    [
        0,
        "&Iota;"
    ],
    [
        0,
        "&Kappa;"
    ],
    [
        0,
        "&Lambda;"
    ],
    [
        0,
        "&Mu;"
    ],
    [
        0,
        "&Nu;"
    ],
    [
        0,
        "&Xi;"
    ],
    [
        0,
        "&Omicron;"
    ],
    [
        0,
        "&Pi;"
    ],
    [
        0,
        "&Rho;"
    ],
    [
        1,
        "&Sigma;"
    ],
    [
        0,
        "&Tau;"
    ],
    [
        0,
        "&Upsilon;"
    ],
    [
        0,
        "&Phi;"
    ],
    [
        0,
        "&Chi;"
    ],
    [
        0,
        "&Psi;"
    ],
    [
        0,
        "&ohm;"
    ],
    [
        7,
        "&alpha;"
    ],
    [
        0,
        "&beta;"
    ],
    [
        0,
        "&gamma;"
    ],
    [
        0,
        "&delta;"
    ],
    [
        0,
        "&epsi;"
    ],
    [
        0,
        "&zeta;"
    ],
    [
        0,
        "&eta;"
    ],
    [
        0,
        "&theta;"
    ],
    [
        0,
        "&iota;"
    ],
    [
        0,
        "&kappa;"
    ],
    [
        0,
        "&lambda;"
    ],
    [
        0,
        "&mu;"
    ],
    [
        0,
        "&nu;"
    ],
    [
        0,
        "&xi;"
    ],
    [
        0,
        "&omicron;"
    ],
    [
        0,
        "&pi;"
    ],
    [
        0,
        "&rho;"
    ],
    [
        0,
        "&sigmaf;"
    ],
    [
        0,
        "&sigma;"
    ],
    [
        0,
        "&tau;"
    ],
    [
        0,
        "&upsi;"
    ],
    [
        0,
        "&phi;"
    ],
    [
        0,
        "&chi;"
    ],
    [
        0,
        "&psi;"
    ],
    [
        0,
        "&omega;"
    ],
    [
        7,
        "&thetasym;"
    ],
    [
        0,
        "&Upsi;"
    ],
    [
        2,
        "&phiv;"
    ],
    [
        0,
        "&piv;"
    ],
    [
        5,
        "&Gammad;"
    ],
    [
        0,
        "&digamma;"
    ],
    [
        18,
        "&kappav;"
    ],
    [
        0,
        "&rhov;"
    ],
    [
        3,
        "&epsiv;"
    ],
    [
        0,
        "&backepsilon;"
    ],
    [
        10,
        "&IOcy;"
    ],
    [
        0,
        "&DJcy;"
    ],
    [
        0,
        "&GJcy;"
    ],
    [
        0,
        "&Jukcy;"
    ],
    [
        0,
        "&DScy;"
    ],
    [
        0,
        "&Iukcy;"
    ],
    [
        0,
        "&YIcy;"
    ],
    [
        0,
        "&Jsercy;"
    ],
    [
        0,
        "&LJcy;"
    ],
    [
        0,
        "&NJcy;"
    ],
    [
        0,
        "&TSHcy;"
    ],
    [
        0,
        "&KJcy;"
    ],
    [
        1,
        "&Ubrcy;"
    ],
    [
        0,
        "&DZcy;"
    ],
    [
        0,
        "&Acy;"
    ],
    [
        0,
        "&Bcy;"
    ],
    [
        0,
        "&Vcy;"
    ],
    [
        0,
        "&Gcy;"
    ],
    [
        0,
        "&Dcy;"
    ],
    [
        0,
        "&IEcy;"
    ],
    [
        0,
        "&ZHcy;"
    ],
    [
        0,
        "&Zcy;"
    ],
    [
        0,
        "&Icy;"
    ],
    [
        0,
        "&Jcy;"
    ],
    [
        0,
        "&Kcy;"
    ],
    [
        0,
        "&Lcy;"
    ],
    [
        0,
        "&Mcy;"
    ],
    [
        0,
        "&Ncy;"
    ],
    [
        0,
        "&Ocy;"
    ],
    [
        0,
        "&Pcy;"
    ],
    [
        0,
        "&Rcy;"
    ],
    [
        0,
        "&Scy;"
    ],
    [
        0,
        "&Tcy;"
    ],
    [
        0,
        "&Ucy;"
    ],
    [
        0,
        "&Fcy;"
    ],
    [
        0,
        "&KHcy;"
    ],
    [
        0,
        "&TScy;"
    ],
    [
        0,
        "&CHcy;"
    ],
    [
        0,
        "&SHcy;"
    ],
    [
        0,
        "&SHCHcy;"
    ],
    [
        0,
        "&HARDcy;"
    ],
    [
        0,
        "&Ycy;"
    ],
    [
        0,
        "&SOFTcy;"
    ],
    [
        0,
        "&Ecy;"
    ],
    [
        0,
        "&YUcy;"
    ],
    [
        0,
        "&YAcy;"
    ],
    [
        0,
        "&acy;"
    ],
    [
        0,
        "&bcy;"
    ],
    [
        0,
        "&vcy;"
    ],
    [
        0,
        "&gcy;"
    ],
    [
        0,
        "&dcy;"
    ],
    [
        0,
        "&iecy;"
    ],
    [
        0,
        "&zhcy;"
    ],
    [
        0,
        "&zcy;"
    ],
    [
        0,
        "&icy;"
    ],
    [
        0,
        "&jcy;"
    ],
    [
        0,
        "&kcy;"
    ],
    [
        0,
        "&lcy;"
    ],
    [
        0,
        "&mcy;"
    ],
    [
        0,
        "&ncy;"
    ],
    [
        0,
        "&ocy;"
    ],
    [
        0,
        "&pcy;"
    ],
    [
        0,
        "&rcy;"
    ],
    [
        0,
        "&scy;"
    ],
    [
        0,
        "&tcy;"
    ],
    [
        0,
        "&ucy;"
    ],
    [
        0,
        "&fcy;"
    ],
    [
        0,
        "&khcy;"
    ],
    [
        0,
        "&tscy;"
    ],
    [
        0,
        "&chcy;"
    ],
    [
        0,
        "&shcy;"
    ],
    [
        0,
        "&shchcy;"
    ],
    [
        0,
        "&hardcy;"
    ],
    [
        0,
        "&ycy;"
    ],
    [
        0,
        "&softcy;"
    ],
    [
        0,
        "&ecy;"
    ],
    [
        0,
        "&yucy;"
    ],
    [
        0,
        "&yacy;"
    ],
    [
        1,
        "&iocy;"
    ],
    [
        0,
        "&djcy;"
    ],
    [
        0,
        "&gjcy;"
    ],
    [
        0,
        "&jukcy;"
    ],
    [
        0,
        "&dscy;"
    ],
    [
        0,
        "&iukcy;"
    ],
    [
        0,
        "&yicy;"
    ],
    [
        0,
        "&jsercy;"
    ],
    [
        0,
        "&ljcy;"
    ],
    [
        0,
        "&njcy;"
    ],
    [
        0,
        "&tshcy;"
    ],
    [
        0,
        "&kjcy;"
    ],
    [
        1,
        "&ubrcy;"
    ],
    [
        0,
        "&dzcy;"
    ],
    [
        7074,
        "&ensp;"
    ],
    [
        0,
        "&emsp;"
    ],
    [
        0,
        "&emsp13;"
    ],
    [
        0,
        "&emsp14;"
    ],
    [
        1,
        "&numsp;"
    ],
    [
        0,
        "&puncsp;"
    ],
    [
        0,
        "&ThinSpace;"
    ],
    [
        0,
        "&hairsp;"
    ],
    [
        0,
        "&NegativeMediumSpace;"
    ],
    [
        0,
        "&zwnj;"
    ],
    [
        0,
        "&zwj;"
    ],
    [
        0,
        "&lrm;"
    ],
    [
        0,
        "&rlm;"
    ],
    [
        0,
        "&dash;"
    ],
    [
        2,
        "&ndash;"
    ],
    [
        0,
        "&mdash;"
    ],
    [
        0,
        "&horbar;"
    ],
    [
        0,
        "&Verbar;"
    ],
    [
        1,
        "&lsquo;"
    ],
    [
        0,
        "&CloseCurlyQuote;"
    ],
    [
        0,
        "&lsquor;"
    ],
    [
        1,
        "&ldquo;"
    ],
    [
        0,
        "&CloseCurlyDoubleQuote;"
    ],
    [
        0,
        "&bdquo;"
    ],
    [
        1,
        "&dagger;"
    ],
    [
        0,
        "&Dagger;"
    ],
    [
        0,
        "&bull;"
    ],
    [
        2,
        "&nldr;"
    ],
    [
        0,
        "&hellip;"
    ],
    [
        9,
        "&permil;"
    ],
    [
        0,
        "&pertenk;"
    ],
    [
        0,
        "&prime;"
    ],
    [
        0,
        "&Prime;"
    ],
    [
        0,
        "&tprime;"
    ],
    [
        0,
        "&backprime;"
    ],
    [
        3,
        "&lsaquo;"
    ],
    [
        0,
        "&rsaquo;"
    ],
    [
        3,
        "&oline;"
    ],
    [
        2,
        "&caret;"
    ],
    [
        1,
        "&hybull;"
    ],
    [
        0,
        "&frasl;"
    ],
    [
        10,
        "&bsemi;"
    ],
    [
        7,
        "&qprime;"
    ],
    [
        7,
        {
            v: "&MediumSpace;",
            n: 8202,
            o: "&ThickSpace;"
        }
    ],
    [
        0,
        "&NoBreak;"
    ],
    [
        0,
        "&af;"
    ],
    [
        0,
        "&InvisibleTimes;"
    ],
    [
        0,
        "&ic;"
    ],
    [
        72,
        "&euro;"
    ],
    [
        46,
        "&tdot;"
    ],
    [
        0,
        "&DotDot;"
    ],
    [
        37,
        "&complexes;"
    ],
    [
        2,
        "&incare;"
    ],
    [
        4,
        "&gscr;"
    ],
    [
        0,
        "&hamilt;"
    ],
    [
        0,
        "&Hfr;"
    ],
    [
        0,
        "&Hopf;"
    ],
    [
        0,
        "&planckh;"
    ],
    [
        0,
        "&hbar;"
    ],
    [
        0,
        "&imagline;"
    ],
    [
        0,
        "&Ifr;"
    ],
    [
        0,
        "&lagran;"
    ],
    [
        0,
        "&ell;"
    ],
    [
        1,
        "&naturals;"
    ],
    [
        0,
        "&numero;"
    ],
    [
        0,
        "&copysr;"
    ],
    [
        0,
        "&weierp;"
    ],
    [
        0,
        "&Popf;"
    ],
    [
        0,
        "&Qopf;"
    ],
    [
        0,
        "&realine;"
    ],
    [
        0,
        "&real;"
    ],
    [
        0,
        "&reals;"
    ],
    [
        0,
        "&rx;"
    ],
    [
        3,
        "&trade;"
    ],
    [
        1,
        "&integers;"
    ],
    [
        2,
        "&mho;"
    ],
    [
        0,
        "&zeetrf;"
    ],
    [
        0,
        "&iiota;"
    ],
    [
        2,
        "&bernou;"
    ],
    [
        0,
        "&Cayleys;"
    ],
    [
        1,
        "&escr;"
    ],
    [
        0,
        "&Escr;"
    ],
    [
        0,
        "&Fouriertrf;"
    ],
    [
        1,
        "&Mellintrf;"
    ],
    [
        0,
        "&order;"
    ],
    [
        0,
        "&alefsym;"
    ],
    [
        0,
        "&beth;"
    ],
    [
        0,
        "&gimel;"
    ],
    [
        0,
        "&daleth;"
    ],
    [
        12,
        "&CapitalDifferentialD;"
    ],
    [
        0,
        "&dd;"
    ],
    [
        0,
        "&ee;"
    ],
    [
        0,
        "&ii;"
    ],
    [
        10,
        "&frac13;"
    ],
    [
        0,
        "&frac23;"
    ],
    [
        0,
        "&frac15;"
    ],
    [
        0,
        "&frac25;"
    ],
    [
        0,
        "&frac35;"
    ],
    [
        0,
        "&frac45;"
    ],
    [
        0,
        "&frac16;"
    ],
    [
        0,
        "&frac56;"
    ],
    [
        0,
        "&frac18;"
    ],
    [
        0,
        "&frac38;"
    ],
    [
        0,
        "&frac58;"
    ],
    [
        0,
        "&frac78;"
    ],
    [
        49,
        "&larr;"
    ],
    [
        0,
        "&ShortUpArrow;"
    ],
    [
        0,
        "&rarr;"
    ],
    [
        0,
        "&darr;"
    ],
    [
        0,
        "&harr;"
    ],
    [
        0,
        "&updownarrow;"
    ],
    [
        0,
        "&nwarr;"
    ],
    [
        0,
        "&nearr;"
    ],
    [
        0,
        "&LowerRightArrow;"
    ],
    [
        0,
        "&LowerLeftArrow;"
    ],
    [
        0,
        "&nlarr;"
    ],
    [
        0,
        "&nrarr;"
    ],
    [
        1,
        {
            v: "&rarrw;",
            n: 824,
            o: "&nrarrw;"
        }
    ],
    [
        0,
        "&Larr;"
    ],
    [
        0,
        "&Uarr;"
    ],
    [
        0,
        "&Rarr;"
    ],
    [
        0,
        "&Darr;"
    ],
    [
        0,
        "&larrtl;"
    ],
    [
        0,
        "&rarrtl;"
    ],
    [
        0,
        "&LeftTeeArrow;"
    ],
    [
        0,
        "&mapstoup;"
    ],
    [
        0,
        "&map;"
    ],
    [
        0,
        "&DownTeeArrow;"
    ],
    [
        1,
        "&hookleftarrow;"
    ],
    [
        0,
        "&hookrightarrow;"
    ],
    [
        0,
        "&larrlp;"
    ],
    [
        0,
        "&looparrowright;"
    ],
    [
        0,
        "&harrw;"
    ],
    [
        0,
        "&nharr;"
    ],
    [
        1,
        "&lsh;"
    ],
    [
        0,
        "&rsh;"
    ],
    [
        0,
        "&ldsh;"
    ],
    [
        0,
        "&rdsh;"
    ],
    [
        1,
        "&crarr;"
    ],
    [
        0,
        "&cularr;"
    ],
    [
        0,
        "&curarr;"
    ],
    [
        2,
        "&circlearrowleft;"
    ],
    [
        0,
        "&circlearrowright;"
    ],
    [
        0,
        "&leftharpoonup;"
    ],
    [
        0,
        "&DownLeftVector;"
    ],
    [
        0,
        "&RightUpVector;"
    ],
    [
        0,
        "&LeftUpVector;"
    ],
    [
        0,
        "&rharu;"
    ],
    [
        0,
        "&DownRightVector;"
    ],
    [
        0,
        "&dharr;"
    ],
    [
        0,
        "&dharl;"
    ],
    [
        0,
        "&RightArrowLeftArrow;"
    ],
    [
        0,
        "&udarr;"
    ],
    [
        0,
        "&LeftArrowRightArrow;"
    ],
    [
        0,
        "&leftleftarrows;"
    ],
    [
        0,
        "&upuparrows;"
    ],
    [
        0,
        "&rightrightarrows;"
    ],
    [
        0,
        "&ddarr;"
    ],
    [
        0,
        "&leftrightharpoons;"
    ],
    [
        0,
        "&Equilibrium;"
    ],
    [
        0,
        "&nlArr;"
    ],
    [
        0,
        "&nhArr;"
    ],
    [
        0,
        "&nrArr;"
    ],
    [
        0,
        "&DoubleLeftArrow;"
    ],
    [
        0,
        "&DoubleUpArrow;"
    ],
    [
        0,
        "&DoubleRightArrow;"
    ],
    [
        0,
        "&dArr;"
    ],
    [
        0,
        "&DoubleLeftRightArrow;"
    ],
    [
        0,
        "&DoubleUpDownArrow;"
    ],
    [
        0,
        "&nwArr;"
    ],
    [
        0,
        "&neArr;"
    ],
    [
        0,
        "&seArr;"
    ],
    [
        0,
        "&swArr;"
    ],
    [
        0,
        "&lAarr;"
    ],
    [
        0,
        "&rAarr;"
    ],
    [
        1,
        "&zigrarr;"
    ],
    [
        6,
        "&larrb;"
    ],
    [
        0,
        "&rarrb;"
    ],
    [
        15,
        "&DownArrowUpArrow;"
    ],
    [
        7,
        "&loarr;"
    ],
    [
        0,
        "&roarr;"
    ],
    [
        0,
        "&hoarr;"
    ],
    [
        0,
        "&forall;"
    ],
    [
        0,
        "&comp;"
    ],
    [
        0,
        {
            v: "&part;",
            n: 824,
            o: "&npart;"
        }
    ],
    [
        0,
        "&exist;"
    ],
    [
        0,
        "&nexist;"
    ],
    [
        0,
        "&empty;"
    ],
    [
        1,
        "&Del;"
    ],
    [
        0,
        "&Element;"
    ],
    [
        0,
        "&NotElement;"
    ],
    [
        1,
        "&ni;"
    ],
    [
        0,
        "&notni;"
    ],
    [
        2,
        "&prod;"
    ],
    [
        0,
        "&coprod;"
    ],
    [
        0,
        "&sum;"
    ],
    [
        0,
        "&minus;"
    ],
    [
        0,
        "&MinusPlus;"
    ],
    [
        0,
        "&dotplus;"
    ],
    [
        1,
        "&Backslash;"
    ],
    [
        0,
        "&lowast;"
    ],
    [
        0,
        "&compfn;"
    ],
    [
        1,
        "&radic;"
    ],
    [
        2,
        "&prop;"
    ],
    [
        0,
        "&infin;"
    ],
    [
        0,
        "&angrt;"
    ],
    [
        0,
        {
            v: "&ang;",
            n: 8402,
            o: "&nang;"
        }
    ],
    [
        0,
        "&angmsd;"
    ],
    [
        0,
        "&angsph;"
    ],
    [
        0,
        "&mid;"
    ],
    [
        0,
        "&nmid;"
    ],
    [
        0,
        "&DoubleVerticalBar;"
    ],
    [
        0,
        "&NotDoubleVerticalBar;"
    ],
    [
        0,
        "&and;"
    ],
    [
        0,
        "&or;"
    ],
    [
        0,
        {
            v: "&cap;",
            n: 65024,
            o: "&caps;"
        }
    ],
    [
        0,
        {
            v: "&cup;",
            n: 65024,
            o: "&cups;"
        }
    ],
    [
        0,
        "&int;"
    ],
    [
        0,
        "&Int;"
    ],
    [
        0,
        "&iiint;"
    ],
    [
        0,
        "&conint;"
    ],
    [
        0,
        "&Conint;"
    ],
    [
        0,
        "&Cconint;"
    ],
    [
        0,
        "&cwint;"
    ],
    [
        0,
        "&ClockwiseContourIntegral;"
    ],
    [
        0,
        "&awconint;"
    ],
    [
        0,
        "&there4;"
    ],
    [
        0,
        "&becaus;"
    ],
    [
        0,
        "&ratio;"
    ],
    [
        0,
        "&Colon;"
    ],
    [
        0,
        "&dotminus;"
    ],
    [
        1,
        "&mDDot;"
    ],
    [
        0,
        "&homtht;"
    ],
    [
        0,
        {
            v: "&sim;",
            n: 8402,
            o: "&nvsim;"
        }
    ],
    [
        0,
        {
            v: "&backsim;",
            n: 817,
            o: "&race;"
        }
    ],
    [
        0,
        {
            v: "&ac;",
            n: 819,
            o: "&acE;"
        }
    ],
    [
        0,
        "&acd;"
    ],
    [
        0,
        "&VerticalTilde;"
    ],
    [
        0,
        "&NotTilde;"
    ],
    [
        0,
        {
            v: "&eqsim;",
            n: 824,
            o: "&nesim;"
        }
    ],
    [
        0,
        "&sime;"
    ],
    [
        0,
        "&NotTildeEqual;"
    ],
    [
        0,
        "&cong;"
    ],
    [
        0,
        "&simne;"
    ],
    [
        0,
        "&ncong;"
    ],
    [
        0,
        "&ap;"
    ],
    [
        0,
        "&nap;"
    ],
    [
        0,
        "&ape;"
    ],
    [
        0,
        {
            v: "&apid;",
            n: 824,
            o: "&napid;"
        }
    ],
    [
        0,
        "&backcong;"
    ],
    [
        0,
        {
            v: "&asympeq;",
            n: 8402,
            o: "&nvap;"
        }
    ],
    [
        0,
        {
            v: "&bump;",
            n: 824,
            o: "&nbump;"
        }
    ],
    [
        0,
        {
            v: "&bumpe;",
            n: 824,
            o: "&nbumpe;"
        }
    ],
    [
        0,
        {
            v: "&doteq;",
            n: 824,
            o: "&nedot;"
        }
    ],
    [
        0,
        "&doteqdot;"
    ],
    [
        0,
        "&efDot;"
    ],
    [
        0,
        "&erDot;"
    ],
    [
        0,
        "&Assign;"
    ],
    [
        0,
        "&ecolon;"
    ],
    [
        0,
        "&ecir;"
    ],
    [
        0,
        "&circeq;"
    ],
    [
        1,
        "&wedgeq;"
    ],
    [
        0,
        "&veeeq;"
    ],
    [
        1,
        "&triangleq;"
    ],
    [
        2,
        "&equest;"
    ],
    [
        0,
        "&ne;"
    ],
    [
        0,
        {
            v: "&Congruent;",
            n: 8421,
            o: "&bnequiv;"
        }
    ],
    [
        0,
        "&nequiv;"
    ],
    [
        1,
        {
            v: "&le;",
            n: 8402,
            o: "&nvle;"
        }
    ],
    [
        0,
        {
            v: "&ge;",
            n: 8402,
            o: "&nvge;"
        }
    ],
    [
        0,
        {
            v: "&lE;",
            n: 824,
            o: "&nlE;"
        }
    ],
    [
        0,
        {
            v: "&gE;",
            n: 824,
            o: "&ngE;"
        }
    ],
    [
        0,
        {
            v: "&lnE;",
            n: 65024,
            o: "&lvertneqq;"
        }
    ],
    [
        0,
        {
            v: "&gnE;",
            n: 65024,
            o: "&gvertneqq;"
        }
    ],
    [
        0,
        {
            v: "&ll;",
            n: new Map(/* #__PURE__ */ restoreDiff([
                [
                    824,
                    "&nLtv;"
                ],
                [
                    7577,
                    "&nLt;"
                ]
            ]))
        }
    ],
    [
        0,
        {
            v: "&gg;",
            n: new Map(/* #__PURE__ */ restoreDiff([
                [
                    824,
                    "&nGtv;"
                ],
                [
                    7577,
                    "&nGt;"
                ]
            ]))
        }
    ],
    [
        0,
        "&between;"
    ],
    [
        0,
        "&NotCupCap;"
    ],
    [
        0,
        "&nless;"
    ],
    [
        0,
        "&ngt;"
    ],
    [
        0,
        "&nle;"
    ],
    [
        0,
        "&nge;"
    ],
    [
        0,
        "&lesssim;"
    ],
    [
        0,
        "&GreaterTilde;"
    ],
    [
        0,
        "&nlsim;"
    ],
    [
        0,
        "&ngsim;"
    ],
    [
        0,
        "&LessGreater;"
    ],
    [
        0,
        "&gl;"
    ],
    [
        0,
        "&NotLessGreater;"
    ],
    [
        0,
        "&NotGreaterLess;"
    ],
    [
        0,
        "&pr;"
    ],
    [
        0,
        "&sc;"
    ],
    [
        0,
        "&prcue;"
    ],
    [
        0,
        "&sccue;"
    ],
    [
        0,
        "&PrecedesTilde;"
    ],
    [
        0,
        {
            v: "&scsim;",
            n: 824,
            o: "&NotSucceedsTilde;"
        }
    ],
    [
        0,
        "&NotPrecedes;"
    ],
    [
        0,
        "&NotSucceeds;"
    ],
    [
        0,
        {
            v: "&sub;",
            n: 8402,
            o: "&NotSubset;"
        }
    ],
    [
        0,
        {
            v: "&sup;",
            n: 8402,
            o: "&NotSuperset;"
        }
    ],
    [
        0,
        "&nsub;"
    ],
    [
        0,
        "&nsup;"
    ],
    [
        0,
        "&sube;"
    ],
    [
        0,
        "&supe;"
    ],
    [
        0,
        "&NotSubsetEqual;"
    ],
    [
        0,
        "&NotSupersetEqual;"
    ],
    [
        0,
        {
            v: "&subne;",
            n: 65024,
            o: "&varsubsetneq;"
        }
    ],
    [
        0,
        {
            v: "&supne;",
            n: 65024,
            o: "&varsupsetneq;"
        }
    ],
    [
        1,
        "&cupdot;"
    ],
    [
        0,
        "&UnionPlus;"
    ],
    [
        0,
        {
            v: "&sqsub;",
            n: 824,
            o: "&NotSquareSubset;"
        }
    ],
    [
        0,
        {
            v: "&sqsup;",
            n: 824,
            o: "&NotSquareSuperset;"
        }
    ],
    [
        0,
        "&sqsube;"
    ],
    [
        0,
        "&sqsupe;"
    ],
    [
        0,
        {
            v: "&sqcap;",
            n: 65024,
            o: "&sqcaps;"
        }
    ],
    [
        0,
        {
            v: "&sqcup;",
            n: 65024,
            o: "&sqcups;"
        }
    ],
    [
        0,
        "&CirclePlus;"
    ],
    [
        0,
        "&CircleMinus;"
    ],
    [
        0,
        "&CircleTimes;"
    ],
    [
        0,
        "&osol;"
    ],
    [
        0,
        "&CircleDot;"
    ],
    [
        0,
        "&circledcirc;"
    ],
    [
        0,
        "&circledast;"
    ],
    [
        1,
        "&circleddash;"
    ],
    [
        0,
        "&boxplus;"
    ],
    [
        0,
        "&boxminus;"
    ],
    [
        0,
        "&boxtimes;"
    ],
    [
        0,
        "&dotsquare;"
    ],
    [
        0,
        "&RightTee;"
    ],
    [
        0,
        "&dashv;"
    ],
    [
        0,
        "&DownTee;"
    ],
    [
        0,
        "&bot;"
    ],
    [
        1,
        "&models;"
    ],
    [
        0,
        "&DoubleRightTee;"
    ],
    [
        0,
        "&Vdash;"
    ],
    [
        0,
        "&Vvdash;"
    ],
    [
        0,
        "&VDash;"
    ],
    [
        0,
        "&nvdash;"
    ],
    [
        0,
        "&nvDash;"
    ],
    [
        0,
        "&nVdash;"
    ],
    [
        0,
        "&nVDash;"
    ],
    [
        0,
        "&prurel;"
    ],
    [
        1,
        "&LeftTriangle;"
    ],
    [
        0,
        "&RightTriangle;"
    ],
    [
        0,
        {
            v: "&LeftTriangleEqual;",
            n: 8402,
            o: "&nvltrie;"
        }
    ],
    [
        0,
        {
            v: "&RightTriangleEqual;",
            n: 8402,
            o: "&nvrtrie;"
        }
    ],
    [
        0,
        "&origof;"
    ],
    [
        0,
        "&imof;"
    ],
    [
        0,
        "&multimap;"
    ],
    [
        0,
        "&hercon;"
    ],
    [
        0,
        "&intcal;"
    ],
    [
        0,
        "&veebar;"
    ],
    [
        1,
        "&barvee;"
    ],
    [
        0,
        "&angrtvb;"
    ],
    [
        0,
        "&lrtri;"
    ],
    [
        0,
        "&bigwedge;"
    ],
    [
        0,
        "&bigvee;"
    ],
    [
        0,
        "&bigcap;"
    ],
    [
        0,
        "&bigcup;"
    ],
    [
        0,
        "&diam;"
    ],
    [
        0,
        "&sdot;"
    ],
    [
        0,
        "&sstarf;"
    ],
    [
        0,
        "&divideontimes;"
    ],
    [
        0,
        "&bowtie;"
    ],
    [
        0,
        "&ltimes;"
    ],
    [
        0,
        "&rtimes;"
    ],
    [
        0,
        "&leftthreetimes;"
    ],
    [
        0,
        "&rightthreetimes;"
    ],
    [
        0,
        "&backsimeq;"
    ],
    [
        0,
        "&curlyvee;"
    ],
    [
        0,
        "&curlywedge;"
    ],
    [
        0,
        "&Sub;"
    ],
    [
        0,
        "&Sup;"
    ],
    [
        0,
        "&Cap;"
    ],
    [
        0,
        "&Cup;"
    ],
    [
        0,
        "&fork;"
    ],
    [
        0,
        "&epar;"
    ],
    [
        0,
        "&lessdot;"
    ],
    [
        0,
        "&gtdot;"
    ],
    [
        0,
        {
            v: "&Ll;",
            n: 824,
            o: "&nLl;"
        }
    ],
    [
        0,
        {
            v: "&Gg;",
            n: 824,
            o: "&nGg;"
        }
    ],
    [
        0,
        {
            v: "&leg;",
            n: 65024,
            o: "&lesg;"
        }
    ],
    [
        0,
        {
            v: "&gel;",
            n: 65024,
            o: "&gesl;"
        }
    ],
    [
        2,
        "&cuepr;"
    ],
    [
        0,
        "&cuesc;"
    ],
    [
        0,
        "&NotPrecedesSlantEqual;"
    ],
    [
        0,
        "&NotSucceedsSlantEqual;"
    ],
    [
        0,
        "&NotSquareSubsetEqual;"
    ],
    [
        0,
        "&NotSquareSupersetEqual;"
    ],
    [
        2,
        "&lnsim;"
    ],
    [
        0,
        "&gnsim;"
    ],
    [
        0,
        "&precnsim;"
    ],
    [
        0,
        "&scnsim;"
    ],
    [
        0,
        "&nltri;"
    ],
    [
        0,
        "&NotRightTriangle;"
    ],
    [
        0,
        "&nltrie;"
    ],
    [
        0,
        "&NotRightTriangleEqual;"
    ],
    [
        0,
        "&vellip;"
    ],
    [
        0,
        "&ctdot;"
    ],
    [
        0,
        "&utdot;"
    ],
    [
        0,
        "&dtdot;"
    ],
    [
        0,
        "&disin;"
    ],
    [
        0,
        "&isinsv;"
    ],
    [
        0,
        "&isins;"
    ],
    [
        0,
        {
            v: "&isindot;",
            n: 824,
            o: "&notindot;"
        }
    ],
    [
        0,
        "&notinvc;"
    ],
    [
        0,
        "&notinvb;"
    ],
    [
        1,
        {
            v: "&isinE;",
            n: 824,
            o: "&notinE;"
        }
    ],
    [
        0,
        "&nisd;"
    ],
    [
        0,
        "&xnis;"
    ],
    [
        0,
        "&nis;"
    ],
    [
        0,
        "&notnivc;"
    ],
    [
        0,
        "&notnivb;"
    ],
    [
        6,
        "&barwed;"
    ],
    [
        0,
        "&Barwed;"
    ],
    [
        1,
        "&lceil;"
    ],
    [
        0,
        "&rceil;"
    ],
    [
        0,
        "&LeftFloor;"
    ],
    [
        0,
        "&rfloor;"
    ],
    [
        0,
        "&drcrop;"
    ],
    [
        0,
        "&dlcrop;"
    ],
    [
        0,
        "&urcrop;"
    ],
    [
        0,
        "&ulcrop;"
    ],
    [
        0,
        "&bnot;"
    ],
    [
        1,
        "&profline;"
    ],
    [
        0,
        "&profsurf;"
    ],
    [
        1,
        "&telrec;"
    ],
    [
        0,
        "&target;"
    ],
    [
        5,
        "&ulcorn;"
    ],
    [
        0,
        "&urcorn;"
    ],
    [
        0,
        "&dlcorn;"
    ],
    [
        0,
        "&drcorn;"
    ],
    [
        2,
        "&frown;"
    ],
    [
        0,
        "&smile;"
    ],
    [
        9,
        "&cylcty;"
    ],
    [
        0,
        "&profalar;"
    ],
    [
        7,
        "&topbot;"
    ],
    [
        6,
        "&ovbar;"
    ],
    [
        1,
        "&solbar;"
    ],
    [
        60,
        "&angzarr;"
    ],
    [
        51,
        "&lmoustache;"
    ],
    [
        0,
        "&rmoustache;"
    ],
    [
        2,
        "&OverBracket;"
    ],
    [
        0,
        "&bbrk;"
    ],
    [
        0,
        "&bbrktbrk;"
    ],
    [
        37,
        "&OverParenthesis;"
    ],
    [
        0,
        "&UnderParenthesis;"
    ],
    [
        0,
        "&OverBrace;"
    ],
    [
        0,
        "&UnderBrace;"
    ],
    [
        2,
        "&trpezium;"
    ],
    [
        4,
        "&elinters;"
    ],
    [
        59,
        "&blank;"
    ],
    [
        164,
        "&circledS;"
    ],
    [
        55,
        "&boxh;"
    ],
    [
        1,
        "&boxv;"
    ],
    [
        9,
        "&boxdr;"
    ],
    [
        3,
        "&boxdl;"
    ],
    [
        3,
        "&boxur;"
    ],
    [
        3,
        "&boxul;"
    ],
    [
        3,
        "&boxvr;"
    ],
    [
        7,
        "&boxvl;"
    ],
    [
        7,
        "&boxhd;"
    ],
    [
        7,
        "&boxhu;"
    ],
    [
        7,
        "&boxvh;"
    ],
    [
        19,
        "&boxH;"
    ],
    [
        0,
        "&boxV;"
    ],
    [
        0,
        "&boxdR;"
    ],
    [
        0,
        "&boxDr;"
    ],
    [
        0,
        "&boxDR;"
    ],
    [
        0,
        "&boxdL;"
    ],
    [
        0,
        "&boxDl;"
    ],
    [
        0,
        "&boxDL;"
    ],
    [
        0,
        "&boxuR;"
    ],
    [
        0,
        "&boxUr;"
    ],
    [
        0,
        "&boxUR;"
    ],
    [
        0,
        "&boxuL;"
    ],
    [
        0,
        "&boxUl;"
    ],
    [
        0,
        "&boxUL;"
    ],
    [
        0,
        "&boxvR;"
    ],
    [
        0,
        "&boxVr;"
    ],
    [
        0,
        "&boxVR;"
    ],
    [
        0,
        "&boxvL;"
    ],
    [
        0,
        "&boxVl;"
    ],
    [
        0,
        "&boxVL;"
    ],
    [
        0,
        "&boxHd;"
    ],
    [
        0,
        "&boxhD;"
    ],
    [
        0,
        "&boxHD;"
    ],
    [
        0,
        "&boxHu;"
    ],
    [
        0,
        "&boxhU;"
    ],
    [
        0,
        "&boxHU;"
    ],
    [
        0,
        "&boxvH;"
    ],
    [
        0,
        "&boxVh;"
    ],
    [
        0,
        "&boxVH;"
    ],
    [
        19,
        "&uhblk;"
    ],
    [
        3,
        "&lhblk;"
    ],
    [
        3,
        "&block;"
    ],
    [
        8,
        "&blk14;"
    ],
    [
        0,
        "&blk12;"
    ],
    [
        0,
        "&blk34;"
    ],
    [
        13,
        "&square;"
    ],
    [
        8,
        "&blacksquare;"
    ],
    [
        0,
        "&EmptyVerySmallSquare;"
    ],
    [
        1,
        "&rect;"
    ],
    [
        0,
        "&marker;"
    ],
    [
        2,
        "&fltns;"
    ],
    [
        1,
        "&bigtriangleup;"
    ],
    [
        0,
        "&blacktriangle;"
    ],
    [
        0,
        "&triangle;"
    ],
    [
        2,
        "&blacktriangleright;"
    ],
    [
        0,
        "&rtri;"
    ],
    [
        3,
        "&bigtriangledown;"
    ],
    [
        0,
        "&blacktriangledown;"
    ],
    [
        0,
        "&dtri;"
    ],
    [
        2,
        "&blacktriangleleft;"
    ],
    [
        0,
        "&ltri;"
    ],
    [
        6,
        "&loz;"
    ],
    [
        0,
        "&cir;"
    ],
    [
        32,
        "&tridot;"
    ],
    [
        2,
        "&bigcirc;"
    ],
    [
        8,
        "&ultri;"
    ],
    [
        0,
        "&urtri;"
    ],
    [
        0,
        "&lltri;"
    ],
    [
        0,
        "&EmptySmallSquare;"
    ],
    [
        0,
        "&FilledSmallSquare;"
    ],
    [
        8,
        "&bigstar;"
    ],
    [
        0,
        "&star;"
    ],
    [
        7,
        "&phone;"
    ],
    [
        49,
        "&female;"
    ],
    [
        1,
        "&male;"
    ],
    [
        29,
        "&spades;"
    ],
    [
        2,
        "&clubs;"
    ],
    [
        1,
        "&hearts;"
    ],
    [
        0,
        "&diamondsuit;"
    ],
    [
        3,
        "&sung;"
    ],
    [
        2,
        "&flat;"
    ],
    [
        0,
        "&natural;"
    ],
    [
        0,
        "&sharp;"
    ],
    [
        163,
        "&check;"
    ],
    [
        3,
        "&cross;"
    ],
    [
        8,
        "&malt;"
    ],
    [
        21,
        "&sext;"
    ],
    [
        33,
        "&VerticalSeparator;"
    ],
    [
        25,
        "&lbbrk;"
    ],
    [
        0,
        "&rbbrk;"
    ],
    [
        84,
        "&bsolhsub;"
    ],
    [
        0,
        "&suphsol;"
    ],
    [
        28,
        "&LeftDoubleBracket;"
    ],
    [
        0,
        "&RightDoubleBracket;"
    ],
    [
        0,
        "&lang;"
    ],
    [
        0,
        "&rang;"
    ],
    [
        0,
        "&Lang;"
    ],
    [
        0,
        "&Rang;"
    ],
    [
        0,
        "&loang;"
    ],
    [
        0,
        "&roang;"
    ],
    [
        7,
        "&longleftarrow;"
    ],
    [
        0,
        "&longrightarrow;"
    ],
    [
        0,
        "&longleftrightarrow;"
    ],
    [
        0,
        "&DoubleLongLeftArrow;"
    ],
    [
        0,
        "&DoubleLongRightArrow;"
    ],
    [
        0,
        "&DoubleLongLeftRightArrow;"
    ],
    [
        1,
        "&longmapsto;"
    ],
    [
        2,
        "&dzigrarr;"
    ],
    [
        258,
        "&nvlArr;"
    ],
    [
        0,
        "&nvrArr;"
    ],
    [
        0,
        "&nvHarr;"
    ],
    [
        0,
        "&Map;"
    ],
    [
        6,
        "&lbarr;"
    ],
    [
        0,
        "&bkarow;"
    ],
    [
        0,
        "&lBarr;"
    ],
    [
        0,
        "&dbkarow;"
    ],
    [
        0,
        "&drbkarow;"
    ],
    [
        0,
        "&DDotrahd;"
    ],
    [
        0,
        "&UpArrowBar;"
    ],
    [
        0,
        "&DownArrowBar;"
    ],
    [
        2,
        "&Rarrtl;"
    ],
    [
        2,
        "&latail;"
    ],
    [
        0,
        "&ratail;"
    ],
    [
        0,
        "&lAtail;"
    ],
    [
        0,
        "&rAtail;"
    ],
    [
        0,
        "&larrfs;"
    ],
    [
        0,
        "&rarrfs;"
    ],
    [
        0,
        "&larrbfs;"
    ],
    [
        0,
        "&rarrbfs;"
    ],
    [
        2,
        "&nwarhk;"
    ],
    [
        0,
        "&nearhk;"
    ],
    [
        0,
        "&hksearow;"
    ],
    [
        0,
        "&hkswarow;"
    ],
    [
        0,
        "&nwnear;"
    ],
    [
        0,
        "&nesear;"
    ],
    [
        0,
        "&seswar;"
    ],
    [
        0,
        "&swnwar;"
    ],
    [
        8,
        {
            v: "&rarrc;",
            n: 824,
            o: "&nrarrc;"
        }
    ],
    [
        1,
        "&cudarrr;"
    ],
    [
        0,
        "&ldca;"
    ],
    [
        0,
        "&rdca;"
    ],
    [
        0,
        "&cudarrl;"
    ],
    [
        0,
        "&larrpl;"
    ],
    [
        2,
        "&curarrm;"
    ],
    [
        0,
        "&cularrp;"
    ],
    [
        7,
        "&rarrpl;"
    ],
    [
        2,
        "&harrcir;"
    ],
    [
        0,
        "&Uarrocir;"
    ],
    [
        0,
        "&lurdshar;"
    ],
    [
        0,
        "&ldrushar;"
    ],
    [
        2,
        "&LeftRightVector;"
    ],
    [
        0,
        "&RightUpDownVector;"
    ],
    [
        0,
        "&DownLeftRightVector;"
    ],
    [
        0,
        "&LeftUpDownVector;"
    ],
    [
        0,
        "&LeftVectorBar;"
    ],
    [
        0,
        "&RightVectorBar;"
    ],
    [
        0,
        "&RightUpVectorBar;"
    ],
    [
        0,
        "&RightDownVectorBar;"
    ],
    [
        0,
        "&DownLeftVectorBar;"
    ],
    [
        0,
        "&DownRightVectorBar;"
    ],
    [
        0,
        "&LeftUpVectorBar;"
    ],
    [
        0,
        "&LeftDownVectorBar;"
    ],
    [
        0,
        "&LeftTeeVector;"
    ],
    [
        0,
        "&RightTeeVector;"
    ],
    [
        0,
        "&RightUpTeeVector;"
    ],
    [
        0,
        "&RightDownTeeVector;"
    ],
    [
        0,
        "&DownLeftTeeVector;"
    ],
    [
        0,
        "&DownRightTeeVector;"
    ],
    [
        0,
        "&LeftUpTeeVector;"
    ],
    [
        0,
        "&LeftDownTeeVector;"
    ],
    [
        0,
        "&lHar;"
    ],
    [
        0,
        "&uHar;"
    ],
    [
        0,
        "&rHar;"
    ],
    [
        0,
        "&dHar;"
    ],
    [
        0,
        "&luruhar;"
    ],
    [
        0,
        "&ldrdhar;"
    ],
    [
        0,
        "&ruluhar;"
    ],
    [
        0,
        "&rdldhar;"
    ],
    [
        0,
        "&lharul;"
    ],
    [
        0,
        "&llhard;"
    ],
    [
        0,
        "&rharul;"
    ],
    [
        0,
        "&lrhard;"
    ],
    [
        0,
        "&udhar;"
    ],
    [
        0,
        "&duhar;"
    ],
    [
        0,
        "&RoundImplies;"
    ],
    [
        0,
        "&erarr;"
    ],
    [
        0,
        "&simrarr;"
    ],
    [
        0,
        "&larrsim;"
    ],
    [
        0,
        "&rarrsim;"
    ],
    [
        0,
        "&rarrap;"
    ],
    [
        0,
        "&ltlarr;"
    ],
    [
        1,
        "&gtrarr;"
    ],
    [
        0,
        "&subrarr;"
    ],
    [
        1,
        "&suplarr;"
    ],
    [
        0,
        "&lfisht;"
    ],
    [
        0,
        "&rfisht;"
    ],
    [
        0,
        "&ufisht;"
    ],
    [
        0,
        "&dfisht;"
    ],
    [
        5,
        "&lopar;"
    ],
    [
        0,
        "&ropar;"
    ],
    [
        4,
        "&lbrke;"
    ],
    [
        0,
        "&rbrke;"
    ],
    [
        0,
        "&lbrkslu;"
    ],
    [
        0,
        "&rbrksld;"
    ],
    [
        0,
        "&lbrksld;"
    ],
    [
        0,
        "&rbrkslu;"
    ],
    [
        0,
        "&langd;"
    ],
    [
        0,
        "&rangd;"
    ],
    [
        0,
        "&lparlt;"
    ],
    [
        0,
        "&rpargt;"
    ],
    [
        0,
        "&gtlPar;"
    ],
    [
        0,
        "&ltrPar;"
    ],
    [
        3,
        "&vzigzag;"
    ],
    [
        1,
        "&vangrt;"
    ],
    [
        0,
        "&angrtvbd;"
    ],
    [
        6,
        "&ange;"
    ],
    [
        0,
        "&range;"
    ],
    [
        0,
        "&dwangle;"
    ],
    [
        0,
        "&uwangle;"
    ],
    [
        0,
        "&angmsdaa;"
    ],
    [
        0,
        "&angmsdab;"
    ],
    [
        0,
        "&angmsdac;"
    ],
    [
        0,
        "&angmsdad;"
    ],
    [
        0,
        "&angmsdae;"
    ],
    [
        0,
        "&angmsdaf;"
    ],
    [
        0,
        "&angmsdag;"
    ],
    [
        0,
        "&angmsdah;"
    ],
    [
        0,
        "&bemptyv;"
    ],
    [
        0,
        "&demptyv;"
    ],
    [
        0,
        "&cemptyv;"
    ],
    [
        0,
        "&raemptyv;"
    ],
    [
        0,
        "&laemptyv;"
    ],
    [
        0,
        "&ohbar;"
    ],
    [
        0,
        "&omid;"
    ],
    [
        0,
        "&opar;"
    ],
    [
        1,
        "&operp;"
    ],
    [
        1,
        "&olcross;"
    ],
    [
        0,
        "&odsold;"
    ],
    [
        1,
        "&olcir;"
    ],
    [
        0,
        "&ofcir;"
    ],
    [
        0,
        "&olt;"
    ],
    [
        0,
        "&ogt;"
    ],
    [
        0,
        "&cirscir;"
    ],
    [
        0,
        "&cirE;"
    ],
    [
        0,
        "&solb;"
    ],
    [
        0,
        "&bsolb;"
    ],
    [
        3,
        "&boxbox;"
    ],
    [
        3,
        "&trisb;"
    ],
    [
        0,
        "&rtriltri;"
    ],
    [
        0,
        {
            v: "&LeftTriangleBar;",
            n: 824,
            o: "&NotLeftTriangleBar;"
        }
    ],
    [
        0,
        {
            v: "&RightTriangleBar;",
            n: 824,
            o: "&NotRightTriangleBar;"
        }
    ],
    [
        11,
        "&iinfin;"
    ],
    [
        0,
        "&infintie;"
    ],
    [
        0,
        "&nvinfin;"
    ],
    [
        4,
        "&eparsl;"
    ],
    [
        0,
        "&smeparsl;"
    ],
    [
        0,
        "&eqvparsl;"
    ],
    [
        5,
        "&blacklozenge;"
    ],
    [
        8,
        "&RuleDelayed;"
    ],
    [
        1,
        "&dsol;"
    ],
    [
        9,
        "&bigodot;"
    ],
    [
        0,
        "&bigoplus;"
    ],
    [
        0,
        "&bigotimes;"
    ],
    [
        1,
        "&biguplus;"
    ],
    [
        1,
        "&bigsqcup;"
    ],
    [
        5,
        "&iiiint;"
    ],
    [
        0,
        "&fpartint;"
    ],
    [
        2,
        "&cirfnint;"
    ],
    [
        0,
        "&awint;"
    ],
    [
        0,
        "&rppolint;"
    ],
    [
        0,
        "&scpolint;"
    ],
    [
        0,
        "&npolint;"
    ],
    [
        0,
        "&pointint;"
    ],
    [
        0,
        "&quatint;"
    ],
    [
        0,
        "&intlarhk;"
    ],
    [
        10,
        "&pluscir;"
    ],
    [
        0,
        "&plusacir;"
    ],
    [
        0,
        "&simplus;"
    ],
    [
        0,
        "&plusdu;"
    ],
    [
        0,
        "&plussim;"
    ],
    [
        0,
        "&plustwo;"
    ],
    [
        1,
        "&mcomma;"
    ],
    [
        0,
        "&minusdu;"
    ],
    [
        2,
        "&loplus;"
    ],
    [
        0,
        "&roplus;"
    ],
    [
        0,
        "&Cross;"
    ],
    [
        0,
        "&timesd;"
    ],
    [
        0,
        "&timesbar;"
    ],
    [
        1,
        "&smashp;"
    ],
    [
        0,
        "&lotimes;"
    ],
    [
        0,
        "&rotimes;"
    ],
    [
        0,
        "&otimesas;"
    ],
    [
        0,
        "&Otimes;"
    ],
    [
        0,
        "&odiv;"
    ],
    [
        0,
        "&triplus;"
    ],
    [
        0,
        "&triminus;"
    ],
    [
        0,
        "&tritime;"
    ],
    [
        0,
        "&intprod;"
    ],
    [
        2,
        "&amalg;"
    ],
    [
        0,
        "&capdot;"
    ],
    [
        1,
        "&ncup;"
    ],
    [
        0,
        "&ncap;"
    ],
    [
        0,
        "&capand;"
    ],
    [
        0,
        "&cupor;"
    ],
    [
        0,
        "&cupcap;"
    ],
    [
        0,
        "&capcup;"
    ],
    [
        0,
        "&cupbrcap;"
    ],
    [
        0,
        "&capbrcup;"
    ],
    [
        0,
        "&cupcup;"
    ],
    [
        0,
        "&capcap;"
    ],
    [
        0,
        "&ccups;"
    ],
    [
        0,
        "&ccaps;"
    ],
    [
        2,
        "&ccupssm;"
    ],
    [
        2,
        "&And;"
    ],
    [
        0,
        "&Or;"
    ],
    [
        0,
        "&andand;"
    ],
    [
        0,
        "&oror;"
    ],
    [
        0,
        "&orslope;"
    ],
    [
        0,
        "&andslope;"
    ],
    [
        1,
        "&andv;"
    ],
    [
        0,
        "&orv;"
    ],
    [
        0,
        "&andd;"
    ],
    [
        0,
        "&ord;"
    ],
    [
        1,
        "&wedbar;"
    ],
    [
        6,
        "&sdote;"
    ],
    [
        3,
        "&simdot;"
    ],
    [
        2,
        {
            v: "&congdot;",
            n: 824,
            o: "&ncongdot;"
        }
    ],
    [
        0,
        "&easter;"
    ],
    [
        0,
        "&apacir;"
    ],
    [
        0,
        {
            v: "&apE;",
            n: 824,
            o: "&napE;"
        }
    ],
    [
        0,
        "&eplus;"
    ],
    [
        0,
        "&pluse;"
    ],
    [
        0,
        "&Esim;"
    ],
    [
        0,
        "&Colone;"
    ],
    [
        0,
        "&Equal;"
    ],
    [
        1,
        "&ddotseq;"
    ],
    [
        0,
        "&equivDD;"
    ],
    [
        0,
        "&ltcir;"
    ],
    [
        0,
        "&gtcir;"
    ],
    [
        0,
        "&ltquest;"
    ],
    [
        0,
        "&gtquest;"
    ],
    [
        0,
        {
            v: "&leqslant;",
            n: 824,
            o: "&nleqslant;"
        }
    ],
    [
        0,
        {
            v: "&geqslant;",
            n: 824,
            o: "&ngeqslant;"
        }
    ],
    [
        0,
        "&lesdot;"
    ],
    [
        0,
        "&gesdot;"
    ],
    [
        0,
        "&lesdoto;"
    ],
    [
        0,
        "&gesdoto;"
    ],
    [
        0,
        "&lesdotor;"
    ],
    [
        0,
        "&gesdotol;"
    ],
    [
        0,
        "&lap;"
    ],
    [
        0,
        "&gap;"
    ],
    [
        0,
        "&lne;"
    ],
    [
        0,
        "&gne;"
    ],
    [
        0,
        "&lnap;"
    ],
    [
        0,
        "&gnap;"
    ],
    [
        0,
        "&lEg;"
    ],
    [
        0,
        "&gEl;"
    ],
    [
        0,
        "&lsime;"
    ],
    [
        0,
        "&gsime;"
    ],
    [
        0,
        "&lsimg;"
    ],
    [
        0,
        "&gsiml;"
    ],
    [
        0,
        "&lgE;"
    ],
    [
        0,
        "&glE;"
    ],
    [
        0,
        "&lesges;"
    ],
    [
        0,
        "&gesles;"
    ],
    [
        0,
        "&els;"
    ],
    [
        0,
        "&egs;"
    ],
    [
        0,
        "&elsdot;"
    ],
    [
        0,
        "&egsdot;"
    ],
    [
        0,
        "&el;"
    ],
    [
        0,
        "&eg;"
    ],
    [
        2,
        "&siml;"
    ],
    [
        0,
        "&simg;"
    ],
    [
        0,
        "&simlE;"
    ],
    [
        0,
        "&simgE;"
    ],
    [
        0,
        {
            v: "&LessLess;",
            n: 824,
            o: "&NotNestedLessLess;"
        }
    ],
    [
        0,
        {
            v: "&GreaterGreater;",
            n: 824,
            o: "&NotNestedGreaterGreater;"
        }
    ],
    [
        1,
        "&glj;"
    ],
    [
        0,
        "&gla;"
    ],
    [
        0,
        "&ltcc;"
    ],
    [
        0,
        "&gtcc;"
    ],
    [
        0,
        "&lescc;"
    ],
    [
        0,
        "&gescc;"
    ],
    [
        0,
        "&smt;"
    ],
    [
        0,
        "&lat;"
    ],
    [
        0,
        {
            v: "&smte;",
            n: 65024,
            o: "&smtes;"
        }
    ],
    [
        0,
        {
            v: "&late;",
            n: 65024,
            o: "&lates;"
        }
    ],
    [
        0,
        "&bumpE;"
    ],
    [
        0,
        {
            v: "&PrecedesEqual;",
            n: 824,
            o: "&NotPrecedesEqual;"
        }
    ],
    [
        0,
        {
            v: "&sce;",
            n: 824,
            o: "&NotSucceedsEqual;"
        }
    ],
    [
        2,
        "&prE;"
    ],
    [
        0,
        "&scE;"
    ],
    [
        0,
        "&precneqq;"
    ],
    [
        0,
        "&scnE;"
    ],
    [
        0,
        "&prap;"
    ],
    [
        0,
        "&scap;"
    ],
    [
        0,
        "&precnapprox;"
    ],
    [
        0,
        "&scnap;"
    ],
    [
        0,
        "&Pr;"
    ],
    [
        0,
        "&Sc;"
    ],
    [
        0,
        "&subdot;"
    ],
    [
        0,
        "&supdot;"
    ],
    [
        0,
        "&subplus;"
    ],
    [
        0,
        "&supplus;"
    ],
    [
        0,
        "&submult;"
    ],
    [
        0,
        "&supmult;"
    ],
    [
        0,
        "&subedot;"
    ],
    [
        0,
        "&supedot;"
    ],
    [
        0,
        {
            v: "&subE;",
            n: 824,
            o: "&nsubE;"
        }
    ],
    [
        0,
        {
            v: "&supE;",
            n: 824,
            o: "&nsupE;"
        }
    ],
    [
        0,
        "&subsim;"
    ],
    [
        0,
        "&supsim;"
    ],
    [
        2,
        {
            v: "&subnE;",
            n: 65024,
            o: "&varsubsetneqq;"
        }
    ],
    [
        0,
        {
            v: "&supnE;",
            n: 65024,
            o: "&varsupsetneqq;"
        }
    ],
    [
        2,
        "&csub;"
    ],
    [
        0,
        "&csup;"
    ],
    [
        0,
        "&csube;"
    ],
    [
        0,
        "&csupe;"
    ],
    [
        0,
        "&subsup;"
    ],
    [
        0,
        "&supsub;"
    ],
    [
        0,
        "&subsub;"
    ],
    [
        0,
        "&supsup;"
    ],
    [
        0,
        "&suphsub;"
    ],
    [
        0,
        "&supdsub;"
    ],
    [
        0,
        "&forkv;"
    ],
    [
        0,
        "&topfork;"
    ],
    [
        0,
        "&mlcp;"
    ],
    [
        8,
        "&Dashv;"
    ],
    [
        1,
        "&Vdashl;"
    ],
    [
        0,
        "&Barv;"
    ],
    [
        0,
        "&vBar;"
    ],
    [
        0,
        "&vBarv;"
    ],
    [
        1,
        "&Vbar;"
    ],
    [
        0,
        "&Not;"
    ],
    [
        0,
        "&bNot;"
    ],
    [
        0,
        "&rnmid;"
    ],
    [
        0,
        "&cirmid;"
    ],
    [
        0,
        "&midcir;"
    ],
    [
        0,
        "&topcir;"
    ],
    [
        0,
        "&nhpar;"
    ],
    [
        0,
        "&parsim;"
    ],
    [
        9,
        {
            v: "&parsl;",
            n: 8421,
            o: "&nparsl;"
        }
    ],
    [
        44343,
        {
            n: new Map(/* #__PURE__ */ restoreDiff([
                [
                    56476,
                    "&Ascr;"
                ],
                [
                    1,
                    "&Cscr;"
                ],
                [
                    0,
                    "&Dscr;"
                ],
                [
                    2,
                    "&Gscr;"
                ],
                [
                    2,
                    "&Jscr;"
                ],
                [
                    0,
                    "&Kscr;"
                ],
                [
                    2,
                    "&Nscr;"
                ],
                [
                    0,
                    "&Oscr;"
                ],
                [
                    0,
                    "&Pscr;"
                ],
                [
                    0,
                    "&Qscr;"
                ],
                [
                    1,
                    "&Sscr;"
                ],
                [
                    0,
                    "&Tscr;"
                ],
                [
                    0,
                    "&Uscr;"
                ],
                [
                    0,
                    "&Vscr;"
                ],
                [
                    0,
                    "&Wscr;"
                ],
                [
                    0,
                    "&Xscr;"
                ],
                [
                    0,
                    "&Yscr;"
                ],
                [
                    0,
                    "&Zscr;"
                ],
                [
                    0,
                    "&ascr;"
                ],
                [
                    0,
                    "&bscr;"
                ],
                [
                    0,
                    "&cscr;"
                ],
                [
                    0,
                    "&dscr;"
                ],
                [
                    1,
                    "&fscr;"
                ],
                [
                    1,
                    "&hscr;"
                ],
                [
                    0,
                    "&iscr;"
                ],
                [
                    0,
                    "&jscr;"
                ],
                [
                    0,
                    "&kscr;"
                ],
                [
                    0,
                    "&lscr;"
                ],
                [
                    0,
                    "&mscr;"
                ],
                [
                    0,
                    "&nscr;"
                ],
                [
                    1,
                    "&pscr;"
                ],
                [
                    0,
                    "&qscr;"
                ],
                [
                    0,
                    "&rscr;"
                ],
                [
                    0,
                    "&sscr;"
                ],
                [
                    0,
                    "&tscr;"
                ],
                [
                    0,
                    "&uscr;"
                ],
                [
                    0,
                    "&vscr;"
                ],
                [
                    0,
                    "&wscr;"
                ],
                [
                    0,
                    "&xscr;"
                ],
                [
                    0,
                    "&yscr;"
                ],
                [
                    0,
                    "&zscr;"
                ],
                [
                    52,
                    "&Afr;"
                ],
                [
                    0,
                    "&Bfr;"
                ],
                [
                    1,
                    "&Dfr;"
                ],
                [
                    0,
                    "&Efr;"
                ],
                [
                    0,
                    "&Ffr;"
                ],
                [
                    0,
                    "&Gfr;"
                ],
                [
                    2,
                    "&Jfr;"
                ],
                [
                    0,
                    "&Kfr;"
                ],
                [
                    0,
                    "&Lfr;"
                ],
                [
                    0,
                    "&Mfr;"
                ],
                [
                    0,
                    "&Nfr;"
                ],
                [
                    0,
                    "&Ofr;"
                ],
                [
                    0,
                    "&Pfr;"
                ],
                [
                    0,
                    "&Qfr;"
                ],
                [
                    1,
                    "&Sfr;"
                ],
                [
                    0,
                    "&Tfr;"
                ],
                [
                    0,
                    "&Ufr;"
                ],
                [
                    0,
                    "&Vfr;"
                ],
                [
                    0,
                    "&Wfr;"
                ],
                [
                    0,
                    "&Xfr;"
                ],
                [
                    0,
                    "&Yfr;"
                ],
                [
                    1,
                    "&afr;"
                ],
                [
                    0,
                    "&bfr;"
                ],
                [
                    0,
                    "&cfr;"
                ],
                [
                    0,
                    "&dfr;"
                ],
                [
                    0,
                    "&efr;"
                ],
                [
                    0,
                    "&ffr;"
                ],
                [
                    0,
                    "&gfr;"
                ],
                [
                    0,
                    "&hfr;"
                ],
                [
                    0,
                    "&ifr;"
                ],
                [
                    0,
                    "&jfr;"
                ],
                [
                    0,
                    "&kfr;"
                ],
                [
                    0,
                    "&lfr;"
                ],
                [
                    0,
                    "&mfr;"
                ],
                [
                    0,
                    "&nfr;"
                ],
                [
                    0,
                    "&ofr;"
                ],
                [
                    0,
                    "&pfr;"
                ],
                [
                    0,
                    "&qfr;"
                ],
                [
                    0,
                    "&rfr;"
                ],
                [
                    0,
                    "&sfr;"
                ],
                [
                    0,
                    "&tfr;"
                ],
                [
                    0,
                    "&ufr;"
                ],
                [
                    0,
                    "&vfr;"
                ],
                [
                    0,
                    "&wfr;"
                ],
                [
                    0,
                    "&xfr;"
                ],
                [
                    0,
                    "&yfr;"
                ],
                [
                    0,
                    "&zfr;"
                ],
                [
                    0,
                    "&Aopf;"
                ],
                [
                    0,
                    "&Bopf;"
                ],
                [
                    1,
                    "&Dopf;"
                ],
                [
                    0,
                    "&Eopf;"
                ],
                [
                    0,
                    "&Fopf;"
                ],
                [
                    0,
                    "&Gopf;"
                ],
                [
                    1,
                    "&Iopf;"
                ],
                [
                    0,
                    "&Jopf;"
                ],
                [
                    0,
                    "&Kopf;"
                ],
                [
                    0,
                    "&Lopf;"
                ],
                [
                    0,
                    "&Mopf;"
                ],
                [
                    1,
                    "&Oopf;"
                ],
                [
                    3,
                    "&Sopf;"
                ],
                [
                    0,
                    "&Topf;"
                ],
                [
                    0,
                    "&Uopf;"
                ],
                [
                    0,
                    "&Vopf;"
                ],
                [
                    0,
                    "&Wopf;"
                ],
                [
                    0,
                    "&Xopf;"
                ],
                [
                    0,
                    "&Yopf;"
                ],
                [
                    1,
                    "&aopf;"
                ],
                [
                    0,
                    "&bopf;"
                ],
                [
                    0,
                    "&copf;"
                ],
                [
                    0,
                    "&dopf;"
                ],
                [
                    0,
                    "&eopf;"
                ],
                [
                    0,
                    "&fopf;"
                ],
                [
                    0,
                    "&gopf;"
                ],
                [
                    0,
                    "&hopf;"
                ],
                [
                    0,
                    "&iopf;"
                ],
                [
                    0,
                    "&jopf;"
                ],
                [
                    0,
                    "&kopf;"
                ],
                [
                    0,
                    "&lopf;"
                ],
                [
                    0,
                    "&mopf;"
                ],
                [
                    0,
                    "&nopf;"
                ],
                [
                    0,
                    "&oopf;"
                ],
                [
                    0,
                    "&popf;"
                ],
                [
                    0,
                    "&qopf;"
                ],
                [
                    0,
                    "&ropf;"
                ],
                [
                    0,
                    "&sopf;"
                ],
                [
                    0,
                    "&topf;"
                ],
                [
                    0,
                    "&uopf;"
                ],
                [
                    0,
                    "&vopf;"
                ],
                [
                    0,
                    "&wopf;"
                ],
                [
                    0,
                    "&xopf;"
                ],
                [
                    0,
                    "&yopf;"
                ],
                [
                    0,
                    "&zopf;"
                ]
            ]))
        }
    ],
    [
        8906,
        "&fflig;"
    ],
    [
        0,
        "&filig;"
    ],
    [
        0,
        "&fllig;"
    ],
    [
        0,
        "&ffilig;"
    ],
    [
        0,
        "&ffllig;"
    ]
]))); //# sourceMappingURL=encode-html.js.map

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/escape.js
const escape_xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
const xmlCodeMap = new Map([
    [
        34,
        "&quot;"
    ],
    [
        38,
        "&amp;"
    ],
    [
        39,
        "&apos;"
    ],
    [
        60,
        "&lt;"
    ],
    [
        62,
        "&gt;"
    ]
]);
// For compatibility with node < 4, we wrap `codePointAt`
const escape_getCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null ? (str, index)=>str.codePointAt(index) : (c, index)=>(c.charCodeAt(index) & 0xfc00) === 0xd800 ? (c.charCodeAt(index) - 0xd800) * 0x400 + c.charCodeAt(index + 1) - 0xdc00 + 0x10000 : c.charCodeAt(index);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */ function escape_encodeXML(str) {
    let ret = "";
    let lastIdx = 0;
    let match;
    while((match = escape_xmlReplacer.exec(str)) !== null){
        const i = match.index;
        const char = str.charCodeAt(i);
        const next = xmlCodeMap.get(char);
        if (next !== undefined) {
            ret += str.substring(lastIdx, i) + next;
            lastIdx = i + 1;
        } else {
            ret += `${str.substring(lastIdx, i)}&#x${escape_getCodePoint(str, i).toString(16)};`;
            // Increase by 1 if we have a surrogate pair
            lastIdx = escape_xmlReplacer.lastIndex += Number((char & 0xfc00) === 0xd800);
        }
    }
    return ret + str.substr(lastIdx);
}
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */ const escape_escape = (/* unused pure expression or super */ null && (escape_encodeXML));
/**
 * Creates a function that escapes all characters matched by the given regular
 * expression using the given map of characters to escape to their entities.
 *
 * @param regex Regular expression to match characters to escape.
 * @param map Map of characters to escape to their entities.
 *
 * @returns Function that escapes all characters matched by the given regular
 * expression using the given map of characters to escape to their entities.
 */ function getEscaper(regex, map) {
    return function escape(data) {
        let match;
        let lastIdx = 0;
        let result = "";
        while(match = regex.exec(data)){
            if (lastIdx !== match.index) {
                result += data.substring(lastIdx, match.index);
            }
            // We know that this character will be in the map.
            result += map.get(match[0].charCodeAt(0));
            // Every match will be of length 1
            lastIdx = match.index + 1;
        }
        return result + data.substring(lastIdx);
    };
}
/**
 * Encodes all characters not valid in XML documents using XML entities.
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */ const escape_escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
/**
 * Encodes all characters that have to be escaped in HTML attributes,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */ const escape_escapeAttribute = getEscaper(/["&\u00A0]/g, new Map([
    [
        34,
        "&quot;"
    ],
    [
        38,
        "&amp;"
    ],
    [
        160,
        "&nbsp;"
    ]
]));
/**
 * Encodes all characters that have to be escaped in HTML text,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */ const escape_escapeText = getEscaper(/[&<>\u00A0]/g, new Map([
    [
        38,
        "&amp;"
    ],
    [
        60,
        "&lt;"
    ],
    [
        62,
        "&gt;"
    ],
    [
        160,
        "&nbsp;"
    ]
])); //# sourceMappingURL=escape.js.map

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/encode.js


const htmlReplacer = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
/**
 * Encodes all characters in the input using HTML entities. This includes
 * characters that are valid ASCII characters in HTML documents, such as `#`.
 *
 * To get a more compact output, consider using the `encodeNonAsciiHTML`
 * function, which will only encode characters that are not valid in HTML
 * documents, as well as non-ASCII characters.
 *
 * If a character has no equivalent entity, a numeric hexadecimal reference
 * (eg. `&#xfc;`) will be used.
 */ function encode_encodeHTML(data) {
    return encodeHTMLTrieRe(htmlReplacer, data);
}
/**
 * Encodes all non-ASCII characters, as well as characters not valid in HTML
 * documents using HTML entities. This function will not encode characters that
 * are valid in HTML documents, such as `#`.
 *
 * If a character has no equivalent entity, a numeric hexadecimal reference
 * (eg. `&#xfc;`) will be used.
 */ function encode_encodeNonAsciiHTML(data) {
    return encodeHTMLTrieRe(xmlReplacer, data);
}
function encodeHTMLTrieRe(regExp, str) {
    let ret = "";
    let lastIdx = 0;
    let match;
    while((match = regExp.exec(str)) !== null){
        const i = match.index;
        ret += str.substring(lastIdx, i);
        const char = str.charCodeAt(i);
        let next = htmlTrie.get(char);
        if (typeof next === "object") {
            // We are in a branch. Try to match the next char.
            if (i + 1 < str.length) {
                const nextChar = str.charCodeAt(i + 1);
                const value = typeof next.n === "number" ? next.n === nextChar ? next.o : undefined : next.n.get(nextChar);
                if (value !== undefined) {
                    ret += value;
                    lastIdx = regExp.lastIndex += 1;
                    continue;
                }
            }
            next = next.v;
        }
        // We might have a tree node without a value; skip and use a numeric entity.
        if (next !== undefined) {
            ret += next;
            lastIdx = i + 1;
        } else {
            const cp = getCodePoint(str, i);
            ret += `&#x${cp.toString(16)};`;
            // Increase by 1 if we have a surrogate pair
            lastIdx = regExp.lastIndex += Number(cp !== char);
        }
    }
    return ret + str.substr(lastIdx);
} //# sourceMappingURL=encode.js.map

;// CONCATENATED MODULE: ./node_modules/entities/lib/esm/index.js



/** The level of entities to support. */ var EntityLevel;
(function(EntityLevel) {
    /** Support only XML entities. */ EntityLevel[EntityLevel["XML"] = 0] = "XML";
    /** Support HTML entities, which are a superset of XML entities. */ EntityLevel[EntityLevel["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode) {
    /**
     * The output is UTF-8 encoded. Only characters that need escaping within
     * XML will be escaped.
     */ EncodingMode[EncodingMode["UTF8"] = 0] = "UTF8";
    /**
     * The output consists only of ASCII characters. Characters that need
     * escaping within HTML, and characters that aren't ASCII characters will
     * be escaped.
     */ EncodingMode[EncodingMode["ASCII"] = 1] = "ASCII";
    /**
     * Encode all characters that have an equivalent entity, as well as all
     * characters that are not ASCII characters.
     */ EncodingMode[EncodingMode["Extensive"] = 2] = "Extensive";
    /**
     * Encode all characters that have to be escaped in HTML attributes,
     * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
     */ EncodingMode[EncodingMode["Attribute"] = 3] = "Attribute";
    /**
     * Encode all characters that have to be escaped in HTML text,
     * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
     */ EncodingMode[EncodingMode["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));
/**
 * Decodes a string with entities.
 *
 * @param data String to decode.
 * @param options Decoding options.
 */ function decode(data, options = EntityLevel.XML) {
    const level = typeof options === "number" ? options : options.level;
    if (level === EntityLevel.HTML) {
        const mode = typeof options === "object" ? options.mode : undefined;
        return decodeHTML(data, mode);
    }
    return decodeXML(data);
}
/**
 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
 *
 * @param data String to decode.
 * @param options Decoding options.
 * @deprecated Use `decode` with the `mode` set to `Strict`.
 */ function decodeStrict(data, options = EntityLevel.XML) {
    var _a;
    const opts = typeof options === "number" ? {
        level: options
    } : options;
    (_a = opts.mode) !== null && _a !== void 0 ? _a : opts.mode = DecodingMode.Strict;
    return decode(data, opts);
}
/**
 * Encodes a string with entities.
 *
 * @param data String to encode.
 * @param options Encoding options.
 */ function encode(data, options = EntityLevel.XML) {
    const opts = typeof options === "number" ? {
        level: options
    } : options;
    // Mode `UTF8` just escapes XML entities
    if (opts.mode === EncodingMode.UTF8) return escapeUTF8(data);
    if (opts.mode === EncodingMode.Attribute) return escapeAttribute(data);
    if (opts.mode === EncodingMode.Text) return escapeText(data);
    if (opts.level === EntityLevel.HTML) {
        if (opts.mode === EncodingMode.ASCII) {
            return encodeNonAsciiHTML(data);
        }
        return encodeHTML(data);
    }
    // ASCII and Extensive are equivalent
    return encodeXML(data);
}


 //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/dom-serializer/lib/esm/foreignNames.js
const elementNames = new Map([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "textPath"
].map((val)=>[
        val.toLowerCase(),
        val
    ]));
const attributeNames = new Map([
    "definitionURL",
    "attributeName",
    "attributeType",
    "baseFrequency",
    "baseProfile",
    "calcMode",
    "clipPathUnits",
    "diffuseConstant",
    "edgeMode",
    "filterUnits",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "kernelMatrix",
    "kernelUnitLength",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "limitingConeAngle",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "maskContentUnits",
    "maskUnits",
    "numOctaves",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "specularConstant",
    "specularExponent",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stitchTiles",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textLength",
    "viewBox",
    "viewTarget",
    "xChannelSelector",
    "yChannelSelector",
    "zoomAndPan"
].map((val)=>[
        val.toLowerCase(),
        val
    ]));

;// CONCATENATED MODULE: ./node_modules/dom-serializer/lib/esm/index.js
/*
 * Module dependencies
 */ 

/**
 * Mixed-case SVG and MathML tags & attributes
 * recognized by the HTML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
 */ 
const unencodedElements = new Set([
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript"
]);
function replaceQuotes(value) {
    return value.replace(/"/g, "&quot;");
}
/**
 * Format attributes
 */ function formatAttributes(attributes, opts) {
    var _a;
    if (!attributes) return;
    const encode = ((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? escape_encodeXML : escape_escapeAttribute;
    return Object.keys(attributes).map((key)=>{
        var _a, _b;
        const value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
        if (opts.xmlMode === "foreign") {
            /* Fix up mixed-case attribute names */ key = (_b = attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
        }
        if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
            return key;
        }
        return `${key}="${encode(value)}"`;
    }).join(" ");
}
/**
 * Self-enclosing tags
 */ const singleTag = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);
/**
 * Renders a DOM node or an array of DOM nodes to a string.
 *
 * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
 *
 * @param node Node to be rendered.
 * @param options Changes serialization behavior
 */ function render(node, options = {}) {
    const nodes = "length" in node ? node : [
        node
    ];
    let output = "";
    for(let i = 0; i < nodes.length; i++){
        output += renderNode(nodes[i], options);
    }
    return output;
}
/* harmony default export */ const lib_esm = (render);
function renderNode(node, options) {
    switch(node.type){
        case Root:
            return render(node.children, options);
        // @ts-expect-error We don't use `Doctype` yet
        case Doctype:
        case Directive:
            return renderDirective(node);
        case Comment:
            return renderComment(node);
        case CDATA:
            return renderCdata(node);
        case Script:
        case Style:
        case Tag:
            return renderTag(node, options);
        case Text:
            return renderText(node, options);
    }
}
const foreignModeIntegrationPoints = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title"
]);
const foreignElements = new Set([
    "svg",
    "math"
]);
function renderTag(elem, opts) {
    var _a;
    // Handle SVG / MathML in HTML
    if (opts.xmlMode === "foreign") {
        /* Fix up mixed-case element names */ elem.name = (_a = elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
        /* Exit foreign mode at integration points */ if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
            opts = {
                ...opts,
                xmlMode: false
            };
        }
    }
    if (!opts.xmlMode && foreignElements.has(elem.name)) {
        opts = {
            ...opts,
            xmlMode: "foreign"
        };
    }
    let tag = `<${elem.name}`;
    const attribs = formatAttributes(elem.attribs, opts);
    if (attribs) {
        tag += ` ${attribs}`;
    }
    if (elem.children.length === 0 && (opts.xmlMode ? opts.selfClosingTags !== false : opts.selfClosingTags && singleTag.has(elem.name))) {
        if (!opts.xmlMode) tag += " ";
        tag += "/>";
    } else {
        tag += ">";
        if (elem.children.length > 0) {
            tag += render(elem.children, opts);
        }
        if (opts.xmlMode || !singleTag.has(elem.name)) {
            tag += `</${elem.name}>`;
        }
    }
    return tag;
}
function renderDirective(elem) {
    return `<${elem.data}>`;
}
function renderText(elem, opts) {
    var _a;
    let data = elem.data || "";
    // If entities weren't decoded, no need to encode them back
    if (((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
        data = opts.xmlMode || opts.encodeEntities !== "utf8" ? escape_encodeXML(data) : escape_escapeText(data);
    }
    return data;
}
function renderCdata(elem) {
    return `<![CDATA[${elem.children[0].data}]]>`;
}
function renderComment(elem) {
    return `<!--${elem.data}-->`;
}

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/stringify.js



/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @returns `node`'s outer HTML.
 */ function getOuterHTML(node, options) {
    return lib_esm(node, options);
}
/**
 * @category Stringify
 * @deprecated Use the `dom-serializer` module directly.
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @returns `node`'s inner HTML.
 */ function getInnerHTML(node, options) {
    return hasChildren(node) ? node.children.map((node)=>getOuterHTML(node, options)).join("") : "";
}
/**
 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags. Ignores comments.
 *
 * @category Stringify
 * @deprecated Use `textContent` instead.
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */ function getText(node) {
    if (Array.isArray(node)) return node.map(getText).join("");
    if (node_isTag(node)) return node.name === "br" ? "\n" : getText(node.children);
    if (isCDATA(node)) return getText(node.children);
    if (isText(node)) return node.data;
    return "";
}
/**
 * Get a node's text content. Ignores comments.
 *
 * @category Stringify
 * @param node Node to get the text content of.
 * @returns `node`'s text content.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
 */ function textContent(node) {
    if (Array.isArray(node)) return node.map(textContent).join("");
    if (hasChildren(node) && !isComment(node)) {
        return textContent(node.children);
    }
    if (isText(node)) return node.data;
    return "";
}
/**
 * Get a node's inner text, ignoring `<script>` and `<style>` tags. Ignores comments.
 *
 * @category Stringify
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
 */ function innerText(node) {
    if (Array.isArray(node)) return node.map(innerText).join("");
    if (hasChildren(node) && (node.type === ElementType.Tag || isCDATA(node))) {
        return innerText(node.children);
    }
    if (isText(node)) return node.data;
    return "";
} //# sourceMappingURL=stringify.js.map

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/traversal.js

/**
 * Get a node's children.
 *
 * @category Traversal
 * @param elem Node to get the children of.
 * @returns `elem`'s children, or an empty array.
 */ function getChildren(elem) {
    return hasChildren(elem) ? elem.children : [];
}
/**
 * Get a node's parent.
 *
 * @category Traversal
 * @param elem Node to get the parent of.
 * @returns `elem`'s parent node, or `null` if `elem` is a root node.
 */ function getParent(elem) {
    return elem.parent || null;
}
/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first. If we don't
 * have a parent (the element is a root node), we walk the element's `prev` &
 * `next` to get all remaining nodes.
 *
 * @category Traversal
 * @param elem Element to get the siblings of.
 * @returns `elem`'s siblings, including `elem`.
 */ function getSiblings(elem) {
    const parent = getParent(elem);
    if (parent != null) return getChildren(parent);
    const siblings = [
        elem
    ];
    let { prev, next } = elem;
    while(prev != null){
        siblings.unshift(prev);
        ({ prev } = prev);
    }
    while(next != null){
        siblings.push(next);
        ({ next } = next);
    }
    return siblings;
}
/**
 * Gets an attribute from an element.
 *
 * @category Traversal
 * @param elem Element to check.
 * @param name Attribute name to retrieve.
 * @returns The element's attribute value, or `undefined`.
 */ function getAttributeValue(elem, name) {
    var _a;
    return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
}
/**
 * Checks whether an element has an attribute.
 *
 * @category Traversal
 * @param elem Element to check.
 * @param name Attribute name to look for.
 * @returns Returns whether `elem` has the attribute `name`.
 */ function hasAttrib(elem, name) {
    return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
/**
 * Get the tag name of an element.
 *
 * @category Traversal
 * @param elem The element to get the name for.
 * @returns The tag name of `elem`.
 */ function getName(elem) {
    return elem.name;
}
/**
 * Returns the next element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the next sibling of.
 * @returns `elem`'s next sibling that is a tag, or `null` if there is no next
 * sibling.
 */ function nextElementSibling(elem) {
    let { next } = elem;
    while(next !== null && !node_isTag(next))({ next } = next);
    return next;
}
/**
 * Returns the previous element sibling of a node.
 *
 * @category Traversal
 * @param elem The element to get the previous sibling of.
 * @returns `elem`'s previous sibling that is a tag, or `null` if there is no
 * previous sibling.
 */ function prevElementSibling(elem) {
    let { prev } = elem;
    while(prev !== null && !node_isTag(prev))({ prev } = prev);
    return prev;
} //# sourceMappingURL=traversal.js.map

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/manipulation.js
/**
 * Remove an element from the dom
 *
 * @category Manipulation
 * @param elem The element to be removed
 */ function removeElement(elem) {
    if (elem.prev) elem.prev.next = elem.next;
    if (elem.next) elem.next.prev = elem.prev;
    if (elem.parent) {
        const childs = elem.parent.children;
        const childsIndex = childs.lastIndexOf(elem);
        if (childsIndex >= 0) {
            childs.splice(childsIndex, 1);
        }
    }
    elem.next = null;
    elem.prev = null;
    elem.parent = null;
}
/**
 * Replace an element in the dom
 *
 * @category Manipulation
 * @param elem The element to be replaced
 * @param replacement The element to be added
 */ function replaceElement(elem, replacement) {
    const prev = replacement.prev = elem.prev;
    if (prev) {
        prev.next = replacement;
    }
    const next = replacement.next = elem.next;
    if (next) {
        next.prev = replacement;
    }
    const parent = replacement.parent = elem.parent;
    if (parent) {
        const childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
        elem.parent = null;
    }
}
/**
 * Append a child to an element.
 *
 * @category Manipulation
 * @param parent The element to append to.
 * @param child The element to be added as a child.
 */ function appendChild(parent, child) {
    removeElement(child);
    child.next = null;
    child.parent = parent;
    if (parent.children.push(child) > 1) {
        const sibling = parent.children[parent.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
    } else {
        child.prev = null;
    }
}
/**
 * Append an element after another.
 *
 * @category Manipulation
 * @param elem The element to append after.
 * @param next The element be added.
 */ function append(elem, next) {
    removeElement(next);
    const { parent } = elem;
    const currNext = elem.next;
    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;
    if (currNext) {
        currNext.prev = next;
        if (parent) {
            const childs = parent.children;
            childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
    } else if (parent) {
        parent.children.push(next);
    }
}
/**
 * Prepend a child to an element.
 *
 * @category Manipulation
 * @param parent The element to prepend before.
 * @param child The element to be added as a child.
 */ function prependChild(parent, child) {
    removeElement(child);
    child.parent = parent;
    child.prev = null;
    if (parent.children.unshift(child) !== 1) {
        const sibling = parent.children[1];
        sibling.prev = child;
        child.next = sibling;
    } else {
        child.next = null;
    }
}
/**
 * Prepend an element before another.
 *
 * @category Manipulation
 * @param elem The element to prepend before.
 * @param prev The element be added.
 */ function prepend(elem, prev) {
    removeElement(prev);
    const { parent } = elem;
    if (parent) {
        const childs = parent.children;
        childs.splice(childs.indexOf(elem), 0, prev);
    }
    if (elem.prev) {
        elem.prev.next = prev;
    }
    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
} //# sourceMappingURL=manipulation.js.map

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/querying.js

/**
 * Search a node and its children for nodes passing a test function. If `node` is not an array, it will be wrapped in one.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */ function filter(test, node, recurse = true, limit = Infinity) {
    return find(test, Array.isArray(node) ? node : [
        node
    ], recurse, limit);
}
/**
 * Search an array of nodes and their children for nodes passing a test function.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */ function find(test, nodes, recurse, limit) {
    const result = [];
    /** Stack of the arrays we are looking at. */ const nodeStack = [
        Array.isArray(nodes) ? nodes : [
            nodes
        ]
    ];
    /** Stack of the indices within the arrays. */ const indexStack = [
        0
    ];
    for(;;){
        // First, check if the current array has any more elements to look at.
        if (indexStack[0] >= nodeStack[0].length) {
            // If we have no more arrays to look at, we are done.
            if (indexStack.length === 1) {
                return result;
            }
            // Otherwise, remove the current array from the stack.
            nodeStack.shift();
            indexStack.shift();
            continue;
        }
        const elem = nodeStack[0][indexStack[0]++];
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0) return result;
        }
        if (recurse && hasChildren(elem) && elem.children.length > 0) {
            /*
             * Add the children to the stack. We are depth-first, so this is
             * the next array we look at.
             */ indexStack.unshift(0);
            nodeStack.unshift(elem.children);
        }
    }
}
/**
 * Finds the first element inside of an array that matches a test function. This is an alias for `Array.prototype.find`.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 * @deprecated Use `Array.prototype.find` directly.
 */ function findOneChild(test, nodes) {
    return nodes.find(test);
}
/**
 * Finds one element in a tree that passes a test.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Node or array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first node that passes `test`.
 */ function findOne(test, nodes, recurse = true) {
    const searchedNodes = Array.isArray(nodes) ? nodes : [
        nodes
    ];
    for(let i = 0; i < searchedNodes.length; i++){
        const node = searchedNodes[i];
        if (node_isTag(node) && test(node)) {
            return node;
        }
        if (recurse && hasChildren(node) && node.children.length > 0) {
            const found = findOne(test, node.children, true);
            if (found) return found;
        }
    }
    return null;
}
/**
 * Checks if a tree of nodes contains at least one node passing a test.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing the test.
 */ function existsOne(test, nodes) {
    return (Array.isArray(nodes) ? nodes : [
        nodes
    ]).some((node)=>node_isTag(node) && test(node) || hasChildren(node) && existsOne(test, node.children));
}
/**
 * Search an array of nodes and their children for elements passing a test function.
 *
 * Same as `find`, but limited to elements and with less options, leading to reduced complexity.
 *
 * @category Querying
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */ function findAll(test, nodes) {
    const result = [];
    const nodeStack = [
        Array.isArray(nodes) ? nodes : [
            nodes
        ]
    ];
    const indexStack = [
        0
    ];
    for(;;){
        if (indexStack[0] >= nodeStack[0].length) {
            if (nodeStack.length === 1) {
                return result;
            }
            // Otherwise, remove the current array from the stack.
            nodeStack.shift();
            indexStack.shift();
            continue;
        }
        const elem = nodeStack[0][indexStack[0]++];
        if (node_isTag(elem) && test(elem)) result.push(elem);
        if (hasChildren(elem) && elem.children.length > 0) {
            indexStack.unshift(0);
            nodeStack.unshift(elem.children);
        }
    }
} //# sourceMappingURL=querying.js.map

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/legacy.js


/**
 * A map of functions to check nodes against.
 */ const Checks = {
    tag_name (name) {
        if (typeof name === "function") {
            return (elem)=>node_isTag(elem) && name(elem.name);
        } else if (name === "*") {
            return node_isTag;
        }
        return (elem)=>node_isTag(elem) && elem.name === name;
    },
    tag_type (type) {
        if (typeof type === "function") {
            return (elem)=>type(elem.type);
        }
        return (elem)=>elem.type === type;
    },
    tag_contains (data) {
        if (typeof data === "function") {
            return (elem)=>isText(elem) && data(elem.data);
        }
        return (elem)=>isText(elem) && elem.data === data;
    }
};
/**
 * Returns a function to check whether a node has an attribute with a particular
 * value.
 *
 * @param attrib Attribute to check.
 * @param value Attribute value to look for.
 * @returns A function to check whether the a node has an attribute with a
 *   particular value.
 */ function getAttribCheck(attrib, value) {
    if (typeof value === "function") {
        return (elem)=>node_isTag(elem) && value(elem.attribs[attrib]);
    }
    return (elem)=>node_isTag(elem) && elem.attribs[attrib] === value;
}
/**
 * Returns a function that returns `true` if either of the input functions
 * returns `true` for a node.
 *
 * @param a First function to combine.
 * @param b Second function to combine.
 * @returns A function taking a node and returning `true` if either of the input
 *   functions returns `true` for the node.
 */ function combineFuncs(a, b) {
    return (elem)=>a(elem) || b(elem);
}
/**
 * Returns a function that executes all checks in `options` and returns `true`
 * if any of them match a node.
 *
 * @param options An object describing nodes to look for.
 * @returns A function that executes all checks in `options` and returns `true`
 *   if any of them match a node.
 */ function compileTest(options) {
    const funcs = Object.keys(options).map((key)=>{
        const value = options[key];
        return Object.prototype.hasOwnProperty.call(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
    });
    return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
/**
 * Checks whether a node matches the description in `options`.
 *
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param node The element to test.
 * @returns Whether the element matches the description in `options`.
 */ function testElement(options, node) {
    const test = compileTest(options);
    return test ? test(node) : true;
}
/**
 * Returns all nodes that match `options`.
 *
 * @category Legacy Query Functions
 * @param options An object describing nodes to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes that match `options`.
 */ function getElements(options, nodes, recurse, limit = Infinity) {
    const test = compileTest(options);
    return test ? filter(test, nodes, recurse, limit) : [];
}
/**
 * Returns the node with the supplied ID.
 *
 * @category Legacy Query Functions
 * @param id The unique ID attribute value to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @returns The node with the supplied ID.
 */ function getElementById(id, nodes, recurse = true) {
    if (!Array.isArray(nodes)) nodes = [
        nodes
    ];
    return findOne(getAttribCheck("id", id), nodes, recurse);
}
/**
 * Returns all nodes with the supplied `tagName`.
 *
 * @category Legacy Query Functions
 * @param tagName Tag name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `tagName`.
 */ function getElementsByTagName(tagName, nodes, recurse = true, limit = Infinity) {
    return filter(Checks["tag_name"](tagName), nodes, recurse, limit);
}
/**
 * Returns all nodes with the supplied `className`.
 *
 * @category Legacy Query Functions
 * @param className Class name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `className`.
 */ function getElementsByClassName(className, nodes, recurse = true, limit = Infinity) {
    return filter(getAttribCheck("class", className), nodes, recurse, limit);
}
/**
 * Returns all nodes with the supplied `type`.
 *
 * @category Legacy Query Functions
 * @param type Element type to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `type`.
 */ function getElementsByTagType(type, nodes, recurse = true, limit = Infinity) {
    return filter(Checks["tag_type"](type), nodes, recurse, limit);
} //# sourceMappingURL=legacy.js.map

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/helpers.js

/**
 * Given an array of nodes, remove any member that is contained by another
 * member.
 *
 * @category Helpers
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't contained by other nodes.
 */ function removeSubsets(nodes) {
    let idx = nodes.length;
    /*
     * Check if each node (or one of its ancestors) is already contained in the
     * array.
     */ while(--idx >= 0){
        const node = nodes[idx];
        /*
         * Remove the node if it is not unique.
         * We are going through the array from the end, so we only
         * have to check nodes that preceed the node under consideration in the array.
         */ if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
            nodes.splice(idx, 1);
            continue;
        }
        for(let ancestor = node.parent; ancestor; ancestor = ancestor.parent){
            if (nodes.includes(ancestor)) {
                nodes.splice(idx, 1);
                break;
            }
        }
    }
    return nodes;
}
/**
 * @category Helpers
 * @see {@link http://dom.spec.whatwg.org/#dom-node-comparedocumentposition}
 */ var DocumentPosition;
(function(DocumentPosition) {
    DocumentPosition[DocumentPosition["DISCONNECTED"] = 1] = "DISCONNECTED";
    DocumentPosition[DocumentPosition["PRECEDING"] = 2] = "PRECEDING";
    DocumentPosition[DocumentPosition["FOLLOWING"] = 4] = "FOLLOWING";
    DocumentPosition[DocumentPosition["CONTAINS"] = 8] = "CONTAINS";
    DocumentPosition[DocumentPosition["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));
/**
 * Compare the position of one node against another node in any other document,
 * returning a bitmask with the values from {@link DocumentPosition}.
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent.
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @category Helpers
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */ function compareDocumentPosition(nodeA, nodeB) {
    const aParents = [];
    const bParents = [];
    if (nodeA === nodeB) {
        return 0;
    }
    let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
    while(current){
        aParents.unshift(current);
        current = current.parent;
    }
    current = hasChildren(nodeB) ? nodeB : nodeB.parent;
    while(current){
        bParents.unshift(current);
        current = current.parent;
    }
    const maxIdx = Math.min(aParents.length, bParents.length);
    let idx = 0;
    while(idx < maxIdx && aParents[idx] === bParents[idx]){
        idx++;
    }
    if (idx === 0) {
        return DocumentPosition.DISCONNECTED;
    }
    const sharedParent = aParents[idx - 1];
    const siblings = sharedParent.children;
    const aSibling = aParents[idx];
    const bSibling = bParents[idx];
    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) {
            return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
        }
        return DocumentPosition.FOLLOWING;
    }
    if (sharedParent === nodeA) {
        return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
    }
    return DocumentPosition.PRECEDING;
}
/**
 * Sort an array of nodes based on their relative position in the document,
 * removing any duplicate nodes. If the array contains nodes that do not belong
 * to the same document, sort order is unspecified.
 *
 * @category Helpers
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */ function uniqueSort(nodes) {
    nodes = nodes.filter((node, i, arr)=>!arr.includes(node, i + 1));
    nodes.sort((a, b)=>{
        const relative = compareDocumentPosition(a, b);
        if (relative & DocumentPosition.PRECEDING) {
            return -1;
        } else if (relative & DocumentPosition.FOLLOWING) {
            return 1;
        }
        return 0;
    });
    return nodes;
} //# sourceMappingURL=helpers.js.map

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/feeds.js


/**
 * Get the feed object from the root of a DOM tree.
 *
 * @category Feeds
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */ function feeds_getFeed(doc) {
    const feedRoot = getOneElement(isValidFeed, doc);
    return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */ function getAtomFeed(feedRoot) {
    var _a;
    const childs = feedRoot.children;
    const feed = {
        type: "atom",
        items: getElementsByTagName("entry", childs).map((item)=>{
            var _a;
            const { children } = item;
            const entry = {
                media: getMediaElements(children)
            };
            addConditionally(entry, "id", "id", children);
            addConditionally(entry, "title", "title", children);
            const href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs["href"];
            if (href) {
                entry.link = href;
            }
            const description = fetch("summary", children) || fetch("content", children);
            if (description) {
                entry.description = description;
            }
            const pubDate = fetch("updated", children);
            if (pubDate) {
                entry.pubDate = new Date(pubDate);
            }
            return entry;
        })
    };
    addConditionally(feed, "id", "id", childs);
    addConditionally(feed, "title", "title", childs);
    const href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs["href"];
    if (href) {
        feed.link = href;
    }
    addConditionally(feed, "description", "subtitle", childs);
    const updated = fetch("updated", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "email", childs, true);
    return feed;
}
/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */ function getRssFeed(feedRoot) {
    var _a, _b;
    const childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
    const feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: getElementsByTagName("item", feedRoot.children).map((item)=>{
            const { children } = item;
            const entry = {
                media: getMediaElements(children)
            };
            addConditionally(entry, "id", "guid", children);
            addConditionally(entry, "title", "title", children);
            addConditionally(entry, "link", "link", children);
            addConditionally(entry, "description", "description", children);
            const pubDate = fetch("pubDate", children) || fetch("dc:date", children);
            if (pubDate) entry.pubDate = new Date(pubDate);
            return entry;
        })
    };
    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);
    const updated = fetch("lastBuildDate", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "managingEditor", childs, true);
    return feed;
}
const MEDIA_KEYS_STRING = [
    "url",
    "type",
    "lang"
];
const MEDIA_KEYS_INT = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width"
];
/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @returns Media elements.
 */ function getMediaElements(where) {
    return getElementsByTagName("media:content", where).map((elem)=>{
        const { attribs } = elem;
        const media = {
            medium: attribs["medium"],
            isDefault: !!attribs["isDefault"]
        };
        for (const attrib of MEDIA_KEYS_STRING){
            if (attribs[attrib]) {
                media[attrib] = attribs[attrib];
            }
        }
        for (const attrib of MEDIA_KEYS_INT){
            if (attribs[attrib]) {
                media[attrib] = parseInt(attribs[attrib], 10);
            }
        }
        if (attribs["expression"]) {
            media.expression = attribs["expression"];
        }
        return media;
    });
}
/**
 * Get one element by tag name.
 *
 * @param tagName Tag name to look for
 * @param node Node to search in
 * @returns The element or null
 */ function getOneElement(tagName, node) {
    return getElementsByTagName(tagName, node, true, 1)[0];
}
/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name to look for.
 * @param where Node to search in.
 * @param recurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */ function fetch(tagName, where, recurse = false) {
    return textContent(getElementsByTagName(tagName, where, recurse, 1)).trim();
}
/**
 * Adds a property to an object if it has a value.
 *
 * @param obj Object to be extended
 * @param prop Property name
 * @param tagName Tag name that contains the conditionally added property
 * @param where Element to search for the property
 * @param recurse Whether to recurse into child nodes.
 */ function addConditionally(obj, prop, tagName, where, recurse = false) {
    const val = fetch(tagName, where, recurse);
    if (val) obj[prop] = val;
}
/**
 * Checks if an element is a feed root node.
 *
 * @param value The name of the element to check.
 * @returns Whether an element is a feed root node.
 */ function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
} //# sourceMappingURL=feeds.js.map

;// CONCATENATED MODULE: ./node_modules/domutils/lib/esm/index.js







/** @deprecated Use these methods from `domhandler` directly. */  //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/static.js


/**
 * Helper function to render a DOM.
 *
 * @param that - Cheerio instance to render.
 * @param dom - The DOM to render. Defaults to `that`'s root.
 * @param options - Options for rendering.
 * @returns The rendered document.
 */ function static_render(that, dom, options) {
    if (!that) return "";
    return that(dom !== null && dom !== void 0 ? dom : that._root.children, null, undefined, options).toString();
}
/**
 * Checks if a passed object is an options object.
 *
 * @param dom - Object to check if it is an options object.
 * @returns Whether the object is an options object.
 */ function isOptions(dom, options) {
    return !options && typeof dom === "object" && dom != null && !("length" in dom) && !("type" in dom);
}
function html(dom, options) {
    /*
     * Be flexible about parameters, sometimes we call html(),
     * with options as only parameter
     * check dom argument for dom element specific properties
     * assume there is no 'length' or 'type' properties in the options object
     */ const toRender = isOptions(dom) ? (options = dom, undefined) : dom;
    /*
     * Sometimes `$.html()` is used without preloading html,
     * so fallback non-existing options to the default ones.
     */ const opts = {
        ...esm_options,
        ...this === null || this === void 0 ? void 0 : this._options,
        ...flatten(options !== null && options !== void 0 ? options : {})
    };
    return static_render(this, toRender, opts);
}
/**
 * Render the document as XML.
 *
 * @param dom - Element to render.
 * @returns THe rendered document.
 */ function xml(dom) {
    const options = {
        ...this._options,
        xmlMode: true
    };
    return static_render(this, dom, options);
}
/**
 * Render the document as text.
 *
 * This returns the `textContent` of the passed elements. The result will
 * include the contents of `script` and `stype` elements. To avoid this, use
 * `.prop('innerText')` instead.
 *
 * @param elements - Elements to render.
 * @returns The rendered document.
 */ function static_text(elements) {
    const elems = elements ? elements : this ? this.root() : [];
    let ret = "";
    for(let i = 0; i < elems.length; i++){
        ret += textContent(elems[i]);
    }
    return ret;
}
function parseHTML(data, context, keepScripts = typeof context === "boolean" ? context : false) {
    if (!data || typeof data !== "string") {
        return null;
    }
    if (typeof context === "boolean") {
        keepScripts = context;
    }
    const parsed = this.load(data, esm_options, false);
    if (!keepScripts) {
        parsed("script").remove();
    }
    /*
     * The `children` array is used by Cheerio internally to group elements that
     * share the same parents. When nodes created through `parseHTML` are
     * inserted into previously-existing DOM structures, they will be removed
     * from the `children` array. The results of `parseHTML` should remain
     * constant across these operations, so a shallow copy should be returned.
     */ return parsed.root()[0].children.slice();
}
/**
 * Sometimes you need to work with the top-level root element. To query it, you
 * can use `$.root()`.
 *
 * @example
 *
 * ```js
 * $.root().append('<ul id="vegetables"></ul>').html();
 * //=> <ul id="fruits">...</ul><ul id="vegetables"></ul>
 * ```
 *
 * @returns Cheerio instance wrapping the root node.
 * @alias Cheerio.root
 */ function root() {
    return this(this._root);
}
/**
 * Checks to see if the `contained` DOM element is a descendant of the
 * `container` DOM element.
 *
 * @param container - Potential parent node.
 * @param contained - Potential child node.
 * @returns Indicates if the nodes contain one another.
 * @alias Cheerio.contains
 * @see {@link https://api.jquery.com/jQuery.contains/}
 */ function contains(container, contained) {
    // According to the jQuery API, an element does not "contain" itself
    if (contained === container) {
        return false;
    }
    /*
     * Step up the descendants, stopping when the root element is reached
     * (signaled by `.parent` returning a reference to the same object)
     */ let next = contained;
    while(next && next !== next.parent){
        next = next.parent;
        if (next === container) {
            return true;
        }
    }
    return false;
}
/**
 * $.merge().
 *
 * @param arr1 - First array.
 * @param arr2 - Second array.
 * @returns `arr1`, with elements of `arr2` inserted.
 * @alias Cheerio.merge
 * @see {@link https://api.jquery.com/jQuery.merge/}
 */ function merge(arr1, arr2) {
    if (!isArrayLike(arr1) || !isArrayLike(arr2)) {
        return;
    }
    let newLength = arr1.length;
    const len = +arr2.length;
    for(let i = 0; i < len; i++){
        arr1[newLength++] = arr2[i];
    }
    arr1.length = newLength;
    return arr1;
}
/**
 * Checks if an object is array-like.
 *
 * @param item - Item to check.
 * @returns Indicates if the item is array-like.
 */ function isArrayLike(item) {
    if (Array.isArray(item)) {
        return true;
    }
    if (typeof item !== "object" || !Object.prototype.hasOwnProperty.call(item, "length") || typeof item.length !== "number" || item.length < 0) {
        return false;
    }
    for(let i = 0; i < item.length; i++){
        if (!(i in item)) {
            return false;
        }
    }
    return true;
} //# sourceMappingURL=static.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/utils.js

/**
 * Check if the DOM element is a tag.
 *
 * `isTag(type)` includes `<script>` and `<style>` tags.
 *
 * @private
 * @category Utils
 * @param type - The DOM node to check.
 * @returns Whether the node is a tag.
 */ 
/**
 * Checks if an object is a Cheerio instance.
 *
 * @category Utils
 * @param maybeCheerio - The object to check.
 * @returns Whether the object is a Cheerio instance.
 */ function isCheerio(maybeCheerio) {
    return maybeCheerio.cheerio != null;
}
/**
 * Convert a string to camel case notation.
 *
 * @private
 * @category Utils
 * @param str - The string to be converted.
 * @returns String in camel case notation.
 */ function camelCase(str) {
    return str.replace(/[_.-](\w|$)/g, (_, x)=>x.toUpperCase());
}
/**
 * Convert a string from camel case to "CSS case", where word boundaries are
 * described by hyphens ("-") and all characters are lower-case.
 *
 * @private
 * @category Utils
 * @param str - The string to be converted.
 * @returns String in "CSS case".
 */ function cssCase(str) {
    return str.replace(/[A-Z]/g, "-$&").toLowerCase();
}
/**
 * Iterate over each DOM element without creating intermediary Cheerio instances.
 *
 * This is indented for use internally to avoid otherwise unnecessary memory
 * pressure introduced by _make.
 *
 * @category Utils
 * @param array - The array to iterate over.
 * @param fn - Function to call.
 * @returns The original instance.
 */ function domEach(array, fn) {
    const len = array.length;
    for(let i = 0; i < len; i++)fn(array[i], i);
    return array;
}
/**
 * Create a deep copy of the given DOM structure. Sets the parents of the copies
 * of the passed nodes to `null`.
 *
 * @private
 * @category Utils
 * @param dom - The domhandler-compliant DOM structure.
 * @returns - The cloned DOM.
 */ function cloneDom(dom) {
    const clone = "length" in dom ? Array.prototype.map.call(dom, (el)=>cloneNode(el, true)) : [
        cloneNode(dom, true)
    ];
    // Add a root node around the cloned nodes
    const root = new Document(clone);
    clone.forEach((node)=>{
        node.parent = root;
    });
    return clone;
}
var CharacterCodes;
(function(CharacterCodes) {
    CharacterCodes[CharacterCodes["LowerA"] = 97] = "LowerA";
    CharacterCodes[CharacterCodes["LowerZ"] = 122] = "LowerZ";
    CharacterCodes[CharacterCodes["UpperA"] = 65] = "UpperA";
    CharacterCodes[CharacterCodes["UpperZ"] = 90] = "UpperZ";
    CharacterCodes[CharacterCodes["Exclamation"] = 33] = "Exclamation";
})(CharacterCodes || (CharacterCodes = {}));
/**
 * Check if string is HTML.
 *
 * Tests for a `<` within a string, immediate followed by a letter and
 * eventually followed by a `>`.
 *
 * @private
 * @category Utils
 * @param str - The string to check.
 * @returns Indicates if `str` is HTML.
 */ function isHtml(str) {
    const tagStart = str.indexOf("<");
    if (tagStart < 0 || tagStart > str.length - 3) return false;
    const tagChar = str.charCodeAt(tagStart + 1);
    return (tagChar >= CharacterCodes.LowerA && tagChar <= CharacterCodes.LowerZ || tagChar >= CharacterCodes.UpperA && tagChar <= CharacterCodes.UpperZ || tagChar === CharacterCodes.Exclamation) && str.includes(">", tagStart + 2);
} //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/api/attributes.js
/**
 * Methods for getting and modifying attributes.
 *
 * @module cheerio/attributes
 */ 


const hasOwn = Object.prototype.hasOwnProperty;
const rspace = /\s+/;
const dataAttrPrefix = "data-";
/*
 * Lookup table for coercing string data-* attributes to their corresponding
 * JavaScript primitives
 */ const primitives = {
    null: null,
    true: true,
    false: false
};
// Attributes that are booleans
const rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i;
// Matches strings that look like JSON objects or arrays
const rbrace = /^{[^]*}$|^\[[^]*]$/;
function getAttr(elem, name, xmlMode) {
    var _a;
    if (!elem || !node_isTag(elem)) return undefined;
    (_a = elem.attribs) !== null && _a !== void 0 ? _a : elem.attribs = {};
    // Return the entire attribs object if no attribute specified
    if (!name) {
        return elem.attribs;
    }
    if (hasOwn.call(elem.attribs, name)) {
        // Get the (decoded) attribute
        return !xmlMode && rboolean.test(name) ? name : elem.attribs[name];
    }
    // Mimic the DOM and return text content as value for `option's`
    if (elem.name === "option" && name === "value") {
        return static_text(elem.children);
    }
    // Mimic DOM with default value for radios/checkboxes
    if (elem.name === "input" && (elem.attribs["type"] === "radio" || elem.attribs["type"] === "checkbox") && name === "value") {
        return "on";
    }
    return undefined;
}
/**
 * Sets the value of an attribute. The attribute will be deleted if the value is `null`.
 *
 * @private
 * @param el - The element to set the attribute on.
 * @param name - The attribute's name.
 * @param value - The attribute's value.
 */ function setAttr(el, name, value) {
    if (value === null) {
        removeAttribute(el, name);
    } else {
        el.attribs[name] = `${value}`;
    }
}
function attr(name, value) {
    // Set the value (with attr map support)
    if (typeof name === "object" || value !== undefined) {
        if (typeof value === "function") {
            if (typeof name !== "string") {
                {
                    throw new Error("Bad combination of arguments.");
                }
            }
            return domEach(this, (el, i)=>{
                if (node_isTag(el)) setAttr(el, name, value.call(el, i, el.attribs[name]));
            });
        }
        return domEach(this, (el)=>{
            if (!node_isTag(el)) return;
            if (typeof name === "object") {
                Object.keys(name).forEach((objName)=>{
                    const objValue = name[objName];
                    setAttr(el, objName, objValue);
                });
            } else {
                setAttr(el, name, value);
            }
        });
    }
    return arguments.length > 1 ? this : getAttr(this[0], name, this.options.xmlMode);
}
/**
 * Gets a node's prop.
 *
 * @private
 * @category Attributes
 * @param el - Element to get the prop of.
 * @param name - Name of the prop.
 * @returns The prop's value.
 */ function getProp(el, name, xmlMode) {
    return name in el ? el[name] : !xmlMode && rboolean.test(name) ? getAttr(el, name, false) !== undefined : getAttr(el, name, xmlMode);
}
/**
 * Sets the value of a prop.
 *
 * @private
 * @param el - The element to set the prop on.
 * @param name - The prop's name.
 * @param value - The prop's value.
 */ function setProp(el, name, value, xmlMode) {
    if (name in el) {
        // @ts-expect-error Overriding value
        el[name] = value;
    } else {
        setAttr(el, name, !xmlMode && rboolean.test(name) ? value ? "" : null : `${value}`);
    }
}
function prop(name, value) {
    var _a;
    if (typeof name === "string" && value === undefined) {
        const el = this[0];
        if (!el || !node_isTag(el)) return undefined;
        switch(name){
            case "style":
                {
                    const property = this.css();
                    const keys = Object.keys(property);
                    keys.forEach((p, i)=>{
                        property[i] = p;
                    });
                    property.length = keys.length;
                    return property;
                }
            case "tagName":
            case "nodeName":
                {
                    return el.name.toUpperCase();
                }
            case "href":
            case "src":
                {
                    const prop = (_a = el.attribs) === null || _a === void 0 ? void 0 : _a[name];
                    /* eslint-disable node/no-unsupported-features/node-builtins */ if (typeof URL !== "undefined" && (name === "href" && (el.tagName === "a" || el.name === "link") || name === "src" && (el.tagName === "img" || el.tagName === "iframe" || el.tagName === "audio" || el.tagName === "video" || el.tagName === "source")) && prop !== undefined && this.options.baseURI) {
                        return new URL(prop, this.options.baseURI).href;
                    }
                    /* eslint-enable node/no-unsupported-features/node-builtins */ return prop;
                }
            case "innerText":
                {
                    return innerText(el);
                }
            case "textContent":
                {
                    return textContent(el);
                }
            case "outerHTML":
                return this.clone().wrap("<container />").parent().html();
            case "innerHTML":
                return this.html();
            default:
                return getProp(el, name, this.options.xmlMode);
        }
    }
    if (typeof name === "object" || value !== undefined) {
        if (typeof value === "function") {
            if (typeof name === "object") {
                throw new Error("Bad combination of arguments.");
            }
            return domEach(this, (el, i)=>{
                if (node_isTag(el)) {
                    setProp(el, name, value.call(el, i, getProp(el, name, this.options.xmlMode)), this.options.xmlMode);
                }
            });
        }
        return domEach(this, (el)=>{
            if (!node_isTag(el)) return;
            if (typeof name === "object") {
                Object.keys(name).forEach((key)=>{
                    const val = name[key];
                    setProp(el, key, val, this.options.xmlMode);
                });
            } else {
                setProp(el, name, value, this.options.xmlMode);
            }
        });
    }
    return undefined;
}
/**
 * Sets the value of a data attribute.
 *
 * @private
 * @param el - The element to set the data attribute on.
 * @param name - The data attribute's name.
 * @param value - The data attribute's value.
 */ function setData(el, name, value) {
    var _a;
    const elem = el;
    (_a = elem.data) !== null && _a !== void 0 ? _a : elem.data = {};
    if (typeof name === "object") Object.assign(elem.data, name);
    else if (typeof name === "string" && value !== undefined) {
        elem.data[name] = value;
    }
}
/**
 * Read the specified attribute from the equivalent HTML5 `data-*` attribute,
 * and (if present) cache the value in the node's internal data store. If no
 * attribute name is specified, read _all_ HTML5 `data-*` attributes in this manner.
 *
 * @private
 * @category Attributes
 * @param el - Element to get the data attribute of.
 * @param name - Name of the data attribute.
 * @returns The data attribute's value, or a map with all of the data attributes.
 */ function readData(el, name) {
    let domNames;
    let jsNames;
    let value;
    if (name == null) {
        domNames = Object.keys(el.attribs).filter((attrName)=>attrName.startsWith(dataAttrPrefix));
        jsNames = domNames.map((domName)=>camelCase(domName.slice(dataAttrPrefix.length)));
    } else {
        domNames = [
            dataAttrPrefix + cssCase(name)
        ];
        jsNames = [
            name
        ];
    }
    for(let idx = 0; idx < domNames.length; ++idx){
        const domName = domNames[idx];
        const jsName = jsNames[idx];
        if (hasOwn.call(el.attribs, domName) && !hasOwn.call(el.data, jsName)) {
            value = el.attribs[domName];
            if (hasOwn.call(primitives, value)) {
                value = primitives[value];
            } else if (value === String(Number(value))) {
                value = Number(value);
            } else if (rbrace.test(value)) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                /* Ignore */ }
            }
            el.data[jsName] = value;
        }
    }
    return name == null ? el.data : value;
}
function data(name, value) {
    var _a;
    const elem = this[0];
    if (!elem || !node_isTag(elem)) return;
    const dataEl = elem;
    (_a = dataEl.data) !== null && _a !== void 0 ? _a : dataEl.data = {};
    // Return the entire data object if no data specified
    if (!name) {
        return readData(dataEl);
    }
    // Set the value (with attr map support)
    if (typeof name === "object" || value !== undefined) {
        domEach(this, (el)=>{
            if (node_isTag(el)) {
                if (typeof name === "object") setData(el, name);
                else setData(el, name, value);
            }
        });
        return this;
    }
    if (hasOwn.call(dataEl.data, name)) {
        return dataEl.data[name];
    }
    return readData(dataEl, name);
}
function val(value) {
    const querying = arguments.length === 0;
    const element = this[0];
    if (!element || !node_isTag(element)) return querying ? undefined : this;
    switch(element.name){
        case "textarea":
            return this.text(value);
        case "select":
            {
                const option = this.find("option:selected");
                if (!querying) {
                    if (this.attr("multiple") == null && typeof value === "object") {
                        return this;
                    }
                    this.find("option").removeAttr("selected");
                    const values = typeof value !== "object" ? [
                        value
                    ] : value;
                    for(let i = 0; i < values.length; i++){
                        this.find(`option[value="${values[i]}"]`).attr("selected", "");
                    }
                    return this;
                }
                return this.attr("multiple") ? option.toArray().map((el)=>static_text(el.children)) : option.attr("value");
            }
        case "input":
        case "option":
            return querying ? this.attr("value") : this.attr("value", value);
    }
    return undefined;
}
/**
 * Remove an attribute.
 *
 * @private
 * @param elem - Node to remove attribute from.
 * @param name - Name of the attribute to remove.
 */ function removeAttribute(elem, name) {
    if (!elem.attribs || !hasOwn.call(elem.attribs, name)) return;
    delete elem.attribs[name];
}
/**
 * Splits a space-separated list of names to individual names.
 *
 * @category Attributes
 * @param names - Names to split.
 * @returns - Split names.
 */ function splitNames(names) {
    return names ? names.trim().split(rspace) : [];
}
/**
 * Method for removing attributes by `name`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').removeAttr('class').html();
 * //=> <li>Pear</li>
 *
 * $('.apple').attr('id', 'favorite');
 * $('.apple').removeAttr('id class').html();
 * //=> <li>Apple</li>
 * ```
 *
 * @param name - Name of the attribute.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/removeAttr/}
 */ function removeAttr(name) {
    const attrNames = splitNames(name);
    for(let i = 0; i < attrNames.length; i++){
        domEach(this, (elem)=>{
            if (node_isTag(elem)) removeAttribute(elem, attrNames[i]);
        });
    }
    return this;
}
/**
 * Check to see if _any_ of the matched elements have the given `className`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').hasClass('pear');
 * //=> true
 *
 * $('apple').hasClass('fruit');
 * //=> false
 *
 * $('li').hasClass('pear');
 * //=> true
 * ```
 *
 * @param className - Name of the class.
 * @returns Indicates if an element has the given `className`.
 * @see {@link https://api.jquery.com/hasClass/}
 */ function hasClass(className) {
    return this.toArray().some((elem)=>{
        const clazz = node_isTag(elem) && elem.attribs["class"];
        let idx = -1;
        if (clazz && className.length) {
            while((idx = clazz.indexOf(className, idx + 1)) > -1){
                const end = idx + className.length;
                if ((idx === 0 || rspace.test(clazz[idx - 1])) && (end === clazz.length || rspace.test(clazz[end]))) {
                    return true;
                }
            }
        }
        return false;
    });
}
/**
 * Adds class(es) to all of the matched elements. Also accepts a `function`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').addClass('fruit').html();
 * //=> <li class="pear fruit">Pear</li>
 *
 * $('.apple').addClass('fruit red').html();
 * //=> <li class="apple fruit red">Apple</li>
 * ```
 *
 * @param value - Name of new class.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/addClass/}
 */ function addClass(value) {
    // Support functions
    if (typeof value === "function") {
        return domEach(this, (el, i)=>{
            if (node_isTag(el)) {
                const className = el.attribs["class"] || "";
                addClass.call([
                    el
                ], value.call(el, i, className));
            }
        });
    }
    // Return if no value or not a string or function
    if (!value || typeof value !== "string") return this;
    const classNames = value.split(rspace);
    const numElements = this.length;
    for(let i = 0; i < numElements; i++){
        const el = this[i];
        // If selected element isn't a tag, move on
        if (!node_isTag(el)) continue;
        // If we don't already have classes — always set xmlMode to false here, as it doesn't matter for classes
        const className = getAttr(el, "class", false);
        if (!className) {
            setAttr(el, "class", classNames.join(" ").trim());
        } else {
            let setClass = ` ${className} `;
            // Check if class already exists
            for(let j = 0; j < classNames.length; j++){
                const appendClass = `${classNames[j]} `;
                if (!setClass.includes(` ${appendClass}`)) setClass += appendClass;
            }
            setAttr(el, "class", setClass.trim());
        }
    }
    return this;
}
/**
 * Removes one or more space-separated classes from the selected elements. If no
 * `className` is defined, all classes will be removed. Also accepts a `function`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.pear').removeClass('pear').html();
 * //=> <li class="">Pear</li>
 *
 * $('.apple').addClass('red').removeClass().html();
 * //=> <li class="">Apple</li>
 * ```
 *
 * @param name - Name of the class. If not specified, removes all elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/removeClass/}
 */ function removeClass(name) {
    // Handle if value is a function
    if (typeof name === "function") {
        return domEach(this, (el, i)=>{
            if (node_isTag(el)) {
                removeClass.call([
                    el
                ], name.call(el, i, el.attribs["class"] || ""));
            }
        });
    }
    const classes = splitNames(name);
    const numClasses = classes.length;
    const removeAll = arguments.length === 0;
    return domEach(this, (el)=>{
        if (!node_isTag(el)) return;
        if (removeAll) {
            // Short circuit the remove all case as this is the nice one
            el.attribs["class"] = "";
        } else {
            const elClasses = splitNames(el.attribs["class"]);
            let changed = false;
            for(let j = 0; j < numClasses; j++){
                const index = elClasses.indexOf(classes[j]);
                if (index >= 0) {
                    elClasses.splice(index, 1);
                    changed = true;
                    /*
                     * We have to do another pass to ensure that there are not duplicate
                     * classes listed
                     */ j--;
                }
            }
            if (changed) {
                el.attribs["class"] = elClasses.join(" ");
            }
        }
    });
}
/**
 * Add or remove class(es) from the matched elements, depending on either the
 * class's presence or the value of the switch argument. Also accepts a `function`.
 *
 * @category Attributes
 * @example
 *
 * ```js
 * $('.apple.green').toggleClass('fruit green red').html();
 * //=> <li class="apple fruit red">Apple</li>
 *
 * $('.apple.green').toggleClass('fruit green red', true).html();
 * //=> <li class="apple green fruit red">Apple</li>
 * ```
 *
 * @param value - Name of the class. Can also be a function.
 * @param stateVal - If specified the state of the class.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/toggleClass/}
 */ function toggleClass(value, stateVal) {
    // Support functions
    if (typeof value === "function") {
        return domEach(this, (el, i)=>{
            if (node_isTag(el)) {
                toggleClass.call([
                    el
                ], value.call(el, i, el.attribs["class"] || "", stateVal), stateVal);
            }
        });
    }
    // Return if no value or not a string or function
    if (!value || typeof value !== "string") return this;
    const classNames = value.split(rspace);
    const numClasses = classNames.length;
    const state = typeof stateVal === "boolean" ? stateVal ? 1 : -1 : 0;
    const numElements = this.length;
    for(let i = 0; i < numElements; i++){
        const el = this[i];
        // If selected element isn't a tag, move on
        if (!node_isTag(el)) continue;
        const elementClasses = splitNames(el.attribs["class"]);
        // Check if class already exists
        for(let j = 0; j < numClasses; j++){
            // Check if the class name is currently defined
            const index = elementClasses.indexOf(classNames[j]);
            // Add if stateValue === true or we are toggling and there is no value
            if (state >= 0 && index < 0) {
                elementClasses.push(classNames[j]);
            } else if (state <= 0 && index >= 0) {
                // Otherwise remove but only if the item exists
                elementClasses.splice(index, 1);
            }
        }
        el.attribs["class"] = elementClasses.join(" ");
    }
    return this;
} //# sourceMappingURL=attributes.js.map

// EXTERNAL MODULE: ./node_modules/css-what/lib/commonjs/index.js
var commonjs = __webpack_require__(85065);
// EXTERNAL MODULE: ./node_modules/boolbase/index.js
var boolbase = __webpack_require__(1385);
;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/sort.js

const procedure = new Map([
    [
        commonjs.SelectorType.Universal,
        50
    ],
    [
        commonjs.SelectorType.Tag,
        30
    ],
    [
        commonjs.SelectorType.Attribute,
        1
    ],
    [
        commonjs.SelectorType.Pseudo,
        0
    ]
]);
function isTraversal(token) {
    return !procedure.has(token.type);
}
const attributes = new Map([
    [
        commonjs.AttributeAction.Exists,
        10
    ],
    [
        commonjs.AttributeAction.Equals,
        8
    ],
    [
        commonjs.AttributeAction.Not,
        7
    ],
    [
        commonjs.AttributeAction.Start,
        6
    ],
    [
        commonjs.AttributeAction.End,
        6
    ],
    [
        commonjs.AttributeAction.Any,
        5
    ]
]);
/**
 * Sort the parts of the passed selector,
 * as there is potential for optimization
 * (some types of selectors are faster than others)
 *
 * @param arr Selector to sort
 */ function sortByProcedure(arr) {
    const procs = arr.map(getProcedure);
    for(let i = 1; i < arr.length; i++){
        const procNew = procs[i];
        if (procNew < 0) continue;
        for(let j = i - 1; j >= 0 && procNew < procs[j]; j--){
            const token = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = token;
            procs[j + 1] = procs[j];
            procs[j] = procNew;
        }
    }
}
function getProcedure(token) {
    var _a, _b;
    let proc = (_a = procedure.get(token.type)) !== null && _a !== void 0 ? _a : -1;
    if (token.type === commonjs.SelectorType.Attribute) {
        proc = (_b = attributes.get(token.action)) !== null && _b !== void 0 ? _b : 4;
        if (token.action === commonjs.AttributeAction.Equals && token.name === "id") {
            // Prefer ID selectors (eg. #ID)
            proc = 9;
        }
        if (token.ignoreCase) {
            /*
             * IgnoreCase adds some overhead, prefer "normal" token
             * this is a binary operation, to ensure it's still an int
             */ proc >>= 1;
        }
    } else if (token.type === commonjs.SelectorType.Pseudo) {
        if (!token.data) {
            proc = 3;
        } else if (token.name === "has" || token.name === "contains") {
            proc = 0; // Expensive in any case
        } else if (Array.isArray(token.data)) {
            // Eg. :matches, :not
            proc = Math.min(...token.data.map((d)=>Math.min(...d.map(getProcedure))));
            // If we have traversals, try to avoid executing this selector
            if (proc < 0) {
                proc = 0;
            }
        } else {
            proc = 2;
        }
    }
    return proc;
} //# sourceMappingURL=sort.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/attributes.js

/**
 * All reserved characters in a regex, used for escaping.
 *
 * Taken from XRegExp, (c) 2007-2020 Steven Levithan under the MIT license
 * https://github.com/slevithan/xregexp/blob/95eeebeb8fac8754d54eafe2b4743661ac1cf028/src/xregexp.js#L794
 */ const reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
function escapeRegex(value) {
    return value.replace(reChars, "\\$&");
}
/**
 * Attributes that are case-insensitive in HTML.
 *
 * @private
 * @see https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
 */ const caseInsensitiveAttributes = new Set([
    "accept",
    "accept-charset",
    "align",
    "alink",
    "axis",
    "bgcolor",
    "charset",
    "checked",
    "clear",
    "codetype",
    "color",
    "compact",
    "declare",
    "defer",
    "dir",
    "direction",
    "disabled",
    "enctype",
    "face",
    "frame",
    "hreflang",
    "http-equiv",
    "lang",
    "language",
    "link",
    "media",
    "method",
    "multiple",
    "nohref",
    "noresize",
    "noshade",
    "nowrap",
    "readonly",
    "rel",
    "rev",
    "rules",
    "scope",
    "scrolling",
    "selected",
    "shape",
    "target",
    "text",
    "type",
    "valign",
    "valuetype",
    "vlink"
]);
function shouldIgnoreCase(selector, options) {
    return typeof selector.ignoreCase === "boolean" ? selector.ignoreCase : selector.ignoreCase === "quirks" ? !!options.quirksMode : !options.xmlMode && caseInsensitiveAttributes.has(selector.name);
}
/**
 * Attribute selectors
 */ const attributeRules = {
    equals (next, data, options) {
        const { adapter } = options;
        const { name } = data;
        let { value } = data;
        if (shouldIgnoreCase(data, options)) {
            value = value.toLowerCase();
            return (elem)=>{
                const attr = adapter.getAttributeValue(elem, name);
                return attr != null && attr.length === value.length && attr.toLowerCase() === value && next(elem);
            };
        }
        return (elem)=>adapter.getAttributeValue(elem, name) === value && next(elem);
    },
    hyphen (next, data, options) {
        const { adapter } = options;
        const { name } = data;
        let { value } = data;
        const len = value.length;
        if (shouldIgnoreCase(data, options)) {
            value = value.toLowerCase();
            return function hyphenIC(elem) {
                const attr = adapter.getAttributeValue(elem, name);
                return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len).toLowerCase() === value && next(elem);
            };
        }
        return function hyphen(elem) {
            const attr = adapter.getAttributeValue(elem, name);
            return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len) === value && next(elem);
        };
    },
    element (next, data, options) {
        const { adapter } = options;
        const { name, value } = data;
        if (/\s/.test(value)) {
            return boolbase.falseFunc;
        }
        const regex = new RegExp(`(?:^|\\s)${escapeRegex(value)}(?:$|\\s)`, shouldIgnoreCase(data, options) ? "i" : "");
        return function element(elem) {
            const attr = adapter.getAttributeValue(elem, name);
            return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
        };
    },
    exists (next, { name }, { adapter }) {
        return (elem)=>adapter.hasAttrib(elem, name) && next(elem);
    },
    start (next, data, options) {
        const { adapter } = options;
        const { name } = data;
        let { value } = data;
        const len = value.length;
        if (len === 0) {
            return boolbase.falseFunc;
        }
        if (shouldIgnoreCase(data, options)) {
            value = value.toLowerCase();
            return (elem)=>{
                const attr = adapter.getAttributeValue(elem, name);
                return attr != null && attr.length >= len && attr.substr(0, len).toLowerCase() === value && next(elem);
            };
        }
        return (elem)=>{
            var _a;
            return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.startsWith(value)) && next(elem);
        };
    },
    end (next, data, options) {
        const { adapter } = options;
        const { name } = data;
        let { value } = data;
        const len = -value.length;
        if (len === 0) {
            return boolbase.falseFunc;
        }
        if (shouldIgnoreCase(data, options)) {
            value = value.toLowerCase();
            return (elem)=>{
                var _a;
                return ((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.substr(len).toLowerCase()) === value && next(elem);
            };
        }
        return (elem)=>{
            var _a;
            return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.endsWith(value)) && next(elem);
        };
    },
    any (next, data, options) {
        const { adapter } = options;
        const { name, value } = data;
        if (value === "") {
            return boolbase.falseFunc;
        }
        if (shouldIgnoreCase(data, options)) {
            const regex = new RegExp(escapeRegex(value), "i");
            return function anyIC(elem) {
                const attr = adapter.getAttributeValue(elem, name);
                return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
            };
        }
        return (elem)=>{
            var _a;
            return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.includes(value)) && next(elem);
        };
    },
    not (next, data, options) {
        const { adapter } = options;
        const { name } = data;
        let { value } = data;
        if (value === "") {
            return (elem)=>!!adapter.getAttributeValue(elem, name) && next(elem);
        } else if (shouldIgnoreCase(data, options)) {
            value = value.toLowerCase();
            return (elem)=>{
                const attr = adapter.getAttributeValue(elem, name);
                return (attr == null || attr.length !== value.length || attr.toLowerCase() !== value) && next(elem);
            };
        }
        return (elem)=>adapter.getAttributeValue(elem, name) !== value && next(elem);
    }
}; //# sourceMappingURL=attributes.js.map

;// CONCATENATED MODULE: ./node_modules/nth-check/lib/esm/parse.js
// Following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
// Whitespace as per https://www.w3.org/TR/selectors-3/#lex is " \t\r\n\f"
const whitespace = new Set([
    9,
    10,
    12,
    13,
    32
]);
const ZERO = "0".charCodeAt(0);
const NINE = "9".charCodeAt(0);
/**
 * Parses an expression.
 *
 * @throws An `Error` if parsing fails.
 * @returns An array containing the integer step size and the integer offset of the nth rule.
 * @example nthCheck.parse("2n+3"); // returns [2, 3]
 */ function parse_parse(formula) {
    formula = formula.trim().toLowerCase();
    if (formula === "even") {
        return [
            2,
            0
        ];
    } else if (formula === "odd") {
        return [
            2,
            1
        ];
    }
    // Parse [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
    let idx = 0;
    let a = 0;
    let sign = readSign();
    let number = readNumber();
    if (idx < formula.length && formula.charAt(idx) === "n") {
        idx++;
        a = sign * (number !== null && number !== void 0 ? number : 1);
        skipWhitespace();
        if (idx < formula.length) {
            sign = readSign();
            skipWhitespace();
            number = readNumber();
        } else {
            sign = number = 0;
        }
    }
    // Throw if there is anything else
    if (number === null || idx < formula.length) {
        throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
    }
    return [
        a,
        sign * number
    ];
    function readSign() {
        if (formula.charAt(idx) === "-") {
            idx++;
            return -1;
        }
        if (formula.charAt(idx) === "+") {
            idx++;
        }
        return 1;
    }
    function readNumber() {
        const start = idx;
        let value = 0;
        while(idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE){
            value = value * 10 + (formula.charCodeAt(idx) - ZERO);
            idx++;
        }
        // Return `null` if we didn't read anything.
        return idx === start ? null : value;
    }
    function skipWhitespace() {
        while(idx < formula.length && whitespace.has(formula.charCodeAt(idx))){
            idx++;
        }
    }
} //# sourceMappingURL=parse.js.map

;// CONCATENATED MODULE: ./node_modules/nth-check/lib/esm/compile.js

/**
 * Returns a function that checks if an elements index matches the given rule
 * highly optimized to return the fastest solution.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A highly optimized function that returns whether an index matches the nth-check.
 * @example
 *
 * ```js
 * const check = nthCheck.compile([2, 3]);
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 * ```
 */ function compile(parsed) {
    const a = parsed[0];
    // Subtract 1 from `b`, to convert from one- to zero-indexed.
    const b = parsed[1] - 1;
    /*
     * When `b <= 0`, `a * n` won't be lead to any matches for `a < 0`.
     * Besides, the specification states that no elements are
     * matched when `a` and `b` are 0.
     *
     * `b < 0` here as we subtracted 1 from `b` above.
     */ if (b < 0 && a <= 0) return boolbase.falseFunc;
    // When `a` is in the range -1..1, it matches any element (so only `b` is checked).
    if (a === -1) return (index)=>index <= b;
    if (a === 0) return (index)=>index === b;
    // When `b <= 0` and `a === 1`, they match any element.
    if (a === 1) return b < 0 ? boolbase.trueFunc : (index)=>index >= b;
    /*
     * Otherwise, modulo can be used to check if there is a match.
     *
     * Modulo doesn't care about the sign, so let's use `a`s absolute value.
     */ const absA = Math.abs(a);
    // Get `b mod a`, + a if this is negative.
    const bMod = (b % absA + absA) % absA;
    return a > 1 ? (index)=>index >= b && index % absA === bMod : (index)=>index <= b && index % absA === bMod;
}
/**
 * Returns a function that produces a monotonously increasing sequence of indices.
 *
 * If the sequence has an end, the returned function will return `null` after
 * the last index in the sequence.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing (2n+3)</caption>
 *
 * ```js
 * const gen = nthCheck.generate([2, 3])
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value (-2n+10)</caption>
 *
 * ```js
 *
 * const gen = nthCheck.generate([-2, 5]);
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */ function compile_generate(parsed) {
    const a = parsed[0];
    // Subtract 1 from `b`, to convert from one- to zero-indexed.
    let b = parsed[1] - 1;
    let n = 0;
    // Make sure to always return an increasing sequence
    if (a < 0) {
        const aPos = -a;
        // Get `b mod a`
        const minValue = (b % aPos + aPos) % aPos;
        return ()=>{
            const val = minValue + aPos * n++;
            return val > b ? null : val;
        };
    }
    if (a === 0) return b < 0 ? ()=>null : ()=>n++ === 0 ? b : null;
    if (b < 0) {
        b += a * Math.ceil(-b / a);
    }
    return ()=>a * n++ + b;
} //# sourceMappingURL=compile.js.map

;// CONCATENATED MODULE: ./node_modules/nth-check/lib/esm/index.js



/**
 * Parses and compiles a formula to a highly optimized function.
 * Combination of {@link parse} and {@link compile}.
 *
 * If the formula doesn't match any elements,
 * it returns [`boolbase`](https://github.com/fb55/boolbase)'s `falseFunc`.
 * Otherwise, a function accepting an _index_ is returned, which returns
 * whether or not the passed _index_ matches the formula.
 *
 * Note: The nth-rule starts counting at `1`, the returned function at `0`.
 *
 * @param formula The formula to compile.
 * @example
 * const check = nthCheck("2n+3");
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 */ function nthCheck(formula) {
    return compile(parse_parse(formula));
}
/**
 * Parses and compiles a formula to a generator that produces a sequence of indices.
 * Combination of {@link parse} and {@link generate}.
 *
 * @param formula The formula to compile.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing</caption>
 *
 * ```js
 * const gen = nthCheck.sequence('2n+3')
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value</caption>
 *
 * ```js
 *
 * const gen = nthCheck.sequence('-2n+5');
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */ function sequence(formula) {
    return generate(parse(formula));
} //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/pseudo-selectors/filters.js


function getChildFunc(next, adapter) {
    return (elem)=>{
        const parent = adapter.getParent(elem);
        return parent != null && adapter.isTag(parent) && next(elem);
    };
}
const filters = {
    contains (next, text, { adapter }) {
        return function contains(elem) {
            return next(elem) && adapter.getText(elem).includes(text);
        };
    },
    icontains (next, text, { adapter }) {
        const itext = text.toLowerCase();
        return function icontains(elem) {
            return next(elem) && adapter.getText(elem).toLowerCase().includes(itext);
        };
    },
    // Location specific methods
    "nth-child" (next, rule, { adapter, equals }) {
        const func = nthCheck(rule);
        if (func === boolbase.falseFunc) return boolbase.falseFunc;
        if (func === boolbase.trueFunc) return getChildFunc(next, adapter);
        return function nthChild(elem) {
            const siblings = adapter.getSiblings(elem);
            let pos = 0;
            for(let i = 0; i < siblings.length; i++){
                if (equals(elem, siblings[i])) break;
                if (adapter.isTag(siblings[i])) {
                    pos++;
                }
            }
            return func(pos) && next(elem);
        };
    },
    "nth-last-child" (next, rule, { adapter, equals }) {
        const func = nthCheck(rule);
        if (func === boolbase.falseFunc) return boolbase.falseFunc;
        if (func === boolbase.trueFunc) return getChildFunc(next, adapter);
        return function nthLastChild(elem) {
            const siblings = adapter.getSiblings(elem);
            let pos = 0;
            for(let i = siblings.length - 1; i >= 0; i--){
                if (equals(elem, siblings[i])) break;
                if (adapter.isTag(siblings[i])) {
                    pos++;
                }
            }
            return func(pos) && next(elem);
        };
    },
    "nth-of-type" (next, rule, { adapter, equals }) {
        const func = nthCheck(rule);
        if (func === boolbase.falseFunc) return boolbase.falseFunc;
        if (func === boolbase.trueFunc) return getChildFunc(next, adapter);
        return function nthOfType(elem) {
            const siblings = adapter.getSiblings(elem);
            let pos = 0;
            for(let i = 0; i < siblings.length; i++){
                const currentSibling = siblings[i];
                if (equals(elem, currentSibling)) break;
                if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
                    pos++;
                }
            }
            return func(pos) && next(elem);
        };
    },
    "nth-last-of-type" (next, rule, { adapter, equals }) {
        const func = nthCheck(rule);
        if (func === boolbase.falseFunc) return boolbase.falseFunc;
        if (func === boolbase.trueFunc) return getChildFunc(next, adapter);
        return function nthLastOfType(elem) {
            const siblings = adapter.getSiblings(elem);
            let pos = 0;
            for(let i = siblings.length - 1; i >= 0; i--){
                const currentSibling = siblings[i];
                if (equals(elem, currentSibling)) break;
                if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
                    pos++;
                }
            }
            return func(pos) && next(elem);
        };
    },
    // TODO determine the actual root element
    root (next, _rule, { adapter }) {
        return (elem)=>{
            const parent = adapter.getParent(elem);
            return (parent == null || !adapter.isTag(parent)) && next(elem);
        };
    },
    scope (next, rule, options, context) {
        const { equals } = options;
        if (!context || context.length === 0) {
            // Equivalent to :root
            return filters["root"](next, rule, options);
        }
        if (context.length === 1) {
            // NOTE: can't be unpacked, as :has uses this for side-effects
            return (elem)=>equals(context[0], elem) && next(elem);
        }
        return (elem)=>context.includes(elem) && next(elem);
    },
    hover: dynamicStatePseudo("isHovered"),
    visited: dynamicStatePseudo("isVisited"),
    active: dynamicStatePseudo("isActive")
};
/**
 * Dynamic state pseudos. These depend on optional Adapter methods.
 *
 * @param name The name of the adapter method to call.
 * @returns Pseudo for the `filters` object.
 */ function dynamicStatePseudo(name) {
    return function dynamicPseudo(next, _rule, { adapter }) {
        const func = adapter[name];
        if (typeof func !== "function") {
            return boolbase.falseFunc;
        }
        return function active(elem) {
            return func(elem) && next(elem);
        };
    };
} //# sourceMappingURL=filters.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/pseudo-selectors/pseudos.js
// While filters are precompiled, pseudos get called when they are needed
const pseudos = {
    empty (elem, { adapter }) {
        return !adapter.getChildren(elem).some((elem)=>// FIXME: `getText` call is potentially expensive.
            adapter.isTag(elem) || adapter.getText(elem) !== "");
    },
    "first-child" (elem, { adapter, equals }) {
        if (adapter.prevElementSibling) {
            return adapter.prevElementSibling(elem) == null;
        }
        const firstChild = adapter.getSiblings(elem).find((elem)=>adapter.isTag(elem));
        return firstChild != null && equals(elem, firstChild);
    },
    "last-child" (elem, { adapter, equals }) {
        const siblings = adapter.getSiblings(elem);
        for(let i = siblings.length - 1; i >= 0; i--){
            if (equals(elem, siblings[i])) return true;
            if (adapter.isTag(siblings[i])) break;
        }
        return false;
    },
    "first-of-type" (elem, { adapter, equals }) {
        const siblings = adapter.getSiblings(elem);
        const elemName = adapter.getName(elem);
        for(let i = 0; i < siblings.length; i++){
            const currentSibling = siblings[i];
            if (equals(elem, currentSibling)) return true;
            if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
                break;
            }
        }
        return false;
    },
    "last-of-type" (elem, { adapter, equals }) {
        const siblings = adapter.getSiblings(elem);
        const elemName = adapter.getName(elem);
        for(let i = siblings.length - 1; i >= 0; i--){
            const currentSibling = siblings[i];
            if (equals(elem, currentSibling)) return true;
            if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
                break;
            }
        }
        return false;
    },
    "only-of-type" (elem, { adapter, equals }) {
        const elemName = adapter.getName(elem);
        return adapter.getSiblings(elem).every((sibling)=>equals(elem, sibling) || !adapter.isTag(sibling) || adapter.getName(sibling) !== elemName);
    },
    "only-child" (elem, { adapter, equals }) {
        return adapter.getSiblings(elem).every((sibling)=>equals(elem, sibling) || !adapter.isTag(sibling));
    }
};
function verifyPseudoArgs(func, name, subselect, argIndex) {
    if (subselect === null) {
        if (func.length > argIndex) {
            throw new Error(`Pseudo-class :${name} requires an argument`);
        }
    } else if (func.length === argIndex) {
        throw new Error(`Pseudo-class :${name} doesn't have any arguments`);
    }
} //# sourceMappingURL=pseudos.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/pseudo-selectors/aliases.js
/**
 * Aliases are pseudos that are expressed as selectors.
 */ const aliases = {
    // Links
    "any-link": ":is(a, area, link)[href]",
    link: ":any-link:not(:visited)",
    // Forms
    // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
    disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
    enabled: ":not(:disabled)",
    checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
    required: ":is(input, select, textarea)[required]",
    optional: ":is(input, select, textarea):not([required])",
    // JQuery extensions
    // https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
    selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
    checkbox: "[type=checkbox]",
    file: "[type=file]",
    password: "[type=password]",
    radio: "[type=radio]",
    reset: "[type=reset]",
    image: "[type=image]",
    submit: "[type=submit]",
    parent: ":not(:empty)",
    header: ":is(h1, h2, h3, h4, h5, h6)",
    button: ":is(button, input[type=button])",
    input: ":is(input, textarea, select, button)",
    text: "input:is(:not([type!='']), [type=text])"
}; //# sourceMappingURL=aliases.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/pseudo-selectors/subselects.js


/** Used as a placeholder for :has. Will be replaced with the actual element. */ const PLACEHOLDER_ELEMENT = {};
function ensureIsTag(next, adapter) {
    if (next === boolbase.falseFunc) return boolbase.falseFunc;
    return (elem)=>adapter.isTag(elem) && next(elem);
}
function getNextSiblings(elem, adapter) {
    const siblings = adapter.getSiblings(elem);
    if (siblings.length <= 1) return [];
    const elemIndex = siblings.indexOf(elem);
    if (elemIndex < 0 || elemIndex === siblings.length - 1) return [];
    return siblings.slice(elemIndex + 1).filter(adapter.isTag);
}
function copyOptions(options) {
    // Not copied: context, rootFunc
    return {
        xmlMode: !!options.xmlMode,
        lowerCaseAttributeNames: !!options.lowerCaseAttributeNames,
        lowerCaseTags: !!options.lowerCaseTags,
        quirksMode: !!options.quirksMode,
        cacheResults: !!options.cacheResults,
        pseudos: options.pseudos,
        adapter: options.adapter,
        equals: options.equals
    };
}
const is = (next, token, options, context, compileToken)=>{
    const func = compileToken(token, copyOptions(options), context);
    return func === boolbase.trueFunc ? next : func === boolbase.falseFunc ? boolbase.falseFunc : (elem)=>func(elem) && next(elem);
};
/*
 * :not, :has, :is, :matches and :where have to compile selectors
 * doing this in src/pseudos.ts would lead to circular dependencies,
 * so we add them here
 */ const subselects = {
    is,
    /**
     * `:matches` and `:where` are aliases for `:is`.
     */ matches: is,
    where: is,
    not (next, token, options, context, compileToken) {
        const func = compileToken(token, copyOptions(options), context);
        return func === boolbase.falseFunc ? next : func === boolbase.trueFunc ? boolbase.falseFunc : (elem)=>!func(elem) && next(elem);
    },
    has (next, subselect, options, _context, compileToken) {
        const { adapter } = options;
        const opts = copyOptions(options);
        opts.relativeSelector = true;
        const context = subselect.some((s)=>s.some(isTraversal)) ? [
            PLACEHOLDER_ELEMENT
        ] : undefined;
        const compiled = compileToken(subselect, opts, context);
        if (compiled === boolbase.falseFunc) return boolbase.falseFunc;
        const hasElement = ensureIsTag(compiled, adapter);
        // If `compiled` is `trueFunc`, we can skip this.
        if (context && compiled !== boolbase.trueFunc) {
            /*
             * `shouldTestNextSiblings` will only be true if the query starts with
             * a traversal (sibling or adjacent). That means we will always have a context.
             */ const { shouldTestNextSiblings = false } = compiled;
            return (elem)=>{
                if (!next(elem)) return false;
                context[0] = elem;
                const childs = adapter.getChildren(elem);
                const nextElements = shouldTestNextSiblings ? [
                    ...childs,
                    ...getNextSiblings(elem, adapter)
                ] : childs;
                return adapter.existsOne(hasElement, nextElements);
            };
        }
        return (elem)=>next(elem) && adapter.existsOne(hasElement, adapter.getChildren(elem));
    }
}; //# sourceMappingURL=subselects.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/pseudo-selectors/index.js






function compilePseudoSelector(next, selector, options, context, compileToken) {
    var _a;
    const { name, data } = selector;
    if (Array.isArray(data)) {
        if (!(name in subselects)) {
            throw new Error(`Unknown pseudo-class :${name}(${data})`);
        }
        return subselects[name](next, data, options, context, compileToken);
    }
    const userPseudo = (_a = options.pseudos) === null || _a === void 0 ? void 0 : _a[name];
    const stringPseudo = typeof userPseudo === "string" ? userPseudo : aliases[name];
    if (typeof stringPseudo === "string") {
        if (data != null) {
            throw new Error(`Pseudo ${name} doesn't have any arguments`);
        }
        // The alias has to be parsed here, to make sure options are respected.
        const alias = (0,commonjs.parse)(stringPseudo);
        return subselects["is"](next, alias, options, context, compileToken);
    }
    if (typeof userPseudo === "function") {
        verifyPseudoArgs(userPseudo, name, data, 1);
        return (elem)=>userPseudo(elem, data) && next(elem);
    }
    if (name in filters) {
        return filters[name](next, data, options, context);
    }
    if (name in pseudos) {
        const pseudo = pseudos[name];
        verifyPseudoArgs(pseudo, name, data, 2);
        return (elem)=>pseudo(elem, options, data) && next(elem);
    }
    throw new Error(`Unknown pseudo-class :${name}`);
} //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/general.js



function getElementParent(node, adapter) {
    const parent = adapter.getParent(node);
    if (parent && adapter.isTag(parent)) {
        return parent;
    }
    return null;
}
/*
 * All available rules
 */ function compileGeneralSelector(next, selector, options, context, compileToken) {
    const { adapter, equals } = options;
    switch(selector.type){
        case commonjs.SelectorType.PseudoElement:
            {
                throw new Error("Pseudo-elements are not supported by css-select");
            }
        case commonjs.SelectorType.ColumnCombinator:
            {
                throw new Error("Column combinators are not yet supported by css-select");
            }
        case commonjs.SelectorType.Attribute:
            {
                if (selector.namespace != null) {
                    throw new Error("Namespaced attributes are not yet supported by css-select");
                }
                if (!options.xmlMode || options.lowerCaseAttributeNames) {
                    selector.name = selector.name.toLowerCase();
                }
                return attributeRules[selector.action](next, selector, options);
            }
        case commonjs.SelectorType.Pseudo:
            {
                return compilePseudoSelector(next, selector, options, context, compileToken);
            }
        // Tags
        case commonjs.SelectorType.Tag:
            {
                if (selector.namespace != null) {
                    throw new Error("Namespaced tag names are not yet supported by css-select");
                }
                let { name } = selector;
                if (!options.xmlMode || options.lowerCaseTags) {
                    name = name.toLowerCase();
                }
                return function tag(elem) {
                    return adapter.getName(elem) === name && next(elem);
                };
            }
        // Traversal
        case commonjs.SelectorType.Descendant:
            {
                if (options.cacheResults === false || typeof WeakSet === "undefined") {
                    return function descendant(elem) {
                        let current = elem;
                        while(current = getElementParent(current, adapter)){
                            if (next(current)) {
                                return true;
                            }
                        }
                        return false;
                    };
                }
                // @ts-expect-error `ElementNode` is not extending object
                const isFalseCache = new WeakSet();
                return function cachedDescendant(elem) {
                    let current = elem;
                    while(current = getElementParent(current, adapter)){
                        if (!isFalseCache.has(current)) {
                            if (adapter.isTag(current) && next(current)) {
                                return true;
                            }
                            isFalseCache.add(current);
                        }
                    }
                    return false;
                };
            }
        case "_flexibleDescendant":
            {
                // Include element itself, only used while querying an array
                return function flexibleDescendant(elem) {
                    let current = elem;
                    do {
                        if (next(current)) return true;
                    }while (current = getElementParent(current, adapter));
                    return false;
                };
            }
        case commonjs.SelectorType.Parent:
            {
                return function parent(elem) {
                    return adapter.getChildren(elem).some((elem)=>adapter.isTag(elem) && next(elem));
                };
            }
        case commonjs.SelectorType.Child:
            {
                return function child(elem) {
                    const parent = adapter.getParent(elem);
                    return parent != null && adapter.isTag(parent) && next(parent);
                };
            }
        case commonjs.SelectorType.Sibling:
            {
                return function sibling(elem) {
                    const siblings = adapter.getSiblings(elem);
                    for(let i = 0; i < siblings.length; i++){
                        const currentSibling = siblings[i];
                        if (equals(elem, currentSibling)) break;
                        if (adapter.isTag(currentSibling) && next(currentSibling)) {
                            return true;
                        }
                    }
                    return false;
                };
            }
        case commonjs.SelectorType.Adjacent:
            {
                if (adapter.prevElementSibling) {
                    return function adjacent(elem) {
                        const previous = adapter.prevElementSibling(elem);
                        return previous != null && next(previous);
                    };
                }
                return function adjacent(elem) {
                    const siblings = adapter.getSiblings(elem);
                    let lastElement;
                    for(let i = 0; i < siblings.length; i++){
                        const currentSibling = siblings[i];
                        if (equals(elem, currentSibling)) break;
                        if (adapter.isTag(currentSibling)) {
                            lastElement = currentSibling;
                        }
                    }
                    return !!lastElement && next(lastElement);
                };
            }
        case commonjs.SelectorType.Universal:
            {
                if (selector.namespace != null && selector.namespace !== "*") {
                    throw new Error("Namespaced universal selectors are not yet supported by css-select");
                }
                return next;
            }
    }
} //# sourceMappingURL=general.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/compile.js





/**
 * Compiles a selector to an executable function.
 *
 * @param selector Selector to compile.
 * @param options Compilation options.
 * @param context Optional context for the selector.
 */ function compile_compile(selector, options, context) {
    const next = compileUnsafe(selector, options, context);
    return ensureIsTag(next, options.adapter);
}
function compileUnsafe(selector, options, context) {
    const token = typeof selector === "string" ? (0,commonjs.parse)(selector) : selector;
    return compileToken(token, options, context);
}
function includesScopePseudo(t) {
    return t.type === commonjs.SelectorType.Pseudo && (t.name === "scope" || Array.isArray(t.data) && t.data.some((data)=>data.some(includesScopePseudo)));
}
const DESCENDANT_TOKEN = {
    type: commonjs.SelectorType.Descendant
};
const FLEXIBLE_DESCENDANT_TOKEN = {
    type: "_flexibleDescendant"
};
const SCOPE_TOKEN = {
    type: commonjs.SelectorType.Pseudo,
    name: "scope",
    data: null
};
/*
 * CSS 4 Spec (Draft): 3.4.1. Absolutizing a Relative Selector
 * http://www.w3.org/TR/selectors4/#absolutizing
 */ function absolutize(token, { adapter }, context) {
    // TODO Use better check if the context is a document
    const hasContext = !!(context === null || context === void 0 ? void 0 : context.every((e)=>{
        const parent = adapter.isTag(e) && adapter.getParent(e);
        return e === PLACEHOLDER_ELEMENT || parent && adapter.isTag(parent);
    }));
    for (const t of token){
        if (t.length > 0 && isTraversal(t[0]) && t[0].type !== commonjs.SelectorType.Descendant) {
        // Don't continue in else branch
        } else if (hasContext && !t.some(includesScopePseudo)) {
            t.unshift(DESCENDANT_TOKEN);
        } else {
            continue;
        }
        t.unshift(SCOPE_TOKEN);
    }
}
function compileToken(token, options, context) {
    var _a;
    token.forEach(sortByProcedure);
    context = (_a = options.context) !== null && _a !== void 0 ? _a : context;
    const isArrayContext = Array.isArray(context);
    const finalContext = context && (Array.isArray(context) ? context : [
        context
    ]);
    // Check if the selector is relative
    if (options.relativeSelector !== false) {
        absolutize(token, options, finalContext);
    } else if (token.some((t)=>t.length > 0 && isTraversal(t[0]))) {
        throw new Error("Relative selectors are not allowed when the `relativeSelector` option is disabled");
    }
    let shouldTestNextSiblings = false;
    const query = token.map((rules)=>{
        if (rules.length >= 2) {
            const [first, second] = rules;
            if (first.type !== commonjs.SelectorType.Pseudo || first.name !== "scope") {
            // Ignore
            } else if (isArrayContext && second.type === commonjs.SelectorType.Descendant) {
                rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
            } else if (second.type === commonjs.SelectorType.Adjacent || second.type === commonjs.SelectorType.Sibling) {
                shouldTestNextSiblings = true;
            }
        }
        return compileRules(rules, options, finalContext);
    }).reduce(reduceRules, boolbase.falseFunc);
    query.shouldTestNextSiblings = shouldTestNextSiblings;
    return query;
}
function compileRules(rules, options, context) {
    var _a;
    return rules.reduce((previous, rule)=>previous === boolbase.falseFunc ? boolbase.falseFunc : compileGeneralSelector(previous, rule, options, context, compileToken), (_a = options.rootFunc) !== null && _a !== void 0 ? _a : boolbase.trueFunc);
}
function reduceRules(a, b) {
    if (b === boolbase.falseFunc || a === boolbase.trueFunc) {
        return a;
    }
    if (a === boolbase.falseFunc || b === boolbase.trueFunc) {
        return b;
    }
    return function combine(elem) {
        return a(elem) || b(elem);
    };
} //# sourceMappingURL=compile.js.map

;// CONCATENATED MODULE: ./node_modules/css-select/lib/esm/index.js




const defaultEquals = (a, b)=>a === b;
const defaultOptions = {
    adapter: domutils_lib_esm_namespaceObject,
    equals: defaultEquals
};
function convertOptionFormats(options) {
    var _a, _b, _c, _d;
    /*
     * We force one format of options to the other one.
     */ // @ts-expect-error Default options may have incompatible `Node` / `ElementNode`.
    const opts = options !== null && options !== void 0 ? options : defaultOptions;
    // @ts-expect-error Same as above.
    (_a = opts.adapter) !== null && _a !== void 0 ? _a : opts.adapter = domutils_lib_esm_namespaceObject;
    // @ts-expect-error `equals` does not exist on `Options`
    (_b = opts.equals) !== null && _b !== void 0 ? _b : opts.equals = (_d = (_c = opts.adapter) === null || _c === void 0 ? void 0 : _c.equals) !== null && _d !== void 0 ? _d : defaultEquals;
    return opts;
}
function wrapCompile(func) {
    return function addAdapter(selector, options, context) {
        const opts = convertOptionFormats(options);
        return func(selector, opts, context);
    };
}
/**
 * Compiles the query, returns a function.
 */ const esm_compile = wrapCompile(compile_compile);
const _compileUnsafe = wrapCompile(compileUnsafe);
const _compileToken = wrapCompile(compileToken);
function getSelectorFunc(searchFunc) {
    return function select(query, elements, options) {
        const opts = convertOptionFormats(options);
        if (typeof query !== "function") {
            query = compileUnsafe(query, opts, elements);
        }
        const filteredElements = prepareContext(elements, opts.adapter, query.shouldTestNextSiblings);
        return searchFunc(query, filteredElements, opts);
    };
}
function prepareContext(elems, adapter, shouldTestNextSiblings = false) {
    /*
     * Add siblings if the query requires them.
     * See https://github.com/fb55/css-select/pull/43#issuecomment-225414692
     */ if (shouldTestNextSiblings) {
        elems = appendNextSiblings(elems, adapter);
    }
    return Array.isArray(elems) ? adapter.removeSubsets(elems) : adapter.getChildren(elems);
}
function appendNextSiblings(elem, adapter) {
    // Order matters because jQuery seems to check the children before the siblings
    const elems = Array.isArray(elem) ? elem.slice(0) : [
        elem
    ];
    const elemsLength = elems.length;
    for(let i = 0; i < elemsLength; i++){
        const nextSiblings = getNextSiblings(elems[i], adapter);
        elems.push(...nextSiblings);
    }
    return elems;
}
/**
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elems Elements to query. If it is an element, its children will be queried..
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns All matching elements.
 *
 */ const selectAll = getSelectorFunc((query, elems, options)=>query === boolbase.falseFunc || !elems || elems.length === 0 ? [] : options.adapter.findAll(query, elems));
/**
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elems Elements to query. If it is an element, its children will be queried..
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns the first match, or null if there was no match.
 */ const selectOne = getSelectorFunc((query, elems, options)=>query === boolbase.falseFunc || !elems || elems.length === 0 ? null : options.adapter.findOne(query, elems));
/**
 * Tests whether or not an element is matched by query.
 *
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elem The element to test if it matches the query.
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns
 */ function esm_is(elem, query, options) {
    const opts = convertOptionFormats(options);
    return (typeof query === "function" ? query : compileRaw(query, opts))(elem);
}
/**
 * Alias for selectAll(query, elems, options).
 * @see [compile] for supported selector queries.
 */ /* harmony default export */ const css_select_lib_esm = ((/* unused pure expression or super */ null && (selectAll)));
// Export filters, pseudos and aliases to allow users to supply their own.
/** @deprecated Use the `pseudos` option instead. */  //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio-select/lib/esm/positionals.js
const filterNames = new Set([
    "first",
    "last",
    "eq",
    "gt",
    "nth",
    "lt",
    "even",
    "odd"
]);
function isFilter(s) {
    if (s.type !== "pseudo") return false;
    if (filterNames.has(s.name)) return true;
    if (s.name === "not" && Array.isArray(s.data)) {
        // Only consider `:not` with embedded filters
        return s.data.some((s)=>s.some(isFilter));
    }
    return false;
}
function getLimit(filter, data, partLimit) {
    const num = data != null ? parseInt(data, 10) : NaN;
    switch(filter){
        case "first":
            return 1;
        case "nth":
        case "eq":
            return isFinite(num) ? num >= 0 ? num + 1 : Infinity : 0;
        case "lt":
            return isFinite(num) ? num >= 0 ? Math.min(num, partLimit) : Infinity : 0;
        case "gt":
            return isFinite(num) ? Infinity : 0;
        case "odd":
            return 2 * partLimit;
        case "even":
            return 2 * partLimit - 1;
        case "last":
        case "not":
            return Infinity;
    }
} //# sourceMappingURL=positionals.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio-select/lib/esm/helpers.js

function getDocumentRoot(node) {
    while(node.parent)node = node.parent;
    return node;
}
function groupSelectors(selectors) {
    const filteredSelectors = [];
    const plainSelectors = [];
    for (const selector of selectors){
        if (selector.some(isFilter)) {
            filteredSelectors.push(selector);
        } else {
            plainSelectors.push(selector);
        }
    }
    return [
        plainSelectors,
        filteredSelectors
    ];
} //# sourceMappingURL=helpers.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio-select/lib/esm/index.js






// Re-export pseudo extension points

const UNIVERSAL_SELECTOR = {
    type: commonjs.SelectorType.Universal,
    namespace: null
};
const SCOPE_PSEUDO = {
    type: commonjs.SelectorType.Pseudo,
    name: "scope",
    data: null
};
function lib_esm_is(element, selector, options = {}) {
    return some([
        element
    ], selector, options);
}
function some(elements, selector, options = {}) {
    if (typeof selector === "function") return elements.some(selector);
    const [plain, filtered] = groupSelectors((0,commonjs.parse)(selector));
    return plain.length > 0 && elements.some(_compileToken(plain, options)) || filtered.some((sel)=>filterBySelector(sel, elements, options).length > 0);
}
function filterByPosition(filter, elems, data, options) {
    const num = typeof data === "string" ? parseInt(data, 10) : NaN;
    switch(filter){
        case "first":
        case "lt":
            // Already done in `getLimit`
            return elems;
        case "last":
            return elems.length > 0 ? [
                elems[elems.length - 1]
            ] : elems;
        case "nth":
        case "eq":
            return isFinite(num) && Math.abs(num) < elems.length ? [
                num < 0 ? elems[elems.length + num] : elems[num]
            ] : [];
        case "gt":
            return isFinite(num) ? elems.slice(num + 1) : [];
        case "even":
            return elems.filter((_, i)=>i % 2 === 0);
        case "odd":
            return elems.filter((_, i)=>i % 2 === 1);
        case "not":
            {
                const filtered = new Set(filterParsed(data, elems, options));
                return elems.filter((e)=>!filtered.has(e));
            }
    }
}
function esm_filter(selector, elements, options = {}) {
    return filterParsed((0,commonjs.parse)(selector), elements, options);
}
/**
 * Filter a set of elements by a selector.
 *
 * Will return elements in the original order.
 *
 * @param selector Selector to filter by.
 * @param elements Elements to filter.
 * @param options Options for selector.
 */ function filterParsed(selector, elements, options) {
    if (elements.length === 0) return [];
    const [plainSelectors, filteredSelectors] = groupSelectors(selector);
    let found;
    if (plainSelectors.length) {
        const filtered = filterElements(elements, plainSelectors, options);
        // If there are no filters, just return
        if (filteredSelectors.length === 0) {
            return filtered;
        }
        // Otherwise, we have to do some filtering
        if (filtered.length) {
            found = new Set(filtered);
        }
    }
    for(let i = 0; i < filteredSelectors.length && (found === null || found === void 0 ? void 0 : found.size) !== elements.length; i++){
        const filteredSelector = filteredSelectors[i];
        const missing = found ? elements.filter((e)=>node_isTag(e) && !found.has(e)) : elements;
        if (missing.length === 0) break;
        const filtered = filterBySelector(filteredSelector, elements, options);
        if (filtered.length) {
            if (!found) {
                /*
                 * If we haven't found anything before the last selector,
                 * just return what we found now.
                 */ if (i === filteredSelectors.length - 1) {
                    return filtered;
                }
                found = new Set(filtered);
            } else {
                filtered.forEach((el)=>found.add(el));
            }
        }
    }
    return typeof found !== "undefined" ? found.size === elements.length ? elements : elements.filter((el)=>found.has(el)) : [];
}
function filterBySelector(selector, elements, options) {
    var _a;
    if (selector.some(commonjs.isTraversal)) {
        /*
         * Get root node, run selector with the scope
         * set to all of our nodes.
         */ const root = (_a = options.root) !== null && _a !== void 0 ? _a : getDocumentRoot(elements[0]);
        const opts = {
            ...options,
            context: elements,
            relativeSelector: false
        };
        selector.push(SCOPE_PSEUDO);
        return findFilterElements(root, selector, opts, true, elements.length);
    }
    // Performance optimization: If we don't have to traverse, just filter set.
    return findFilterElements(elements, selector, options, false, elements.length);
}
function esm_select(selector, root, options = {}, limit = Infinity) {
    if (typeof selector === "function") {
        return esm_find(root, selector);
    }
    const [plain, filtered] = groupSelectors((0,commonjs.parse)(selector));
    const results = filtered.map((sel)=>findFilterElements(root, sel, options, true, limit));
    // Plain selectors can be queried in a single go
    if (plain.length) {
        results.push(findElements(root, plain, options, limit));
    }
    if (results.length === 0) {
        return [];
    }
    // If there was only a single selector, just return the result
    if (results.length === 1) {
        return results[0];
    }
    // Sort results, filtering for duplicates
    return uniqueSort(results.reduce((a, b)=>[
            ...a,
            ...b
        ]));
}
/**
 *
 * @param root Element(s) to search from.
 * @param selector Selector to look for.
 * @param options Options for querying.
 * @param queryForSelector Query multiple levels deep for the initial selector, even if it doesn't contain a traversal.
 */ function findFilterElements(root, selector, options, queryForSelector, totalLimit) {
    const filterIndex = selector.findIndex(isFilter);
    const sub = selector.slice(0, filterIndex);
    const filter = selector[filterIndex];
    // If we are at the end of the selector, we can limit the number of elements to retrieve.
    const partLimit = selector.length - 1 === filterIndex ? totalLimit : Infinity;
    /*
     * Set the number of elements to retrieve.
     * Eg. for :first, we only have to get a single element.
     */ const limit = getLimit(filter.name, filter.data, partLimit);
    if (limit === 0) return [];
    /*
     * Skip `findElements` call if our selector starts with a positional
     * pseudo.
     */ const elemsNoLimit = sub.length === 0 && !Array.isArray(root) ? getChildren(root).filter(node_isTag) : sub.length === 0 ? (Array.isArray(root) ? root : [
        root
    ]).filter(node_isTag) : queryForSelector || sub.some(commonjs.isTraversal) ? findElements(root, [
        sub
    ], options, limit) : filterElements(root, [
        sub
    ], options);
    const elems = elemsNoLimit.slice(0, limit);
    let result = filterByPosition(filter.name, elems, filter.data, options);
    if (result.length === 0 || selector.length === filterIndex + 1) {
        return result;
    }
    const remainingSelector = selector.slice(filterIndex + 1);
    const remainingHasTraversal = remainingSelector.some(commonjs.isTraversal);
    if (remainingHasTraversal) {
        if ((0,commonjs.isTraversal)(remainingSelector[0])) {
            const { type } = remainingSelector[0];
            if (type === commonjs.SelectorType.Sibling || type === commonjs.SelectorType.Adjacent) {
                // If we have a sibling traversal, we need to also look at the siblings.
                result = prepareContext(result, domutils_lib_esm_namespaceObject, true);
            }
            // Avoid a traversal-first selector error.
            remainingSelector.unshift(UNIVERSAL_SELECTOR);
        }
        options = {
            ...options,
            // Avoid absolutizing the selector
            relativeSelector: false,
            /*
             * Add a custom root func, to make sure traversals don't match elements
             * that aren't a part of the considered tree.
             */ rootFunc: (el)=>result.includes(el)
        };
    } else if (options.rootFunc && options.rootFunc !== boolbase.trueFunc) {
        options = {
            ...options,
            rootFunc: boolbase.trueFunc
        };
    }
    /*
     * If we have another filter, recursively call `findFilterElements`,
     * with the `recursive` flag disabled. We only have to look for more
     * elements when we see a traversal.
     *
     * Otherwise,
     */ return remainingSelector.some(isFilter) ? findFilterElements(result, remainingSelector, options, false, totalLimit) : remainingHasTraversal ? findElements(result, [
        remainingSelector
    ], options, totalLimit) : filterElements(result, [
        remainingSelector
    ], options);
}
function findElements(root, sel, options, limit) {
    const query = _compileToken(sel, options, root);
    return esm_find(root, query, limit);
}
function esm_find(root, query, limit = Infinity) {
    const elems = prepareContext(root, domutils_lib_esm_namespaceObject, query.shouldTestNextSiblings);
    return find((node)=>node_isTag(node) && query(node), elems, true, limit);
}
function filterElements(elements, sel, options) {
    const els = (Array.isArray(elements) ? elements : [
        elements
    ]).filter(node_isTag);
    if (els.length === 0) return els;
    const query = _compileToken(sel, options);
    return query === boolbase.trueFunc ? els : els.filter(query);
} //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/api/traversing.js
/**
 * Methods for traversing the DOM structure.
 *
 * @module cheerio/traversing
 */ 




const reSiblingSelector = /^\s*[~+]/;
/**
 * Get the descendants of each element in the current set of matched elements,
 * filtered by a selector, jQuery object, or element.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').find('li').length;
 * //=> 3
 * $('#fruits').find($('.apple')).length;
 * //=> 1
 * ```
 *
 * @param selectorOrHaystack - Element to look for.
 * @returns The found elements.
 * @see {@link https://api.jquery.com/find/}
 */ function traversing_find(selectorOrHaystack) {
    var _a;
    if (!selectorOrHaystack) {
        return this._make([]);
    }
    const context = this.toArray();
    if (typeof selectorOrHaystack !== "string") {
        const haystack = isCheerio(selectorOrHaystack) ? selectorOrHaystack.toArray() : [
            selectorOrHaystack
        ];
        return this._make(haystack.filter((elem)=>context.some((node)=>contains(node, elem))));
    }
    const elems = reSiblingSelector.test(selectorOrHaystack) ? context : this.children().toArray();
    const options = {
        context,
        root: (_a = this._root) === null || _a === void 0 ? void 0 : _a[0],
        // Pass options that are recognized by `cheerio-select`
        xmlMode: this.options.xmlMode,
        lowerCaseTags: this.options.lowerCaseTags,
        lowerCaseAttributeNames: this.options.lowerCaseAttributeNames,
        pseudos: this.options.pseudos,
        quirksMode: this.options.quirksMode
    };
    return this._make(esm_select(selectorOrHaystack, elems, options));
}
/**
 * Creates a matcher, using a particular mapping function. Matchers provide a
 * function that finds elements using a generating function, supporting filtering.
 *
 * @private
 * @param matchMap - Mapping function.
 * @returns - Function for wrapping generating functions.
 */ function _getMatcher(matchMap) {
    return function(fn, ...postFns) {
        return function(selector) {
            var _a;
            let matched = matchMap(fn, this);
            if (selector) {
                matched = filterArray(matched, selector, this.options.xmlMode, (_a = this._root) === null || _a === void 0 ? void 0 : _a[0]);
            }
            return this._make(// Post processing is only necessary if there is more than one element.
            this.length > 1 && matched.length > 1 ? postFns.reduce((elems, fn)=>fn(elems), matched) : matched);
        };
    };
}
/** Matcher that adds multiple elements for each entry in the input. */ const _matcher = _getMatcher((fn, elems)=>{
    const ret = [];
    for(let i = 0; i < elems.length; i++){
        const value = fn(elems[i]);
        ret.push(value);
    }
    return new Array().concat(...ret);
});
/** Matcher that adds at most one element for each entry in the input. */ const _singleMatcher = _getMatcher((fn, elems)=>{
    const ret = [];
    for(let i = 0; i < elems.length; i++){
        const value = fn(elems[i]);
        if (value !== null) {
            ret.push(value);
        }
    }
    return ret;
});
/**
 * Matcher that supports traversing until a condition is met.
 *
 * @returns A function usable for `*Until` methods.
 */ function _matchUntil(nextElem, ...postFns) {
    // We use a variable here that is used from within the matcher.
    let matches = null;
    const innerMatcher = _getMatcher((nextElem, elems)=>{
        const matched = [];
        domEach(elems, (elem)=>{
            for(let next; next = nextElem(elem); elem = next){
                // FIXME: `matched` might contain duplicates here and the index is too large.
                if (matches === null || matches === void 0 ? void 0 : matches(next, matched.length)) break;
                matched.push(next);
            }
        });
        return matched;
    })(nextElem, ...postFns);
    return function(selector, filterSelector) {
        // Override `matches` variable with the new target.
        matches = typeof selector === "string" ? (elem)=>lib_esm_is(elem, selector, this.options) : selector ? getFilterFn(selector) : null;
        const ret = innerMatcher.call(this, filterSelector);
        // Set `matches` to `null`, so we don't waste memory.
        matches = null;
        return ret;
    };
}
function _removeDuplicates(elems) {
    return Array.from(new Set(elems));
}
/**
 * Get the parent of each element in the current set of matched elements,
 * optionally filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').parent().attr('id');
 * //=> fruits
 * ```
 *
 * @param selector - If specified filter for parent.
 * @returns The parents.
 * @see {@link https://api.jquery.com/parent/}
 */ const traversing_parent = _singleMatcher(({ parent })=>parent && !node_isDocument(parent) ? parent : null, _removeDuplicates);
/**
 * Get a set of parents filtered by `selector` of each element in the current
 * set of match elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').parents().length;
 * //=> 2
 * $('.orange').parents('#fruits').length;
 * //=> 1
 * ```
 *
 * @param selector - If specified filter for parents.
 * @returns The parents.
 * @see {@link https://api.jquery.com/parents/}
 */ const parents = _matcher((elem)=>{
    const matched = [];
    while(elem.parent && !node_isDocument(elem.parent)){
        matched.push(elem.parent);
        elem = elem.parent;
    }
    return matched;
}, uniqueSort, (elems)=>elems.reverse());
/**
 * Get the ancestors of each element in the current set of matched elements, up
 * to but not including the element matched by the selector, DOM node, or cheerio object.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').parentsUntil('#food').length;
 * //=> 1
 * ```
 *
 * @param selector - Selector for element to stop at.
 * @param filterSelector - Optional filter for parents.
 * @returns The parents.
 * @see {@link https://api.jquery.com/parentsUntil/}
 */ const parentsUntil = _matchUntil(({ parent })=>parent && !node_isDocument(parent) ? parent : null, uniqueSort, (elems)=>elems.reverse());
/**
 * For each element in the set, get the first element that matches the selector
 * by testing the element itself and traversing up through its ancestors in the DOM tree.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').closest();
 * //=> []
 *
 * $('.orange').closest('.apple');
 * // => []
 *
 * $('.orange').closest('li');
 * //=> [<li class="orange">Orange</li>]
 *
 * $('.orange').closest('#fruits');
 * //=> [<ul id="fruits"> ... </ul>]
 * ```
 *
 * @param selector - Selector for the element to find.
 * @returns The closest nodes.
 * @see {@link https://api.jquery.com/closest/}
 */ function closest(selector) {
    var _a;
    const set = [];
    if (!selector) {
        return this._make(set);
    }
    const selectOpts = {
        xmlMode: this.options.xmlMode,
        root: (_a = this._root) === null || _a === void 0 ? void 0 : _a[0]
    };
    const selectFn = typeof selector === "string" ? (elem)=>lib_esm_is(elem, selector, selectOpts) : getFilterFn(selector);
    domEach(this, (elem)=>{
        while(elem && node_isTag(elem)){
            if (selectFn(elem, 0)) {
                // Do not add duplicate elements to the set
                if (!set.includes(elem)) {
                    set.push(elem);
                }
                break;
            }
            elem = elem.parent;
        }
    });
    return this._make(set);
}
/**
 * Gets the next sibling of the first selected element, optionally filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').next().hasClass('orange');
 * //=> true
 * ```
 *
 * @param selector - If specified filter for sibling.
 * @returns The next nodes.
 * @see {@link https://api.jquery.com/next/}
 */ const next = _singleMatcher((elem)=>nextElementSibling(elem));
/**
 * Gets all the following siblings of the first selected element, optionally
 * filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').nextAll();
 * //=> [<li class="orange">Orange</li>, <li class="pear">Pear</li>]
 * $('.apple').nextAll('.orange');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The next nodes.
 * @see {@link https://api.jquery.com/nextAll/}
 */ const nextAll = _matcher((elem)=>{
    const matched = [];
    while(elem.next){
        elem = elem.next;
        if (node_isTag(elem)) matched.push(elem);
    }
    return matched;
}, _removeDuplicates);
/**
 * Gets all the following siblings up to but not including the element matched
 * by the selector, optionally filtered by another selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').nextUntil('.pear');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - Selector for element to stop at.
 * @param filterSelector - If specified filter for siblings.
 * @returns The next nodes.
 * @see {@link https://api.jquery.com/nextUntil/}
 */ const nextUntil = _matchUntil((el)=>nextElementSibling(el), _removeDuplicates);
/**
 * Gets the previous sibling of the first selected element optionally filtered
 * by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.orange').prev().hasClass('apple');
 * //=> true
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The previous nodes.
 * @see {@link https://api.jquery.com/prev/}
 */ const prev = _singleMatcher((elem)=>prevElementSibling(elem));
/**
 * Gets all the preceding siblings of the first selected element, optionally
 * filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').prevAll();
 * //=> [<li class="orange">Orange</li>, <li class="apple">Apple</li>]
 *
 * $('.pear').prevAll('.orange');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The previous nodes.
 * @see {@link https://api.jquery.com/prevAll/}
 */ const prevAll = _matcher((elem)=>{
    const matched = [];
    while(elem.prev){
        elem = elem.prev;
        if (node_isTag(elem)) matched.push(elem);
    }
    return matched;
}, _removeDuplicates);
/**
 * Gets all the preceding siblings up to but not including the element matched
 * by the selector, optionally filtered by another selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').prevUntil('.apple');
 * //=> [<li class="orange">Orange</li>]
 * ```
 *
 * @param selector - Selector for element to stop at.
 * @param filterSelector - If specified filter for siblings.
 * @returns The previous nodes.
 * @see {@link https://api.jquery.com/prevUntil/}
 */ const prevUntil = _matchUntil((el)=>prevElementSibling(el), _removeDuplicates);
/**
 * Get the siblings of each element (excluding the element) in the set of
 * matched elements, optionally filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').siblings().length;
 * //=> 2
 *
 * $('.pear').siblings('.orange').length;
 * //=> 1
 * ```
 *
 * @param selector - If specified filter for siblings.
 * @returns The siblings.
 * @see {@link https://api.jquery.com/siblings/}
 */ const siblings = _matcher((elem)=>getSiblings(elem).filter((el)=>node_isTag(el) && el !== elem), uniqueSort);
/**
 * Gets the element children of each element in the set of matched elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').children().length;
 * //=> 3
 *
 * $('#fruits').children('.pear').text();
 * //=> Pear
 * ```
 *
 * @param selector - If specified filter for children.
 * @returns The children.
 * @see {@link https://api.jquery.com/children/}
 */ const children = _matcher((elem)=>getChildren(elem).filter(node_isTag), _removeDuplicates);
/**
 * Gets the children of each element in the set of matched elements, including
 * text and comment nodes.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').contents().length;
 * //=> 3
 * ```
 *
 * @returns The children.
 * @see {@link https://api.jquery.com/contents/}
 */ function contents() {
    const elems = this.toArray().reduce((newElems, elem)=>hasChildren(elem) ? newElems.concat(elem.children) : newElems, []);
    return this._make(elems);
}
/**
 * Iterates over a cheerio object, executing a function for each matched
 * element. When the callback is fired, the function is fired in the context of
 * the DOM element, so `this` refers to the current element, which is equivalent
 * to the function parameter `element`. To break out of the `each` loop early,
 * return with `false`.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * const fruits = [];
 *
 * $('li').each(function (i, elem) {
 *   fruits[i] = $(this).text();
 * });
 *
 * fruits.join(', ');
 * //=> Apple, Orange, Pear
 * ```
 *
 * @param fn - Function to execute.
 * @returns The instance itself, useful for chaining.
 * @see {@link https://api.jquery.com/each/}
 */ function each(fn) {
    let i = 0;
    const len = this.length;
    while(i < len && fn.call(this[i], i, this[i]) !== false)++i;
    return this;
}
/**
 * Pass each element in the current matched set through a function, producing a
 * new Cheerio object containing the return values. The function can return an
 * individual data item or an array of data items to be inserted into the
 * resulting set. If an array is returned, the elements inside the array are
 * inserted into the set. If the function returns null or undefined, no element
 * will be inserted.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li')
 *   .map(function (i, el) {
 *     // this === el
 *     return $(this).text();
 *   })
 *   .toArray()
 *   .join(' ');
 * //=> "apple orange pear"
 * ```
 *
 * @param fn - Function to execute.
 * @returns The mapped elements, wrapped in a Cheerio collection.
 * @see {@link https://api.jquery.com/map/}
 */ function map(fn) {
    let elems = [];
    for(let i = 0; i < this.length; i++){
        const el = this[i];
        const val = fn.call(el, i, el);
        if (val != null) {
            elems = elems.concat(val);
        }
    }
    return this._make(elems);
}
/**
 * Creates a function to test if a filter is matched.
 *
 * @param match - A filter.
 * @returns A function that determines if a filter has been matched.
 */ function getFilterFn(match) {
    if (typeof match === "function") {
        return (el, i)=>match.call(el, i, el);
    }
    if (isCheerio(match)) {
        return (el)=>Array.prototype.includes.call(match, el);
    }
    return function(el) {
        return match === el;
    };
}
function traversing_filter(match) {
    var _a;
    return this._make(filterArray(this.toArray(), match, this.options.xmlMode, (_a = this._root) === null || _a === void 0 ? void 0 : _a[0]));
}
function filterArray(nodes, match, xmlMode, root) {
    return typeof match === "string" ? esm_filter(match, nodes, {
        xmlMode,
        root
    }) : nodes.filter(getFilterFn(match));
}
/**
 * Checks the current list of elements and returns `true` if _any_ of the
 * elements match the selector. If using an element or Cheerio selection,
 * returns `true` if _any_ of the elements match. If using a predicate function,
 * the function is executed in the context of the selected element, so `this`
 * refers to the current element.
 *
 * @category Attributes
 * @param selector - Selector for the selection.
 * @returns Whether or not the selector matches an element of the instance.
 * @see {@link https://api.jquery.com/is/}
 */ function traversing_is(selector) {
    const nodes = this.toArray();
    return typeof selector === "string" ? some(nodes.filter(node_isTag), selector, this.options) : selector ? nodes.some(getFilterFn(selector)) : false;
}
/**
 * Remove elements from the set of matched elements. Given a Cheerio object that
 * represents a set of DOM elements, the `.not()` method constructs a new
 * Cheerio object from a subset of the matching elements. The supplied selector
 * is tested against each element; the elements that don't match the selector
 * will be included in the result.
 *
 * The `.not()` method can take a function as its argument in the same way that
 * `.filter()` does. Elements for which the function returns `true` are excluded
 * from the filtered set; all other elements are included.
 *
 * @category Traversing
 * @example <caption>Selector</caption>
 *
 * ```js
 * $('li').not('.apple').length;
 * //=> 2
 * ```
 *
 * @example <caption>Function</caption>
 *
 * ```js
 * $('li').not(function (i, el) {
 *   // this === el
 *   return $(this).attr('class') === 'orange';
 * }).length; //=> 2
 * ```
 *
 * @param match - Value to look for, following the rules above.
 * @param container - Optional node to filter instead.
 * @returns The filtered collection.
 * @see {@link https://api.jquery.com/not/}
 */ function not(match) {
    let nodes = this.toArray();
    if (typeof match === "string") {
        const matches = new Set(esm_filter(match, nodes, this.options));
        nodes = nodes.filter((el)=>!matches.has(el));
    } else {
        const filterFn = getFilterFn(match);
        nodes = nodes.filter((el, i)=>!filterFn(el, i));
    }
    return this._make(nodes);
}
/**
 * Filters the set of matched elements to only those which have the given DOM
 * element as a descendant or which have a descendant that matches the given
 * selector. Equivalent to `.filter(':has(selector)')`.
 *
 * @category Traversing
 * @example <caption>Selector</caption>
 *
 * ```js
 * $('ul').has('.pear').attr('id');
 * //=> fruits
 * ```
 *
 * @example <caption>Element</caption>
 *
 * ```js
 * $('ul').has($('.pear')[0]).attr('id');
 * //=> fruits
 * ```
 *
 * @param selectorOrHaystack - Element to look for.
 * @returns The filtered collection.
 * @see {@link https://api.jquery.com/has/}
 */ function has(selectorOrHaystack) {
    return this.filter(typeof selectorOrHaystack === "string" ? `:has(${selectorOrHaystack})` : (_, el)=>this._make(el).find(selectorOrHaystack).length > 0);
}
/**
 * Will select the first element of a cheerio object.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').children().first().text();
 * //=> Apple
 * ```
 *
 * @returns The first element.
 * @see {@link https://api.jquery.com/first/}
 */ function first() {
    return this.length > 1 ? this._make(this[0]) : this;
}
/**
 * Will select the last element of a cheerio object.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('#fruits').children().last().text();
 * //=> Pear
 * ```
 *
 * @returns The last element.
 * @see {@link https://api.jquery.com/last/}
 */ function last() {
    return this.length > 0 ? this._make(this[this.length - 1]) : this;
}
/**
 * Reduce the set of matched elements to the one at the specified index. Use
 * `.eq(-i)` to count backwards from the last selected element.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').eq(0).text();
 * //=> Apple
 *
 * $('li').eq(-1).text();
 * //=> Pear
 * ```
 *
 * @param i - Index of the element to select.
 * @returns The element at the `i`th position.
 * @see {@link https://api.jquery.com/eq/}
 */ function eq(i) {
    var _a;
    i = +i;
    // Use the first identity optimization if possible
    if (i === 0 && this.length <= 1) return this;
    if (i < 0) i = this.length + i;
    return this._make((_a = this[i]) !== null && _a !== void 0 ? _a : []);
}
function get(i) {
    if (i == null) {
        return this.toArray();
    }
    return this[i < 0 ? this.length + i : i];
}
/**
 * Retrieve all the DOM elements contained in the jQuery set as an array.
 *
 * @example
 *
 * ```js
 * $('li').toArray();
 * //=> [ {...}, {...}, {...} ]
 * ```
 *
 * @returns The contained items.
 */ function toArray() {
    return Array.prototype.slice.call(this);
}
/**
 * Search for a given element from among the matched elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.pear').index();
 * //=> 2 $('.orange').index('li');
 * //=> 1
 * $('.apple').index($('#fruit, li'));
 * //=> 1
 * ```
 *
 * @param selectorOrNeedle - Element to look for.
 * @returns The index of the element.
 * @see {@link https://api.jquery.com/index/}
 */ function index(selectorOrNeedle) {
    let $haystack;
    let needle;
    if (selectorOrNeedle == null) {
        $haystack = this.parent().children();
        needle = this[0];
    } else if (typeof selectorOrNeedle === "string") {
        $haystack = this._make(selectorOrNeedle);
        needle = this[0];
    } else {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        $haystack = this;
        needle = isCheerio(selectorOrNeedle) ? selectorOrNeedle[0] : selectorOrNeedle;
    }
    return Array.prototype.indexOf.call($haystack, needle);
}
/**
 * Gets the elements matching the specified range (0-based position).
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').slice(1).eq(0).text();
 * //=> 'Orange'
 *
 * $('li').slice(1, 2).length;
 * //=> 1
 * ```
 *
 * @param start - A position at which the elements begin to be selected. If
 *   negative, it indicates an offset from the end of the set.
 * @param end - A position at which the elements stop being selected. If
 *   negative, it indicates an offset from the end of the set. If omitted, the
 *   range continues until the end of the set.
 * @returns The elements matching the specified range.
 * @see {@link https://api.jquery.com/slice/}
 */ function slice(start, end) {
    return this._make(Array.prototype.slice.call(this, start, end));
}
/**
 * End the most recent filtering operation in the current chain and return the
 * set of matched elements to its previous state.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').eq(0).end().length;
 * //=> 3
 * ```
 *
 * @returns The previous state of the set of matched elements.
 * @see {@link https://api.jquery.com/end/}
 */ function end() {
    var _a;
    return (_a = this.prevObject) !== null && _a !== void 0 ? _a : this._make([]);
}
/**
 * Add elements to the set of matched elements.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('.apple').add('.orange').length;
 * //=> 2
 * ```
 *
 * @param other - Elements to add.
 * @param context - Optionally the context of the new selection.
 * @returns The combined set.
 * @see {@link https://api.jquery.com/add/}
 */ function add(other, context) {
    const selection = this._make(other, context);
    const contents = uniqueSort([
        ...this.get(),
        ...selection.get()
    ]);
    return this._make(contents);
}
/**
 * Add the previous set of elements on the stack to the current set, optionally
 * filtered by a selector.
 *
 * @category Traversing
 * @example
 *
 * ```js
 * $('li').eq(0).addBack('.orange').length;
 * //=> 2
 * ```
 *
 * @param selector - Selector for the elements to add.
 * @returns The combined set.
 * @see {@link https://api.jquery.com/addBack/}
 */ function addBack(selector) {
    return this.prevObject ? this.add(selector ? this.prevObject.filter(selector) : this.prevObject) : this;
} //# sourceMappingURL=traversing.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/parse.js


/**
 * Get the parse function with options.
 *
 * @param parser - The parser function.
 * @returns The parse function with options.
 */ function getParse(parser) {
    /**
     * Parse a HTML string or a node.
     *
     * @param content - The HTML string or node.
     * @param options - The parser options.
     * @param isDocument - If `content` is a document.
     * @param context - The context node in the DOM tree.
     * @returns The parsed document node.
     */ return function parse(content, options, isDocument, context) {
        if (typeof Buffer !== "undefined" && Buffer.isBuffer(content)) {
            content = content.toString();
        }
        if (typeof content === "string") {
            return parser(content, options, isDocument, context);
        }
        const doc = content;
        if (!Array.isArray(doc) && node_isDocument(doc)) {
            // If `doc` is already a root, just return it
            return doc;
        }
        // Add conent to new root element
        const root = new Document([]);
        // Update the DOM using the root
        update(doc, root);
        return root;
    };
}
/**
 * Update the dom structure, for one changed layer.
 *
 * @param newChilds - The new children.
 * @param parent - The new parent.
 * @returns The parent node.
 */ function update(newChilds, parent) {
    // Normalize
    const arr = Array.isArray(newChilds) ? newChilds : [
        newChilds
    ];
    // Update parent
    if (parent) {
        parent.children = arr;
    } else {
        parent = null;
    }
    // Update neighbors
    for(let i = 0; i < arr.length; i++){
        const node = arr[i];
        // Cleanly remove existing nodes from their previous structures.
        if (node.parent && node.parent.children !== arr) {
            removeElement(node);
        }
        if (parent) {
            node.prev = arr[i - 1] || null;
            node.next = arr[i + 1] || null;
        } else {
            node.prev = node.next = null;
        }
        node.parent = parent;
    }
    return parent;
} //# sourceMappingURL=parse.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/api/manipulation.js
/**
 * Methods for modifying the DOM structure.
 *
 * @module cheerio/manipulation
 */ 




/**
 * Create an array of nodes, recursing into arrays and parsing strings if necessary.
 *
 * @private
 * @category Manipulation
 * @param elem - Elements to make an array of.
 * @param clone - Optionally clone nodes.
 * @returns The array of nodes.
 */ function _makeDomArray(elem, clone) {
    if (elem == null) {
        return [];
    }
    if (isCheerio(elem)) {
        return clone ? cloneDom(elem.get()) : elem.get();
    }
    if (Array.isArray(elem)) {
        return elem.reduce((newElems, el)=>newElems.concat(this._makeDomArray(el, clone)), []);
    }
    if (typeof elem === "string") {
        return this._parse(elem, this.options, false, null).children;
    }
    return clone ? cloneDom([
        elem
    ]) : [
        elem
    ];
}
function _insert(concatenator) {
    return function(...elems) {
        const lastIdx = this.length - 1;
        return domEach(this, (el, i)=>{
            if (!hasChildren(el)) return;
            const domSrc = typeof elems[0] === "function" ? elems[0].call(el, i, this._render(el.children)) : elems;
            const dom = this._makeDomArray(domSrc, i < lastIdx);
            concatenator(dom, el.children, el);
        });
    };
}
/**
 * Modify an array in-place, removing some number of elements and adding new
 * elements directly following them.
 *
 * @private
 * @category Manipulation
 * @param array - Target array to splice.
 * @param spliceIdx - Index at which to begin changing the array.
 * @param spliceCount - Number of elements to remove from the array.
 * @param newElems - Elements to insert into the array.
 * @param parent - The parent of the node.
 * @returns The spliced array.
 */ function uniqueSplice(array, spliceIdx, spliceCount, newElems, parent) {
    var _a, _b;
    const spliceArgs = [
        spliceIdx,
        spliceCount,
        ...newElems
    ];
    const prev = spliceIdx === 0 ? null : array[spliceIdx - 1];
    const next = spliceIdx + spliceCount >= array.length ? null : array[spliceIdx + spliceCount];
    /*
     * Before splicing in new elements, ensure they do not already appear in the
     * current array.
     */ for(let idx = 0; idx < newElems.length; ++idx){
        const node = newElems[idx];
        const oldParent = node.parent;
        if (oldParent) {
            const oldSiblings = oldParent.children;
            const prevIdx = oldSiblings.indexOf(node);
            if (prevIdx > -1) {
                oldParent.children.splice(prevIdx, 1);
                if (parent === oldParent && spliceIdx > prevIdx) {
                    spliceArgs[0]--;
                }
            }
        }
        node.parent = parent;
        if (node.prev) {
            node.prev.next = (_a = node.next) !== null && _a !== void 0 ? _a : null;
        }
        if (node.next) {
            node.next.prev = (_b = node.prev) !== null && _b !== void 0 ? _b : null;
        }
        node.prev = idx === 0 ? prev : newElems[idx - 1];
        node.next = idx === newElems.length - 1 ? next : newElems[idx + 1];
    }
    if (prev) {
        prev.next = newElems[0];
    }
    if (next) {
        next.prev = newElems[newElems.length - 1];
    }
    return array.splice(...spliceArgs);
}
/**
 * Insert every element in the set of matched elements to the end of the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').appendTo('#fruits');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //      <li class="plum">Plum</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to append elements to.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/appendTo/}
 */ function appendTo(target) {
    const appendTarget = isCheerio(target) ? target : this._make(target);
    appendTarget.append(this);
    return this;
}
/**
 * Insert every element in the set of matched elements to the beginning of the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').prependTo('#fruits');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to prepend elements to.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/prependTo/}
 */ function prependTo(target) {
    const prependTarget = isCheerio(target) ? target : this._make(target);
    prependTarget.prepend(this);
    return this;
}
/**
 * Inserts content as the _last_ child of each of the selected elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('ul').append('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //      <li class="plum">Plum</li>
 * //    </ul>
 * ```
 *
 * @see {@link https://api.jquery.com/append/}
 */ const manipulation_append = _insert((dom, children, parent)=>{
    uniqueSplice(children, children.length, 0, dom, parent);
});
/**
 * Inserts content as the _first_ child of each of the selected elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('ul').prepend('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @see {@link https://api.jquery.com/prepend/}
 */ const manipulation_prepend = _insert((dom, children, parent)=>{
    uniqueSplice(children, 0, 0, dom, parent);
});
function _wrap(insert) {
    return function(wrapper) {
        const lastIdx = this.length - 1;
        const lastParent = this.parents().last();
        for(let i = 0; i < this.length; i++){
            const el = this[i];
            const wrap = typeof wrapper === "function" ? wrapper.call(el, i, el) : typeof wrapper === "string" && !isHtml(wrapper) ? lastParent.find(wrapper).clone() : wrapper;
            const [wrapperDom] = this._makeDomArray(wrap, i < lastIdx);
            if (!wrapperDom || !hasChildren(wrapperDom)) continue;
            let elInsertLocation = wrapperDom;
            /*
             * Find the deepest child. Only consider the first tag child of each node
             * (ignore text); stop if no children are found.
             */ let j = 0;
            while(j < elInsertLocation.children.length){
                const child = elInsertLocation.children[j];
                if (node_isTag(child)) {
                    elInsertLocation = child;
                    j = 0;
                } else {
                    j++;
                }
            }
            insert(el, elInsertLocation, [
                wrapperDom
            ]);
        }
        return this;
    };
}
/**
 * The .wrap() function can take any string or object that could be passed to
 * the $() factory function to specify a DOM structure. This structure may be
 * nested several levels deep, but should contain only one inmost element. A
 * copy of this structure will be wrapped around each of the elements in the set
 * of matched elements. This method returns the original set of elements for
 * chaining purposes.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const redFruit = $('<div class="red-fruit"></div>');
 * $('.apple').wrap(redFruit);
 *
 * //=> <ul id="fruits">
 * //     <div class="red-fruit">
 * //      <li class="apple">Apple</li>
 * //     </div>
 * //     <li class="orange">Orange</li>
 * //     <li class="plum">Plum</li>
 * //   </ul>
 *
 * const healthy = $('<div class="healthy"></div>');
 * $('li').wrap(healthy);
 *
 * //=> <ul id="fruits">
 * //     <div class="healthy">
 * //       <li class="apple">Apple</li>
 * //     </div>
 * //     <div class="healthy">
 * //       <li class="orange">Orange</li>
 * //     </div>
 * //     <div class="healthy">
 * //        <li class="plum">Plum</li>
 * //     </div>
 * //   </ul>
 * ```
 *
 * @param wrapper - The DOM structure to wrap around each element in the selection.
 * @see {@link https://api.jquery.com/wrap/}
 */ const wrap = _wrap((el, elInsertLocation, wrapperDom)=>{
    const { parent } = el;
    if (!parent) return;
    const siblings = parent.children;
    const index = siblings.indexOf(el);
    update([
        el
    ], elInsertLocation);
    /*
     * The previous operation removed the current element from the `siblings`
     * array, so the `dom` array can be inserted without removing any
     * additional elements.
     */ uniqueSplice(siblings, index, 0, wrapperDom, parent);
});
/**
 * The .wrapInner() function can take any string or object that could be passed
 * to the $() factory function to specify a DOM structure. This structure may be
 * nested several levels deep, but should contain only one inmost element. The
 * structure will be wrapped around the content of each of the elements in the
 * set of matched elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const redFruit = $('<div class="red-fruit"></div>');
 * $('.apple').wrapInner(redFruit);
 *
 * //=> <ul id="fruits">
 * //     <li class="apple">
 * //       <div class="red-fruit">Apple</div>
 * //     </li>
 * //     <li class="orange">Orange</li>
 * //     <li class="pear">Pear</li>
 * //   </ul>
 *
 * const healthy = $('<div class="healthy"></div>');
 * $('li').wrapInner(healthy);
 *
 * //=> <ul id="fruits">
 * //     <li class="apple">
 * //       <div class="healthy">Apple</div>
 * //     </li>
 * //     <li class="orange">
 * //       <div class="healthy">Orange</div>
 * //     </li>
 * //     <li class="pear">
 * //       <div class="healthy">Pear</div>
 * //     </li>
 * //   </ul>
 * ```
 *
 * @param wrapper - The DOM structure to wrap around the content of each element
 *   in the selection.
 * @returns The instance itself, for chaining.
 * @see {@link https://api.jquery.com/wrapInner/}
 */ const wrapInner = _wrap((el, elInsertLocation, wrapperDom)=>{
    if (!hasChildren(el)) return;
    update(el.children, elInsertLocation);
    update(wrapperDom, el);
});
/**
 * The .unwrap() function, removes the parents of the set of matched elements
 * from the DOM, leaving the matched elements in their place.
 *
 * @category Manipulation
 * @example <caption>without selector</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<div id=test>\n  <div><p>Hello</p></div>\n  <div><p>World</p></div>\n</div>'
 * );
 * $('#test p').unwrap();
 *
 * //=> <div id=test>
 * //     <p>Hello</p>
 * //     <p>World</p>
 * //   </div>
 * ```
 *
 * @example <caption>with selector</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<div id=test>\n  <p>Hello</p>\n  <b><p>World</p></b>\n</div>'
 * );
 * $('#test p').unwrap('b');
 *
 * //=> <div id=test>
 * //     <p>Hello</p>
 * //     <p>World</p>
 * //   </div>
 * ```
 *
 * @param selector - A selector to check the parent element against. If an
 *   element's parent does not match the selector, the element won't be unwrapped.
 * @returns The instance itself, for chaining.
 * @see {@link https://api.jquery.com/unwrap/}
 */ function unwrap(selector) {
    this.parent(selector).not("body").each((_, el)=>{
        this._make(el).replaceWith(el.children);
    });
    return this;
}
/**
 * The .wrapAll() function can take any string or object that could be passed to
 * the $() function to specify a DOM structure. This structure may be nested
 * several levels deep, but should contain only one inmost element. The
 * structure will be wrapped around all of the elements in the set of matched
 * elements, as a single group.
 *
 * @category Manipulation
 * @example <caption>With markup passed to `wrapAll`</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<div class="container"><div class="inner">First</div><div class="inner">Second</div></div>'
 * );
 * $('.inner').wrapAll("<div class='new'></div>");
 *
 * //=> <div class="container">
 * //     <div class='new'>
 * //       <div class="inner">First</div>
 * //       <div class="inner">Second</div>
 * //     </div>
 * //   </div>
 * ```
 *
 * @example <caption>With an existing cheerio instance</caption>
 *
 * ```js
 * const $ = cheerio.load(
 *   '<span>Span 1</span><strong>Strong</strong><span>Span 2</span>'
 * );
 * const wrap = $('<div><p><em><b></b></em></p></div>');
 * $('span').wrapAll(wrap);
 *
 * //=> <div>
 * //     <p>
 * //       <em>
 * //         <b>
 * //           <span>Span 1</span>
 * //           <span>Span 2</span>
 * //         </b>
 * //       </em>
 * //     </p>
 * //   </div>
 * //   <strong>Strong</strong>
 * ```
 *
 * @param wrapper - The DOM structure to wrap around all matched elements in the
 *   selection.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/wrapAll/}
 */ function wrapAll(wrapper) {
    const el = this[0];
    if (el) {
        const wrap = this._make(typeof wrapper === "function" ? wrapper.call(el, 0, el) : wrapper).insertBefore(el);
        // If html is given as wrapper, wrap may contain text elements
        let elInsertLocation;
        for(let i = 0; i < wrap.length; i++){
            if (wrap[i].type === "tag") elInsertLocation = wrap[i];
        }
        let j = 0;
        /*
         * Find the deepest child. Only consider the first tag child of each node
         * (ignore text); stop if no children are found.
         */ while(elInsertLocation && j < elInsertLocation.children.length){
            const child = elInsertLocation.children[j];
            if (child.type === "tag") {
                elInsertLocation = child;
                j = 0;
            } else {
                j++;
            }
        }
        if (elInsertLocation) this._make(elInsertLocation).append(this);
    }
    return this;
}
/* eslint-disable jsdoc/check-param-names*/ /**
 * Insert content next to each element in the set of matched elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('.apple').after('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="plum">Plum</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param content - HTML string, DOM element, array of DOM elements or Cheerio
 *   to insert after each element in the set of matched elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/after/}
 */ function after(...elems) {
    const lastIdx = this.length - 1;
    return domEach(this, (el, i)=>{
        const { parent } = el;
        if (!hasChildren(el) || !parent) {
            return;
        }
        const siblings = parent.children;
        const index = siblings.indexOf(el);
        // If not found, move on
        /* istanbul ignore next */ if (index < 0) return;
        const domSrc = typeof elems[0] === "function" ? elems[0].call(el, i, this._render(el.children)) : elems;
        const dom = this._makeDomArray(domSrc, i < lastIdx);
        // Add element after `this` element
        uniqueSplice(siblings, index + 1, 0, dom, parent);
    });
}
/* eslint-enable jsdoc/check-param-names*/ /**
 * Insert every element in the set of matched elements after the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').insertAfter('.apple');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="plum">Plum</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to insert elements after.
 * @returns The set of newly inserted elements.
 * @see {@link https://api.jquery.com/insertAfter/}
 */ function insertAfter(target) {
    if (typeof target === "string") {
        target = this._make(target);
    }
    this.remove();
    const clones = [];
    this._makeDomArray(target).forEach((el)=>{
        const clonedSelf = this.clone().toArray();
        const { parent } = el;
        if (!parent) {
            return;
        }
        const siblings = parent.children;
        const index = siblings.indexOf(el);
        // If not found, move on
        /* istanbul ignore next */ if (index < 0) return;
        // Add cloned `this` element(s) after target element
        uniqueSplice(siblings, index + 1, 0, clonedSelf, parent);
        clones.push(...clonedSelf);
    });
    return this._make(clones);
}
/* eslint-disable jsdoc/check-param-names*/ /**
 * Insert content previous to each element in the set of matched elements.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('.apple').before('<li class="plum">Plum</li>');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param content - HTML string, DOM element, array of DOM elements or Cheerio
 *   to insert before each element in the set of matched elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/before/}
 */ function before(...elems) {
    const lastIdx = this.length - 1;
    return domEach(this, (el, i)=>{
        const { parent } = el;
        if (!hasChildren(el) || !parent) {
            return;
        }
        const siblings = parent.children;
        const index = siblings.indexOf(el);
        // If not found, move on
        /* istanbul ignore next */ if (index < 0) return;
        const domSrc = typeof elems[0] === "function" ? elems[0].call(el, i, this._render(el.children)) : elems;
        const dom = this._makeDomArray(domSrc, i < lastIdx);
        // Add element before `el` element
        uniqueSplice(siblings, index, 0, dom, parent);
    });
}
/* eslint-enable jsdoc/check-param-names*/ /**
 * Insert every element in the set of matched elements before the target.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('<li class="plum">Plum</li>').insertBefore('.apple');
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="plum">Plum</li>
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //      <li class="pear">Pear</li>
 * //    </ul>
 * ```
 *
 * @param target - Element to insert elements before.
 * @returns The set of newly inserted elements.
 * @see {@link https://api.jquery.com/insertBefore/}
 */ function insertBefore(target) {
    const targetArr = this._make(target);
    this.remove();
    const clones = [];
    domEach(targetArr, (el)=>{
        const clonedSelf = this.clone().toArray();
        const { parent } = el;
        if (!parent) {
            return;
        }
        const siblings = parent.children;
        const index = siblings.indexOf(el);
        // If not found, move on
        /* istanbul ignore next */ if (index < 0) return;
        // Add cloned `this` element(s) after target element
        uniqueSplice(siblings, index, 0, clonedSelf, parent);
        clones.push(...clonedSelf);
    });
    return this._make(clones);
}
/**
 * Removes the set of matched elements from the DOM and all their children.
 * `selector` filters the set of matched elements to be removed.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('.pear').remove();
 * $.html();
 * //=>  <ul id="fruits">
 * //      <li class="apple">Apple</li>
 * //      <li class="orange">Orange</li>
 * //    </ul>
 * ```
 *
 * @param selector - Optional selector for elements to remove.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/remove/}
 */ function remove(selector) {
    // Filter if we have selector
    const elems = selector ? this.filter(selector) : this;
    domEach(elems, (el)=>{
        removeElement(el);
        el.prev = el.next = el.parent = null;
    });
    return this;
}
/**
 * Replaces matched elements with `content`.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const plum = $('<li class="plum">Plum</li>');
 * $('.pear').replaceWith(plum);
 * $.html();
 * //=> <ul id="fruits">
 * //     <li class="apple">Apple</li>
 * //     <li class="orange">Orange</li>
 * //     <li class="plum">Plum</li>
 * //   </ul>
 * ```
 *
 * @param content - Replacement for matched elements.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/replaceWith/}
 */ function replaceWith(content) {
    return domEach(this, (el, i)=>{
        const { parent } = el;
        if (!parent) {
            return;
        }
        const siblings = parent.children;
        const cont = typeof content === "function" ? content.call(el, i, el) : content;
        const dom = this._makeDomArray(cont);
        /*
         * In the case that `dom` contains nodes that already exist in other
         * structures, ensure those nodes are properly removed.
         */ update(dom, null);
        const index = siblings.indexOf(el);
        // Completely remove old element
        uniqueSplice(siblings, index, 1, dom, parent);
        if (!dom.includes(el)) {
            el.parent = el.prev = el.next = null;
        }
    });
}
/**
 * Empties an element, removing all its children.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * $('ul').empty();
 * $.html();
 * //=>  <ul id="fruits"></ul>
 * ```
 *
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/empty/}
 */ function empty() {
    return domEach(this, (el)=>{
        if (!hasChildren(el)) return;
        el.children.forEach((child)=>{
            child.next = child.prev = child.parent = null;
        });
        el.children.length = 0;
    });
}
function manipulation_html(str) {
    if (str === undefined) {
        const el = this[0];
        if (!el || !hasChildren(el)) return null;
        return this._render(el.children);
    }
    return domEach(this, (el)=>{
        if (!hasChildren(el)) return;
        el.children.forEach((child)=>{
            child.next = child.prev = child.parent = null;
        });
        const content = isCheerio(str) ? str.toArray() : this._parse(`${str}`, this.options, false, el).children;
        update(content, el);
    });
}
/**
 * Turns the collection to a string. Alias for `.html()`.
 *
 * @category Manipulation
 * @returns The rendered document.
 */ function manipulation_toString() {
    return this._render(this);
}
function manipulation_text(str) {
    // If `str` is undefined, act as a "getter"
    if (str === undefined) {
        return static_text(this);
    }
    if (typeof str === "function") {
        // Function support
        return domEach(this, (el, i)=>this._make(el).text(str.call(el, i, static_text([
                el
            ]))));
    }
    // Append text node to each selected elements
    return domEach(this, (el)=>{
        if (!hasChildren(el)) return;
        el.children.forEach((child)=>{
            child.next = child.prev = child.parent = null;
        });
        const textNode = new node_Text(`${str}`);
        update(textNode, el);
    });
}
/**
 * Clone the cheerio object.
 *
 * @category Manipulation
 * @example
 *
 * ```js
 * const moreFruit = $('#fruits').clone();
 * ```
 *
 * @returns The cloned object.
 * @see {@link https://api.jquery.com/clone/}
 */ function clone() {
    return this._make(cloneDom(this.get()));
} //# sourceMappingURL=manipulation.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/api/css.js

/**
 * Set multiple CSS properties for every matched element.
 *
 * @category CSS
 * @param prop - The names of the properties.
 * @param val - The new values.
 * @returns The instance itself.
 * @see {@link https://api.jquery.com/css/}
 */ function css(prop, val) {
    if (prop != null && val != null || // When `prop` is a "plain" object
    typeof prop === "object" && !Array.isArray(prop)) {
        return domEach(this, (el, i)=>{
            if (node_isTag(el)) {
                // `prop` can't be an array here anymore.
                setCss(el, prop, val, i);
            }
        });
    }
    if (this.length === 0) {
        return undefined;
    }
    return getCss(this[0], prop);
}
/**
 * Set styles of all elements.
 *
 * @private
 * @param el - Element to set style of.
 * @param prop - Name of property.
 * @param value - Value to set property to.
 * @param idx - Optional index within the selection.
 */ function setCss(el, prop, value, idx) {
    if (typeof prop === "string") {
        const styles = getCss(el);
        const val = typeof value === "function" ? value.call(el, idx, styles[prop]) : value;
        if (val === "") {
            delete styles[prop];
        } else if (val != null) {
            styles[prop] = val;
        }
        el.attribs["style"] = stringify(styles);
    } else if (typeof prop === "object") {
        Object.keys(prop).forEach((k, i)=>{
            setCss(el, k, prop[k], i);
        });
    }
}
function getCss(el, prop) {
    if (!el || !node_isTag(el)) return;
    const styles = css_parse(el.attribs["style"]);
    if (typeof prop === "string") {
        return styles[prop];
    }
    if (Array.isArray(prop)) {
        const newStyles = {};
        prop.forEach((item)=>{
            if (styles[item] != null) {
                newStyles[item] = styles[item];
            }
        });
        return newStyles;
    }
    return styles;
}
/**
 * Stringify `obj` to styles.
 *
 * @private
 * @category CSS
 * @param obj - Object to stringify.
 * @returns The serialized styles.
 */ function stringify(obj) {
    return Object.keys(obj).reduce((str, prop)=>`${str}${str ? " " : ""}${prop}: ${obj[prop]};`, "");
}
/**
 * Parse `styles`.
 *
 * @private
 * @category CSS
 * @param styles - Styles to be parsed.
 * @returns The parsed styles.
 */ function css_parse(styles) {
    styles = (styles || "").trim();
    if (!styles) return {};
    const obj = {};
    let key;
    for (const str of styles.split(";")){
        const n = str.indexOf(":");
        // If there is no :, or if it is the first/last character, add to the previous item's value
        if (n < 1 || n === str.length - 1) {
            const trimmed = str.trimEnd();
            if (trimmed.length > 0 && key !== undefined) {
                obj[key] += `;${trimmed}`;
            }
        } else {
            key = str.slice(0, n).trim();
            obj[key] = str.slice(n + 1).trim();
        }
    }
    return obj;
} //# sourceMappingURL=css.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/api/forms.js

/*
 * https://github.com/jquery/jquery/blob/2.1.3/src/manipulation/var/rcheckableType.js
 * https://github.com/jquery/jquery/blob/2.1.3/src/serialize.js
 */ const submittableSelector = "input,select,textarea,keygen";
const r20 = /%20/g;
const rCRLF = /\r?\n/g;
/**
 * Encode a set of form elements as a string for submission.
 *
 * @category Forms
 * @example
 *
 * ```js
 * $('<form><input name="foo" value="bar" /></form>').serialize();
 * //=> 'foo=bar'
 * ```
 *
 * @returns The serialized form.
 * @see {@link https://api.jquery.com/serialize/}
 */ function serialize() {
    // Convert form elements into name/value objects
    const arr = this.serializeArray();
    // Serialize each element into a key/value string
    const retArr = arr.map((data)=>`${encodeURIComponent(data.name)}=${encodeURIComponent(data.value)}`);
    // Return the resulting serialization
    return retArr.join("&").replace(r20, "+");
}
/**
 * Encode a set of form elements as an array of names and values.
 *
 * @category Forms
 * @example
 *
 * ```js
 * $('<form><input name="foo" value="bar" /></form>').serializeArray();
 * //=> [ { name: 'foo', value: 'bar' } ]
 * ```
 *
 * @returns The serialized form.
 * @see {@link https://api.jquery.com/serializeArray/}
 */ function serializeArray() {
    // Resolve all form elements from either forms or collections of form elements
    return this.map((_, elem)=>{
        const $elem = this._make(elem);
        if (node_isTag(elem) && elem.name === "form") {
            return $elem.find(submittableSelector).toArray();
        }
        return $elem.filter(submittableSelector).toArray();
    }).filter(// Verify elements have a name (`attr.name`) and are not disabled (`:enabled`)
    '[name!=""]:enabled' + // And cannot be clicked (`[type=submit]`) or are used in `x-www-form-urlencoded` (`[type=file]`)
    ":not(:submit, :button, :image, :reset, :file)" + // And are either checked/don't have a checkable state
    ":matches([checked], :not(:checkbox, :radio))").map((_, elem)=>{
        var _a;
        const $elem = this._make(elem);
        const name = $elem.attr("name"); // We have filtered for elements with a name before.
        // If there is no value set (e.g. `undefined`, `null`), then default value to empty
        const value = (_a = $elem.val()) !== null && _a !== void 0 ? _a : "";
        // If we have an array of values (e.g. `<select multiple>`), return an array of key/value pairs
        if (Array.isArray(value)) {
            return value.map((val)=>/*
             * We trim replace any line endings (e.g. `\r` or `\r\n` with `\r\n`) to guarantee consistency across platforms
             * These can occur inside of `<textarea>'s`
             */ ({
                    name,
                    value: val.replace(rCRLF, "\r\n")
                }));
        }
        // Otherwise (e.g. `<input type="text">`, return only one key/value pair
        return {
            name,
            value: value.replace(rCRLF, "\r\n")
        };
    }).toArray();
} //# sourceMappingURL=forms.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/cheerio.js





class Cheerio {
    /**
     * Instance of cheerio. Methods are specified in the modules. Usage of this
     * constructor is not recommended. Please use `$.load` instead.
     *
     * @private
     * @param elements - The new selection.
     * @param root - Sets the root node.
     * @param options - Options for the instance.
     */ constructor(elements, root, options){
        this.length = 0;
        this.options = options;
        this._root = root;
        if (elements) {
            for(let idx = 0; idx < elements.length; idx++){
                this[idx] = elements[idx];
            }
            this.length = elements.length;
        }
    }
}
/** Set a signature of the object. */ Cheerio.prototype.cheerio = "[cheerio object]";
/*
 * Make cheerio an array-like object
 */ Cheerio.prototype.splice = Array.prototype.splice;
// Support for (const element of $(...)) iteration:
Cheerio.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// Plug in the API
Object.assign(Cheerio.prototype, attributes_namespaceObject, traversing_namespaceObject, api_manipulation_namespaceObject, css_namespaceObject, forms_namespaceObject); //# sourceMappingURL=cheerio.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/load.js




function getLoad(parse, render) {
    /**
     * Create a querying function, bound to a document created from the provided markup.
     *
     * Note that similar to web browser contexts, this operation may introduce
     * `<html>`, `<head>`, and `<body>` elements; set `isDocument` to `false` to
     * switch to fragment mode and disable this.
     *
     * @param content - Markup to be loaded.
     * @param options - Options for the created instance.
     * @param isDocument - Allows parser to be switched to fragment mode.
     * @returns The loaded document.
     * @see {@link https://cheerio.js.org#loading} for additional usage information.
     */ return function load(content, options, isDocument = true) {
        if (content == null) {
            throw new Error("cheerio.load() expects a string");
        }
        const internalOpts = {
            ...esm_options,
            ...flatten(options)
        };
        const initialRoot = parse(content, internalOpts, isDocument, null);
        /** Create an extended class here, so that extensions only live on one instance. */ class LoadedCheerio extends Cheerio {
            _make(selector, context) {
                const cheerio = initialize(selector, context);
                cheerio.prevObject = this;
                return cheerio;
            }
            _parse(content, options, isDocument, context) {
                return parse(content, options, isDocument, context);
            }
            _render(dom) {
                return render(dom, this.options);
            }
        }
        function initialize(selector, context, root = initialRoot, opts) {
            // $($)
            if (selector && isCheerio(selector)) return selector;
            const options = {
                ...internalOpts,
                ...flatten(opts)
            };
            const r = typeof root === "string" ? [
                parse(root, options, false, null)
            ] : "length" in root ? root : [
                root
            ];
            const rootInstance = isCheerio(r) ? r : new LoadedCheerio(r, null, options);
            // Add a cyclic reference, so that calling methods on `_root` never fails.
            rootInstance._root = rootInstance;
            // $(), $(null), $(undefined), $(false)
            if (!selector) {
                return new LoadedCheerio(undefined, rootInstance, options);
            }
            const elements = typeof selector === "string" && isHtml(selector) ? parse(selector, options, false, null).children : isNode(selector) ? [
                selector
            ] : Array.isArray(selector) ? selector : undefined;
            const instance = new LoadedCheerio(elements, rootInstance, options);
            if (elements) {
                return instance;
            }
            if (typeof selector !== "string") {
                throw new Error("Unexpected type of selector");
            }
            // We know that our selector is a string now.
            let search = selector;
            const searchContext = !context ? rootInstance : typeof context === "string" ? isHtml(context) ? new LoadedCheerio([
                parse(context, options, false, null)
            ], rootInstance, options) : (search = `${context} ${search}`, rootInstance) : isCheerio(context) ? context : new LoadedCheerio(Array.isArray(context) ? context : [
                context
            ], rootInstance, options);
            // If we still don't have a context, return
            if (!searchContext) return instance;
            /*
             * #id, .class, tag
             */ return searchContext.find(search);
        }
        // Add in static methods & properties
        Object.assign(initialize, static_namespaceObject, {
            load,
            // `_root` and `_options` are used in static methods.
            _root: initialRoot,
            _options: internalOpts,
            // Add `fn` for plugins
            fn: LoadedCheerio.prototype,
            // Add the prototype here to maintain `instanceof` behavior.
            prototype: LoadedCheerio.prototype
        });
        return initialize;
    };
}
function isNode(obj) {
    return !!obj.name || obj.type === "root" || obj.type === "text" || obj.type === "comment";
} //# sourceMappingURL=load.js.map

;// CONCATENATED MODULE: ./node_modules/parse5/dist/common/unicode.js
const UNDEFINED_CODE_POINTS = new Set([
    65534,
    65535,
    131070,
    131071,
    196606,
    196607,
    262142,
    262143,
    327678,
    327679,
    393214,
    393215,
    458750,
    458751,
    524286,
    524287,
    589822,
    589823,
    655358,
    655359,
    720894,
    720895,
    786430,
    786431,
    851966,
    851967,
    917502,
    917503,
    983038,
    983039,
    1048574,
    1048575,
    1114110,
    1114111
]);
const REPLACEMENT_CHARACTER = "�";
var CODE_POINTS;
(function(CODE_POINTS) {
    CODE_POINTS[CODE_POINTS["EOF"] = -1] = "EOF";
    CODE_POINTS[CODE_POINTS["NULL"] = 0] = "NULL";
    CODE_POINTS[CODE_POINTS["TABULATION"] = 9] = "TABULATION";
    CODE_POINTS[CODE_POINTS["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
    CODE_POINTS[CODE_POINTS["LINE_FEED"] = 10] = "LINE_FEED";
    CODE_POINTS[CODE_POINTS["FORM_FEED"] = 12] = "FORM_FEED";
    CODE_POINTS[CODE_POINTS["SPACE"] = 32] = "SPACE";
    CODE_POINTS[CODE_POINTS["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
    CODE_POINTS[CODE_POINTS["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
    CODE_POINTS[CODE_POINTS["AMPERSAND"] = 38] = "AMPERSAND";
    CODE_POINTS[CODE_POINTS["APOSTROPHE"] = 39] = "APOSTROPHE";
    CODE_POINTS[CODE_POINTS["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
    CODE_POINTS[CODE_POINTS["SOLIDUS"] = 47] = "SOLIDUS";
    CODE_POINTS[CODE_POINTS["DIGIT_0"] = 48] = "DIGIT_0";
    CODE_POINTS[CODE_POINTS["DIGIT_9"] = 57] = "DIGIT_9";
    CODE_POINTS[CODE_POINTS["SEMICOLON"] = 59] = "SEMICOLON";
    CODE_POINTS[CODE_POINTS["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
    CODE_POINTS[CODE_POINTS["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
    CODE_POINTS[CODE_POINTS["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
    CODE_POINTS[CODE_POINTS["QUESTION_MARK"] = 63] = "QUESTION_MARK";
    CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
    CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
    CODE_POINTS[CODE_POINTS["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
    CODE_POINTS[CODE_POINTS["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
    CODE_POINTS[CODE_POINTS["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
    CODE_POINTS[CODE_POINTS["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
})(CODE_POINTS || (CODE_POINTS = {}));
const SEQUENCES = {
    DASH_DASH: "--",
    CDATA_START: "[CDATA[",
    DOCTYPE: "doctype",
    SCRIPT: "script",
    PUBLIC: "public",
    SYSTEM: "system"
};
//Surrogates
function isSurrogate(cp) {
    return cp >= 55296 && cp <= 57343;
}
function isSurrogatePair(cp) {
    return cp >= 56320 && cp <= 57343;
}
function getSurrogatePairCodePoint(cp1, cp2) {
    return (cp1 - 55296) * 1024 + 9216 + cp2;
}
//NOTE: excluding NULL and ASCII whitespace
function isControlCodePoint(cp) {
    return cp !== 0x20 && cp !== 0x0a && cp !== 0x0d && cp !== 0x09 && cp !== 0x0c && cp >= 0x01 && cp <= 0x1f || cp >= 0x7f && cp <= 0x9f;
}
function isUndefinedCodePoint(cp) {
    return cp >= 64976 && cp <= 65007 || UNDEFINED_CODE_POINTS.has(cp);
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/common/error-codes.js
var ERR;
(function(ERR) {
    ERR["controlCharacterInInputStream"] = "control-character-in-input-stream";
    ERR["noncharacterInInputStream"] = "noncharacter-in-input-stream";
    ERR["surrogateInInputStream"] = "surrogate-in-input-stream";
    ERR["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
    ERR["endTagWithAttributes"] = "end-tag-with-attributes";
    ERR["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
    ERR["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
    ERR["unexpectedNullCharacter"] = "unexpected-null-character";
    ERR["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
    ERR["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
    ERR["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
    ERR["missingEndTagName"] = "missing-end-tag-name";
    ERR["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
    ERR["unknownNamedCharacterReference"] = "unknown-named-character-reference";
    ERR["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
    ERR["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
    ERR["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
    ERR["eofBeforeTagName"] = "eof-before-tag-name";
    ERR["eofInTag"] = "eof-in-tag";
    ERR["missingAttributeValue"] = "missing-attribute-value";
    ERR["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
    ERR["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
    ERR["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
    ERR["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
    ERR["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
    ERR["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
    ERR["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
    ERR["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
    ERR["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
    ERR["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
    ERR["cdataInHtmlContent"] = "cdata-in-html-content";
    ERR["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
    ERR["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
    ERR["eofInDoctype"] = "eof-in-doctype";
    ERR["nestedComment"] = "nested-comment";
    ERR["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
    ERR["eofInComment"] = "eof-in-comment";
    ERR["incorrectlyClosedComment"] = "incorrectly-closed-comment";
    ERR["eofInCdata"] = "eof-in-cdata";
    ERR["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
    ERR["nullCharacterReference"] = "null-character-reference";
    ERR["surrogateCharacterReference"] = "surrogate-character-reference";
    ERR["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
    ERR["controlCharacterReference"] = "control-character-reference";
    ERR["noncharacterCharacterReference"] = "noncharacter-character-reference";
    ERR["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
    ERR["missingDoctypeName"] = "missing-doctype-name";
    ERR["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
    ERR["duplicateAttribute"] = "duplicate-attribute";
    ERR["nonConformingDoctype"] = "non-conforming-doctype";
    ERR["missingDoctype"] = "missing-doctype";
    ERR["misplacedDoctype"] = "misplaced-doctype";
    ERR["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
    ERR["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
    ERR["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
    ERR["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
    ERR["abandonedHeadElementChild"] = "abandoned-head-element-child";
    ERR["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
    ERR["nestedNoscriptInHead"] = "nested-noscript-in-head";
    ERR["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));

;// CONCATENATED MODULE: ./node_modules/parse5/dist/tokenizer/preprocessor.js


//Const
const DEFAULT_BUFFER_WATERLINE = 1 << 16;
//Preprocessor
//NOTE: HTML input preprocessing
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#preprocessing-the-input-stream)
class Preprocessor {
    constructor(handler){
        this.handler = handler;
        this.html = "";
        this.pos = -1;
        // NOTE: Initial `lastGapPos` is -2, to ensure `col` on initialisation is 0
        this.lastGapPos = -2;
        this.gapStack = [];
        this.skipNextNewLine = false;
        this.lastChunkWritten = false;
        this.endOfChunkHit = false;
        this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
        this.isEol = false;
        this.lineStartPos = 0;
        this.droppedBufferSize = 0;
        this.line = 1;
        //NOTE: avoid reporting errors twice on advance/retreat
        this.lastErrOffset = -1;
    }
    /** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */ get col() {
        return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
    }
    get offset() {
        return this.droppedBufferSize + this.pos;
    }
    getError(code, cpOffset) {
        const { line, col, offset } = this;
        const startCol = col + cpOffset;
        const startOffset = offset + cpOffset;
        return {
            code,
            startLine: line,
            endLine: line,
            startCol,
            endCol: startCol,
            startOffset,
            endOffset: startOffset
        };
    }
    _err(code) {
        if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
            this.lastErrOffset = this.offset;
            this.handler.onParseError(this.getError(code, 0));
        }
    }
    _addGap() {
        this.gapStack.push(this.lastGapPos);
        this.lastGapPos = this.pos;
    }
    _processSurrogate(cp) {
        //NOTE: try to peek a surrogate pair
        if (this.pos !== this.html.length - 1) {
            const nextCp = this.html.charCodeAt(this.pos + 1);
            if (isSurrogatePair(nextCp)) {
                //NOTE: we have a surrogate pair. Peek pair character and recalculate code point.
                this.pos++;
                //NOTE: add a gap that should be avoided during retreat
                this._addGap();
                return getSurrogatePairCodePoint(cp, nextCp);
            }
        } else if (!this.lastChunkWritten) {
            this.endOfChunkHit = true;
            return CODE_POINTS.EOF;
        }
        //NOTE: isolated surrogate
        this._err(ERR.surrogateInInputStream);
        return cp;
    }
    willDropParsedChunk() {
        return this.pos > this.bufferWaterline;
    }
    dropParsedChunk() {
        if (this.willDropParsedChunk()) {
            this.html = this.html.substring(this.pos);
            this.lineStartPos -= this.pos;
            this.droppedBufferSize += this.pos;
            this.pos = 0;
            this.lastGapPos = -2;
            this.gapStack.length = 0;
        }
    }
    write(chunk, isLastChunk) {
        if (this.html.length > 0) {
            this.html += chunk;
        } else {
            this.html = chunk;
        }
        this.endOfChunkHit = false;
        this.lastChunkWritten = isLastChunk;
    }
    insertHtmlAtCurrentPos(chunk) {
        this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
        this.endOfChunkHit = false;
    }
    startsWith(pattern, caseSensitive) {
        // Check if our buffer has enough characters
        if (this.pos + pattern.length > this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return false;
        }
        if (caseSensitive) {
            return this.html.startsWith(pattern, this.pos);
        }
        for(let i = 0; i < pattern.length; i++){
            const cp = this.html.charCodeAt(this.pos + i) | 0x20;
            if (cp !== pattern.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    }
    peek(offset) {
        const pos = this.pos + offset;
        if (pos >= this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return CODE_POINTS.EOF;
        }
        const code = this.html.charCodeAt(pos);
        return code === CODE_POINTS.CARRIAGE_RETURN ? CODE_POINTS.LINE_FEED : code;
    }
    advance() {
        this.pos++;
        //NOTE: LF should be in the last column of the line
        if (this.isEol) {
            this.isEol = false;
            this.line++;
            this.lineStartPos = this.pos;
        }
        if (this.pos >= this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return CODE_POINTS.EOF;
        }
        let cp = this.html.charCodeAt(this.pos);
        //NOTE: all U+000D CARRIAGE RETURN (CR) characters must be converted to U+000A LINE FEED (LF) characters
        if (cp === CODE_POINTS.CARRIAGE_RETURN) {
            this.isEol = true;
            this.skipNextNewLine = true;
            return CODE_POINTS.LINE_FEED;
        }
        //NOTE: any U+000A LINE FEED (LF) characters that immediately follow a U+000D CARRIAGE RETURN (CR) character
        //must be ignored.
        if (cp === CODE_POINTS.LINE_FEED) {
            this.isEol = true;
            if (this.skipNextNewLine) {
                // `line` will be bumped again in the recursive call.
                this.line--;
                this.skipNextNewLine = false;
                this._addGap();
                return this.advance();
            }
        }
        this.skipNextNewLine = false;
        if (isSurrogate(cp)) {
            cp = this._processSurrogate(cp);
        }
        //OPTIMIZATION: first check if code point is in the common allowed
        //range (ASCII alphanumeric, whitespaces, big chunk of BMP)
        //before going into detailed performance cost validation.
        const isCommonValidRange = this.handler.onParseError === null || cp > 0x1f && cp < 0x7f || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.CARRIAGE_RETURN || cp > 0x9f && cp < 64976;
        if (!isCommonValidRange) {
            this._checkForProblematicCharacters(cp);
        }
        return cp;
    }
    _checkForProblematicCharacters(cp) {
        if (isControlCodePoint(cp)) {
            this._err(ERR.controlCharacterInInputStream);
        } else if (isUndefinedCodePoint(cp)) {
            this._err(ERR.noncharacterInInputStream);
        }
    }
    retreat(count) {
        this.pos -= count;
        while(this.pos < this.lastGapPos){
            this.lastGapPos = this.gapStack.pop();
            this.pos--;
        }
        this.isEol = false;
    }
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/common/token.js
var TokenType;
(function(TokenType) {
    TokenType[TokenType["CHARACTER"] = 0] = "CHARACTER";
    TokenType[TokenType["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
    TokenType[TokenType["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
    TokenType[TokenType["START_TAG"] = 3] = "START_TAG";
    TokenType[TokenType["END_TAG"] = 4] = "END_TAG";
    TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
    TokenType[TokenType["DOCTYPE"] = 6] = "DOCTYPE";
    TokenType[TokenType["EOF"] = 7] = "EOF";
    TokenType[TokenType["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));
function getTokenAttr(token, attrName) {
    for(let i = token.attrs.length - 1; i >= 0; i--){
        if (token.attrs[i].name === attrName) {
            return token.attrs[i].value;
        }
    }
    return null;
}

;// CONCATENATED MODULE: ./node_modules/parse5/node_modules/entities/dist/esm/generated/decode-data-html.js
// Generated using scripts/write-decode-map.ts
const decode_data_html_htmlDecodeTree = /* #__PURE__ */ new Uint16Array(// prettier-ignore
/* #__PURE__ */ 'ᵁ<\xd5ıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\x00\x00\x00\x00\x00\x00ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms\x7f\x84\x8b\x90\x95\x98\xa6\xb3\xb9\xc8\xcflig耻\xc6䃆P耻&䀦cute耻\xc1䃁reve;䄂Āiyx}rc耻\xc2䃂;䐐r;쀀\ud835\udd04rave耻\xc0䃀pha;䎑acr;䄀d;橓Āgp\x9d\xa1on;䄄f;쀀\ud835\udd38plyFunction;恡ing耻\xc5䃅Ācs\xbe\xc3r;쀀\ud835\udc9cign;扔ilde耻\xc3䃃ml耻\xc4䃄Ѐaceforsu\xe5\xfb\xfeėĜĢħĪĀcr\xea\xf2kslash;或Ŷ\xf6\xf8;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀\ud835\udd05pf;쀀\ud835\udd39eve;䋘c\xf2ēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻\xa9䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻\xc7䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷\xf2ſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀\ud835\udc9epĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀\ud835\udd07Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\x00\x00\x00͔͂\x00Ѕf;쀀\ud835\udd3bƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegra\xecȹoɴ͹\x00\x00ͻ\xbb͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔e\xe5ˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\x00\x00ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\x00ц\x00ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\x00ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀\ud835\udc9frok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻\xd0䃐cute耻\xc9䃉ƀaiyӒӗӜron;䄚rc耻\xca䃊;䐭ot;䄖r;쀀\ud835\udd08rave耻\xc8䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\x00\x00ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀\ud835\udd3csilon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻\xcb䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀\ud835\udd09lledɓ֗\x00\x00֣mallSquare;旼erySmallSquare;斪Ͱֺ\x00ֿ\x00\x00ׄf;쀀\ud835\udd3dAll;戀riertrf;愱c\xf2׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀\ud835\udd0a;拙pf;쀀\ud835\udd3eeater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀\ud835\udca2;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\x00ڲf;愍izontalLine;攀Āctۃۅ\xf2کrok;䄦mpńېۘownHum\xf0įqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻\xcd䃍Āiyܓܘrc耻\xce䃎;䐘ot;䄰r;愑rave耻\xcc䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lie\xf3ϝǴ݉\x00ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀\ud835\udd40a;䎙cr;愐ilde;䄨ǫޚ\x00ޞcy;䐆l耻\xcf䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀\ud835\udd0dpf;쀀\ud835\udd41ǣ߇\x00ߌr;쀀\ud835\udca5rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀\ud835\udd0epf;쀀\ud835\udd42cr;쀀\ud835\udca6րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\x00ࣃbleBracket;柦nǔࣈ\x00࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ight\xe1Μs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀\ud835\udd0fĀ;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊight\xe1οight\xe1ϊf;쀀\ud835\udd43erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂ\xf2ࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀\ud835\udd10nusPlus;戓pf;쀀\ud835\udd44c\xf2੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘\xeb૙eryThi\xee૙tedĀGL૸ଆreaterGreate\xf2ٳessLes\xf3ੈLine;䀊r;쀀\ud835\udd11ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀\ud835\udca9ilde耻\xd1䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻\xd3䃓Āiy෎ීrc耻\xd4䃔;䐞blac;䅐r;쀀\ud835\udd12rave耻\xd2䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀\ud835\udd46enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀\ud835\udcaaash耻\xd8䃘iŬื฼de耻\xd5䃕es;樷ml耻\xd6䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀\ud835\udd13i;䎦;䎠usMinus;䂱Āipຢອncareplan\xe5ڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀\ud835\udcab;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀\ud835\udd14pf;愚cr;쀀\ud835\udcac؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻\xae䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r\xbbཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\x00စbleBracket;柧nǔည\x00နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀\ud835\udd16ortȀDLRUᄪᄴᄾᅉownArrow\xbbОeftArrow\xbb࢚ightArrow\xbb࿝pArrow;憑gma;䎣allCircle;战pf;쀀\ud835\udd4aɲᅭ\x00\x00ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀\ud835\udcaear;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Th\xe1ྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et\xbbሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻\xde䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀\ud835\udd17Āeiቻ኉ǲኀ\x00ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀\ud835\udd4bipleDot;惛Āctዖዛr;쀀\ud835\udcafrok;䅦ૡዷጎጚጦ\x00ጬጱ\x00\x00\x00\x00\x00ጸጽ፷ᎅ\x00᏿ᐄᐊᐐĀcrዻጁute耻\xda䃚rĀ;oጇገ憟cir;楉rǣጓ\x00጖y;䐎ve;䅬Āiyጞጣrc耻\xdb䃛;䐣blac;䅰r;쀀\ud835\udd18rave耻\xd9䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀\ud835\udd4cЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥own\xe1ϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀\ud835\udcb0ilde;䅨ml耻\xdc䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀\ud835\udd19pf;쀀\ud835\udd4dcr;쀀\ud835\udcb1dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀\ud835\udd1apf;쀀\ud835\udd4ecr;쀀\ud835\udcb2Ȁfiosᓋᓐᓒᓘr;쀀\ud835\udd1b;䎞pf;쀀\ud835\udd4fcr;쀀\ud835\udcb3ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻\xdd䃝Āiyᔉᔍrc;䅶;䐫r;쀀\ud835\udd1cpf;쀀\ud835\udd50cr;쀀\ud835\udcb4ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\x00ᕛoWidt\xe8૙a;䎖r;愨pf;愤cr;쀀\ud835\udcb5௡ᖃᖊᖐ\x00ᖰᖶᖿ\x00\x00\x00\x00ᗆᗛᗫᙟ᙭\x00ᚕ᚛ᚲᚹ\x00ᚾcute耻\xe1䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻\xe2䃢te肻\xb4̆;䐰lig耻\xe6䃦Ā;r\xb2ᖺ;쀀\ud835\udd1erave耻\xe0䃠ĀepᗊᗖĀfpᗏᗔsym;愵\xe8ᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\x00\x00ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e\xbbᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢\xbb\xb9arr;捼Āgpᙣᙧon;䄅f;쀀\ud835\udd52΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒ\xf1ᚃing耻\xe5䃥ƀctyᚡᚦᚨr;쀀\ud835\udcb6;䀪mpĀ;e዁ᚯ\xf1ʈilde耻\xe3䃣ml耻\xe4䃤Āciᛂᛈonin\xf4ɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e\xbbᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰s\xe9ᜌno\xf5ēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀\ud835\udd1fg΀costuvwឍឝឳេ៕៛៞ƀaiuបពរ\xf0ݠrc;旯p\xbb፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\x00\x00ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄e\xe5ᑄ\xe5ᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\x00ᠳƲᠯ\x00ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀\ud835\udd53Ā;tᏋᡣom\xbbᏌtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻\xa6䂦Ȁceioᥑᥖᥚᥠr;쀀\ud835\udcb7mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t\xbb᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\x00᧨ᨑᨕᨲ\x00ᨷᩐ\x00\x00᪴\x00\x00᫁\x00\x00ᬡᬮ᭍᭒\x00᯽\x00ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁\xeeړȀaeiu᧰᧻ᨁᨅǰ᧵\x00᧸s;橍on;䄍dil耻\xe7䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻\xb8ƭptyv;榲t脀\xa2;eᨭᨮ䂢r\xe4Ʋr;쀀\ud835\udd20ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark\xbbᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\x00\x00᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟\xbbཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it\xbb᪼ˬ᫇᫔᫺\x00ᬊonĀ;eᫍᫎ䀺Ā;q\xc7\xc6ɭ᫙\x00\x00᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁\xeeᅠeĀmx᫱᫶ent\xbb᫩e\xf3ɍǧ᫾\x00ᬇĀ;dኻᬂot;橭n\xf4Ɇƀfryᬐᬔᬗ;쀀\ud835\udd54o\xe4ɔ脀\xa9;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀\ud835\udcb8Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\x00\x00᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\x00\x00ᯒre\xe3᭳u\xe3᭵ee;拎edge;拏en耻\xa4䂤earrowĀlrᯮ᯳eft\xbbᮀight\xbbᮽe\xe4ᯝĀciᰁᰇonin\xf4Ƿnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍r\xf2΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸\xf2ᄳhĀ;vᱚᱛ怐\xbbऊūᱡᱧarow;椏a\xe3̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻\xb0䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀\ud835\udd21arĀlrᲳᲵ\xbbࣜ\xbbသʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀\xf7;o᳧ᳰntimes;拇n\xf8᳷cy;䑒cɯᴆ\x00\x00ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀\ud835\udd55ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedg\xe5\xfanƀadhᄮᵝᵧownarrow\xf3ᲃarpoonĀlrᵲᵶef\xf4Ჴigh\xf4ᲶŢᵿᶅkaro\xf7གɯᶊ\x00\x00ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀\ud835\udcb9;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃r\xf2Щa\xf2ྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴo\xf4ᲉĀcsḎḔute耻\xe9䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻\xea䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀\ud835\udd22ƀ;rsṐṑṗ檚ave耻\xe8䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et\xbbẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀\ud835\udd56ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on\xbbớ;䏵ȀcsuvỪỳἋἣĀioữḱrc\xbbḮɩỹ\x00\x00ỻ\xedՈantĀglἂἆtr\xbbṝess\xbbṺƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯o\xf4͒ĀahὉὋ;䎷耻\xf0䃰Āmrὓὗl耻\xeb䃫o;悬ƀcipὡὤὧl;䀡s\xf4ծĀeoὬὴctatio\xeeՙnential\xe5չৡᾒ\x00ᾞ\x00ᾡᾧ\x00\x00ῆῌ\x00ΐ\x00ῦῪ \x00 ⁚llingdotse\xf1Ṅy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\x00\x00᾽g;耀ﬀig;耀ﬄ;쀀\ud835\udd23lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\x00ῳf;쀀\ud835\udd57ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\x00⁐β•‥‧‪‬\x00‮耻\xbd䂽;慓耻\xbc䂼;慕;慙;慛Ƴ‴\x00‶;慔;慖ʴ‾⁁\x00\x00⁃耻\xbe䂾;慗;慜5;慘ƶ⁌\x00⁎;慚;慝8;慞l;恄wn;挢cr;쀀\ud835\udcbbࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lan\xf4٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀\ud835\udd24Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox\xbbℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀\ud835\udd58Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\x00↎pro\xf8₞r;楸qĀlqؿ↖les\xf3₈i\xed٫Āen↣↭rtneqq;쀀≩︀\xc5↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽r\xf2ΠȀilmr⇐⇔⇗⇛rs\xf0ᒄf\xbb․il\xf4کĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it\xbb∊lip;怦con;抹r;쀀\ud835\udd25sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀\ud835\udd59bar;怕ƀclt≯≴≸r;쀀\ud835\udcbdas\xe8⇴rok;䄧Ābp⊂⊇ull;恃hen\xbbᱛૡ⊣\x00⊪\x00⊸⋅⋎\x00⋕⋳\x00\x00⋸⌢⍧⍢⍿\x00⎆⎪⎴cute耻\xed䃭ƀ;iyݱ⊰⊵rc耻\xee䃮;䐸Ācx⊼⊿y;䐵cl耻\xa1䂡ĀfrΟ⋉;쀀\ud835\udd26rave耻\xec䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓in\xe5ގar\xf4ܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝do\xf4⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙er\xf3ᕣ\xe3⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀\ud835\udd5aa;䎹uest耻\xbf䂿Āci⎊⎏r;쀀\ud835\udcbenʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\x00⎼cy;䑖l耻\xef䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀\ud835\udd27ath;䈷pf;쀀\ud835\udd5bǣ⏬\x00⏱r;쀀\ud835\udcbfrcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀\ud835\udd28reen;䄸cy;䑅cy;䑜pf;쀀\ud835\udd5ccr;쀀\ud835\udcc0஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼r\xf2৆\xf2Εail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\x00⒪\x00⒱\x00\x00\x00\x00\x00⒵Ⓔ\x00ⓆⓈⓍ\x00⓹ute;䄺mptyv;榴ra\xeeࡌbda;䎻gƀ;dlࢎⓁⓃ;榑\xe5ࢎ;檅uo耻\xab䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝\xeb≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼\xecࢰ\xe2┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□a\xe9⓶arpoonĀdu▯▴own\xbbњp\xbb०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoon\xf3྘quigarro\xf7⇰hreetimes;拋ƀ;qs▋ও◺lan\xf4বʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋ppro\xf8Ⓠot;拖qĀgq♃♅\xf4উgt\xf2⒌\xf4ছi\xedলƀilr♕࣡♚sht;楼;쀀\ud835\udd29Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖r\xf2◁orne\xf2ᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che\xbb⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox\xbb⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽r\xebࣁgƀlmr⛿✍✔eftĀar০✇ight\xe1৲apsto;柼ight\xe1৽parrowĀlr✥✩ef\xf4⓭ight;憬ƀafl✶✹✽r;榅;쀀\ud835\udd5dus;樭imes;樴š❋❏st;戗\xe1ፎƀ;ef❗❘᠀旊nge\xbb❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇r\xf2ࢨorne\xf2ᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀\ud835\udcc1mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹re\xe5◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀\xc5⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻\xaf䂯Āet⡗⡙;時Ā;e⡞⡟朠se\xbb⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻ow\xeeҌef\xf4ए\xf0Ꮡker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle\xbbᘦr;쀀\ud835\udd2ao;愧ƀcdn⢯⢴⣉ro耻\xb5䂵Ȁ;acdᑤ⢽⣀⣄s\xf4ᚧir;櫰ot肻\xb7Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛\xf2−\xf0ઁĀdp⣩⣮els;抧f;쀀\ud835\udd5eĀct⣸⣽r;쀀\ud835\udcc2pos\xbbᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la\xbb˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉ro\xf8඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\x00⧣p肻\xa0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\x00⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸ui\xf6ୣĀei⩊⩎ar;椨\xed஘istĀ;s஠டr;쀀\ud835\udd2bȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lan\xf4௢i\xed௪Ā;rஶ⪁\xbbஷƀAap⪊⪍⪑r\xf2⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹r\xf2⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro\xf7⫁ightarro\xf7⪐ƀ;qs఻⪺⫪lan\xf4ౕĀ;sౕ⫴\xbbశi\xedౝĀ;rవ⫾iĀ;eచథi\xe4ඐĀpt⬌⬑f;쀀\ud835\udd5f膀\xac;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lle\xec୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳u\xe5ಥĀ;cಘ⭸Ā;eಒ⭽\xf1ಘȀAait⮈⮋⮝⮧r\xf2⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow\xbb⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉u\xe5൅;쀀\ud835\udcc3ortɭ⬅\x00\x00⯖ar\xe1⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭\xe5೸\xe5ഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗ\xf1സȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇ\xecௗlde耻\xf1䃱\xe7ృiangleĀlrⱒⱜeftĀ;eచⱚ\xf1దightĀ;eೋⱥ\xf1೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ⴭ\x00ⴸⵈⵠⵥ⵲ⶄᬇ\x00\x00ⶍⶫ\x00ⷈⷎ\x00ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻\xf3䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻\xf4䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀\ud835\udd2cͯ⵹\x00\x00⵼\x00ⶂn;䋛ave耻\xf2䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨr\xf2᪀Āir⶝ⶠr;榾oss;榻n\xe5๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀\ud835\udd60ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨r\xf2᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f\xbbⷿ耻\xaa䂪耻\xba䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧\xf2⸁ash耻\xf8䃸l;折iŬⸯ⸴de耻\xf5䃵esĀ;aǛ⸺s;樶ml耻\xf6䃶bar;挽ૡ⹞\x00⹽\x00⺀⺝\x00⺢⺹\x00\x00⻋ຜ\x00⼓\x00\x00⼫⾼\x00⿈rȀ;astЃ⹧⹲຅脀\xb6;l⹭⹮䂶le\xecЃɩ⹸\x00\x00⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀\ud835\udd2dƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕ma\xf4੶ne;明ƀ;tv⺿⻀⻈䏀chfork\xbb´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎\xf6⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻\xb1ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀\ud835\udd61nd耻\xa3䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷u\xe5໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾ppro\xf8⽃urlye\xf1໙\xf1໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨i\xedໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺\xf0⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴\xef໻rel;抰Āci⿀⿅r;쀀\ud835\udcc5;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀\ud835\udd2epf;쀀\ud835\udd62rime;恗cr;쀀\ud835\udcc6ƀaeo⿸〉〓tĀei⿾々rnion\xf3ڰnt;樖stĀ;e【】䀿\xf1Ἑ\xf4༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがr\xf2Ⴓ\xf2ϝail;検ar\xf2ᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕i\xe3ᅮmptyv;榳gȀ;del࿑らるろ;榒;榥\xe5࿑uo耻\xbb䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞\xeb≝\xf0✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶al\xf3༞ƀabrョリヮr\xf2៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗\xec࿲\xe2ヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜn\xe5Ⴛar\xf4ྩt;断ƀilrㅩဣㅮsht;楽;쀀\ud835\udd2fĀaoㅷㆆrĀduㅽㅿ\xbbѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭa\xe9トarpoonĀduㆻㆿow\xeeㅾp\xbb႒eftĀah㇊㇐rrow\xf3࿪arpoon\xf3Ցightarrows;應quigarro\xf7ニhreetimes;拌g;䋚ingdotse\xf1ἲƀahm㈍㈐㈓r\xf2࿪a\xf2Ց;怏oustĀ;a㈞㈟掱che\xbb㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾r\xebဃƀafl㉇㉊㉎r;榆;쀀\ud835\udd63us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒ar\xf2㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀\ud835\udcc7Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠re\xe5ㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\x00㍺㎤\x00\x00㏬㏰\x00㐨㑈㑚㒭㒱㓊㓱\x00㘖\x00\x00㘳cute;䅛qu\xef➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\x00㋼;檸on;䅡u\xe5ᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓i\xedሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒\xeb∨Ā;oਸ਼਴t耻\xa7䂧i;䀻war;椩mĀin㍩\xf0nu\xf3\xf1t;朶rĀ;o㍶⁕쀀\ud835\udd30Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\x00\x00㎜i\xe4ᑤara\xec⹯耻\xad䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲ar\xf2ᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetm\xe9㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀\ud835\udd64aĀdr㑍ЂesĀ;u㑔㑕晠it\xbb㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍\xf1ᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝\xf1ᆮƀ;afᅻ㒦ְrť㒫ֱ\xbbᅼar\xf2ᅈȀcemt㒹㒾㓂㓅r;쀀\ud835\udcc8tm\xee\xf1i\xec㐕ar\xe6ᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psilo\xeeỠh\xe9⺯s\xbb⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦ppro\xf8㋺urlye\xf1ᇾ\xf1ᇳƀaes㖂㖈㌛ppro\xf8㌚q\xf1㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻\xb9䂹耻\xb2䂲耻\xb3䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨\xeb∮Ā;oਫ਩war;椪lig耻\xdf䃟௡㙑㙝㙠ዎ㙳㙹\x00㙾㛂\x00\x00\x00\x00\x00㛛㜃\x00㜉㝬\x00\x00\x00㞇ɲ㙖\x00\x00㙛get;挖;䏄r\xeb๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀\ud835\udd31Ȁeiko㚆㚝㚵㚼ǲ㚋\x00㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮ppro\xf8዁im\xbbኬs\xf0ኞĀas㚺㚮\xf0዁rn耻\xfe䃾Ǭ̟㛆⋧es膀\xd7;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀\xe1⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀\ud835\udd65rk;櫚\xe1㍢rime;怴ƀaip㜏㜒㝤d\xe5ቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own\xbbᶻeftĀ;e⠀㜾\xf1म;扜ightĀ;e㊪㝋\xf1ၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀\ud835\udcc9;䑆cy;䑛rok;䅧Āio㞋㞎x\xf4᝷headĀlr㞗㞠eftarro\xf7ࡏightarrow\xbbཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶r\xf2ϭar;楣Ācr㟜㟢ute耻\xfa䃺\xf2ᅐrǣ㟪\x00㟭y;䑞ve;䅭Āiy㟵㟺rc耻\xfb䃻;䑃ƀabh㠃㠆㠋r\xf2Ꭽlac;䅱a\xf2ᏃĀir㠓㠘sht;楾;쀀\ud835\udd32rave耻\xf9䃹š㠧㠱rĀlr㠬㠮\xbbॗ\xbbႃlk;斀Āct㠹㡍ɯ㠿\x00\x00㡊rnĀ;e㡅㡆挜r\xbb㡆op;挏ri;旸Āal㡖㡚cr;䅫肻\xa8͉Āgp㡢㡦on;䅳f;쀀\ud835\udd66̀adhlsuᅋ㡸㡽፲㢑㢠own\xe1ᎳarpoonĀlr㢈㢌ef\xf4㠭igh\xf4㠯iƀ;hl㢙㢚㢜䏅\xbbᏺon\xbb㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\x00\x00㣁rnĀ;e㢼㢽挝r\xbb㢽op;挎ng;䅯ri;旹cr;쀀\ud835\udccaƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨\xbb᠓Āam㣯㣲r\xf2㢨l耻\xfc䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠r\xf2ϷarĀ;v㤦㤧櫨;櫩as\xe8ϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖app\xe1␕othin\xe7ẖƀhir㓫⻈㥙op\xf4⾵Ā;hᎷ㥢\xefㆍĀiu㥩㥭gm\xe1㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟et\xe1㚜iangleĀlr㦪㦯eft\xbbथight\xbbၑy;䐲ash\xbbံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨa\xf2ᑩr;쀀\ud835\udd33tr\xe9㦮suĀbp㧯㧱\xbbജ\xbb൙pf;쀀\ud835\udd67ro\xf0໻tr\xe9㦴Ācu㨆㨋r;쀀\ud835\udccbĀbp㨐㨘nĀEe㦀㨖\xbb㥾nĀEe㦒㨞\xbb㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀\ud835\udd34pf;쀀\ud835\udd68Ā;eᑹ㩦at\xe8ᑹcr;쀀\ud835\udcccૣណ㪇\x00㪋\x00㪐㪛\x00\x00㪝㪨㪫㪯\x00\x00㫃㫎\x00㫘ៜ៟tr\xe9៑r;쀀\ud835\udd35ĀAa㪔㪗r\xf2σr\xf2৶;䎾ĀAa㪡㪤r\xf2θr\xf2৫a\xf0✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀\ud835\udd69im\xe5ឲĀAa㫇㫊r\xf2ώr\xf2ਁĀcq㫒ីr;쀀\ud835\udccdĀpt៖㫜r\xe9។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻\xfd䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻\xa5䂥r;쀀\ud835\udd36cy;䑗pf;쀀\ud835\udd6acr;쀀\ud835\udcceĀcm㬦㬩y;䑎l耻\xff䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡tr\xe6ᕟa;䎶r;쀀\ud835\udd37cy;䐶grarr;懝pf;쀀\ud835\udd6bcr;쀀\ud835\udccfĀjn㮅㮇;怍j;怌'.split("").map((c)=>c.charCodeAt(0))); //# sourceMappingURL=decode-data-html.js.map

;// CONCATENATED MODULE: ./node_modules/parse5/node_modules/entities/dist/esm/generated/decode-data-xml.js
// Generated using scripts/write-decode-map.ts
const decode_data_xml_xmlDecodeTree = /* #__PURE__ */ new Uint16Array(// prettier-ignore
/* #__PURE__ */ "Ȁaglq	\x15\x18\x1bɭ\x0f\x00\x00\x12p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((c)=>c.charCodeAt(0))); //# sourceMappingURL=decode-data-xml.js.map

;// CONCATENATED MODULE: ./node_modules/parse5/node_modules/entities/dist/esm/decode-codepoint.js
// Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
var decode_codepoint_a;
const decode_codepoint_decodeMap = new Map([
    [
        0,
        65533
    ],
    // C1 Unicode control character reference replacements
    [
        128,
        8364
    ],
    [
        130,
        8218
    ],
    [
        131,
        402
    ],
    [
        132,
        8222
    ],
    [
        133,
        8230
    ],
    [
        134,
        8224
    ],
    [
        135,
        8225
    ],
    [
        136,
        710
    ],
    [
        137,
        8240
    ],
    [
        138,
        352
    ],
    [
        139,
        8249
    ],
    [
        140,
        338
    ],
    [
        142,
        381
    ],
    [
        145,
        8216
    ],
    [
        146,
        8217
    ],
    [
        147,
        8220
    ],
    [
        148,
        8221
    ],
    [
        149,
        8226
    ],
    [
        150,
        8211
    ],
    [
        151,
        8212
    ],
    [
        152,
        732
    ],
    [
        153,
        8482
    ],
    [
        154,
        353
    ],
    [
        155,
        8250
    ],
    [
        156,
        339
    ],
    [
        158,
        382
    ],
    [
        159,
        376
    ]
]);
/**
 * Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
 */ const esm_decode_codepoint_fromCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, n/no-unsupported-features/es-builtins
(decode_codepoint_a = String.fromCodePoint) !== null && decode_codepoint_a !== void 0 ? decode_codepoint_a : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
        codePoint -= 65536;
        output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
};
/**
 * Replace the given code point with a replacement character if it is a
 * surrogate or is outside the valid range. Otherwise return the code
 * point unchanged.
 */ function decode_codepoint_replaceCodePoint(codePoint) {
    var _a;
    if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
        return 65533;
    }
    return (_a = decode_codepoint_decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
/**
 * Replace the code point if relevant, then convert it to a string.
 *
 * @deprecated Use `fromCodePoint(replaceCodePoint(codePoint))` instead.
 * @param codePoint The code point to decode.
 * @returns The decoded code point.
 */ function decode_codepoint_decodeCodePoint(codePoint) {
    return esm_decode_codepoint_fromCodePoint(decode_codepoint_replaceCodePoint(codePoint));
} //# sourceMappingURL=decode-codepoint.js.map

;// CONCATENATED MODULE: ./node_modules/parse5/node_modules/entities/dist/esm/decode.js



var decode_CharCodes;
(function(CharCodes) {
    CharCodes[CharCodes["NUM"] = 35] = "NUM";
    CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
    CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
    CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
    CharCodes[CharCodes["NINE"] = 57] = "NINE";
    CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
    CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
    CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
    CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
    CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
    CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
    CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
})(decode_CharCodes || (decode_CharCodes = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */ const decode_TO_LOWER_BIT = 32;
var decode_BinTrieFlags;
(function(BinTrieFlags) {
    BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
    BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
    BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(decode_BinTrieFlags || (decode_BinTrieFlags = {}));
function decode_isNumber(code) {
    return code >= decode_CharCodes.ZERO && code <= decode_CharCodes.NINE;
}
function decode_isHexadecimalCharacter(code) {
    return code >= decode_CharCodes.UPPER_A && code <= decode_CharCodes.UPPER_F || code >= decode_CharCodes.LOWER_A && code <= decode_CharCodes.LOWER_F;
}
function decode_isAsciiAlphaNumeric(code) {
    return code >= decode_CharCodes.UPPER_A && code <= decode_CharCodes.UPPER_Z || code >= decode_CharCodes.LOWER_A && code <= decode_CharCodes.LOWER_Z || decode_isNumber(code);
}
/**
 * Checks if the given character is a valid end character for an entity in an attribute.
 *
 * Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
 * See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
 */ function decode_isEntityInAttributeInvalidEnd(code) {
    return code === decode_CharCodes.EQUALS || decode_isAsciiAlphaNumeric(code);
}
var decode_EntityDecoderState;
(function(EntityDecoderState) {
    EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
    EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
    EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
    EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
    EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
})(decode_EntityDecoderState || (decode_EntityDecoderState = {}));
var esm_decode_DecodingMode;
(function(DecodingMode) {
    /** Entities in text nodes that can end with any character. */ DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
    /** Only allow entities terminated with a semicolon. */ DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
    /** Entities in attributes have limitations on ending characters. */ DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
})(esm_decode_DecodingMode || (esm_decode_DecodingMode = {}));
/**
 * Token decoder with support of writing partial entities.
 */ class decode_EntityDecoder {
    constructor(/** The tree used to decode entities. */ decodeTree, /**
     * The function that is called when a codepoint is decoded.
     *
     * For multi-byte named entities, this will be called multiple times,
     * with the second codepoint, and the same `consumed` value.
     *
     * @param codepoint The decoded codepoint.
     * @param consumed The number of bytes consumed by the decoder.
     */ emitCodePoint, /** An object that is used to produce errors. */ errors){
        this.decodeTree = decodeTree;
        this.emitCodePoint = emitCodePoint;
        this.errors = errors;
        /** The current state of the decoder. */ this.state = decode_EntityDecoderState.EntityStart;
        /** Characters that were consumed while parsing an entity. */ this.consumed = 1;
        /**
         * The result of the entity.
         *
         * Either the result index of a numeric entity, or the codepoint of a
         * numeric entity.
         */ this.result = 0;
        /** The current index in the decode tree. */ this.treeIndex = 0;
        /** The number of characters that were consumed in excess. */ this.excess = 1;
        /** The mode in which the decoder is operating. */ this.decodeMode = esm_decode_DecodingMode.Strict;
    }
    /** Resets the instance to make it reusable. */ startEntity(decodeMode) {
        this.decodeMode = decodeMode;
        this.state = decode_EntityDecoderState.EntityStart;
        this.result = 0;
        this.treeIndex = 0;
        this.excess = 1;
        this.consumed = 1;
    }
    /**
     * Write an entity to the decoder. This can be called multiple times with partial entities.
     * If the entity is incomplete, the decoder will return -1.
     *
     * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
     * entity is incomplete, and resume when the next string is written.
     *
     * @param input The string containing the entity (or a continuation of the entity).
     * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ write(input, offset) {
        switch(this.state){
            case decode_EntityDecoderState.EntityStart:
                {
                    if (input.charCodeAt(offset) === decode_CharCodes.NUM) {
                        this.state = decode_EntityDecoderState.NumericStart;
                        this.consumed += 1;
                        return this.stateNumericStart(input, offset + 1);
                    }
                    this.state = decode_EntityDecoderState.NamedEntity;
                    return this.stateNamedEntity(input, offset);
                }
            case decode_EntityDecoderState.NumericStart:
                {
                    return this.stateNumericStart(input, offset);
                }
            case decode_EntityDecoderState.NumericDecimal:
                {
                    return this.stateNumericDecimal(input, offset);
                }
            case decode_EntityDecoderState.NumericHex:
                {
                    return this.stateNumericHex(input, offset);
                }
            case decode_EntityDecoderState.NamedEntity:
                {
                    return this.stateNamedEntity(input, offset);
                }
        }
    }
    /**
     * Switches between the numeric decimal and hexadecimal states.
     *
     * Equivalent to the `Numeric character reference state` in the HTML spec.
     *
     * @param input The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNumericStart(input, offset) {
        if (offset >= input.length) {
            return -1;
        }
        if ((input.charCodeAt(offset) | decode_TO_LOWER_BIT) === decode_CharCodes.LOWER_X) {
            this.state = decode_EntityDecoderState.NumericHex;
            this.consumed += 1;
            return this.stateNumericHex(input, offset + 1);
        }
        this.state = decode_EntityDecoderState.NumericDecimal;
        return this.stateNumericDecimal(input, offset);
    }
    addToNumericResult(input, start, end, base) {
        if (start !== end) {
            const digitCount = end - start;
            this.result = this.result * Math.pow(base, digitCount) + Number.parseInt(input.substr(start, digitCount), base);
            this.consumed += digitCount;
        }
    }
    /**
     * Parses a hexadecimal numeric entity.
     *
     * Equivalent to the `Hexademical character reference state` in the HTML spec.
     *
     * @param input The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNumericHex(input, offset) {
        const startIndex = offset;
        while(offset < input.length){
            const char = input.charCodeAt(offset);
            if (decode_isNumber(char) || decode_isHexadecimalCharacter(char)) {
                offset += 1;
            } else {
                this.addToNumericResult(input, startIndex, offset, 16);
                return this.emitNumericEntity(char, 3);
            }
        }
        this.addToNumericResult(input, startIndex, offset, 16);
        return -1;
    }
    /**
     * Parses a decimal numeric entity.
     *
     * Equivalent to the `Decimal character reference state` in the HTML spec.
     *
     * @param input The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNumericDecimal(input, offset) {
        const startIndex = offset;
        while(offset < input.length){
            const char = input.charCodeAt(offset);
            if (decode_isNumber(char)) {
                offset += 1;
            } else {
                this.addToNumericResult(input, startIndex, offset, 10);
                return this.emitNumericEntity(char, 2);
            }
        }
        this.addToNumericResult(input, startIndex, offset, 10);
        return -1;
    }
    /**
     * Validate and emit a numeric entity.
     *
     * Implements the logic from the `Hexademical character reference start
     * state` and `Numeric character reference end state` in the HTML spec.
     *
     * @param lastCp The last code point of the entity. Used to see if the
     *               entity was terminated with a semicolon.
     * @param expectedLength The minimum number of characters that should be
     *                       consumed. Used to validate that at least one digit
     *                       was consumed.
     * @returns The number of characters that were consumed.
     */ emitNumericEntity(lastCp, expectedLength) {
        var _a;
        // Ensure we consumed at least one digit.
        if (this.consumed <= expectedLength) {
            (_a = this.errors) === null || _a === void 0 ? void 0 : _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
            return 0;
        }
        // Figure out if this is a legit end of the entity
        if (lastCp === decode_CharCodes.SEMI) {
            this.consumed += 1;
        } else if (this.decodeMode === esm_decode_DecodingMode.Strict) {
            return 0;
        }
        this.emitCodePoint(decode_codepoint_replaceCodePoint(this.result), this.consumed);
        if (this.errors) {
            if (lastCp !== decode_CharCodes.SEMI) {
                this.errors.missingSemicolonAfterCharacterReference();
            }
            this.errors.validateNumericCharacterReference(this.result);
        }
        return this.consumed;
    }
    /**
     * Parses a named entity.
     *
     * Equivalent to the `Named character reference state` in the HTML spec.
     *
     * @param input The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */ stateNamedEntity(input, offset) {
        const { decodeTree } = this;
        let current = decodeTree[this.treeIndex];
        // The mask is the number of bytes of the value, including the current byte.
        let valueLength = (current & decode_BinTrieFlags.VALUE_LENGTH) >> 14;
        for(; offset < input.length; offset++, this.excess++){
            const char = input.charCodeAt(offset);
            this.treeIndex = decode_determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
            if (this.treeIndex < 0) {
                return this.result === 0 || // If we are parsing an attribute
                this.decodeMode === esm_decode_DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
                (valueLength === 0 || // And there should be no invalid characters.
                decode_isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
            }
            current = decodeTree[this.treeIndex];
            valueLength = (current & decode_BinTrieFlags.VALUE_LENGTH) >> 14;
            // If the branch is a value, store it and continue
            if (valueLength !== 0) {
                // If the entity is terminated by a semicolon, we are done.
                if (char === decode_CharCodes.SEMI) {
                    return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
                }
                // If we encounter a non-terminated (legacy) entity while parsing strictly, then ignore it.
                if (this.decodeMode !== esm_decode_DecodingMode.Strict) {
                    this.result = this.treeIndex;
                    this.consumed += this.excess;
                    this.excess = 0;
                }
            }
        }
        return -1;
    }
    /**
     * Emit a named entity that was not terminated with a semicolon.
     *
     * @returns The number of characters consumed.
     */ emitNotTerminatedNamedEntity() {
        var _a;
        const { result, decodeTree } = this;
        const valueLength = (decodeTree[result] & decode_BinTrieFlags.VALUE_LENGTH) >> 14;
        this.emitNamedEntityData(result, valueLength, this.consumed);
        (_a = this.errors) === null || _a === void 0 ? void 0 : _a.missingSemicolonAfterCharacterReference();
        return this.consumed;
    }
    /**
     * Emit a named entity.
     *
     * @param result The index of the entity in the decode tree.
     * @param valueLength The number of bytes in the entity.
     * @param consumed The number of characters consumed.
     *
     * @returns The number of characters consumed.
     */ emitNamedEntityData(result, valueLength, consumed) {
        const { decodeTree } = this;
        this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~decode_BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
        if (valueLength === 3) {
            // For multi-byte values, we need to emit the second byte.
            this.emitCodePoint(decodeTree[result + 2], consumed);
        }
        return consumed;
    }
    /**
     * Signal to the parser that the end of the input was reached.
     *
     * Remaining data will be emitted and relevant errors will be produced.
     *
     * @returns The number of characters consumed.
     */ end() {
        var _a;
        switch(this.state){
            case decode_EntityDecoderState.NamedEntity:
                {
                    // Emit a named entity if we have one.
                    return this.result !== 0 && (this.decodeMode !== esm_decode_DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
                }
            // Otherwise, emit a numeric entity if we have one.
            case decode_EntityDecoderState.NumericDecimal:
                {
                    return this.emitNumericEntity(0, 2);
                }
            case decode_EntityDecoderState.NumericHex:
                {
                    return this.emitNumericEntity(0, 3);
                }
            case decode_EntityDecoderState.NumericStart:
                {
                    (_a = this.errors) === null || _a === void 0 ? void 0 : _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
                    return 0;
                }
            case decode_EntityDecoderState.EntityStart:
                {
                    // Return 0 if we have no entity.
                    return 0;
                }
        }
    }
}
/**
 * Creates a function that decodes entities in a string.
 *
 * @param decodeTree The decode tree.
 * @returns A function that decodes entities in a string.
 */ function decode_getDecoder(decodeTree) {
    let returnValue = "";
    const decoder = new decode_EntityDecoder(decodeTree, (data)=>returnValue += fromCodePoint(data));
    return function decodeWithTrie(input, decodeMode) {
        let lastIndex = 0;
        let offset = 0;
        while((offset = input.indexOf("&", offset)) >= 0){
            returnValue += input.slice(lastIndex, offset);
            decoder.startEntity(decodeMode);
            const length = decoder.write(input, // Skip the "&"
            offset + 1);
            if (length < 0) {
                lastIndex = offset + decoder.end();
                break;
            }
            lastIndex = offset + length;
            // If `length` is 0, skip the current `&` and continue.
            offset = length === 0 ? lastIndex + 1 : lastIndex;
        }
        const result = returnValue + input.slice(lastIndex);
        // Make sure we don't keep a reference to the final string.
        returnValue = "";
        return result;
    };
}
/**
 * Determines the branch of the current node that is taken given the current
 * character. This function is used to traverse the trie.
 *
 * @param decodeTree The trie.
 * @param current The current node.
 * @param nodeIdx The index right after the current node and its value.
 * @param char The current character.
 * @returns The index of the next node, or -1 if no branch is taken.
 */ function decode_determineBranch(decodeTree, current, nodeIndex, char) {
    const branchCount = (current & decode_BinTrieFlags.BRANCH_LENGTH) >> 7;
    const jumpOffset = current & decode_BinTrieFlags.JUMP_TABLE;
    // Case 1: Single branch encoded in jump offset
    if (branchCount === 0) {
        return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
    }
    // Case 2: Multiple branches encoded in jump table
    if (jumpOffset) {
        const value = char - jumpOffset;
        return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
    }
    // Case 3: Multiple branches encoded in dictionary
    // Binary search for the character.
    let lo = nodeIndex;
    let hi = lo + branchCount - 1;
    while(lo <= hi){
        const mid = lo + hi >>> 1;
        const midValue = decodeTree[mid];
        if (midValue < char) {
            lo = mid + 1;
        } else if (midValue > char) {
            hi = mid - 1;
        } else {
            return decodeTree[mid + branchCount];
        }
    }
    return -1;
}
const decode_htmlDecoder = /* #__PURE__ */ (/* unused pure expression or super */ null && (decode_getDecoder(htmlDecodeTree)));
const decode_xmlDecoder = /* #__PURE__ */ (/* unused pure expression or super */ null && (decode_getDecoder(xmlDecodeTree)));
/**
 * Decodes an HTML string.
 *
 * @param htmlString The string to decode.
 * @param mode The decoding mode.
 * @returns The decoded string.
 */ function esm_decode_decodeHTML(htmlString, mode = esm_decode_DecodingMode.Legacy) {
    return decode_htmlDecoder(htmlString, mode);
}
/**
 * Decodes an HTML string in an attribute.
 *
 * @param htmlAttribute The string to decode.
 * @returns The decoded string.
 */ function decode_decodeHTMLAttribute(htmlAttribute) {
    return decode_htmlDecoder(htmlAttribute, esm_decode_DecodingMode.Attribute);
}
/**
 * Decodes an HTML string, requiring all entities to be terminated by a semicolon.
 *
 * @param htmlString The string to decode.
 * @returns The decoded string.
 */ function decode_decodeHTMLStrict(htmlString) {
    return decode_htmlDecoder(htmlString, esm_decode_DecodingMode.Strict);
}
/**
 * Decodes an XML string, requiring all entities to be terminated by a semicolon.
 *
 * @param xmlString The string to decode.
 * @returns The decoded string.
 */ function esm_decode_decodeXML(xmlString) {
    return decode_xmlDecoder(xmlString, esm_decode_DecodingMode.Strict);
}
// Re-export for use by eg. htmlparser2


 //# sourceMappingURL=decode.js.map

;// CONCATENATED MODULE: ./node_modules/parse5/dist/common/html.js
/** All valid namespaces in HTML. */ var NS;
(function(NS) {
    NS["HTML"] = "http://www.w3.org/1999/xhtml";
    NS["MATHML"] = "http://www.w3.org/1998/Math/MathML";
    NS["SVG"] = "http://www.w3.org/2000/svg";
    NS["XLINK"] = "http://www.w3.org/1999/xlink";
    NS["XML"] = "http://www.w3.org/XML/1998/namespace";
    NS["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS || (NS = {}));
var ATTRS;
(function(ATTRS) {
    ATTRS["TYPE"] = "type";
    ATTRS["ACTION"] = "action";
    ATTRS["ENCODING"] = "encoding";
    ATTRS["PROMPT"] = "prompt";
    ATTRS["NAME"] = "name";
    ATTRS["COLOR"] = "color";
    ATTRS["FACE"] = "face";
    ATTRS["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
/**
 * The mode of the document.
 *
 * @see {@link https://dom.spec.whatwg.org/#concept-document-limited-quirks}
 */ var DOCUMENT_MODE;
(function(DOCUMENT_MODE) {
    DOCUMENT_MODE["NO_QUIRKS"] = "no-quirks";
    DOCUMENT_MODE["QUIRKS"] = "quirks";
    DOCUMENT_MODE["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function(TAG_NAMES) {
    TAG_NAMES["A"] = "a";
    TAG_NAMES["ADDRESS"] = "address";
    TAG_NAMES["ANNOTATION_XML"] = "annotation-xml";
    TAG_NAMES["APPLET"] = "applet";
    TAG_NAMES["AREA"] = "area";
    TAG_NAMES["ARTICLE"] = "article";
    TAG_NAMES["ASIDE"] = "aside";
    TAG_NAMES["B"] = "b";
    TAG_NAMES["BASE"] = "base";
    TAG_NAMES["BASEFONT"] = "basefont";
    TAG_NAMES["BGSOUND"] = "bgsound";
    TAG_NAMES["BIG"] = "big";
    TAG_NAMES["BLOCKQUOTE"] = "blockquote";
    TAG_NAMES["BODY"] = "body";
    TAG_NAMES["BR"] = "br";
    TAG_NAMES["BUTTON"] = "button";
    TAG_NAMES["CAPTION"] = "caption";
    TAG_NAMES["CENTER"] = "center";
    TAG_NAMES["CODE"] = "code";
    TAG_NAMES["COL"] = "col";
    TAG_NAMES["COLGROUP"] = "colgroup";
    TAG_NAMES["DD"] = "dd";
    TAG_NAMES["DESC"] = "desc";
    TAG_NAMES["DETAILS"] = "details";
    TAG_NAMES["DIALOG"] = "dialog";
    TAG_NAMES["DIR"] = "dir";
    TAG_NAMES["DIV"] = "div";
    TAG_NAMES["DL"] = "dl";
    TAG_NAMES["DT"] = "dt";
    TAG_NAMES["EM"] = "em";
    TAG_NAMES["EMBED"] = "embed";
    TAG_NAMES["FIELDSET"] = "fieldset";
    TAG_NAMES["FIGCAPTION"] = "figcaption";
    TAG_NAMES["FIGURE"] = "figure";
    TAG_NAMES["FONT"] = "font";
    TAG_NAMES["FOOTER"] = "footer";
    TAG_NAMES["FOREIGN_OBJECT"] = "foreignObject";
    TAG_NAMES["FORM"] = "form";
    TAG_NAMES["FRAME"] = "frame";
    TAG_NAMES["FRAMESET"] = "frameset";
    TAG_NAMES["H1"] = "h1";
    TAG_NAMES["H2"] = "h2";
    TAG_NAMES["H3"] = "h3";
    TAG_NAMES["H4"] = "h4";
    TAG_NAMES["H5"] = "h5";
    TAG_NAMES["H6"] = "h6";
    TAG_NAMES["HEAD"] = "head";
    TAG_NAMES["HEADER"] = "header";
    TAG_NAMES["HGROUP"] = "hgroup";
    TAG_NAMES["HR"] = "hr";
    TAG_NAMES["HTML"] = "html";
    TAG_NAMES["I"] = "i";
    TAG_NAMES["IMG"] = "img";
    TAG_NAMES["IMAGE"] = "image";
    TAG_NAMES["INPUT"] = "input";
    TAG_NAMES["IFRAME"] = "iframe";
    TAG_NAMES["KEYGEN"] = "keygen";
    TAG_NAMES["LABEL"] = "label";
    TAG_NAMES["LI"] = "li";
    TAG_NAMES["LINK"] = "link";
    TAG_NAMES["LISTING"] = "listing";
    TAG_NAMES["MAIN"] = "main";
    TAG_NAMES["MALIGNMARK"] = "malignmark";
    TAG_NAMES["MARQUEE"] = "marquee";
    TAG_NAMES["MATH"] = "math";
    TAG_NAMES["MENU"] = "menu";
    TAG_NAMES["META"] = "meta";
    TAG_NAMES["MGLYPH"] = "mglyph";
    TAG_NAMES["MI"] = "mi";
    TAG_NAMES["MO"] = "mo";
    TAG_NAMES["MN"] = "mn";
    TAG_NAMES["MS"] = "ms";
    TAG_NAMES["MTEXT"] = "mtext";
    TAG_NAMES["NAV"] = "nav";
    TAG_NAMES["NOBR"] = "nobr";
    TAG_NAMES["NOFRAMES"] = "noframes";
    TAG_NAMES["NOEMBED"] = "noembed";
    TAG_NAMES["NOSCRIPT"] = "noscript";
    TAG_NAMES["OBJECT"] = "object";
    TAG_NAMES["OL"] = "ol";
    TAG_NAMES["OPTGROUP"] = "optgroup";
    TAG_NAMES["OPTION"] = "option";
    TAG_NAMES["P"] = "p";
    TAG_NAMES["PARAM"] = "param";
    TAG_NAMES["PLAINTEXT"] = "plaintext";
    TAG_NAMES["PRE"] = "pre";
    TAG_NAMES["RB"] = "rb";
    TAG_NAMES["RP"] = "rp";
    TAG_NAMES["RT"] = "rt";
    TAG_NAMES["RTC"] = "rtc";
    TAG_NAMES["RUBY"] = "ruby";
    TAG_NAMES["S"] = "s";
    TAG_NAMES["SCRIPT"] = "script";
    TAG_NAMES["SEARCH"] = "search";
    TAG_NAMES["SECTION"] = "section";
    TAG_NAMES["SELECT"] = "select";
    TAG_NAMES["SOURCE"] = "source";
    TAG_NAMES["SMALL"] = "small";
    TAG_NAMES["SPAN"] = "span";
    TAG_NAMES["STRIKE"] = "strike";
    TAG_NAMES["STRONG"] = "strong";
    TAG_NAMES["STYLE"] = "style";
    TAG_NAMES["SUB"] = "sub";
    TAG_NAMES["SUMMARY"] = "summary";
    TAG_NAMES["SUP"] = "sup";
    TAG_NAMES["TABLE"] = "table";
    TAG_NAMES["TBODY"] = "tbody";
    TAG_NAMES["TEMPLATE"] = "template";
    TAG_NAMES["TEXTAREA"] = "textarea";
    TAG_NAMES["TFOOT"] = "tfoot";
    TAG_NAMES["TD"] = "td";
    TAG_NAMES["TH"] = "th";
    TAG_NAMES["THEAD"] = "thead";
    TAG_NAMES["TITLE"] = "title";
    TAG_NAMES["TR"] = "tr";
    TAG_NAMES["TRACK"] = "track";
    TAG_NAMES["TT"] = "tt";
    TAG_NAMES["U"] = "u";
    TAG_NAMES["UL"] = "ul";
    TAG_NAMES["SVG"] = "svg";
    TAG_NAMES["VAR"] = "var";
    TAG_NAMES["WBR"] = "wbr";
    TAG_NAMES["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
/**
 * Tag IDs are numeric IDs for known tag names.
 *
 * We use tag IDs to improve the performance of tag name comparisons.
 */ var TAG_ID;
(function(TAG_ID) {
    TAG_ID[TAG_ID["UNKNOWN"] = 0] = "UNKNOWN";
    TAG_ID[TAG_ID["A"] = 1] = "A";
    TAG_ID[TAG_ID["ADDRESS"] = 2] = "ADDRESS";
    TAG_ID[TAG_ID["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
    TAG_ID[TAG_ID["APPLET"] = 4] = "APPLET";
    TAG_ID[TAG_ID["AREA"] = 5] = "AREA";
    TAG_ID[TAG_ID["ARTICLE"] = 6] = "ARTICLE";
    TAG_ID[TAG_ID["ASIDE"] = 7] = "ASIDE";
    TAG_ID[TAG_ID["B"] = 8] = "B";
    TAG_ID[TAG_ID["BASE"] = 9] = "BASE";
    TAG_ID[TAG_ID["BASEFONT"] = 10] = "BASEFONT";
    TAG_ID[TAG_ID["BGSOUND"] = 11] = "BGSOUND";
    TAG_ID[TAG_ID["BIG"] = 12] = "BIG";
    TAG_ID[TAG_ID["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
    TAG_ID[TAG_ID["BODY"] = 14] = "BODY";
    TAG_ID[TAG_ID["BR"] = 15] = "BR";
    TAG_ID[TAG_ID["BUTTON"] = 16] = "BUTTON";
    TAG_ID[TAG_ID["CAPTION"] = 17] = "CAPTION";
    TAG_ID[TAG_ID["CENTER"] = 18] = "CENTER";
    TAG_ID[TAG_ID["CODE"] = 19] = "CODE";
    TAG_ID[TAG_ID["COL"] = 20] = "COL";
    TAG_ID[TAG_ID["COLGROUP"] = 21] = "COLGROUP";
    TAG_ID[TAG_ID["DD"] = 22] = "DD";
    TAG_ID[TAG_ID["DESC"] = 23] = "DESC";
    TAG_ID[TAG_ID["DETAILS"] = 24] = "DETAILS";
    TAG_ID[TAG_ID["DIALOG"] = 25] = "DIALOG";
    TAG_ID[TAG_ID["DIR"] = 26] = "DIR";
    TAG_ID[TAG_ID["DIV"] = 27] = "DIV";
    TAG_ID[TAG_ID["DL"] = 28] = "DL";
    TAG_ID[TAG_ID["DT"] = 29] = "DT";
    TAG_ID[TAG_ID["EM"] = 30] = "EM";
    TAG_ID[TAG_ID["EMBED"] = 31] = "EMBED";
    TAG_ID[TAG_ID["FIELDSET"] = 32] = "FIELDSET";
    TAG_ID[TAG_ID["FIGCAPTION"] = 33] = "FIGCAPTION";
    TAG_ID[TAG_ID["FIGURE"] = 34] = "FIGURE";
    TAG_ID[TAG_ID["FONT"] = 35] = "FONT";
    TAG_ID[TAG_ID["FOOTER"] = 36] = "FOOTER";
    TAG_ID[TAG_ID["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
    TAG_ID[TAG_ID["FORM"] = 38] = "FORM";
    TAG_ID[TAG_ID["FRAME"] = 39] = "FRAME";
    TAG_ID[TAG_ID["FRAMESET"] = 40] = "FRAMESET";
    TAG_ID[TAG_ID["H1"] = 41] = "H1";
    TAG_ID[TAG_ID["H2"] = 42] = "H2";
    TAG_ID[TAG_ID["H3"] = 43] = "H3";
    TAG_ID[TAG_ID["H4"] = 44] = "H4";
    TAG_ID[TAG_ID["H5"] = 45] = "H5";
    TAG_ID[TAG_ID["H6"] = 46] = "H6";
    TAG_ID[TAG_ID["HEAD"] = 47] = "HEAD";
    TAG_ID[TAG_ID["HEADER"] = 48] = "HEADER";
    TAG_ID[TAG_ID["HGROUP"] = 49] = "HGROUP";
    TAG_ID[TAG_ID["HR"] = 50] = "HR";
    TAG_ID[TAG_ID["HTML"] = 51] = "HTML";
    TAG_ID[TAG_ID["I"] = 52] = "I";
    TAG_ID[TAG_ID["IMG"] = 53] = "IMG";
    TAG_ID[TAG_ID["IMAGE"] = 54] = "IMAGE";
    TAG_ID[TAG_ID["INPUT"] = 55] = "INPUT";
    TAG_ID[TAG_ID["IFRAME"] = 56] = "IFRAME";
    TAG_ID[TAG_ID["KEYGEN"] = 57] = "KEYGEN";
    TAG_ID[TAG_ID["LABEL"] = 58] = "LABEL";
    TAG_ID[TAG_ID["LI"] = 59] = "LI";
    TAG_ID[TAG_ID["LINK"] = 60] = "LINK";
    TAG_ID[TAG_ID["LISTING"] = 61] = "LISTING";
    TAG_ID[TAG_ID["MAIN"] = 62] = "MAIN";
    TAG_ID[TAG_ID["MALIGNMARK"] = 63] = "MALIGNMARK";
    TAG_ID[TAG_ID["MARQUEE"] = 64] = "MARQUEE";
    TAG_ID[TAG_ID["MATH"] = 65] = "MATH";
    TAG_ID[TAG_ID["MENU"] = 66] = "MENU";
    TAG_ID[TAG_ID["META"] = 67] = "META";
    TAG_ID[TAG_ID["MGLYPH"] = 68] = "MGLYPH";
    TAG_ID[TAG_ID["MI"] = 69] = "MI";
    TAG_ID[TAG_ID["MO"] = 70] = "MO";
    TAG_ID[TAG_ID["MN"] = 71] = "MN";
    TAG_ID[TAG_ID["MS"] = 72] = "MS";
    TAG_ID[TAG_ID["MTEXT"] = 73] = "MTEXT";
    TAG_ID[TAG_ID["NAV"] = 74] = "NAV";
    TAG_ID[TAG_ID["NOBR"] = 75] = "NOBR";
    TAG_ID[TAG_ID["NOFRAMES"] = 76] = "NOFRAMES";
    TAG_ID[TAG_ID["NOEMBED"] = 77] = "NOEMBED";
    TAG_ID[TAG_ID["NOSCRIPT"] = 78] = "NOSCRIPT";
    TAG_ID[TAG_ID["OBJECT"] = 79] = "OBJECT";
    TAG_ID[TAG_ID["OL"] = 80] = "OL";
    TAG_ID[TAG_ID["OPTGROUP"] = 81] = "OPTGROUP";
    TAG_ID[TAG_ID["OPTION"] = 82] = "OPTION";
    TAG_ID[TAG_ID["P"] = 83] = "P";
    TAG_ID[TAG_ID["PARAM"] = 84] = "PARAM";
    TAG_ID[TAG_ID["PLAINTEXT"] = 85] = "PLAINTEXT";
    TAG_ID[TAG_ID["PRE"] = 86] = "PRE";
    TAG_ID[TAG_ID["RB"] = 87] = "RB";
    TAG_ID[TAG_ID["RP"] = 88] = "RP";
    TAG_ID[TAG_ID["RT"] = 89] = "RT";
    TAG_ID[TAG_ID["RTC"] = 90] = "RTC";
    TAG_ID[TAG_ID["RUBY"] = 91] = "RUBY";
    TAG_ID[TAG_ID["S"] = 92] = "S";
    TAG_ID[TAG_ID["SCRIPT"] = 93] = "SCRIPT";
    TAG_ID[TAG_ID["SEARCH"] = 94] = "SEARCH";
    TAG_ID[TAG_ID["SECTION"] = 95] = "SECTION";
    TAG_ID[TAG_ID["SELECT"] = 96] = "SELECT";
    TAG_ID[TAG_ID["SOURCE"] = 97] = "SOURCE";
    TAG_ID[TAG_ID["SMALL"] = 98] = "SMALL";
    TAG_ID[TAG_ID["SPAN"] = 99] = "SPAN";
    TAG_ID[TAG_ID["STRIKE"] = 100] = "STRIKE";
    TAG_ID[TAG_ID["STRONG"] = 101] = "STRONG";
    TAG_ID[TAG_ID["STYLE"] = 102] = "STYLE";
    TAG_ID[TAG_ID["SUB"] = 103] = "SUB";
    TAG_ID[TAG_ID["SUMMARY"] = 104] = "SUMMARY";
    TAG_ID[TAG_ID["SUP"] = 105] = "SUP";
    TAG_ID[TAG_ID["TABLE"] = 106] = "TABLE";
    TAG_ID[TAG_ID["TBODY"] = 107] = "TBODY";
    TAG_ID[TAG_ID["TEMPLATE"] = 108] = "TEMPLATE";
    TAG_ID[TAG_ID["TEXTAREA"] = 109] = "TEXTAREA";
    TAG_ID[TAG_ID["TFOOT"] = 110] = "TFOOT";
    TAG_ID[TAG_ID["TD"] = 111] = "TD";
    TAG_ID[TAG_ID["TH"] = 112] = "TH";
    TAG_ID[TAG_ID["THEAD"] = 113] = "THEAD";
    TAG_ID[TAG_ID["TITLE"] = 114] = "TITLE";
    TAG_ID[TAG_ID["TR"] = 115] = "TR";
    TAG_ID[TAG_ID["TRACK"] = 116] = "TRACK";
    TAG_ID[TAG_ID["TT"] = 117] = "TT";
    TAG_ID[TAG_ID["U"] = 118] = "U";
    TAG_ID[TAG_ID["UL"] = 119] = "UL";
    TAG_ID[TAG_ID["SVG"] = 120] = "SVG";
    TAG_ID[TAG_ID["VAR"] = 121] = "VAR";
    TAG_ID[TAG_ID["WBR"] = 122] = "WBR";
    TAG_ID[TAG_ID["XMP"] = 123] = "XMP";
})(TAG_ID || (TAG_ID = {}));
const TAG_NAME_TO_ID = new Map([
    [
        TAG_NAMES.A,
        TAG_ID.A
    ],
    [
        TAG_NAMES.ADDRESS,
        TAG_ID.ADDRESS
    ],
    [
        TAG_NAMES.ANNOTATION_XML,
        TAG_ID.ANNOTATION_XML
    ],
    [
        TAG_NAMES.APPLET,
        TAG_ID.APPLET
    ],
    [
        TAG_NAMES.AREA,
        TAG_ID.AREA
    ],
    [
        TAG_NAMES.ARTICLE,
        TAG_ID.ARTICLE
    ],
    [
        TAG_NAMES.ASIDE,
        TAG_ID.ASIDE
    ],
    [
        TAG_NAMES.B,
        TAG_ID.B
    ],
    [
        TAG_NAMES.BASE,
        TAG_ID.BASE
    ],
    [
        TAG_NAMES.BASEFONT,
        TAG_ID.BASEFONT
    ],
    [
        TAG_NAMES.BGSOUND,
        TAG_ID.BGSOUND
    ],
    [
        TAG_NAMES.BIG,
        TAG_ID.BIG
    ],
    [
        TAG_NAMES.BLOCKQUOTE,
        TAG_ID.BLOCKQUOTE
    ],
    [
        TAG_NAMES.BODY,
        TAG_ID.BODY
    ],
    [
        TAG_NAMES.BR,
        TAG_ID.BR
    ],
    [
        TAG_NAMES.BUTTON,
        TAG_ID.BUTTON
    ],
    [
        TAG_NAMES.CAPTION,
        TAG_ID.CAPTION
    ],
    [
        TAG_NAMES.CENTER,
        TAG_ID.CENTER
    ],
    [
        TAG_NAMES.CODE,
        TAG_ID.CODE
    ],
    [
        TAG_NAMES.COL,
        TAG_ID.COL
    ],
    [
        TAG_NAMES.COLGROUP,
        TAG_ID.COLGROUP
    ],
    [
        TAG_NAMES.DD,
        TAG_ID.DD
    ],
    [
        TAG_NAMES.DESC,
        TAG_ID.DESC
    ],
    [
        TAG_NAMES.DETAILS,
        TAG_ID.DETAILS
    ],
    [
        TAG_NAMES.DIALOG,
        TAG_ID.DIALOG
    ],
    [
        TAG_NAMES.DIR,
        TAG_ID.DIR
    ],
    [
        TAG_NAMES.DIV,
        TAG_ID.DIV
    ],
    [
        TAG_NAMES.DL,
        TAG_ID.DL
    ],
    [
        TAG_NAMES.DT,
        TAG_ID.DT
    ],
    [
        TAG_NAMES.EM,
        TAG_ID.EM
    ],
    [
        TAG_NAMES.EMBED,
        TAG_ID.EMBED
    ],
    [
        TAG_NAMES.FIELDSET,
        TAG_ID.FIELDSET
    ],
    [
        TAG_NAMES.FIGCAPTION,
        TAG_ID.FIGCAPTION
    ],
    [
        TAG_NAMES.FIGURE,
        TAG_ID.FIGURE
    ],
    [
        TAG_NAMES.FONT,
        TAG_ID.FONT
    ],
    [
        TAG_NAMES.FOOTER,
        TAG_ID.FOOTER
    ],
    [
        TAG_NAMES.FOREIGN_OBJECT,
        TAG_ID.FOREIGN_OBJECT
    ],
    [
        TAG_NAMES.FORM,
        TAG_ID.FORM
    ],
    [
        TAG_NAMES.FRAME,
        TAG_ID.FRAME
    ],
    [
        TAG_NAMES.FRAMESET,
        TAG_ID.FRAMESET
    ],
    [
        TAG_NAMES.H1,
        TAG_ID.H1
    ],
    [
        TAG_NAMES.H2,
        TAG_ID.H2
    ],
    [
        TAG_NAMES.H3,
        TAG_ID.H3
    ],
    [
        TAG_NAMES.H4,
        TAG_ID.H4
    ],
    [
        TAG_NAMES.H5,
        TAG_ID.H5
    ],
    [
        TAG_NAMES.H6,
        TAG_ID.H6
    ],
    [
        TAG_NAMES.HEAD,
        TAG_ID.HEAD
    ],
    [
        TAG_NAMES.HEADER,
        TAG_ID.HEADER
    ],
    [
        TAG_NAMES.HGROUP,
        TAG_ID.HGROUP
    ],
    [
        TAG_NAMES.HR,
        TAG_ID.HR
    ],
    [
        TAG_NAMES.HTML,
        TAG_ID.HTML
    ],
    [
        TAG_NAMES.I,
        TAG_ID.I
    ],
    [
        TAG_NAMES.IMG,
        TAG_ID.IMG
    ],
    [
        TAG_NAMES.IMAGE,
        TAG_ID.IMAGE
    ],
    [
        TAG_NAMES.INPUT,
        TAG_ID.INPUT
    ],
    [
        TAG_NAMES.IFRAME,
        TAG_ID.IFRAME
    ],
    [
        TAG_NAMES.KEYGEN,
        TAG_ID.KEYGEN
    ],
    [
        TAG_NAMES.LABEL,
        TAG_ID.LABEL
    ],
    [
        TAG_NAMES.LI,
        TAG_ID.LI
    ],
    [
        TAG_NAMES.LINK,
        TAG_ID.LINK
    ],
    [
        TAG_NAMES.LISTING,
        TAG_ID.LISTING
    ],
    [
        TAG_NAMES.MAIN,
        TAG_ID.MAIN
    ],
    [
        TAG_NAMES.MALIGNMARK,
        TAG_ID.MALIGNMARK
    ],
    [
        TAG_NAMES.MARQUEE,
        TAG_ID.MARQUEE
    ],
    [
        TAG_NAMES.MATH,
        TAG_ID.MATH
    ],
    [
        TAG_NAMES.MENU,
        TAG_ID.MENU
    ],
    [
        TAG_NAMES.META,
        TAG_ID.META
    ],
    [
        TAG_NAMES.MGLYPH,
        TAG_ID.MGLYPH
    ],
    [
        TAG_NAMES.MI,
        TAG_ID.MI
    ],
    [
        TAG_NAMES.MO,
        TAG_ID.MO
    ],
    [
        TAG_NAMES.MN,
        TAG_ID.MN
    ],
    [
        TAG_NAMES.MS,
        TAG_ID.MS
    ],
    [
        TAG_NAMES.MTEXT,
        TAG_ID.MTEXT
    ],
    [
        TAG_NAMES.NAV,
        TAG_ID.NAV
    ],
    [
        TAG_NAMES.NOBR,
        TAG_ID.NOBR
    ],
    [
        TAG_NAMES.NOFRAMES,
        TAG_ID.NOFRAMES
    ],
    [
        TAG_NAMES.NOEMBED,
        TAG_ID.NOEMBED
    ],
    [
        TAG_NAMES.NOSCRIPT,
        TAG_ID.NOSCRIPT
    ],
    [
        TAG_NAMES.OBJECT,
        TAG_ID.OBJECT
    ],
    [
        TAG_NAMES.OL,
        TAG_ID.OL
    ],
    [
        TAG_NAMES.OPTGROUP,
        TAG_ID.OPTGROUP
    ],
    [
        TAG_NAMES.OPTION,
        TAG_ID.OPTION
    ],
    [
        TAG_NAMES.P,
        TAG_ID.P
    ],
    [
        TAG_NAMES.PARAM,
        TAG_ID.PARAM
    ],
    [
        TAG_NAMES.PLAINTEXT,
        TAG_ID.PLAINTEXT
    ],
    [
        TAG_NAMES.PRE,
        TAG_ID.PRE
    ],
    [
        TAG_NAMES.RB,
        TAG_ID.RB
    ],
    [
        TAG_NAMES.RP,
        TAG_ID.RP
    ],
    [
        TAG_NAMES.RT,
        TAG_ID.RT
    ],
    [
        TAG_NAMES.RTC,
        TAG_ID.RTC
    ],
    [
        TAG_NAMES.RUBY,
        TAG_ID.RUBY
    ],
    [
        TAG_NAMES.S,
        TAG_ID.S
    ],
    [
        TAG_NAMES.SCRIPT,
        TAG_ID.SCRIPT
    ],
    [
        TAG_NAMES.SEARCH,
        TAG_ID.SEARCH
    ],
    [
        TAG_NAMES.SECTION,
        TAG_ID.SECTION
    ],
    [
        TAG_NAMES.SELECT,
        TAG_ID.SELECT
    ],
    [
        TAG_NAMES.SOURCE,
        TAG_ID.SOURCE
    ],
    [
        TAG_NAMES.SMALL,
        TAG_ID.SMALL
    ],
    [
        TAG_NAMES.SPAN,
        TAG_ID.SPAN
    ],
    [
        TAG_NAMES.STRIKE,
        TAG_ID.STRIKE
    ],
    [
        TAG_NAMES.STRONG,
        TAG_ID.STRONG
    ],
    [
        TAG_NAMES.STYLE,
        TAG_ID.STYLE
    ],
    [
        TAG_NAMES.SUB,
        TAG_ID.SUB
    ],
    [
        TAG_NAMES.SUMMARY,
        TAG_ID.SUMMARY
    ],
    [
        TAG_NAMES.SUP,
        TAG_ID.SUP
    ],
    [
        TAG_NAMES.TABLE,
        TAG_ID.TABLE
    ],
    [
        TAG_NAMES.TBODY,
        TAG_ID.TBODY
    ],
    [
        TAG_NAMES.TEMPLATE,
        TAG_ID.TEMPLATE
    ],
    [
        TAG_NAMES.TEXTAREA,
        TAG_ID.TEXTAREA
    ],
    [
        TAG_NAMES.TFOOT,
        TAG_ID.TFOOT
    ],
    [
        TAG_NAMES.TD,
        TAG_ID.TD
    ],
    [
        TAG_NAMES.TH,
        TAG_ID.TH
    ],
    [
        TAG_NAMES.THEAD,
        TAG_ID.THEAD
    ],
    [
        TAG_NAMES.TITLE,
        TAG_ID.TITLE
    ],
    [
        TAG_NAMES.TR,
        TAG_ID.TR
    ],
    [
        TAG_NAMES.TRACK,
        TAG_ID.TRACK
    ],
    [
        TAG_NAMES.TT,
        TAG_ID.TT
    ],
    [
        TAG_NAMES.U,
        TAG_ID.U
    ],
    [
        TAG_NAMES.UL,
        TAG_ID.UL
    ],
    [
        TAG_NAMES.SVG,
        TAG_ID.SVG
    ],
    [
        TAG_NAMES.VAR,
        TAG_ID.VAR
    ],
    [
        TAG_NAMES.WBR,
        TAG_ID.WBR
    ],
    [
        TAG_NAMES.XMP,
        TAG_ID.XMP
    ]
]);
function getTagID(tagName) {
    var _a;
    return (_a = TAG_NAME_TO_ID.get(tagName)) !== null && _a !== void 0 ? _a : TAG_ID.UNKNOWN;
}
const $ = TAG_ID;
const SPECIAL_ELEMENTS = {
    [NS.HTML]: new Set([
        $.ADDRESS,
        $.APPLET,
        $.AREA,
        $.ARTICLE,
        $.ASIDE,
        $.BASE,
        $.BASEFONT,
        $.BGSOUND,
        $.BLOCKQUOTE,
        $.BODY,
        $.BR,
        $.BUTTON,
        $.CAPTION,
        $.CENTER,
        $.COL,
        $.COLGROUP,
        $.DD,
        $.DETAILS,
        $.DIR,
        $.DIV,
        $.DL,
        $.DT,
        $.EMBED,
        $.FIELDSET,
        $.FIGCAPTION,
        $.FIGURE,
        $.FOOTER,
        $.FORM,
        $.FRAME,
        $.FRAMESET,
        $.H1,
        $.H2,
        $.H3,
        $.H4,
        $.H5,
        $.H6,
        $.HEAD,
        $.HEADER,
        $.HGROUP,
        $.HR,
        $.HTML,
        $.IFRAME,
        $.IMG,
        $.INPUT,
        $.LI,
        $.LINK,
        $.LISTING,
        $.MAIN,
        $.MARQUEE,
        $.MENU,
        $.META,
        $.NAV,
        $.NOEMBED,
        $.NOFRAMES,
        $.NOSCRIPT,
        $.OBJECT,
        $.OL,
        $.P,
        $.PARAM,
        $.PLAINTEXT,
        $.PRE,
        $.SCRIPT,
        $.SECTION,
        $.SELECT,
        $.SOURCE,
        $.STYLE,
        $.SUMMARY,
        $.TABLE,
        $.TBODY,
        $.TD,
        $.TEMPLATE,
        $.TEXTAREA,
        $.TFOOT,
        $.TH,
        $.THEAD,
        $.TITLE,
        $.TR,
        $.TRACK,
        $.UL,
        $.WBR,
        $.XMP
    ]),
    [NS.MATHML]: new Set([
        $.MI,
        $.MO,
        $.MN,
        $.MS,
        $.MTEXT,
        $.ANNOTATION_XML
    ]),
    [NS.SVG]: new Set([
        $.TITLE,
        $.FOREIGN_OBJECT,
        $.DESC
    ]),
    [NS.XLINK]: new Set(),
    [NS.XML]: new Set(),
    [NS.XMLNS]: new Set()
};
const NUMBERED_HEADERS = new Set([
    $.H1,
    $.H2,
    $.H3,
    $.H4,
    $.H5,
    $.H6
]);
const UNESCAPED_TEXT = new Set([
    TAG_NAMES.STYLE,
    TAG_NAMES.SCRIPT,
    TAG_NAMES.XMP,
    TAG_NAMES.IFRAME,
    TAG_NAMES.NOEMBED,
    TAG_NAMES.NOFRAMES,
    TAG_NAMES.PLAINTEXT
]);
function hasUnescapedText(tn, scriptingEnabled) {
    return UNESCAPED_TEXT.has(tn) || scriptingEnabled && tn === TAG_NAMES.NOSCRIPT;
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/tokenizer/index.js






//States
var State;
(function(State) {
    State[State["DATA"] = 0] = "DATA";
    State[State["RCDATA"] = 1] = "RCDATA";
    State[State["RAWTEXT"] = 2] = "RAWTEXT";
    State[State["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
    State[State["PLAINTEXT"] = 4] = "PLAINTEXT";
    State[State["TAG_OPEN"] = 5] = "TAG_OPEN";
    State[State["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
    State[State["TAG_NAME"] = 7] = "TAG_NAME";
    State[State["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
    State[State["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
    State[State["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
    State[State["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
    State[State["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
    State[State["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
    State[State["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
    State[State["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
    State[State["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
    State[State["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
    State[State["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
    State[State["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
    State[State["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
    State[State["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
    State[State["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
    State[State["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
    State[State["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
    State[State["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
    State[State["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
    State[State["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
    State[State["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
    State[State["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
    State[State["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
    State[State["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
    State[State["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
    State[State["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
    State[State["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
    State[State["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
    State[State["COMMENT_START"] = 42] = "COMMENT_START";
    State[State["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
    State[State["COMMENT"] = 44] = "COMMENT";
    State[State["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
    State[State["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
    State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
    State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
    State[State["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
    State[State["COMMENT_END"] = 50] = "COMMENT_END";
    State[State["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
    State[State["DOCTYPE"] = 52] = "DOCTYPE";
    State[State["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
    State[State["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
    State[State["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
    State[State["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
    State[State["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
    State[State["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
    State[State["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
    State[State["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
    State[State["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
    State[State["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
    State[State["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
    State[State["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
    State[State["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
    State[State["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
    State[State["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
    State[State["CDATA_SECTION"] = 68] = "CDATA_SECTION";
    State[State["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
    State[State["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
    State[State["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
    State[State["AMBIGUOUS_AMPERSAND"] = 72] = "AMBIGUOUS_AMPERSAND";
})(State || (State = {}));
//Tokenizer initial states for different modes
const TokenizerMode = {
    DATA: State.DATA,
    RCDATA: State.RCDATA,
    RAWTEXT: State.RAWTEXT,
    SCRIPT_DATA: State.SCRIPT_DATA,
    PLAINTEXT: State.PLAINTEXT,
    CDATA_SECTION: State.CDATA_SECTION
};
//Utils
//OPTIMIZATION: these utility functions should not be moved out of this module. V8 Crankshaft will not inline
//this functions if they will be situated in another module due to context switch.
//Always perform inlining check before modifying this functions ('node --trace-inlining').
function isAsciiDigit(cp) {
    return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
}
function isAsciiUpper(cp) {
    return cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z;
}
function isAsciiLower(cp) {
    return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
}
function isAsciiLetter(cp) {
    return isAsciiLower(cp) || isAsciiUpper(cp);
}
function tokenizer_isAsciiAlphaNumeric(cp) {
    return isAsciiLetter(cp) || isAsciiDigit(cp);
}
function toAsciiLower(cp) {
    return cp + 32;
}
function isWhitespace(cp) {
    return cp === CODE_POINTS.SPACE || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.TABULATION || cp === CODE_POINTS.FORM_FEED;
}
function isScriptDataDoubleEscapeSequenceEnd(cp) {
    return isWhitespace(cp) || cp === CODE_POINTS.SOLIDUS || cp === CODE_POINTS.GREATER_THAN_SIGN;
}
function getErrorForNumericCharacterReference(code) {
    if (code === CODE_POINTS.NULL) {
        return ERR.nullCharacterReference;
    } else if (code > 1114111) {
        return ERR.characterReferenceOutsideUnicodeRange;
    } else if (isSurrogate(code)) {
        return ERR.surrogateCharacterReference;
    } else if (isUndefinedCodePoint(code)) {
        return ERR.noncharacterCharacterReference;
    } else if (isControlCodePoint(code) || code === CODE_POINTS.CARRIAGE_RETURN) {
        return ERR.controlCharacterReference;
    }
    return null;
}
//Tokenizer
class Tokenizer {
    constructor(options, handler){
        this.options = options;
        this.handler = handler;
        this.paused = false;
        /** Ensures that the parsing loop isn't run multiple times at once. */ this.inLoop = false;
        /**
         * Indicates that the current adjusted node exists, is not an element in the HTML namespace,
         * and that it is not an integration point for either MathML or HTML.
         *
         * @see {@link https://html.spec.whatwg.org/multipage/parsing.html#tree-construction}
         */ this.inForeignNode = false;
        this.lastStartTagName = "";
        this.active = false;
        this.state = State.DATA;
        this.returnState = State.DATA;
        this.entityStartPos = 0;
        this.consumedAfterSnapshot = -1;
        this.currentCharacterToken = null;
        this.currentToken = null;
        this.currentAttr = {
            name: "",
            value: ""
        };
        this.preprocessor = new Preprocessor(handler);
        this.currentLocation = this.getCurrentLocation(-1);
        this.entityDecoder = new decode_EntityDecoder(decode_data_html_htmlDecodeTree, (cp, consumed)=>{
            // Note: Set `pos` _before_ flushing, as flushing might drop
            // the current chunk and invalidate `entityStartPos`.
            this.preprocessor.pos = this.entityStartPos + consumed - 1;
            this._flushCodePointConsumedAsCharacterReference(cp);
        }, handler.onParseError ? {
            missingSemicolonAfterCharacterReference: ()=>{
                this._err(ERR.missingSemicolonAfterCharacterReference, 1);
            },
            absenceOfDigitsInNumericCharacterReference: (consumed)=>{
                this._err(ERR.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + consumed);
            },
            validateNumericCharacterReference: (code)=>{
                const error = getErrorForNumericCharacterReference(code);
                if (error) this._err(error, 1);
            }
        } : undefined);
    }
    //Errors
    _err(code, cpOffset = 0) {
        var _a, _b;
        (_b = (_a = this.handler).onParseError) === null || _b === void 0 ? void 0 : _b.call(_a, this.preprocessor.getError(code, cpOffset));
    }
    // NOTE: `offset` may never run across line boundaries.
    getCurrentLocation(offset) {
        if (!this.options.sourceCodeLocationInfo) {
            return null;
        }
        return {
            startLine: this.preprocessor.line,
            startCol: this.preprocessor.col - offset,
            startOffset: this.preprocessor.offset - offset,
            endLine: -1,
            endCol: -1,
            endOffset: -1
        };
    }
    _runParsingLoop() {
        if (this.inLoop) return;
        this.inLoop = true;
        while(this.active && !this.paused){
            this.consumedAfterSnapshot = 0;
            const cp = this._consume();
            if (!this._ensureHibernation()) {
                this._callState(cp);
            }
        }
        this.inLoop = false;
    }
    //API
    pause() {
        this.paused = true;
    }
    resume(writeCallback) {
        if (!this.paused) {
            throw new Error("Parser was already resumed");
        }
        this.paused = false;
        // Necessary for synchronous resume.
        if (this.inLoop) return;
        this._runParsingLoop();
        if (!this.paused) {
            writeCallback === null || writeCallback === void 0 ? void 0 : writeCallback();
        }
    }
    write(chunk, isLastChunk, writeCallback) {
        this.active = true;
        this.preprocessor.write(chunk, isLastChunk);
        this._runParsingLoop();
        if (!this.paused) {
            writeCallback === null || writeCallback === void 0 ? void 0 : writeCallback();
        }
    }
    insertHtmlAtCurrentPos(chunk) {
        this.active = true;
        this.preprocessor.insertHtmlAtCurrentPos(chunk);
        this._runParsingLoop();
    }
    //Hibernation
    _ensureHibernation() {
        if (this.preprocessor.endOfChunkHit) {
            this.preprocessor.retreat(this.consumedAfterSnapshot);
            this.consumedAfterSnapshot = 0;
            this.active = false;
            return true;
        }
        return false;
    }
    //Consumption
    _consume() {
        this.consumedAfterSnapshot++;
        return this.preprocessor.advance();
    }
    _advanceBy(count) {
        this.consumedAfterSnapshot += count;
        for(let i = 0; i < count; i++){
            this.preprocessor.advance();
        }
    }
    _consumeSequenceIfMatch(pattern, caseSensitive) {
        if (this.preprocessor.startsWith(pattern, caseSensitive)) {
            // We will already have consumed one character before calling this method.
            this._advanceBy(pattern.length - 1);
            return true;
        }
        return false;
    }
    //Token creation
    _createStartTagToken() {
        this.currentToken = {
            type: TokenType.START_TAG,
            tagName: "",
            tagID: TAG_ID.UNKNOWN,
            selfClosing: false,
            ackSelfClosing: false,
            attrs: [],
            location: this.getCurrentLocation(1)
        };
    }
    _createEndTagToken() {
        this.currentToken = {
            type: TokenType.END_TAG,
            tagName: "",
            tagID: TAG_ID.UNKNOWN,
            selfClosing: false,
            ackSelfClosing: false,
            attrs: [],
            location: this.getCurrentLocation(2)
        };
    }
    _createCommentToken(offset) {
        this.currentToken = {
            type: TokenType.COMMENT,
            data: "",
            location: this.getCurrentLocation(offset)
        };
    }
    _createDoctypeToken(initialName) {
        this.currentToken = {
            type: TokenType.DOCTYPE,
            name: initialName,
            forceQuirks: false,
            publicId: null,
            systemId: null,
            location: this.currentLocation
        };
    }
    _createCharacterToken(type, chars) {
        this.currentCharacterToken = {
            type,
            chars,
            location: this.currentLocation
        };
    }
    //Tag attributes
    _createAttr(attrNameFirstCh) {
        this.currentAttr = {
            name: attrNameFirstCh,
            value: ""
        };
        this.currentLocation = this.getCurrentLocation(0);
    }
    _leaveAttrName() {
        var _a;
        var _b;
        const token = this.currentToken;
        if (getTokenAttr(token, this.currentAttr.name) === null) {
            token.attrs.push(this.currentAttr);
            if (token.location && this.currentLocation) {
                const attrLocations = (_a = (_b = token.location).attrs) !== null && _a !== void 0 ? _a : _b.attrs = Object.create(null);
                attrLocations[this.currentAttr.name] = this.currentLocation;
                // Set end location
                this._leaveAttrValue();
            }
        } else {
            this._err(ERR.duplicateAttribute);
        }
    }
    _leaveAttrValue() {
        if (this.currentLocation) {
            this.currentLocation.endLine = this.preprocessor.line;
            this.currentLocation.endCol = this.preprocessor.col;
            this.currentLocation.endOffset = this.preprocessor.offset;
        }
    }
    //Token emission
    prepareToken(ct) {
        this._emitCurrentCharacterToken(ct.location);
        this.currentToken = null;
        if (ct.location) {
            ct.location.endLine = this.preprocessor.line;
            ct.location.endCol = this.preprocessor.col + 1;
            ct.location.endOffset = this.preprocessor.offset + 1;
        }
        this.currentLocation = this.getCurrentLocation(-1);
    }
    emitCurrentTagToken() {
        const ct = this.currentToken;
        this.prepareToken(ct);
        ct.tagID = getTagID(ct.tagName);
        if (ct.type === TokenType.START_TAG) {
            this.lastStartTagName = ct.tagName;
            this.handler.onStartTag(ct);
        } else {
            if (ct.attrs.length > 0) {
                this._err(ERR.endTagWithAttributes);
            }
            if (ct.selfClosing) {
                this._err(ERR.endTagWithTrailingSolidus);
            }
            this.handler.onEndTag(ct);
        }
        this.preprocessor.dropParsedChunk();
    }
    emitCurrentComment(ct) {
        this.prepareToken(ct);
        this.handler.onComment(ct);
        this.preprocessor.dropParsedChunk();
    }
    emitCurrentDoctype(ct) {
        this.prepareToken(ct);
        this.handler.onDoctype(ct);
        this.preprocessor.dropParsedChunk();
    }
    _emitCurrentCharacterToken(nextLocation) {
        if (this.currentCharacterToken) {
            //NOTE: if we have a pending character token, make it's end location equal to the
            //current token's start location.
            if (nextLocation && this.currentCharacterToken.location) {
                this.currentCharacterToken.location.endLine = nextLocation.startLine;
                this.currentCharacterToken.location.endCol = nextLocation.startCol;
                this.currentCharacterToken.location.endOffset = nextLocation.startOffset;
            }
            switch(this.currentCharacterToken.type){
                case TokenType.CHARACTER:
                    {
                        this.handler.onCharacter(this.currentCharacterToken);
                        break;
                    }
                case TokenType.NULL_CHARACTER:
                    {
                        this.handler.onNullCharacter(this.currentCharacterToken);
                        break;
                    }
                case TokenType.WHITESPACE_CHARACTER:
                    {
                        this.handler.onWhitespaceCharacter(this.currentCharacterToken);
                        break;
                    }
            }
            this.currentCharacterToken = null;
        }
    }
    _emitEOFToken() {
        const location = this.getCurrentLocation(0);
        if (location) {
            location.endLine = location.startLine;
            location.endCol = location.startCol;
            location.endOffset = location.startOffset;
        }
        this._emitCurrentCharacterToken(location);
        this.handler.onEof({
            type: TokenType.EOF,
            location
        });
        this.active = false;
    }
    //Characters emission
    //OPTIMIZATION: The specification uses only one type of character token (one token per character).
    //This causes a huge memory overhead and a lot of unnecessary parser loops. parse5 uses 3 groups of characters.
    //If we have a sequence of characters that belong to the same group, the parser can process it
    //as a single solid character token.
    //So, there are 3 types of character tokens in parse5:
    //1)TokenType.NULL_CHARACTER - \u0000-character sequences (e.g. '\u0000\u0000\u0000')
    //2)TokenType.WHITESPACE_CHARACTER - any whitespace/new-line character sequences (e.g. '\n  \r\t   \f')
    //3)TokenType.CHARACTER - any character sequence which don't belong to groups 1 and 2 (e.g. 'abcdef1234@@#$%^')
    _appendCharToCurrentCharacterToken(type, ch) {
        if (this.currentCharacterToken) {
            if (this.currentCharacterToken.type === type) {
                this.currentCharacterToken.chars += ch;
                return;
            } else {
                this.currentLocation = this.getCurrentLocation(0);
                this._emitCurrentCharacterToken(this.currentLocation);
                this.preprocessor.dropParsedChunk();
            }
        }
        this._createCharacterToken(type, ch);
    }
    _emitCodePoint(cp) {
        const type = isWhitespace(cp) ? TokenType.WHITESPACE_CHARACTER : cp === CODE_POINTS.NULL ? TokenType.NULL_CHARACTER : TokenType.CHARACTER;
        this._appendCharToCurrentCharacterToken(type, String.fromCodePoint(cp));
    }
    //NOTE: used when we emit characters explicitly.
    //This is always for non-whitespace and non-null characters, which allows us to avoid additional checks.
    _emitChars(ch) {
        this._appendCharToCurrentCharacterToken(TokenType.CHARACTER, ch);
    }
    // Character reference helpers
    _startCharacterReference() {
        this.returnState = this.state;
        this.state = State.CHARACTER_REFERENCE;
        this.entityStartPos = this.preprocessor.pos;
        this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute() ? esm_decode_DecodingMode.Attribute : esm_decode_DecodingMode.Legacy);
    }
    _isCharacterReferenceInAttribute() {
        return this.returnState === State.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_UNQUOTED;
    }
    _flushCodePointConsumedAsCharacterReference(cp) {
        if (this._isCharacterReferenceInAttribute()) {
            this.currentAttr.value += String.fromCodePoint(cp);
        } else {
            this._emitCodePoint(cp);
        }
    }
    // Calling states this way turns out to be much faster than any other approach.
    _callState(cp) {
        switch(this.state){
            case State.DATA:
                {
                    this._stateData(cp);
                    break;
                }
            case State.RCDATA:
                {
                    this._stateRcdata(cp);
                    break;
                }
            case State.RAWTEXT:
                {
                    this._stateRawtext(cp);
                    break;
                }
            case State.SCRIPT_DATA:
                {
                    this._stateScriptData(cp);
                    break;
                }
            case State.PLAINTEXT:
                {
                    this._statePlaintext(cp);
                    break;
                }
            case State.TAG_OPEN:
                {
                    this._stateTagOpen(cp);
                    break;
                }
            case State.END_TAG_OPEN:
                {
                    this._stateEndTagOpen(cp);
                    break;
                }
            case State.TAG_NAME:
                {
                    this._stateTagName(cp);
                    break;
                }
            case State.RCDATA_LESS_THAN_SIGN:
                {
                    this._stateRcdataLessThanSign(cp);
                    break;
                }
            case State.RCDATA_END_TAG_OPEN:
                {
                    this._stateRcdataEndTagOpen(cp);
                    break;
                }
            case State.RCDATA_END_TAG_NAME:
                {
                    this._stateRcdataEndTagName(cp);
                    break;
                }
            case State.RAWTEXT_LESS_THAN_SIGN:
                {
                    this._stateRawtextLessThanSign(cp);
                    break;
                }
            case State.RAWTEXT_END_TAG_OPEN:
                {
                    this._stateRawtextEndTagOpen(cp);
                    break;
                }
            case State.RAWTEXT_END_TAG_NAME:
                {
                    this._stateRawtextEndTagName(cp);
                    break;
                }
            case State.SCRIPT_DATA_LESS_THAN_SIGN:
                {
                    this._stateScriptDataLessThanSign(cp);
                    break;
                }
            case State.SCRIPT_DATA_END_TAG_OPEN:
                {
                    this._stateScriptDataEndTagOpen(cp);
                    break;
                }
            case State.SCRIPT_DATA_END_TAG_NAME:
                {
                    this._stateScriptDataEndTagName(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPE_START:
                {
                    this._stateScriptDataEscapeStart(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPE_START_DASH:
                {
                    this._stateScriptDataEscapeStartDash(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPED:
                {
                    this._stateScriptDataEscaped(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPED_DASH:
                {
                    this._stateScriptDataEscapedDash(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPED_DASH_DASH:
                {
                    this._stateScriptDataEscapedDashDash(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
                {
                    this._stateScriptDataEscapedLessThanSign(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
                {
                    this._stateScriptDataEscapedEndTagOpen(cp);
                    break;
                }
            case State.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
                {
                    this._stateScriptDataEscapedEndTagName(cp);
                    break;
                }
            case State.SCRIPT_DATA_DOUBLE_ESCAPE_START:
                {
                    this._stateScriptDataDoubleEscapeStart(cp);
                    break;
                }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED:
                {
                    this._stateScriptDataDoubleEscaped(cp);
                    break;
                }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
                {
                    this._stateScriptDataDoubleEscapedDash(cp);
                    break;
                }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
                {
                    this._stateScriptDataDoubleEscapedDashDash(cp);
                    break;
                }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
                {
                    this._stateScriptDataDoubleEscapedLessThanSign(cp);
                    break;
                }
            case State.SCRIPT_DATA_DOUBLE_ESCAPE_END:
                {
                    this._stateScriptDataDoubleEscapeEnd(cp);
                    break;
                }
            case State.BEFORE_ATTRIBUTE_NAME:
                {
                    this._stateBeforeAttributeName(cp);
                    break;
                }
            case State.ATTRIBUTE_NAME:
                {
                    this._stateAttributeName(cp);
                    break;
                }
            case State.AFTER_ATTRIBUTE_NAME:
                {
                    this._stateAfterAttributeName(cp);
                    break;
                }
            case State.BEFORE_ATTRIBUTE_VALUE:
                {
                    this._stateBeforeAttributeValue(cp);
                    break;
                }
            case State.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
                {
                    this._stateAttributeValueDoubleQuoted(cp);
                    break;
                }
            case State.ATTRIBUTE_VALUE_SINGLE_QUOTED:
                {
                    this._stateAttributeValueSingleQuoted(cp);
                    break;
                }
            case State.ATTRIBUTE_VALUE_UNQUOTED:
                {
                    this._stateAttributeValueUnquoted(cp);
                    break;
                }
            case State.AFTER_ATTRIBUTE_VALUE_QUOTED:
                {
                    this._stateAfterAttributeValueQuoted(cp);
                    break;
                }
            case State.SELF_CLOSING_START_TAG:
                {
                    this._stateSelfClosingStartTag(cp);
                    break;
                }
            case State.BOGUS_COMMENT:
                {
                    this._stateBogusComment(cp);
                    break;
                }
            case State.MARKUP_DECLARATION_OPEN:
                {
                    this._stateMarkupDeclarationOpen(cp);
                    break;
                }
            case State.COMMENT_START:
                {
                    this._stateCommentStart(cp);
                    break;
                }
            case State.COMMENT_START_DASH:
                {
                    this._stateCommentStartDash(cp);
                    break;
                }
            case State.COMMENT:
                {
                    this._stateComment(cp);
                    break;
                }
            case State.COMMENT_LESS_THAN_SIGN:
                {
                    this._stateCommentLessThanSign(cp);
                    break;
                }
            case State.COMMENT_LESS_THAN_SIGN_BANG:
                {
                    this._stateCommentLessThanSignBang(cp);
                    break;
                }
            case State.COMMENT_LESS_THAN_SIGN_BANG_DASH:
                {
                    this._stateCommentLessThanSignBangDash(cp);
                    break;
                }
            case State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
                {
                    this._stateCommentLessThanSignBangDashDash(cp);
                    break;
                }
            case State.COMMENT_END_DASH:
                {
                    this._stateCommentEndDash(cp);
                    break;
                }
            case State.COMMENT_END:
                {
                    this._stateCommentEnd(cp);
                    break;
                }
            case State.COMMENT_END_BANG:
                {
                    this._stateCommentEndBang(cp);
                    break;
                }
            case State.DOCTYPE:
                {
                    this._stateDoctype(cp);
                    break;
                }
            case State.BEFORE_DOCTYPE_NAME:
                {
                    this._stateBeforeDoctypeName(cp);
                    break;
                }
            case State.DOCTYPE_NAME:
                {
                    this._stateDoctypeName(cp);
                    break;
                }
            case State.AFTER_DOCTYPE_NAME:
                {
                    this._stateAfterDoctypeName(cp);
                    break;
                }
            case State.AFTER_DOCTYPE_PUBLIC_KEYWORD:
                {
                    this._stateAfterDoctypePublicKeyword(cp);
                    break;
                }
            case State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
                {
                    this._stateBeforeDoctypePublicIdentifier(cp);
                    break;
                }
            case State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
                {
                    this._stateDoctypePublicIdentifierDoubleQuoted(cp);
                    break;
                }
            case State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
                {
                    this._stateDoctypePublicIdentifierSingleQuoted(cp);
                    break;
                }
            case State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
                {
                    this._stateAfterDoctypePublicIdentifier(cp);
                    break;
                }
            case State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
                {
                    this._stateBetweenDoctypePublicAndSystemIdentifiers(cp);
                    break;
                }
            case State.AFTER_DOCTYPE_SYSTEM_KEYWORD:
                {
                    this._stateAfterDoctypeSystemKeyword(cp);
                    break;
                }
            case State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
                {
                    this._stateBeforeDoctypeSystemIdentifier(cp);
                    break;
                }
            case State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
                {
                    this._stateDoctypeSystemIdentifierDoubleQuoted(cp);
                    break;
                }
            case State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
                {
                    this._stateDoctypeSystemIdentifierSingleQuoted(cp);
                    break;
                }
            case State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
                {
                    this._stateAfterDoctypeSystemIdentifier(cp);
                    break;
                }
            case State.BOGUS_DOCTYPE:
                {
                    this._stateBogusDoctype(cp);
                    break;
                }
            case State.CDATA_SECTION:
                {
                    this._stateCdataSection(cp);
                    break;
                }
            case State.CDATA_SECTION_BRACKET:
                {
                    this._stateCdataSectionBracket(cp);
                    break;
                }
            case State.CDATA_SECTION_END:
                {
                    this._stateCdataSectionEnd(cp);
                    break;
                }
            case State.CHARACTER_REFERENCE:
                {
                    this._stateCharacterReference();
                    break;
                }
            case State.AMBIGUOUS_AMPERSAND:
                {
                    this._stateAmbiguousAmpersand(cp);
                    break;
                }
            default:
                {
                    throw new Error("Unknown state");
                }
        }
    }
    // State machine
    // Data state
    //------------------------------------------------------------------
    _stateData(cp) {
        switch(cp){
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.TAG_OPEN;
                    break;
                }
            case CODE_POINTS.AMPERSAND:
                {
                    this._startCharacterReference();
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._emitCodePoint(cp);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    //  RCDATA state
    //------------------------------------------------------------------
    _stateRcdata(cp) {
        switch(cp){
            case CODE_POINTS.AMPERSAND:
                {
                    this._startCharacterReference();
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.RCDATA_LESS_THAN_SIGN;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    // RAWTEXT state
    //------------------------------------------------------------------
    _stateRawtext(cp) {
        switch(cp){
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.RAWTEXT_LESS_THAN_SIGN;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    // Script data state
    //------------------------------------------------------------------
    _stateScriptData(cp) {
        switch(cp){
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA_LESS_THAN_SIGN;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    // PLAINTEXT state
    //------------------------------------------------------------------
    _statePlaintext(cp) {
        switch(cp){
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    // Tag open state
    //------------------------------------------------------------------
    _stateTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this._createStartTagToken();
            this.state = State.TAG_NAME;
            this._stateTagName(cp);
        } else switch(cp){
            case CODE_POINTS.EXCLAMATION_MARK:
                {
                    this.state = State.MARKUP_DECLARATION_OPEN;
                    break;
                }
            case CODE_POINTS.SOLIDUS:
                {
                    this.state = State.END_TAG_OPEN;
                    break;
                }
            case CODE_POINTS.QUESTION_MARK:
                {
                    this._err(ERR.unexpectedQuestionMarkInsteadOfTagName);
                    this._createCommentToken(1);
                    this.state = State.BOGUS_COMMENT;
                    this._stateBogusComment(cp);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofBeforeTagName);
                    this._emitChars("<");
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.invalidFirstCharacterOfTagName);
                    this._emitChars("<");
                    this.state = State.DATA;
                    this._stateData(cp);
                }
        }
    }
    // End tag open state
    //------------------------------------------------------------------
    _stateEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this._createEndTagToken();
            this.state = State.TAG_NAME;
            this._stateTagName(cp);
        } else switch(cp){
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.missingEndTagName);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofBeforeTagName);
                    this._emitChars("</");
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.invalidFirstCharacterOfTagName);
                    this._createCommentToken(2);
                    this.state = State.BOGUS_COMMENT;
                    this._stateBogusComment(cp);
                }
        }
    }
    // Tag name state
    //------------------------------------------------------------------
    _stateTagName(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this.state = State.BEFORE_ATTRIBUTE_NAME;
                    break;
                }
            case CODE_POINTS.SOLIDUS:
                {
                    this.state = State.SELF_CLOSING_START_TAG;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    this.emitCurrentTagToken();
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.tagName += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInTag);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.tagName += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
                }
        }
    }
    // RCDATA less-than sign state
    //------------------------------------------------------------------
    _stateRcdataLessThanSign(cp) {
        if (cp === CODE_POINTS.SOLIDUS) {
            this.state = State.RCDATA_END_TAG_OPEN;
        } else {
            this._emitChars("<");
            this.state = State.RCDATA;
            this._stateRcdata(cp);
        }
    }
    // RCDATA end tag open state
    //------------------------------------------------------------------
    _stateRcdataEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.RCDATA_END_TAG_NAME;
            this._stateRcdataEndTagName(cp);
        } else {
            this._emitChars("</");
            this.state = State.RCDATA;
            this._stateRcdata(cp);
        }
    }
    handleSpecialEndTag(_cp) {
        if (!this.preprocessor.startsWith(this.lastStartTagName, false)) {
            return !this._ensureHibernation();
        }
        this._createEndTagToken();
        const token = this.currentToken;
        token.tagName = this.lastStartTagName;
        const cp = this.preprocessor.peek(this.lastStartTagName.length);
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this._advanceBy(this.lastStartTagName.length);
                    this.state = State.BEFORE_ATTRIBUTE_NAME;
                    return false;
                }
            case CODE_POINTS.SOLIDUS:
                {
                    this._advanceBy(this.lastStartTagName.length);
                    this.state = State.SELF_CLOSING_START_TAG;
                    return false;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._advanceBy(this.lastStartTagName.length);
                    this.emitCurrentTagToken();
                    this.state = State.DATA;
                    return false;
                }
            default:
                {
                    return !this._ensureHibernation();
                }
        }
    }
    // RCDATA end tag name state
    //------------------------------------------------------------------
    _stateRcdataEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars("</");
            this.state = State.RCDATA;
            this._stateRcdata(cp);
        }
    }
    // RAWTEXT less-than sign state
    //------------------------------------------------------------------
    _stateRawtextLessThanSign(cp) {
        if (cp === CODE_POINTS.SOLIDUS) {
            this.state = State.RAWTEXT_END_TAG_OPEN;
        } else {
            this._emitChars("<");
            this.state = State.RAWTEXT;
            this._stateRawtext(cp);
        }
    }
    // RAWTEXT end tag open state
    //------------------------------------------------------------------
    _stateRawtextEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.RAWTEXT_END_TAG_NAME;
            this._stateRawtextEndTagName(cp);
        } else {
            this._emitChars("</");
            this.state = State.RAWTEXT;
            this._stateRawtext(cp);
        }
    }
    // RAWTEXT end tag name state
    //------------------------------------------------------------------
    _stateRawtextEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars("</");
            this.state = State.RAWTEXT;
            this._stateRawtext(cp);
        }
    }
    // Script data less-than sign state
    //------------------------------------------------------------------
    _stateScriptDataLessThanSign(cp) {
        switch(cp){
            case CODE_POINTS.SOLIDUS:
                {
                    this.state = State.SCRIPT_DATA_END_TAG_OPEN;
                    break;
                }
            case CODE_POINTS.EXCLAMATION_MARK:
                {
                    this.state = State.SCRIPT_DATA_ESCAPE_START;
                    this._emitChars("<!");
                    break;
                }
            default:
                {
                    this._emitChars("<");
                    this.state = State.SCRIPT_DATA;
                    this._stateScriptData(cp);
                }
        }
    }
    // Script data end tag open state
    //------------------------------------------------------------------
    _stateScriptDataEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.SCRIPT_DATA_END_TAG_NAME;
            this._stateScriptDataEndTagName(cp);
        } else {
            this._emitChars("</");
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data end tag name state
    //------------------------------------------------------------------
    _stateScriptDataEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars("</");
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data escape start state
    //------------------------------------------------------------------
    _stateScriptDataEscapeStart(cp) {
        if (cp === CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.SCRIPT_DATA_ESCAPE_START_DASH;
            this._emitChars("-");
        } else {
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data escape start dash state
    //------------------------------------------------------------------
    _stateScriptDataEscapeStartDash(cp) {
        if (cp === CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
            this._emitChars("-");
        } else {
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data escaped state
    //------------------------------------------------------------------
    _stateScriptDataEscaped(cp) {
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.SCRIPT_DATA_ESCAPED_DASH;
                    this._emitChars("-");
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInScriptHtmlCommentLikeText);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    // Script data escaped dash state
    //------------------------------------------------------------------
    _stateScriptDataEscapedDash(cp) {
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
                    this._emitChars("-");
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.state = State.SCRIPT_DATA_ESCAPED;
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInScriptHtmlCommentLikeText);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this.state = State.SCRIPT_DATA_ESCAPED;
                    this._emitCodePoint(cp);
                }
        }
    }
    // Script data escaped dash dash state
    //------------------------------------------------------------------
    _stateScriptDataEscapedDashDash(cp) {
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this._emitChars("-");
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA;
                    this._emitChars(">");
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.state = State.SCRIPT_DATA_ESCAPED;
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInScriptHtmlCommentLikeText);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this.state = State.SCRIPT_DATA_ESCAPED;
                    this._emitCodePoint(cp);
                }
        }
    }
    // Script data escaped less-than sign state
    //------------------------------------------------------------------
    _stateScriptDataEscapedLessThanSign(cp) {
        if (cp === CODE_POINTS.SOLIDUS) {
            this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
        } else if (isAsciiLetter(cp)) {
            this._emitChars("<");
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_START;
            this._stateScriptDataDoubleEscapeStart(cp);
        } else {
            this._emitChars("<");
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data escaped end tag open state
    //------------------------------------------------------------------
    _stateScriptDataEscapedEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_NAME;
            this._stateScriptDataEscapedEndTagName(cp);
        } else {
            this._emitChars("</");
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data escaped end tag name state
    //------------------------------------------------------------------
    _stateScriptDataEscapedEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars("</");
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data double escape start state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapeStart(cp) {
        if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
            this._emitCodePoint(cp);
            for(let i = 0; i < SEQUENCES.SCRIPT.length; i++){
                this._emitCodePoint(this._consume());
            }
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
        } else if (!this._ensureHibernation()) {
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data double escaped state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscaped(cp) {
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH;
                    this._emitChars("-");
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
                    this._emitChars("<");
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInScriptHtmlCommentLikeText);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    // Script data double escaped dash state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapedDash(cp) {
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;
                    this._emitChars("-");
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
                    this._emitChars("<");
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInScriptHtmlCommentLikeText);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                    this._emitCodePoint(cp);
                }
        }
    }
    // Script data double escaped dash dash state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapedDashDash(cp) {
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this._emitChars("-");
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
                    this._emitChars("<");
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.SCRIPT_DATA;
                    this._emitChars(">");
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                    this._emitChars(REPLACEMENT_CHARACTER);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInScriptHtmlCommentLikeText);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                    this._emitCodePoint(cp);
                }
        }
    }
    // Script data double escaped less-than sign state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapedLessThanSign(cp) {
        if (cp === CODE_POINTS.SOLIDUS) {
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_END;
            this._emitChars("/");
        } else {
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
            this._stateScriptDataDoubleEscaped(cp);
        }
    }
    // Script data double escape end state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapeEnd(cp) {
        if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
            this._emitCodePoint(cp);
            for(let i = 0; i < SEQUENCES.SCRIPT.length; i++){
                this._emitCodePoint(this._consume());
            }
            this.state = State.SCRIPT_DATA_ESCAPED;
        } else if (!this._ensureHibernation()) {
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
            this._stateScriptDataDoubleEscaped(cp);
        }
    }
    // Before attribute name state
    //------------------------------------------------------------------
    _stateBeforeAttributeName(cp) {
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.SOLIDUS:
            case CODE_POINTS.GREATER_THAN_SIGN:
            case CODE_POINTS.EOF:
                {
                    this.state = State.AFTER_ATTRIBUTE_NAME;
                    this._stateAfterAttributeName(cp);
                    break;
                }
            case CODE_POINTS.EQUALS_SIGN:
                {
                    this._err(ERR.unexpectedEqualsSignBeforeAttributeName);
                    this._createAttr("=");
                    this.state = State.ATTRIBUTE_NAME;
                    break;
                }
            default:
                {
                    this._createAttr("");
                    this.state = State.ATTRIBUTE_NAME;
                    this._stateAttributeName(cp);
                }
        }
    }
    // Attribute name state
    //------------------------------------------------------------------
    _stateAttributeName(cp) {
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
            case CODE_POINTS.SOLIDUS:
            case CODE_POINTS.GREATER_THAN_SIGN:
            case CODE_POINTS.EOF:
                {
                    this._leaveAttrName();
                    this.state = State.AFTER_ATTRIBUTE_NAME;
                    this._stateAfterAttributeName(cp);
                    break;
                }
            case CODE_POINTS.EQUALS_SIGN:
                {
                    this._leaveAttrName();
                    this.state = State.BEFORE_ATTRIBUTE_VALUE;
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
            case CODE_POINTS.APOSTROPHE:
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    this._err(ERR.unexpectedCharacterInAttributeName);
                    this.currentAttr.name += String.fromCodePoint(cp);
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.currentAttr.name += REPLACEMENT_CHARACTER;
                    break;
                }
            default:
                {
                    this.currentAttr.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
                }
        }
    }
    // After attribute name state
    //------------------------------------------------------------------
    _stateAfterAttributeName(cp) {
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.SOLIDUS:
                {
                    this.state = State.SELF_CLOSING_START_TAG;
                    break;
                }
            case CODE_POINTS.EQUALS_SIGN:
                {
                    this.state = State.BEFORE_ATTRIBUTE_VALUE;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    this.emitCurrentTagToken();
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInTag);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._createAttr("");
                    this.state = State.ATTRIBUTE_NAME;
                    this._stateAttributeName(cp);
                }
        }
    }
    // Before attribute value state
    //------------------------------------------------------------------
    _stateBeforeAttributeValue(cp) {
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
                {
                    this.state = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
                    break;
                }
            case CODE_POINTS.APOSTROPHE:
                {
                    this.state = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.missingAttributeValue);
                    this.state = State.DATA;
                    this.emitCurrentTagToken();
                    break;
                }
            default:
                {
                    this.state = State.ATTRIBUTE_VALUE_UNQUOTED;
                    this._stateAttributeValueUnquoted(cp);
                }
        }
    }
    // Attribute value (double-quoted) state
    //------------------------------------------------------------------
    _stateAttributeValueDoubleQuoted(cp) {
        switch(cp){
            case CODE_POINTS.QUOTATION_MARK:
                {
                    this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
                    break;
                }
            case CODE_POINTS.AMPERSAND:
                {
                    this._startCharacterReference();
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.currentAttr.value += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInTag);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this.currentAttr.value += String.fromCodePoint(cp);
                }
        }
    }
    // Attribute value (single-quoted) state
    //------------------------------------------------------------------
    _stateAttributeValueSingleQuoted(cp) {
        switch(cp){
            case CODE_POINTS.APOSTROPHE:
                {
                    this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
                    break;
                }
            case CODE_POINTS.AMPERSAND:
                {
                    this._startCharacterReference();
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.currentAttr.value += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInTag);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this.currentAttr.value += String.fromCodePoint(cp);
                }
        }
    }
    // Attribute value (unquoted) state
    //------------------------------------------------------------------
    _stateAttributeValueUnquoted(cp) {
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this._leaveAttrValue();
                    this.state = State.BEFORE_ATTRIBUTE_NAME;
                    break;
                }
            case CODE_POINTS.AMPERSAND:
                {
                    this._startCharacterReference();
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._leaveAttrValue();
                    this.state = State.DATA;
                    this.emitCurrentTagToken();
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this.currentAttr.value += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
            case CODE_POINTS.APOSTROPHE:
            case CODE_POINTS.LESS_THAN_SIGN:
            case CODE_POINTS.EQUALS_SIGN:
            case CODE_POINTS.GRAVE_ACCENT:
                {
                    this._err(ERR.unexpectedCharacterInUnquotedAttributeValue);
                    this.currentAttr.value += String.fromCodePoint(cp);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInTag);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this.currentAttr.value += String.fromCodePoint(cp);
                }
        }
    }
    // After attribute value (quoted) state
    //------------------------------------------------------------------
    _stateAfterAttributeValueQuoted(cp) {
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this._leaveAttrValue();
                    this.state = State.BEFORE_ATTRIBUTE_NAME;
                    break;
                }
            case CODE_POINTS.SOLIDUS:
                {
                    this._leaveAttrValue();
                    this.state = State.SELF_CLOSING_START_TAG;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._leaveAttrValue();
                    this.state = State.DATA;
                    this.emitCurrentTagToken();
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInTag);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingWhitespaceBetweenAttributes);
                    this.state = State.BEFORE_ATTRIBUTE_NAME;
                    this._stateBeforeAttributeName(cp);
                }
        }
    }
    // Self-closing start tag state
    //------------------------------------------------------------------
    _stateSelfClosingStartTag(cp) {
        switch(cp){
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    const token = this.currentToken;
                    token.selfClosing = true;
                    this.state = State.DATA;
                    this.emitCurrentTagToken();
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInTag);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.unexpectedSolidusInTag);
                    this.state = State.BEFORE_ATTRIBUTE_NAME;
                    this._stateBeforeAttributeName(cp);
                }
        }
    }
    // Bogus comment state
    //------------------------------------------------------------------
    _stateBogusComment(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    this.emitCurrentComment(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this.emitCurrentComment(token);
                    this._emitEOFToken();
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.data += REPLACEMENT_CHARACTER;
                    break;
                }
            default:
                {
                    token.data += String.fromCodePoint(cp);
                }
        }
    }
    // Markup declaration open state
    //------------------------------------------------------------------
    _stateMarkupDeclarationOpen(cp) {
        if (this._consumeSequenceIfMatch(SEQUENCES.DASH_DASH, true)) {
            this._createCommentToken(SEQUENCES.DASH_DASH.length + 1);
            this.state = State.COMMENT_START;
        } else if (this._consumeSequenceIfMatch(SEQUENCES.DOCTYPE, false)) {
            // NOTE: Doctypes tokens are created without fixed offsets. We keep track of the moment a doctype *might* start here.
            this.currentLocation = this.getCurrentLocation(SEQUENCES.DOCTYPE.length + 1);
            this.state = State.DOCTYPE;
        } else if (this._consumeSequenceIfMatch(SEQUENCES.CDATA_START, true)) {
            if (this.inForeignNode) {
                this.state = State.CDATA_SECTION;
            } else {
                this._err(ERR.cdataInHtmlContent);
                this._createCommentToken(SEQUENCES.CDATA_START.length + 1);
                this.currentToken.data = "[CDATA[";
                this.state = State.BOGUS_COMMENT;
            }
        } else if (!this._ensureHibernation()) {
            this._err(ERR.incorrectlyOpenedComment);
            this._createCommentToken(2);
            this.state = State.BOGUS_COMMENT;
            this._stateBogusComment(cp);
        }
    }
    // Comment start state
    //------------------------------------------------------------------
    _stateCommentStart(cp) {
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.COMMENT_START_DASH;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.abruptClosingOfEmptyComment);
                    this.state = State.DATA;
                    const token = this.currentToken;
                    this.emitCurrentComment(token);
                    break;
                }
            default:
                {
                    this.state = State.COMMENT;
                    this._stateComment(cp);
                }
        }
    }
    // Comment start dash state
    //------------------------------------------------------------------
    _stateCommentStartDash(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.COMMENT_END;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.abruptClosingOfEmptyComment);
                    this.state = State.DATA;
                    this.emitCurrentComment(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInComment);
                    this.emitCurrentComment(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.data += "-";
                    this.state = State.COMMENT;
                    this._stateComment(cp);
                }
        }
    }
    // Comment state
    //------------------------------------------------------------------
    _stateComment(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.COMMENT_END_DASH;
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    token.data += "<";
                    this.state = State.COMMENT_LESS_THAN_SIGN;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.data += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInComment);
                    this.emitCurrentComment(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.data += String.fromCodePoint(cp);
                }
        }
    }
    // Comment less-than sign state
    //------------------------------------------------------------------
    _stateCommentLessThanSign(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.EXCLAMATION_MARK:
                {
                    token.data += "!";
                    this.state = State.COMMENT_LESS_THAN_SIGN_BANG;
                    break;
                }
            case CODE_POINTS.LESS_THAN_SIGN:
                {
                    token.data += "<";
                    break;
                }
            default:
                {
                    this.state = State.COMMENT;
                    this._stateComment(cp);
                }
        }
    }
    // Comment less-than sign bang state
    //------------------------------------------------------------------
    _stateCommentLessThanSignBang(cp) {
        if (cp === CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH;
        } else {
            this.state = State.COMMENT;
            this._stateComment(cp);
        }
    }
    // Comment less-than sign bang dash state
    //------------------------------------------------------------------
    _stateCommentLessThanSignBangDash(cp) {
        if (cp === CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
        } else {
            this.state = State.COMMENT_END_DASH;
            this._stateCommentEndDash(cp);
        }
    }
    // Comment less-than sign bang dash dash state
    //------------------------------------------------------------------
    _stateCommentLessThanSignBangDashDash(cp) {
        if (cp !== CODE_POINTS.GREATER_THAN_SIGN && cp !== CODE_POINTS.EOF) {
            this._err(ERR.nestedComment);
        }
        this.state = State.COMMENT_END;
        this._stateCommentEnd(cp);
    }
    // Comment end dash state
    //------------------------------------------------------------------
    _stateCommentEndDash(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    this.state = State.COMMENT_END;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInComment);
                    this.emitCurrentComment(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.data += "-";
                    this.state = State.COMMENT;
                    this._stateComment(cp);
                }
        }
    }
    // Comment end state
    //------------------------------------------------------------------
    _stateCommentEnd(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    this.emitCurrentComment(token);
                    break;
                }
            case CODE_POINTS.EXCLAMATION_MARK:
                {
                    this.state = State.COMMENT_END_BANG;
                    break;
                }
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    token.data += "-";
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInComment);
                    this.emitCurrentComment(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.data += "--";
                    this.state = State.COMMENT;
                    this._stateComment(cp);
                }
        }
    }
    // Comment end bang state
    //------------------------------------------------------------------
    _stateCommentEndBang(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.HYPHEN_MINUS:
                {
                    token.data += "--!";
                    this.state = State.COMMENT_END_DASH;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.incorrectlyClosedComment);
                    this.state = State.DATA;
                    this.emitCurrentComment(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInComment);
                    this.emitCurrentComment(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.data += "--!";
                    this.state = State.COMMENT;
                    this._stateComment(cp);
                }
        }
    }
    // DOCTYPE state
    //------------------------------------------------------------------
    _stateDoctype(cp) {
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this.state = State.BEFORE_DOCTYPE_NAME;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.BEFORE_DOCTYPE_NAME;
                    this._stateBeforeDoctypeName(cp);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    this._createDoctypeToken(null);
                    const token = this.currentToken;
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingWhitespaceBeforeDoctypeName);
                    this.state = State.BEFORE_DOCTYPE_NAME;
                    this._stateBeforeDoctypeName(cp);
                }
        }
    }
    // Before DOCTYPE name state
    //------------------------------------------------------------------
    _stateBeforeDoctypeName(cp) {
        if (isAsciiUpper(cp)) {
            this._createDoctypeToken(String.fromCharCode(toAsciiLower(cp)));
            this.state = State.DOCTYPE_NAME;
        } else switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    this._createDoctypeToken(REPLACEMENT_CHARACTER);
                    this.state = State.DOCTYPE_NAME;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.missingDoctypeName);
                    this._createDoctypeToken(null);
                    const token = this.currentToken;
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    this._createDoctypeToken(null);
                    const token = this.currentToken;
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._createDoctypeToken(String.fromCodePoint(cp));
                    this.state = State.DOCTYPE_NAME;
                }
        }
    }
    // DOCTYPE name state
    //------------------------------------------------------------------
    _stateDoctypeName(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this.state = State.AFTER_DOCTYPE_NAME;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    this.emitCurrentDoctype(token);
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.name += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
                }
        }
    }
    // After DOCTYPE name state
    //------------------------------------------------------------------
    _stateAfterDoctypeName(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    this.emitCurrentDoctype(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    if (this._consumeSequenceIfMatch(SEQUENCES.PUBLIC, false)) {
                        this.state = State.AFTER_DOCTYPE_PUBLIC_KEYWORD;
                    } else if (this._consumeSequenceIfMatch(SEQUENCES.SYSTEM, false)) {
                        this.state = State.AFTER_DOCTYPE_SYSTEM_KEYWORD;
                    } else if (!this._ensureHibernation()) {
                        this._err(ERR.invalidCharacterSequenceAfterDoctypeName);
                        token.forceQuirks = true;
                        this.state = State.BOGUS_DOCTYPE;
                        this._stateBogusDoctype(cp);
                    }
                }
        }
    }
    // After DOCTYPE public keyword state
    //------------------------------------------------------------------
    _stateAfterDoctypePublicKeyword(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this.state = State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
                {
                    this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
                    token.publicId = "";
                    this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
                    break;
                }
            case CODE_POINTS.APOSTROPHE:
                {
                    this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
                    token.publicId = "";
                    this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.missingDoctypePublicIdentifier);
                    token.forceQuirks = true;
                    this.state = State.DATA;
                    this.emitCurrentDoctype(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
                    token.forceQuirks = true;
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // Before DOCTYPE public identifier state
    //------------------------------------------------------------------
    _stateBeforeDoctypePublicIdentifier(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
                {
                    token.publicId = "";
                    this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
                    break;
                }
            case CODE_POINTS.APOSTROPHE:
                {
                    token.publicId = "";
                    this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.missingDoctypePublicIdentifier);
                    token.forceQuirks = true;
                    this.state = State.DATA;
                    this.emitCurrentDoctype(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
                    token.forceQuirks = true;
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // DOCTYPE public identifier (double-quoted) state
    //------------------------------------------------------------------
    _stateDoctypePublicIdentifierDoubleQuoted(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.QUOTATION_MARK:
                {
                    this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.publicId += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.abruptDoctypePublicIdentifier);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.publicId += String.fromCodePoint(cp);
                }
        }
    }
    // DOCTYPE public identifier (single-quoted) state
    //------------------------------------------------------------------
    _stateDoctypePublicIdentifierSingleQuoted(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.APOSTROPHE:
                {
                    this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.publicId += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.abruptDoctypePublicIdentifier);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.publicId += String.fromCodePoint(cp);
                }
        }
    }
    // After DOCTYPE public identifier state
    //------------------------------------------------------------------
    _stateAfterDoctypePublicIdentifier(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this.state = State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    this.emitCurrentDoctype(token);
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
                {
                    this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                    break;
                }
            case CODE_POINTS.APOSTROPHE:
                {
                    this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // Between DOCTYPE public and system identifiers state
    //------------------------------------------------------------------
    _stateBetweenDoctypePublicAndSystemIdentifiers(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
                {
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                    break;
                }
            case CODE_POINTS.APOSTROPHE:
                {
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // After DOCTYPE system keyword state
    //------------------------------------------------------------------
    _stateAfterDoctypeSystemKeyword(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    this.state = State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
                {
                    this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                    break;
                }
            case CODE_POINTS.APOSTROPHE:
                {
                    this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.missingDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.state = State.DATA;
                    this.emitCurrentDoctype(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // Before DOCTYPE system identifier state
    //------------------------------------------------------------------
    _stateBeforeDoctypeSystemIdentifier(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.QUOTATION_MARK:
                {
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                    break;
                }
            case CODE_POINTS.APOSTROPHE:
                {
                    token.systemId = "";
                    this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.missingDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.state = State.DATA;
                    this.emitCurrentDoctype(token);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // DOCTYPE system identifier (double-quoted) state
    //------------------------------------------------------------------
    _stateDoctypeSystemIdentifierDoubleQuoted(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.QUOTATION_MARK:
                {
                    this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.systemId += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.abruptDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.systemId += String.fromCodePoint(cp);
                }
        }
    }
    // DOCTYPE system identifier (single-quoted) state
    //------------------------------------------------------------------
    _stateDoctypeSystemIdentifierSingleQuoted(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.APOSTROPHE:
                {
                    this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    token.systemId += REPLACEMENT_CHARACTER;
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this._err(ERR.abruptDoctypeSystemIdentifier);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    token.systemId += String.fromCodePoint(cp);
                }
        }
    }
    // After DOCTYPE system identifier state
    //------------------------------------------------------------------
    _stateAfterDoctypeSystemIdentifier(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.SPACE:
            case CODE_POINTS.LINE_FEED:
            case CODE_POINTS.TABULATION:
            case CODE_POINTS.FORM_FEED:
                {
                    break;
                }
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInDoctype);
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // Bogus DOCTYPE state
    //------------------------------------------------------------------
    _stateBogusDoctype(cp) {
        const token = this.currentToken;
        switch(cp){
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.NULL:
                {
                    this._err(ERR.unexpectedNullCharacter);
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
            default:
        }
    }
    // CDATA section state
    //------------------------------------------------------------------
    _stateCdataSection(cp) {
        switch(cp){
            case CODE_POINTS.RIGHT_SQUARE_BRACKET:
                {
                    this.state = State.CDATA_SECTION_BRACKET;
                    break;
                }
            case CODE_POINTS.EOF:
                {
                    this._err(ERR.eofInCdata);
                    this._emitEOFToken();
                    break;
                }
            default:
                {
                    this._emitCodePoint(cp);
                }
        }
    }
    // CDATA section bracket state
    //------------------------------------------------------------------
    _stateCdataSectionBracket(cp) {
        if (cp === CODE_POINTS.RIGHT_SQUARE_BRACKET) {
            this.state = State.CDATA_SECTION_END;
        } else {
            this._emitChars("]");
            this.state = State.CDATA_SECTION;
            this._stateCdataSection(cp);
        }
    }
    // CDATA section end state
    //------------------------------------------------------------------
    _stateCdataSectionEnd(cp) {
        switch(cp){
            case CODE_POINTS.GREATER_THAN_SIGN:
                {
                    this.state = State.DATA;
                    break;
                }
            case CODE_POINTS.RIGHT_SQUARE_BRACKET:
                {
                    this._emitChars("]");
                    break;
                }
            default:
                {
                    this._emitChars("]]");
                    this.state = State.CDATA_SECTION;
                    this._stateCdataSection(cp);
                }
        }
    }
    // Character reference state
    //------------------------------------------------------------------
    _stateCharacterReference() {
        let length = this.entityDecoder.write(this.preprocessor.html, this.preprocessor.pos);
        if (length < 0) {
            if (this.preprocessor.lastChunkWritten) {
                length = this.entityDecoder.end();
            } else {
                // Wait for the rest of the entity.
                this.active = false;
                // Mark the entire buffer as read.
                this.preprocessor.pos = this.preprocessor.html.length - 1;
                this.consumedAfterSnapshot = 0;
                this.preprocessor.endOfChunkHit = true;
                return;
            }
        }
        if (length === 0) {
            // This was not a valid entity. Go back to the beginning, and
            // figure out what to do.
            this.preprocessor.pos = this.entityStartPos;
            this._flushCodePointConsumedAsCharacterReference(CODE_POINTS.AMPERSAND);
            this.state = !this._isCharacterReferenceInAttribute() && tokenizer_isAsciiAlphaNumeric(this.preprocessor.peek(1)) ? State.AMBIGUOUS_AMPERSAND : this.returnState;
        } else {
            // We successfully parsed an entity. Switch to the return state.
            this.state = this.returnState;
        }
    }
    // Ambiguos ampersand state
    //------------------------------------------------------------------
    _stateAmbiguousAmpersand(cp) {
        if (tokenizer_isAsciiAlphaNumeric(cp)) {
            this._flushCodePointConsumedAsCharacterReference(cp);
        } else {
            if (cp === CODE_POINTS.SEMICOLON) {
                this._err(ERR.unknownNamedCharacterReference);
            }
            this.state = this.returnState;
            this._callState(cp);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/parser/open-element-stack.js

//Element utils
const IMPLICIT_END_TAG_REQUIRED = new Set([
    TAG_ID.DD,
    TAG_ID.DT,
    TAG_ID.LI,
    TAG_ID.OPTGROUP,
    TAG_ID.OPTION,
    TAG_ID.P,
    TAG_ID.RB,
    TAG_ID.RP,
    TAG_ID.RT,
    TAG_ID.RTC
]);
const IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = new Set([
    ...IMPLICIT_END_TAG_REQUIRED,
    TAG_ID.CAPTION,
    TAG_ID.COLGROUP,
    TAG_ID.TBODY,
    TAG_ID.TD,
    TAG_ID.TFOOT,
    TAG_ID.TH,
    TAG_ID.THEAD,
    TAG_ID.TR
]);
const SCOPING_ELEMENTS_HTML = new Set([
    TAG_ID.APPLET,
    TAG_ID.CAPTION,
    TAG_ID.HTML,
    TAG_ID.MARQUEE,
    TAG_ID.OBJECT,
    TAG_ID.TABLE,
    TAG_ID.TD,
    TAG_ID.TEMPLATE,
    TAG_ID.TH
]);
const SCOPING_ELEMENTS_HTML_LIST = new Set([
    ...SCOPING_ELEMENTS_HTML,
    TAG_ID.OL,
    TAG_ID.UL
]);
const SCOPING_ELEMENTS_HTML_BUTTON = new Set([
    ...SCOPING_ELEMENTS_HTML,
    TAG_ID.BUTTON
]);
const SCOPING_ELEMENTS_MATHML = new Set([
    TAG_ID.ANNOTATION_XML,
    TAG_ID.MI,
    TAG_ID.MN,
    TAG_ID.MO,
    TAG_ID.MS,
    TAG_ID.MTEXT
]);
const SCOPING_ELEMENTS_SVG = new Set([
    TAG_ID.DESC,
    TAG_ID.FOREIGN_OBJECT,
    TAG_ID.TITLE
]);
const TABLE_ROW_CONTEXT = new Set([
    TAG_ID.TR,
    TAG_ID.TEMPLATE,
    TAG_ID.HTML
]);
const TABLE_BODY_CONTEXT = new Set([
    TAG_ID.TBODY,
    TAG_ID.TFOOT,
    TAG_ID.THEAD,
    TAG_ID.TEMPLATE,
    TAG_ID.HTML
]);
const TABLE_CONTEXT = new Set([
    TAG_ID.TABLE,
    TAG_ID.TEMPLATE,
    TAG_ID.HTML
]);
const TABLE_CELLS = new Set([
    TAG_ID.TD,
    TAG_ID.TH
]);
//Stack of open elements
class OpenElementStack {
    get currentTmplContentOrNode() {
        return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
    }
    constructor(document, treeAdapter, handler){
        this.treeAdapter = treeAdapter;
        this.handler = handler;
        this.items = [];
        this.tagIDs = [];
        this.stackTop = -1;
        this.tmplCount = 0;
        this.currentTagId = TAG_ID.UNKNOWN;
        this.current = document;
    }
    //Index of element
    _indexOf(element) {
        return this.items.lastIndexOf(element, this.stackTop);
    }
    //Update current element
    _isInTemplate() {
        return this.currentTagId === TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === NS.HTML;
    }
    _updateCurrentElement() {
        this.current = this.items[this.stackTop];
        this.currentTagId = this.tagIDs[this.stackTop];
    }
    //Mutations
    push(element, tagID) {
        this.stackTop++;
        this.items[this.stackTop] = element;
        this.current = element;
        this.tagIDs[this.stackTop] = tagID;
        this.currentTagId = tagID;
        if (this._isInTemplate()) {
            this.tmplCount++;
        }
        this.handler.onItemPush(element, tagID, true);
    }
    pop() {
        const popped = this.current;
        if (this.tmplCount > 0 && this._isInTemplate()) {
            this.tmplCount--;
        }
        this.stackTop--;
        this._updateCurrentElement();
        this.handler.onItemPop(popped, true);
    }
    replace(oldElement, newElement) {
        const idx = this._indexOf(oldElement);
        this.items[idx] = newElement;
        if (idx === this.stackTop) {
            this.current = newElement;
        }
    }
    insertAfter(referenceElement, newElement, newElementID) {
        const insertionIdx = this._indexOf(referenceElement) + 1;
        this.items.splice(insertionIdx, 0, newElement);
        this.tagIDs.splice(insertionIdx, 0, newElementID);
        this.stackTop++;
        if (insertionIdx === this.stackTop) {
            this._updateCurrentElement();
        }
        if (this.current && this.currentTagId !== undefined) {
            this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
        }
    }
    popUntilTagNamePopped(tagName) {
        let targetIdx = this.stackTop + 1;
        do {
            targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
        }while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== NS.HTML);
        this.shortenToLength(Math.max(targetIdx, 0));
    }
    shortenToLength(idx) {
        while(this.stackTop >= idx){
            const popped = this.current;
            if (this.tmplCount > 0 && this._isInTemplate()) {
                this.tmplCount -= 1;
            }
            this.stackTop--;
            this._updateCurrentElement();
            this.handler.onItemPop(popped, this.stackTop < idx);
        }
    }
    popUntilElementPopped(element) {
        const idx = this._indexOf(element);
        this.shortenToLength(Math.max(idx, 0));
    }
    popUntilPopped(tagNames, targetNS) {
        const idx = this._indexOfTagNames(tagNames, targetNS);
        this.shortenToLength(Math.max(idx, 0));
    }
    popUntilNumberedHeaderPopped() {
        this.popUntilPopped(NUMBERED_HEADERS, NS.HTML);
    }
    popUntilTableCellPopped() {
        this.popUntilPopped(TABLE_CELLS, NS.HTML);
    }
    popAllUpToHtmlElement() {
        //NOTE: here we assume that the root <html> element is always first in the open element stack, so
        //we perform this fast stack clean up.
        this.tmplCount = 0;
        this.shortenToLength(1);
    }
    _indexOfTagNames(tagNames, namespace) {
        for(let i = this.stackTop; i >= 0; i--){
            if (tagNames.has(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) {
                return i;
            }
        }
        return -1;
    }
    clearBackTo(tagNames, targetNS) {
        const idx = this._indexOfTagNames(tagNames, targetNS);
        this.shortenToLength(idx + 1);
    }
    clearBackToTableContext() {
        this.clearBackTo(TABLE_CONTEXT, NS.HTML);
    }
    clearBackToTableBodyContext() {
        this.clearBackTo(TABLE_BODY_CONTEXT, NS.HTML);
    }
    clearBackToTableRowContext() {
        this.clearBackTo(TABLE_ROW_CONTEXT, NS.HTML);
    }
    remove(element) {
        const idx = this._indexOf(element);
        if (idx >= 0) {
            if (idx === this.stackTop) {
                this.pop();
            } else {
                this.items.splice(idx, 1);
                this.tagIDs.splice(idx, 1);
                this.stackTop--;
                this._updateCurrentElement();
                this.handler.onItemPop(element, false);
            }
        }
    }
    //Search
    tryPeekProperlyNestedBodyElement() {
        //Properly nested <body> element (should be second element in stack).
        return this.stackTop >= 1 && this.tagIDs[1] === TAG_ID.BODY ? this.items[1] : null;
    }
    contains(element) {
        return this._indexOf(element) > -1;
    }
    getCommonAncestor(element) {
        const elementIdx = this._indexOf(element) - 1;
        return elementIdx >= 0 ? this.items[elementIdx] : null;
    }
    isRootHtmlElementCurrent() {
        return this.stackTop === 0 && this.tagIDs[0] === TAG_ID.HTML;
    }
    //Element in scope
    hasInDynamicScope(tagName, htmlScope) {
        for(let i = this.stackTop; i >= 0; i--){
            const tn = this.tagIDs[i];
            switch(this.treeAdapter.getNamespaceURI(this.items[i])){
                case NS.HTML:
                    {
                        if (tn === tagName) return true;
                        if (htmlScope.has(tn)) return false;
                        break;
                    }
                case NS.SVG:
                    {
                        if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
                        break;
                    }
                case NS.MATHML:
                    {
                        if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
                        break;
                    }
            }
        }
        return true;
    }
    hasInScope(tagName) {
        return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML);
    }
    hasInListItemScope(tagName) {
        return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_LIST);
    }
    hasInButtonScope(tagName) {
        return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_BUTTON);
    }
    hasNumberedHeaderInScope() {
        for(let i = this.stackTop; i >= 0; i--){
            const tn = this.tagIDs[i];
            switch(this.treeAdapter.getNamespaceURI(this.items[i])){
                case NS.HTML:
                    {
                        if (NUMBERED_HEADERS.has(tn)) return true;
                        if (SCOPING_ELEMENTS_HTML.has(tn)) return false;
                        break;
                    }
                case NS.SVG:
                    {
                        if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
                        break;
                    }
                case NS.MATHML:
                    {
                        if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
                        break;
                    }
            }
        }
        return true;
    }
    hasInTableScope(tagName) {
        for(let i = this.stackTop; i >= 0; i--){
            if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) {
                continue;
            }
            switch(this.tagIDs[i]){
                case tagName:
                    {
                        return true;
                    }
                case TAG_ID.TABLE:
                case TAG_ID.HTML:
                    {
                        return false;
                    }
            }
        }
        return true;
    }
    hasTableBodyContextInTableScope() {
        for(let i = this.stackTop; i >= 0; i--){
            if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) {
                continue;
            }
            switch(this.tagIDs[i]){
                case TAG_ID.TBODY:
                case TAG_ID.THEAD:
                case TAG_ID.TFOOT:
                    {
                        return true;
                    }
                case TAG_ID.TABLE:
                case TAG_ID.HTML:
                    {
                        return false;
                    }
            }
        }
        return true;
    }
    hasInSelectScope(tagName) {
        for(let i = this.stackTop; i >= 0; i--){
            if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) {
                continue;
            }
            switch(this.tagIDs[i]){
                case tagName:
                    {
                        return true;
                    }
                case TAG_ID.OPTION:
                case TAG_ID.OPTGROUP:
                    {
                        break;
                    }
                default:
                    {
                        return false;
                    }
            }
        }
        return true;
    }
    //Implied end tags
    generateImpliedEndTags() {
        while(this.currentTagId !== undefined && IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)){
            this.pop();
        }
    }
    generateImpliedEndTagsThoroughly() {
        while(this.currentTagId !== undefined && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)){
            this.pop();
        }
    }
    generateImpliedEndTagsWithExclusion(exclusionId) {
        while(this.currentTagId !== undefined && this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)){
            this.pop();
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/parser/formatting-element-list.js
//Const
const NOAH_ARK_CAPACITY = 3;
var EntryType;
(function(EntryType) {
    EntryType[EntryType["Marker"] = 0] = "Marker";
    EntryType[EntryType["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
const MARKER = {
    type: EntryType.Marker
};
//List of formatting elements
class FormattingElementList {
    constructor(treeAdapter){
        this.treeAdapter = treeAdapter;
        this.entries = [];
        this.bookmark = null;
    }
    //Noah Ark's condition
    //OPTIMIZATION: at first we try to find possible candidates for exclusion using
    //lightweight heuristics without thorough attributes check.
    _getNoahArkConditionCandidates(newElement, neAttrs) {
        const candidates = [];
        const neAttrsLength = neAttrs.length;
        const neTagName = this.treeAdapter.getTagName(newElement);
        const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
        for(let i = 0; i < this.entries.length; i++){
            const entry = this.entries[i];
            if (entry.type === EntryType.Marker) {
                break;
            }
            const { element } = entry;
            if (this.treeAdapter.getTagName(element) === neTagName && this.treeAdapter.getNamespaceURI(element) === neNamespaceURI) {
                const elementAttrs = this.treeAdapter.getAttrList(element);
                if (elementAttrs.length === neAttrsLength) {
                    candidates.push({
                        idx: i,
                        attrs: elementAttrs
                    });
                }
            }
        }
        return candidates;
    }
    _ensureNoahArkCondition(newElement) {
        if (this.entries.length < NOAH_ARK_CAPACITY) return;
        const neAttrs = this.treeAdapter.getAttrList(newElement);
        const candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);
        if (candidates.length < NOAH_ARK_CAPACITY) return;
        //NOTE: build attrs map for the new element, so we can perform fast lookups
        const neAttrsMap = new Map(neAttrs.map((neAttr)=>[
                neAttr.name,
                neAttr.value
            ]));
        let validCandidates = 0;
        //NOTE: remove bottommost candidates, until Noah's Ark condition will not be met
        for(let i = 0; i < candidates.length; i++){
            const candidate = candidates[i];
            // We know that `candidate.attrs.length === neAttrs.length`
            if (candidate.attrs.every((cAttr)=>neAttrsMap.get(cAttr.name) === cAttr.value)) {
                validCandidates += 1;
                if (validCandidates >= NOAH_ARK_CAPACITY) {
                    this.entries.splice(candidate.idx, 1);
                }
            }
        }
    }
    //Mutations
    insertMarker() {
        this.entries.unshift(MARKER);
    }
    pushElement(element, token) {
        this._ensureNoahArkCondition(element);
        this.entries.unshift({
            type: EntryType.Element,
            element,
            token
        });
    }
    insertElementAfterBookmark(element, token) {
        const bookmarkIdx = this.entries.indexOf(this.bookmark);
        this.entries.splice(bookmarkIdx, 0, {
            type: EntryType.Element,
            element,
            token
        });
    }
    removeEntry(entry) {
        const entryIndex = this.entries.indexOf(entry);
        if (entryIndex !== -1) {
            this.entries.splice(entryIndex, 1);
        }
    }
    /**
     * Clears the list of formatting elements up to the last marker.
     *
     * @see https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker
     */ clearToLastMarker() {
        const markerIdx = this.entries.indexOf(MARKER);
        if (markerIdx === -1) {
            this.entries.length = 0;
        } else {
            this.entries.splice(0, markerIdx + 1);
        }
    }
    //Search
    getElementEntryInScopeWithTagName(tagName) {
        const entry = this.entries.find((entry)=>entry.type === EntryType.Marker || this.treeAdapter.getTagName(entry.element) === tagName);
        return entry && entry.type === EntryType.Element ? entry : null;
    }
    getElementEntry(element) {
        return this.entries.find((entry)=>entry.type === EntryType.Element && entry.element === element);
    }
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/tree-adapters/default.js

const defaultTreeAdapter = {
    //Node construction
    createDocument () {
        return {
            nodeName: "#document",
            mode: DOCUMENT_MODE.NO_QUIRKS,
            childNodes: []
        };
    },
    createDocumentFragment () {
        return {
            nodeName: "#document-fragment",
            childNodes: []
        };
    },
    createElement (tagName, namespaceURI, attrs) {
        return {
            nodeName: tagName,
            tagName,
            attrs,
            namespaceURI,
            childNodes: [],
            parentNode: null
        };
    },
    createCommentNode (data) {
        return {
            nodeName: "#comment",
            data,
            parentNode: null
        };
    },
    createTextNode (value) {
        return {
            nodeName: "#text",
            value,
            parentNode: null
        };
    },
    //Tree mutation
    appendChild (parentNode, newNode) {
        parentNode.childNodes.push(newNode);
        newNode.parentNode = parentNode;
    },
    insertBefore (parentNode, newNode, referenceNode) {
        const insertionIdx = parentNode.childNodes.indexOf(referenceNode);
        parentNode.childNodes.splice(insertionIdx, 0, newNode);
        newNode.parentNode = parentNode;
    },
    setTemplateContent (templateElement, contentElement) {
        templateElement.content = contentElement;
    },
    getTemplateContent (templateElement) {
        return templateElement.content;
    },
    setDocumentType (document, name, publicId, systemId) {
        const doctypeNode = document.childNodes.find((node)=>node.nodeName === "#documentType");
        if (doctypeNode) {
            doctypeNode.name = name;
            doctypeNode.publicId = publicId;
            doctypeNode.systemId = systemId;
        } else {
            const node = {
                nodeName: "#documentType",
                name,
                publicId,
                systemId,
                parentNode: null
            };
            defaultTreeAdapter.appendChild(document, node);
        }
    },
    setDocumentMode (document, mode) {
        document.mode = mode;
    },
    getDocumentMode (document) {
        return document.mode;
    },
    detachNode (node) {
        if (node.parentNode) {
            const idx = node.parentNode.childNodes.indexOf(node);
            node.parentNode.childNodes.splice(idx, 1);
            node.parentNode = null;
        }
    },
    insertText (parentNode, text) {
        if (parentNode.childNodes.length > 0) {
            const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
            if (defaultTreeAdapter.isTextNode(prevNode)) {
                prevNode.value += text;
                return;
            }
        }
        defaultTreeAdapter.appendChild(parentNode, defaultTreeAdapter.createTextNode(text));
    },
    insertTextBefore (parentNode, text, referenceNode) {
        const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
        if (prevNode && defaultTreeAdapter.isTextNode(prevNode)) {
            prevNode.value += text;
        } else {
            defaultTreeAdapter.insertBefore(parentNode, defaultTreeAdapter.createTextNode(text), referenceNode);
        }
    },
    adoptAttributes (recipient, attrs) {
        const recipientAttrsMap = new Set(recipient.attrs.map((attr)=>attr.name));
        for(let j = 0; j < attrs.length; j++){
            if (!recipientAttrsMap.has(attrs[j].name)) {
                recipient.attrs.push(attrs[j]);
            }
        }
    },
    //Tree traversing
    getFirstChild (node) {
        return node.childNodes[0];
    },
    getChildNodes (node) {
        return node.childNodes;
    },
    getParentNode (node) {
        return node.parentNode;
    },
    getAttrList (element) {
        return element.attrs;
    },
    //Node data
    getTagName (element) {
        return element.tagName;
    },
    getNamespaceURI (element) {
        return element.namespaceURI;
    },
    getTextNodeContent (textNode) {
        return textNode.value;
    },
    getCommentNodeContent (commentNode) {
        return commentNode.data;
    },
    getDocumentTypeNodeName (doctypeNode) {
        return doctypeNode.name;
    },
    getDocumentTypeNodePublicId (doctypeNode) {
        return doctypeNode.publicId;
    },
    getDocumentTypeNodeSystemId (doctypeNode) {
        return doctypeNode.systemId;
    },
    //Node types
    isTextNode (node) {
        return node.nodeName === "#text";
    },
    isCommentNode (node) {
        return node.nodeName === "#comment";
    },
    isDocumentTypeNode (node) {
        return node.nodeName === "#documentType";
    },
    isElementNode (node) {
        return Object.prototype.hasOwnProperty.call(node, "tagName");
    },
    // Source code location
    setNodeSourceCodeLocation (node, location) {
        node.sourceCodeLocation = location;
    },
    getNodeSourceCodeLocation (node) {
        return node.sourceCodeLocation;
    },
    updateNodeSourceCodeLocation (node, endLocation) {
        node.sourceCodeLocation = {
            ...node.sourceCodeLocation,
            ...endLocation
        };
    }
};

;// CONCATENATED MODULE: ./node_modules/parse5/dist/common/doctype.js

//Const
const VALID_DOCTYPE_NAME = "html";
const VALID_SYSTEM_ID = "about:legacy-compat";
const QUIRKS_MODE_SYSTEM_ID = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd";
const QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
    "+//silmaril//dtd html pro v0r11 19970101//",
    "-//as//dtd html 3.0 aswedit + extensions//",
    "-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
    "-//ietf//dtd html 2.0 level 1//",
    "-//ietf//dtd html 2.0 level 2//",
    "-//ietf//dtd html 2.0 strict level 1//",
    "-//ietf//dtd html 2.0 strict level 2//",
    "-//ietf//dtd html 2.0 strict//",
    "-//ietf//dtd html 2.0//",
    "-//ietf//dtd html 2.1e//",
    "-//ietf//dtd html 3.0//",
    "-//ietf//dtd html 3.2 final//",
    "-//ietf//dtd html 3.2//",
    "-//ietf//dtd html 3//",
    "-//ietf//dtd html level 0//",
    "-//ietf//dtd html level 1//",
    "-//ietf//dtd html level 2//",
    "-//ietf//dtd html level 3//",
    "-//ietf//dtd html strict level 0//",
    "-//ietf//dtd html strict level 1//",
    "-//ietf//dtd html strict level 2//",
    "-//ietf//dtd html strict level 3//",
    "-//ietf//dtd html strict//",
    "-//ietf//dtd html//",
    "-//metrius//dtd metrius presentational//",
    "-//microsoft//dtd internet explorer 2.0 html strict//",
    "-//microsoft//dtd internet explorer 2.0 html//",
    "-//microsoft//dtd internet explorer 2.0 tables//",
    "-//microsoft//dtd internet explorer 3.0 html strict//",
    "-//microsoft//dtd internet explorer 3.0 html//",
    "-//microsoft//dtd internet explorer 3.0 tables//",
    "-//netscape comm. corp.//dtd html//",
    "-//netscape comm. corp.//dtd strict html//",
    "-//o'reilly and associates//dtd html 2.0//",
    "-//o'reilly and associates//dtd html extended 1.0//",
    "-//o'reilly and associates//dtd html extended relaxed 1.0//",
    "-//sq//dtd html 2.0 hotmetal + extensions//",
    "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
    "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
    "-//spyglass//dtd html 2.0 extended//",
    "-//sun microsystems corp.//dtd hotjava html//",
    "-//sun microsystems corp.//dtd hotjava strict html//",
    "-//w3c//dtd html 3 1995-03-24//",
    "-//w3c//dtd html 3.2 draft//",
    "-//w3c//dtd html 3.2 final//",
    "-//w3c//dtd html 3.2//",
    "-//w3c//dtd html 3.2s draft//",
    "-//w3c//dtd html 4.0 frameset//",
    "-//w3c//dtd html 4.0 transitional//",
    "-//w3c//dtd html experimental 19960712//",
    "-//w3c//dtd html experimental 970421//",
    "-//w3c//dtd w3 html//",
    "-//w3o//dtd w3 html 3.0//",
    "-//webtechs//dtd mozilla html 2.0//",
    "-//webtechs//dtd mozilla html//"
];
const QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
    ...QUIRKS_MODE_PUBLIC_ID_PREFIXES,
    "-//w3c//dtd html 4.01 frameset//",
    "-//w3c//dtd html 4.01 transitional//"
];
const QUIRKS_MODE_PUBLIC_IDS = new Set([
    "-//w3o//dtd w3 html strict 3.0//en//",
    "-/w3c/dtd html 4.0 transitional/en",
    "html"
]);
const LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = [
    "-//w3c//dtd xhtml 1.0 frameset//",
    "-//w3c//dtd xhtml 1.0 transitional//"
];
const LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
    ...LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
    "-//w3c//dtd html 4.01 frameset//",
    "-//w3c//dtd html 4.01 transitional//"
];
//Utils
function hasPrefix(publicId, prefixes) {
    return prefixes.some((prefix)=>publicId.startsWith(prefix));
}
//API
function isConforming(token) {
    return token.name === VALID_DOCTYPE_NAME && token.publicId === null && (token.systemId === null || token.systemId === VALID_SYSTEM_ID);
}
function getDocumentMode(token) {
    if (token.name !== VALID_DOCTYPE_NAME) {
        return DOCUMENT_MODE.QUIRKS;
    }
    const { systemId } = token;
    if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) {
        return DOCUMENT_MODE.QUIRKS;
    }
    let { publicId } = token;
    if (publicId !== null) {
        publicId = publicId.toLowerCase();
        if (QUIRKS_MODE_PUBLIC_IDS.has(publicId)) {
            return DOCUMENT_MODE.QUIRKS;
        }
        let prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;
        if (hasPrefix(publicId, prefixes)) {
            return DOCUMENT_MODE.QUIRKS;
        }
        prefixes = systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;
        if (hasPrefix(publicId, prefixes)) {
            return DOCUMENT_MODE.LIMITED_QUIRKS;
        }
    }
    return DOCUMENT_MODE.NO_QUIRKS;
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/common/foreign-content.js

//MIME types
const MIME_TYPES = {
    TEXT_HTML: "text/html",
    APPLICATION_XML: "application/xhtml+xml"
};
//Attributes
const DEFINITION_URL_ATTR = "definitionurl";
const ADJUSTED_DEFINITION_URL_ATTR = "definitionURL";
const SVG_ATTRS_ADJUSTMENT_MAP = new Map([
    "attributeName",
    "attributeType",
    "baseFrequency",
    "baseProfile",
    "calcMode",
    "clipPathUnits",
    "diffuseConstant",
    "edgeMode",
    "filterUnits",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "kernelMatrix",
    "kernelUnitLength",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "limitingConeAngle",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "maskContentUnits",
    "maskUnits",
    "numOctaves",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "specularConstant",
    "specularExponent",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stitchTiles",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textLength",
    "viewBox",
    "viewTarget",
    "xChannelSelector",
    "yChannelSelector",
    "zoomAndPan"
].map((attr)=>[
        attr.toLowerCase(),
        attr
    ]));
const XML_ATTRS_ADJUSTMENT_MAP = new Map([
    [
        "xlink:actuate",
        {
            prefix: "xlink",
            name: "actuate",
            namespace: NS.XLINK
        }
    ],
    [
        "xlink:arcrole",
        {
            prefix: "xlink",
            name: "arcrole",
            namespace: NS.XLINK
        }
    ],
    [
        "xlink:href",
        {
            prefix: "xlink",
            name: "href",
            namespace: NS.XLINK
        }
    ],
    [
        "xlink:role",
        {
            prefix: "xlink",
            name: "role",
            namespace: NS.XLINK
        }
    ],
    [
        "xlink:show",
        {
            prefix: "xlink",
            name: "show",
            namespace: NS.XLINK
        }
    ],
    [
        "xlink:title",
        {
            prefix: "xlink",
            name: "title",
            namespace: NS.XLINK
        }
    ],
    [
        "xlink:type",
        {
            prefix: "xlink",
            name: "type",
            namespace: NS.XLINK
        }
    ],
    [
        "xml:lang",
        {
            prefix: "xml",
            name: "lang",
            namespace: NS.XML
        }
    ],
    [
        "xml:space",
        {
            prefix: "xml",
            name: "space",
            namespace: NS.XML
        }
    ],
    [
        "xmlns",
        {
            prefix: "",
            name: "xmlns",
            namespace: NS.XMLNS
        }
    ],
    [
        "xmlns:xlink",
        {
            prefix: "xmlns",
            name: "xlink",
            namespace: NS.XMLNS
        }
    ]
]);
//SVG tag names adjustment map
const SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "textPath"
].map((tn)=>[
        tn.toLowerCase(),
        tn
    ]));
//Tags that causes exit from foreign content
const EXITS_FOREIGN_CONTENT = new Set([
    TAG_ID.B,
    TAG_ID.BIG,
    TAG_ID.BLOCKQUOTE,
    TAG_ID.BODY,
    TAG_ID.BR,
    TAG_ID.CENTER,
    TAG_ID.CODE,
    TAG_ID.DD,
    TAG_ID.DIV,
    TAG_ID.DL,
    TAG_ID.DT,
    TAG_ID.EM,
    TAG_ID.EMBED,
    TAG_ID.H1,
    TAG_ID.H2,
    TAG_ID.H3,
    TAG_ID.H4,
    TAG_ID.H5,
    TAG_ID.H6,
    TAG_ID.HEAD,
    TAG_ID.HR,
    TAG_ID.I,
    TAG_ID.IMG,
    TAG_ID.LI,
    TAG_ID.LISTING,
    TAG_ID.MENU,
    TAG_ID.META,
    TAG_ID.NOBR,
    TAG_ID.OL,
    TAG_ID.P,
    TAG_ID.PRE,
    TAG_ID.RUBY,
    TAG_ID.S,
    TAG_ID.SMALL,
    TAG_ID.SPAN,
    TAG_ID.STRONG,
    TAG_ID.STRIKE,
    TAG_ID.SUB,
    TAG_ID.SUP,
    TAG_ID.TABLE,
    TAG_ID.TT,
    TAG_ID.U,
    TAG_ID.UL,
    TAG_ID.VAR
]);
//Check exit from foreign content
function causesExit(startTagToken) {
    const tn = startTagToken.tagID;
    const isFontWithAttrs = tn === TAG_ID.FONT && startTagToken.attrs.some(({ name })=>name === ATTRS.COLOR || name === ATTRS.SIZE || name === ATTRS.FACE);
    return isFontWithAttrs || EXITS_FOREIGN_CONTENT.has(tn);
}
//Token adjustments
function adjustTokenMathMLAttrs(token) {
    for(let i = 0; i < token.attrs.length; i++){
        if (token.attrs[i].name === DEFINITION_URL_ATTR) {
            token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
            break;
        }
    }
}
function adjustTokenSVGAttrs(token) {
    for(let i = 0; i < token.attrs.length; i++){
        const adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
        if (adjustedAttrName != null) {
            token.attrs[i].name = adjustedAttrName;
        }
    }
}
function adjustTokenXMLAttrs(token) {
    for(let i = 0; i < token.attrs.length; i++){
        const adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
        if (adjustedAttrEntry) {
            token.attrs[i].prefix = adjustedAttrEntry.prefix;
            token.attrs[i].name = adjustedAttrEntry.name;
            token.attrs[i].namespace = adjustedAttrEntry.namespace;
        }
    }
}
function adjustTokenSVGTagName(token) {
    const adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(token.tagName);
    if (adjustedTagName != null) {
        token.tagName = adjustedTagName;
        token.tagID = getTagID(token.tagName);
    }
}
//Integration points
function isMathMLTextIntegrationPoint(tn, ns) {
    return ns === NS.MATHML && (tn === TAG_ID.MI || tn === TAG_ID.MO || tn === TAG_ID.MN || tn === TAG_ID.MS || tn === TAG_ID.MTEXT);
}
function isHtmlIntegrationPoint(tn, ns, attrs) {
    if (ns === NS.MATHML && tn === TAG_ID.ANNOTATION_XML) {
        for(let i = 0; i < attrs.length; i++){
            if (attrs[i].name === ATTRS.ENCODING) {
                const value = attrs[i].value.toLowerCase();
                return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
            }
        }
    }
    return ns === NS.SVG && (tn === TAG_ID.FOREIGN_OBJECT || tn === TAG_ID.DESC || tn === TAG_ID.TITLE);
}
function isIntegrationPoint(tn, ns, attrs, foreignNS) {
    return (!foreignNS || foreignNS === NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs) || (!foreignNS || foreignNS === NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns);
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/parser/index.js










//Misc constants
const HIDDEN_INPUT_TYPE = "hidden";
//Adoption agency loops iteration count
const AA_OUTER_LOOP_ITER = 8;
const AA_INNER_LOOP_ITER = 3;
//Insertion modes
var InsertionMode;
(function(InsertionMode) {
    InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
    InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
    InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
    InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
    InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
    InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
    InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
    InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
    InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
    InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
    InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
    InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
    InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
    InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
    InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
    InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
    InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
    InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
    InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
    InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
    InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
    InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
    InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
const BASE_LOC = {
    startLine: -1,
    startCol: -1,
    startOffset: -1,
    endLine: -1,
    endCol: -1,
    endOffset: -1
};
const TABLE_STRUCTURE_TAGS = new Set([
    TAG_ID.TABLE,
    TAG_ID.TBODY,
    TAG_ID.TFOOT,
    TAG_ID.THEAD,
    TAG_ID.TR
]);
const defaultParserOptions = {
    scriptingEnabled: true,
    sourceCodeLocationInfo: false,
    treeAdapter: defaultTreeAdapter,
    onParseError: null
};
//Parser
class parser_Parser {
    constructor(options, document, /** @internal */ fragmentContext = null, /** @internal */ scriptHandler = null){
        this.fragmentContext = fragmentContext;
        this.scriptHandler = scriptHandler;
        this.currentToken = null;
        this.stopped = false;
        /** @internal */ this.insertionMode = InsertionMode.INITIAL;
        /** @internal */ this.originalInsertionMode = InsertionMode.INITIAL;
        /** @internal */ this.headElement = null;
        /** @internal */ this.formElement = null;
        /** Indicates that the current node is not an element in the HTML namespace */ this.currentNotInHTML = false;
        /**
         * The template insertion mode stack is maintained from the left.
         * Ie. the topmost element will always have index 0.
         *
         * @internal
         */ this.tmplInsertionModeStack = [];
        /** @internal */ this.pendingCharacterTokens = [];
        /** @internal */ this.hasNonWhitespacePendingCharacterToken = false;
        /** @internal */ this.framesetOk = true;
        /** @internal */ this.skipNextNewLine = false;
        /** @internal */ this.fosterParentingEnabled = false;
        this.options = {
            ...defaultParserOptions,
            ...options
        };
        this.treeAdapter = this.options.treeAdapter;
        this.onParseError = this.options.onParseError;
        // Always enable location info if we report parse errors.
        if (this.onParseError) {
            this.options.sourceCodeLocationInfo = true;
        }
        this.document = document !== null && document !== void 0 ? document : this.treeAdapter.createDocument();
        this.tokenizer = new Tokenizer(this.options, this);
        this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
        this.fragmentContextID = fragmentContext ? getTagID(this.treeAdapter.getTagName(fragmentContext)) : TAG_ID.UNKNOWN;
        this._setContextModes(fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : this.document, this.fragmentContextID);
        this.openElements = new OpenElementStack(this.document, this.treeAdapter, this);
    }
    // API
    static parse(html, options) {
        const parser = new this(options);
        parser.tokenizer.write(html, true);
        return parser.document;
    }
    static getFragmentParser(fragmentContext, options) {
        const opts = {
            ...defaultParserOptions,
            ...options
        };
        //NOTE: use a <template> element as the fragment context if no context element was provided,
        //so we will parse in a "forgiving" manner
        fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : fragmentContext = opts.treeAdapter.createElement(TAG_NAMES.TEMPLATE, NS.HTML, []);
        //NOTE: create a fake element which will be used as the `document` for fragment parsing.
        //This is important for jsdom, where a new `document` cannot be created. This led to
        //fragment parsing messing with the main `document`.
        const documentMock = opts.treeAdapter.createElement("documentmock", NS.HTML, []);
        const parser = new this(opts, documentMock, fragmentContext);
        if (parser.fragmentContextID === TAG_ID.TEMPLATE) {
            parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
        }
        parser._initTokenizerForFragmentParsing();
        parser._insertFakeRootElement();
        parser._resetInsertionMode();
        parser._findFormInFragmentContext();
        return parser;
    }
    getFragment() {
        const rootElement = this.treeAdapter.getFirstChild(this.document);
        const fragment = this.treeAdapter.createDocumentFragment();
        this._adoptNodes(rootElement, fragment);
        return fragment;
    }
    //Errors
    /** @internal */ _err(token, code, beforeToken) {
        var _a;
        if (!this.onParseError) return;
        const loc = (_a = token.location) !== null && _a !== void 0 ? _a : BASE_LOC;
        const err = {
            code,
            startLine: loc.startLine,
            startCol: loc.startCol,
            startOffset: loc.startOffset,
            endLine: beforeToken ? loc.startLine : loc.endLine,
            endCol: beforeToken ? loc.startCol : loc.endCol,
            endOffset: beforeToken ? loc.startOffset : loc.endOffset
        };
        this.onParseError(err);
    }
    //Stack events
    /** @internal */ onItemPush(node, tid, isTop) {
        var _a, _b;
        (_b = (_a = this.treeAdapter).onItemPush) === null || _b === void 0 ? void 0 : _b.call(_a, node);
        if (isTop && this.openElements.stackTop > 0) this._setContextModes(node, tid);
    }
    /** @internal */ onItemPop(node, isTop) {
        var _a, _b;
        if (this.options.sourceCodeLocationInfo) {
            this._setEndLocation(node, this.currentToken);
        }
        (_b = (_a = this.treeAdapter).onItemPop) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.openElements.current);
        if (isTop) {
            let current;
            let currentTagId;
            if (this.openElements.stackTop === 0 && this.fragmentContext) {
                current = this.fragmentContext;
                currentTagId = this.fragmentContextID;
            } else {
                ({ current, currentTagId } = this.openElements);
            }
            this._setContextModes(current, currentTagId);
        }
    }
    _setContextModes(current, tid) {
        const isHTML = current === this.document || current && this.treeAdapter.getNamespaceURI(current) === NS.HTML;
        this.currentNotInHTML = !isHTML;
        this.tokenizer.inForeignNode = !isHTML && current !== undefined && tid !== undefined && !this._isIntegrationPoint(tid, current);
    }
    /** @protected */ _switchToTextParsing(currentToken, nextTokenizerState) {
        this._insertElement(currentToken, NS.HTML);
        this.tokenizer.state = nextTokenizerState;
        this.originalInsertionMode = this.insertionMode;
        this.insertionMode = InsertionMode.TEXT;
    }
    switchToPlaintextParsing() {
        this.insertionMode = InsertionMode.TEXT;
        this.originalInsertionMode = InsertionMode.IN_BODY;
        this.tokenizer.state = TokenizerMode.PLAINTEXT;
    }
    //Fragment parsing
    /** @protected */ _getAdjustedCurrentElement() {
        return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
    }
    /** @protected */ _findFormInFragmentContext() {
        let node = this.fragmentContext;
        while(node){
            if (this.treeAdapter.getTagName(node) === TAG_NAMES.FORM) {
                this.formElement = node;
                break;
            }
            node = this.treeAdapter.getParentNode(node);
        }
    }
    _initTokenizerForFragmentParsing() {
        if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== NS.HTML) {
            return;
        }
        switch(this.fragmentContextID){
            case TAG_ID.TITLE:
            case TAG_ID.TEXTAREA:
                {
                    this.tokenizer.state = TokenizerMode.RCDATA;
                    break;
                }
            case TAG_ID.STYLE:
            case TAG_ID.XMP:
            case TAG_ID.IFRAME:
            case TAG_ID.NOEMBED:
            case TAG_ID.NOFRAMES:
            case TAG_ID.NOSCRIPT:
                {
                    this.tokenizer.state = TokenizerMode.RAWTEXT;
                    break;
                }
            case TAG_ID.SCRIPT:
                {
                    this.tokenizer.state = TokenizerMode.SCRIPT_DATA;
                    break;
                }
            case TAG_ID.PLAINTEXT:
                {
                    this.tokenizer.state = TokenizerMode.PLAINTEXT;
                    break;
                }
            default:
        }
    }
    //Tree mutation
    /** @protected */ _setDocumentType(token) {
        const name = token.name || "";
        const publicId = token.publicId || "";
        const systemId = token.systemId || "";
        this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
        if (token.location) {
            const documentChildren = this.treeAdapter.getChildNodes(this.document);
            const docTypeNode = documentChildren.find((node)=>this.treeAdapter.isDocumentTypeNode(node));
            if (docTypeNode) {
                this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
            }
        }
    }
    /** @protected */ _attachElementToTree(element, location) {
        if (this.options.sourceCodeLocationInfo) {
            const loc = location && {
                ...location,
                startTag: location
            };
            this.treeAdapter.setNodeSourceCodeLocation(element, loc);
        }
        if (this._shouldFosterParentOnInsertion()) {
            this._fosterParentElement(element);
        } else {
            const parent = this.openElements.currentTmplContentOrNode;
            this.treeAdapter.appendChild(parent !== null && parent !== void 0 ? parent : this.document, element);
        }
    }
    /**
     * For self-closing tags. Add an element to the tree, but skip adding it
     * to the stack.
     */ /** @protected */ _appendElement(token, namespaceURI) {
        const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
        this._attachElementToTree(element, token.location);
    }
    /** @protected */ _insertElement(token, namespaceURI) {
        const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
        this._attachElementToTree(element, token.location);
        this.openElements.push(element, token.tagID);
    }
    /** @protected */ _insertFakeElement(tagName, tagID) {
        const element = this.treeAdapter.createElement(tagName, NS.HTML, []);
        this._attachElementToTree(element, null);
        this.openElements.push(element, tagID);
    }
    /** @protected */ _insertTemplate(token) {
        const tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs);
        const content = this.treeAdapter.createDocumentFragment();
        this.treeAdapter.setTemplateContent(tmpl, content);
        this._attachElementToTree(tmpl, token.location);
        this.openElements.push(tmpl, token.tagID);
        if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(content, null);
    }
    /** @protected */ _insertFakeRootElement() {
        const element = this.treeAdapter.createElement(TAG_NAMES.HTML, NS.HTML, []);
        if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(element, null);
        this.treeAdapter.appendChild(this.openElements.current, element);
        this.openElements.push(element, TAG_ID.HTML);
    }
    /** @protected */ _appendCommentNode(token, parent) {
        const commentNode = this.treeAdapter.createCommentNode(token.data);
        this.treeAdapter.appendChild(parent, commentNode);
        if (this.options.sourceCodeLocationInfo) {
            this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
        }
    }
    /** @protected */ _insertCharacters(token) {
        let parent;
        let beforeElement;
        if (this._shouldFosterParentOnInsertion()) {
            ({ parent, beforeElement } = this._findFosterParentingLocation());
            if (beforeElement) {
                this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
            } else {
                this.treeAdapter.insertText(parent, token.chars);
            }
        } else {
            parent = this.openElements.currentTmplContentOrNode;
            this.treeAdapter.insertText(parent, token.chars);
        }
        if (!token.location) return;
        const siblings = this.treeAdapter.getChildNodes(parent);
        const textNodeIdx = beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length;
        const textNode = siblings[textNodeIdx - 1];
        //NOTE: if we have a location assigned by another token, then just update the end position
        const tnLoc = this.treeAdapter.getNodeSourceCodeLocation(textNode);
        if (tnLoc) {
            const { endLine, endCol, endOffset } = token.location;
            this.treeAdapter.updateNodeSourceCodeLocation(textNode, {
                endLine,
                endCol,
                endOffset
            });
        } else if (this.options.sourceCodeLocationInfo) {
            this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
        }
    }
    /** @protected */ _adoptNodes(donor, recipient) {
        for(let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)){
            this.treeAdapter.detachNode(child);
            this.treeAdapter.appendChild(recipient, child);
        }
    }
    /** @protected */ _setEndLocation(element, closingToken) {
        if (this.treeAdapter.getNodeSourceCodeLocation(element) && closingToken.location) {
            const ctLoc = closingToken.location;
            const tn = this.treeAdapter.getTagName(element);
            const endLoc = // NOTE: For cases like <p> <p> </p> - First 'p' closes without a closing
            // tag and for cases like <td> <p> </td> - 'p' closes without a closing tag.
            closingToken.type === TokenType.END_TAG && tn === closingToken.tagName ? {
                endTag: {
                    ...ctLoc
                },
                endLine: ctLoc.endLine,
                endCol: ctLoc.endCol,
                endOffset: ctLoc.endOffset
            } : {
                endLine: ctLoc.startLine,
                endCol: ctLoc.startCol,
                endOffset: ctLoc.startOffset
            };
            this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
        }
    }
    //Token processing
    shouldProcessStartTagTokenInForeignContent(token) {
        // Check that neither current === document, or ns === NS.HTML
        if (!this.currentNotInHTML) return false;
        let current;
        let currentTagId;
        if (this.openElements.stackTop === 0 && this.fragmentContext) {
            current = this.fragmentContext;
            currentTagId = this.fragmentContextID;
        } else {
            ({ current, currentTagId } = this.openElements);
        }
        if (token.tagID === TAG_ID.SVG && this.treeAdapter.getTagName(current) === TAG_NAMES.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(current) === NS.MATHML) {
            return false;
        }
        return(// Check that `current` is not an integration point for HTML or MathML elements.
        this.tokenizer.inForeignNode || // If it _is_ an integration point, then we might have to check that it is not an HTML
        // integration point.
        (token.tagID === TAG_ID.MGLYPH || token.tagID === TAG_ID.MALIGNMARK) && currentTagId !== undefined && !this._isIntegrationPoint(currentTagId, current, NS.HTML));
    }
    /** @protected */ _processToken(token) {
        switch(token.type){
            case TokenType.CHARACTER:
                {
                    this.onCharacter(token);
                    break;
                }
            case TokenType.NULL_CHARACTER:
                {
                    this.onNullCharacter(token);
                    break;
                }
            case TokenType.COMMENT:
                {
                    this.onComment(token);
                    break;
                }
            case TokenType.DOCTYPE:
                {
                    this.onDoctype(token);
                    break;
                }
            case TokenType.START_TAG:
                {
                    this._processStartTag(token);
                    break;
                }
            case TokenType.END_TAG:
                {
                    this.onEndTag(token);
                    break;
                }
            case TokenType.EOF:
                {
                    this.onEof(token);
                    break;
                }
            case TokenType.WHITESPACE_CHARACTER:
                {
                    this.onWhitespaceCharacter(token);
                    break;
                }
        }
    }
    //Integration points
    /** @protected */ _isIntegrationPoint(tid, element, foreignNS) {
        const ns = this.treeAdapter.getNamespaceURI(element);
        const attrs = this.treeAdapter.getAttrList(element);
        return isIntegrationPoint(tid, ns, attrs, foreignNS);
    }
    //Active formatting elements reconstruction
    /** @protected */ _reconstructActiveFormattingElements() {
        const listLength = this.activeFormattingElements.entries.length;
        if (listLength) {
            const endIndex = this.activeFormattingElements.entries.findIndex((entry)=>entry.type === EntryType.Marker || this.openElements.contains(entry.element));
            const unopenIdx = endIndex === -1 ? listLength - 1 : endIndex - 1;
            for(let i = unopenIdx; i >= 0; i--){
                const entry = this.activeFormattingElements.entries[i];
                this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
                entry.element = this.openElements.current;
            }
        }
    }
    //Close elements
    /** @protected */ _closeTableCell() {
        this.openElements.generateImpliedEndTags();
        this.openElements.popUntilTableCellPopped();
        this.activeFormattingElements.clearToLastMarker();
        this.insertionMode = InsertionMode.IN_ROW;
    }
    /** @protected */ _closePElement() {
        this.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.P);
        this.openElements.popUntilTagNamePopped(TAG_ID.P);
    }
    //Insertion modes
    /** @protected */ _resetInsertionMode() {
        for(let i = this.openElements.stackTop; i >= 0; i--){
            //Insertion mode reset map
            switch(i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]){
                case TAG_ID.TR:
                    {
                        this.insertionMode = InsertionMode.IN_ROW;
                        return;
                    }
                case TAG_ID.TBODY:
                case TAG_ID.THEAD:
                case TAG_ID.TFOOT:
                    {
                        this.insertionMode = InsertionMode.IN_TABLE_BODY;
                        return;
                    }
                case TAG_ID.CAPTION:
                    {
                        this.insertionMode = InsertionMode.IN_CAPTION;
                        return;
                    }
                case TAG_ID.COLGROUP:
                    {
                        this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
                        return;
                    }
                case TAG_ID.TABLE:
                    {
                        this.insertionMode = InsertionMode.IN_TABLE;
                        return;
                    }
                case TAG_ID.BODY:
                    {
                        this.insertionMode = InsertionMode.IN_BODY;
                        return;
                    }
                case TAG_ID.FRAMESET:
                    {
                        this.insertionMode = InsertionMode.IN_FRAMESET;
                        return;
                    }
                case TAG_ID.SELECT:
                    {
                        this._resetInsertionModeForSelect(i);
                        return;
                    }
                case TAG_ID.TEMPLATE:
                    {
                        this.insertionMode = this.tmplInsertionModeStack[0];
                        return;
                    }
                case TAG_ID.HTML:
                    {
                        this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
                        return;
                    }
                case TAG_ID.TD:
                case TAG_ID.TH:
                    {
                        if (i > 0) {
                            this.insertionMode = InsertionMode.IN_CELL;
                            return;
                        }
                        break;
                    }
                case TAG_ID.HEAD:
                    {
                        if (i > 0) {
                            this.insertionMode = InsertionMode.IN_HEAD;
                            return;
                        }
                        break;
                    }
            }
        }
        this.insertionMode = InsertionMode.IN_BODY;
    }
    /** @protected */ _resetInsertionModeForSelect(selectIdx) {
        if (selectIdx > 0) {
            for(let i = selectIdx - 1; i > 0; i--){
                const tn = this.openElements.tagIDs[i];
                if (tn === TAG_ID.TEMPLATE) {
                    break;
                } else if (tn === TAG_ID.TABLE) {
                    this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
                    return;
                }
            }
        }
        this.insertionMode = InsertionMode.IN_SELECT;
    }
    //Foster parenting
    /** @protected */ _isElementCausesFosterParenting(tn) {
        return TABLE_STRUCTURE_TAGS.has(tn);
    }
    /** @protected */ _shouldFosterParentOnInsertion() {
        return this.fosterParentingEnabled && this.openElements.currentTagId !== undefined && this._isElementCausesFosterParenting(this.openElements.currentTagId);
    }
    /** @protected */ _findFosterParentingLocation() {
        for(let i = this.openElements.stackTop; i >= 0; i--){
            const openElement = this.openElements.items[i];
            switch(this.openElements.tagIDs[i]){
                case TAG_ID.TEMPLATE:
                    {
                        if (this.treeAdapter.getNamespaceURI(openElement) === NS.HTML) {
                            return {
                                parent: this.treeAdapter.getTemplateContent(openElement),
                                beforeElement: null
                            };
                        }
                        break;
                    }
                case TAG_ID.TABLE:
                    {
                        const parent = this.treeAdapter.getParentNode(openElement);
                        if (parent) {
                            return {
                                parent,
                                beforeElement: openElement
                            };
                        }
                        return {
                            parent: this.openElements.items[i - 1],
                            beforeElement: null
                        };
                    }
                default:
            }
        }
        return {
            parent: this.openElements.items[0],
            beforeElement: null
        };
    }
    /** @protected */ _fosterParentElement(element) {
        const location = this._findFosterParentingLocation();
        if (location.beforeElement) {
            this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
        } else {
            this.treeAdapter.appendChild(location.parent, element);
        }
    }
    //Special elements
    /** @protected */ _isSpecialElement(element, id) {
        const ns = this.treeAdapter.getNamespaceURI(element);
        return SPECIAL_ELEMENTS[ns].has(id);
    }
    /** @internal */ onCharacter(token) {
        this.skipNextNewLine = false;
        if (this.tokenizer.inForeignNode) {
            characterInForeignContent(this, token);
            return;
        }
        switch(this.insertionMode){
            case InsertionMode.INITIAL:
                {
                    tokenInInitialMode(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HTML:
                {
                    tokenBeforeHtml(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HEAD:
                {
                    tokenBeforeHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD:
                {
                    tokenInHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                {
                    tokenInHeadNoScript(this, token);
                    break;
                }
            case InsertionMode.AFTER_HEAD:
                {
                    tokenAfterHead(this, token);
                    break;
                }
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_TEMPLATE:
                {
                    characterInBody(this, token);
                    break;
                }
            case InsertionMode.TEXT:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
                {
                    this._insertCharacters(token);
                    break;
                }
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
                {
                    characterInTable(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_TEXT:
                {
                    characterInTableText(this, token);
                    break;
                }
            case InsertionMode.IN_COLUMN_GROUP:
                {
                    tokenInColumnGroup(this, token);
                    break;
                }
            case InsertionMode.AFTER_BODY:
                {
                    tokenAfterBody(this, token);
                    break;
                }
            case InsertionMode.AFTER_AFTER_BODY:
                {
                    tokenAfterAfterBody(this, token);
                    break;
                }
            default:
        }
    }
    /** @internal */ onNullCharacter(token) {
        this.skipNextNewLine = false;
        if (this.tokenizer.inForeignNode) {
            nullCharacterInForeignContent(this, token);
            return;
        }
        switch(this.insertionMode){
            case InsertionMode.INITIAL:
                {
                    tokenInInitialMode(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HTML:
                {
                    tokenBeforeHtml(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HEAD:
                {
                    tokenBeforeHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD:
                {
                    tokenInHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                {
                    tokenInHeadNoScript(this, token);
                    break;
                }
            case InsertionMode.AFTER_HEAD:
                {
                    tokenAfterHead(this, token);
                    break;
                }
            case InsertionMode.TEXT:
                {
                    this._insertCharacters(token);
                    break;
                }
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
                {
                    characterInTable(this, token);
                    break;
                }
            case InsertionMode.IN_COLUMN_GROUP:
                {
                    tokenInColumnGroup(this, token);
                    break;
                }
            case InsertionMode.AFTER_BODY:
                {
                    tokenAfterBody(this, token);
                    break;
                }
            case InsertionMode.AFTER_AFTER_BODY:
                {
                    tokenAfterAfterBody(this, token);
                    break;
                }
            default:
        }
    }
    /** @internal */ onComment(token) {
        this.skipNextNewLine = false;
        if (this.currentNotInHTML) {
            appendComment(this, token);
            return;
        }
        switch(this.insertionMode){
            case InsertionMode.INITIAL:
            case InsertionMode.BEFORE_HTML:
            case InsertionMode.BEFORE_HEAD:
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
            case InsertionMode.IN_TEMPLATE:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET:
                {
                    appendComment(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_TEXT:
                {
                    tokenInTableText(this, token);
                    break;
                }
            case InsertionMode.AFTER_BODY:
                {
                    appendCommentToRootHtmlElement(this, token);
                    break;
                }
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET:
                {
                    appendCommentToDocument(this, token);
                    break;
                }
            default:
        }
    }
    /** @internal */ onDoctype(token) {
        this.skipNextNewLine = false;
        switch(this.insertionMode){
            case InsertionMode.INITIAL:
                {
                    doctypeInInitialMode(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HEAD:
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
                {
                    this._err(token, ERR.misplacedDoctype);
                    break;
                }
            case InsertionMode.IN_TABLE_TEXT:
                {
                    tokenInTableText(this, token);
                    break;
                }
            default:
        }
    }
    /** @internal */ onStartTag(token) {
        this.skipNextNewLine = false;
        this.currentToken = token;
        this._processStartTag(token);
        if (token.selfClosing && !token.ackSelfClosing) {
            this._err(token, ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
        }
    }
    /**
     * Processes a given start tag.
     *
     * `onStartTag` checks if a self-closing tag was recognized. When a token
     * is moved inbetween multiple insertion modes, this check for self-closing
     * could lead to false positives. To avoid this, `_processStartTag` is used
     * for nested calls.
     *
     * @param token The token to process.
     * @protected
     */ _processStartTag(token) {
        if (this.shouldProcessStartTagTokenInForeignContent(token)) {
            startTagInForeignContent(this, token);
        } else {
            this._startTagOutsideForeignContent(token);
        }
    }
    /** @protected */ _startTagOutsideForeignContent(token) {
        switch(this.insertionMode){
            case InsertionMode.INITIAL:
                {
                    tokenInInitialMode(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HTML:
                {
                    startTagBeforeHtml(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HEAD:
                {
                    startTagBeforeHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD:
                {
                    startTagInHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                {
                    startTagInHeadNoScript(this, token);
                    break;
                }
            case InsertionMode.AFTER_HEAD:
                {
                    startTagAfterHead(this, token);
                    break;
                }
            case InsertionMode.IN_BODY:
                {
                    startTagInBody(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE:
                {
                    startTagInTable(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_TEXT:
                {
                    tokenInTableText(this, token);
                    break;
                }
            case InsertionMode.IN_CAPTION:
                {
                    startTagInCaption(this, token);
                    break;
                }
            case InsertionMode.IN_COLUMN_GROUP:
                {
                    startTagInColumnGroup(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_BODY:
                {
                    startTagInTableBody(this, token);
                    break;
                }
            case InsertionMode.IN_ROW:
                {
                    startTagInRow(this, token);
                    break;
                }
            case InsertionMode.IN_CELL:
                {
                    startTagInCell(this, token);
                    break;
                }
            case InsertionMode.IN_SELECT:
                {
                    startTagInSelect(this, token);
                    break;
                }
            case InsertionMode.IN_SELECT_IN_TABLE:
                {
                    startTagInSelectInTable(this, token);
                    break;
                }
            case InsertionMode.IN_TEMPLATE:
                {
                    startTagInTemplate(this, token);
                    break;
                }
            case InsertionMode.AFTER_BODY:
                {
                    startTagAfterBody(this, token);
                    break;
                }
            case InsertionMode.IN_FRAMESET:
                {
                    startTagInFrameset(this, token);
                    break;
                }
            case InsertionMode.AFTER_FRAMESET:
                {
                    startTagAfterFrameset(this, token);
                    break;
                }
            case InsertionMode.AFTER_AFTER_BODY:
                {
                    startTagAfterAfterBody(this, token);
                    break;
                }
            case InsertionMode.AFTER_AFTER_FRAMESET:
                {
                    startTagAfterAfterFrameset(this, token);
                    break;
                }
            default:
        }
    }
    /** @internal */ onEndTag(token) {
        this.skipNextNewLine = false;
        this.currentToken = token;
        if (this.currentNotInHTML) {
            endTagInForeignContent(this, token);
        } else {
            this._endTagOutsideForeignContent(token);
        }
    }
    /** @protected */ _endTagOutsideForeignContent(token) {
        switch(this.insertionMode){
            case InsertionMode.INITIAL:
                {
                    tokenInInitialMode(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HTML:
                {
                    endTagBeforeHtml(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HEAD:
                {
                    endTagBeforeHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD:
                {
                    endTagInHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                {
                    endTagInHeadNoScript(this, token);
                    break;
                }
            case InsertionMode.AFTER_HEAD:
                {
                    endTagAfterHead(this, token);
                    break;
                }
            case InsertionMode.IN_BODY:
                {
                    endTagInBody(this, token);
                    break;
                }
            case InsertionMode.TEXT:
                {
                    endTagInText(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE:
                {
                    endTagInTable(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_TEXT:
                {
                    tokenInTableText(this, token);
                    break;
                }
            case InsertionMode.IN_CAPTION:
                {
                    endTagInCaption(this, token);
                    break;
                }
            case InsertionMode.IN_COLUMN_GROUP:
                {
                    endTagInColumnGroup(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_BODY:
                {
                    endTagInTableBody(this, token);
                    break;
                }
            case InsertionMode.IN_ROW:
                {
                    endTagInRow(this, token);
                    break;
                }
            case InsertionMode.IN_CELL:
                {
                    endTagInCell(this, token);
                    break;
                }
            case InsertionMode.IN_SELECT:
                {
                    endTagInSelect(this, token);
                    break;
                }
            case InsertionMode.IN_SELECT_IN_TABLE:
                {
                    endTagInSelectInTable(this, token);
                    break;
                }
            case InsertionMode.IN_TEMPLATE:
                {
                    endTagInTemplate(this, token);
                    break;
                }
            case InsertionMode.AFTER_BODY:
                {
                    endTagAfterBody(this, token);
                    break;
                }
            case InsertionMode.IN_FRAMESET:
                {
                    endTagInFrameset(this, token);
                    break;
                }
            case InsertionMode.AFTER_FRAMESET:
                {
                    endTagAfterFrameset(this, token);
                    break;
                }
            case InsertionMode.AFTER_AFTER_BODY:
                {
                    tokenAfterAfterBody(this, token);
                    break;
                }
            default:
        }
    }
    /** @internal */ onEof(token) {
        switch(this.insertionMode){
            case InsertionMode.INITIAL:
                {
                    tokenInInitialMode(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HTML:
                {
                    tokenBeforeHtml(this, token);
                    break;
                }
            case InsertionMode.BEFORE_HEAD:
                {
                    tokenBeforeHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD:
                {
                    tokenInHead(this, token);
                    break;
                }
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                {
                    tokenInHeadNoScript(this, token);
                    break;
                }
            case InsertionMode.AFTER_HEAD:
                {
                    tokenAfterHead(this, token);
                    break;
                }
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
                {
                    eofInBody(this, token);
                    break;
                }
            case InsertionMode.TEXT:
                {
                    eofInText(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_TEXT:
                {
                    tokenInTableText(this, token);
                    break;
                }
            case InsertionMode.IN_TEMPLATE:
                {
                    eofInTemplate(this, token);
                    break;
                }
            case InsertionMode.AFTER_BODY:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET:
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET:
                {
                    stopParsing(this, token);
                    break;
                }
            default:
        }
    }
    /** @internal */ onWhitespaceCharacter(token) {
        if (this.skipNextNewLine) {
            this.skipNextNewLine = false;
            if (token.chars.charCodeAt(0) === CODE_POINTS.LINE_FEED) {
                if (token.chars.length === 1) {
                    return;
                }
                token.chars = token.chars.substr(1);
            }
        }
        if (this.tokenizer.inForeignNode) {
            this._insertCharacters(token);
            return;
        }
        switch(this.insertionMode){
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
            case InsertionMode.TEXT:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET:
                {
                    this._insertCharacters(token);
                    break;
                }
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_TEMPLATE:
            case InsertionMode.AFTER_BODY:
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET:
                {
                    whitespaceCharacterInBody(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
                {
                    characterInTable(this, token);
                    break;
                }
            case InsertionMode.IN_TABLE_TEXT:
                {
                    whitespaceCharacterInTableText(this, token);
                    break;
                }
            default:
        }
    }
}
//Adoption agency algorithm
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#adoptionAgency)
//------------------------------------------------------------------
//Steps 5-8 of the algorithm
function aaObtainFormattingElementEntry(p, token) {
    let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
    if (formattingElementEntry) {
        if (!p.openElements.contains(formattingElementEntry.element)) {
            p.activeFormattingElements.removeEntry(formattingElementEntry);
            formattingElementEntry = null;
        } else if (!p.openElements.hasInScope(token.tagID)) {
            formattingElementEntry = null;
        }
    } else {
        genericEndTagInBody(p, token);
    }
    return formattingElementEntry;
}
//Steps 9 and 10 of the algorithm
function aaObtainFurthestBlock(p, formattingElementEntry) {
    let furthestBlock = null;
    let idx = p.openElements.stackTop;
    for(; idx >= 0; idx--){
        const element = p.openElements.items[idx];
        if (element === formattingElementEntry.element) {
            break;
        }
        if (p._isSpecialElement(element, p.openElements.tagIDs[idx])) {
            furthestBlock = element;
        }
    }
    if (!furthestBlock) {
        p.openElements.shortenToLength(Math.max(idx, 0));
        p.activeFormattingElements.removeEntry(formattingElementEntry);
    }
    return furthestBlock;
}
//Step 13 of the algorithm
function aaInnerLoop(p, furthestBlock, formattingElement) {
    let lastElement = furthestBlock;
    let nextElement = p.openElements.getCommonAncestor(furthestBlock);
    for(let i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement){
        //NOTE: store the next element for the next loop iteration (it may be deleted from the stack by step 9.5)
        nextElement = p.openElements.getCommonAncestor(element);
        const elementEntry = p.activeFormattingElements.getElementEntry(element);
        const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
        const shouldRemoveFromOpenElements = !elementEntry || counterOverflow;
        if (shouldRemoveFromOpenElements) {
            if (counterOverflow) {
                p.activeFormattingElements.removeEntry(elementEntry);
            }
            p.openElements.remove(element);
        } else {
            element = aaRecreateElementFromEntry(p, elementEntry);
            if (lastElement === furthestBlock) {
                p.activeFormattingElements.bookmark = elementEntry;
            }
            p.treeAdapter.detachNode(lastElement);
            p.treeAdapter.appendChild(element, lastElement);
            lastElement = element;
        }
    }
    return lastElement;
}
//Step 13.7 of the algorithm
function aaRecreateElementFromEntry(p, elementEntry) {
    const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
    const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
    p.openElements.replace(elementEntry.element, newElement);
    elementEntry.element = newElement;
    return newElement;
}
//Step 14 of the algorithm
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
    const tn = p.treeAdapter.getTagName(commonAncestor);
    const tid = getTagID(tn);
    if (p._isElementCausesFosterParenting(tid)) {
        p._fosterParentElement(lastElement);
    } else {
        const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
        if (tid === TAG_ID.TEMPLATE && ns === NS.HTML) {
            commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
        }
        p.treeAdapter.appendChild(commonAncestor, lastElement);
    }
}
//Steps 15-19 of the algorithm
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
    const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
    const { token } = formattingElementEntry;
    const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
    p._adoptNodes(furthestBlock, newElement);
    p.treeAdapter.appendChild(furthestBlock, newElement);
    p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
    p.activeFormattingElements.removeEntry(formattingElementEntry);
    p.openElements.remove(formattingElementEntry.element);
    p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
}
//Algorithm entry point
function callAdoptionAgency(p, token) {
    for(let i = 0; i < AA_OUTER_LOOP_ITER; i++){
        const formattingElementEntry = aaObtainFormattingElementEntry(p, token);
        if (!formattingElementEntry) {
            break;
        }
        const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
        if (!furthestBlock) {
            break;
        }
        p.activeFormattingElements.bookmark = formattingElementEntry;
        const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
        const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
        p.treeAdapter.detachNode(lastElement);
        if (commonAncestor) aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
        aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
    }
}
//Generic token handlers
//------------------------------------------------------------------
function appendComment(p, token) {
    p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}
function appendCommentToRootHtmlElement(p, token) {
    p._appendCommentNode(token, p.openElements.items[0]);
}
function appendCommentToDocument(p, token) {
    p._appendCommentNode(token, p.document);
}
function stopParsing(p, token) {
    p.stopped = true;
    // NOTE: Set end locations for elements that remain on the open element stack.
    if (token.location) {
        // NOTE: If we are not in a fragment, `html` and `body` will stay on the stack.
        // This is a problem, as we might overwrite their end position here.
        const target = p.fragmentContext ? 0 : 2;
        for(let i = p.openElements.stackTop; i >= target; i--){
            p._setEndLocation(p.openElements.items[i], token);
        }
        // Handle `html` and `body`
        if (!p.fragmentContext && p.openElements.stackTop >= 0) {
            const htmlElement = p.openElements.items[0];
            const htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);
            if (htmlLocation && !htmlLocation.endTag) {
                p._setEndLocation(htmlElement, token);
                if (p.openElements.stackTop >= 1) {
                    const bodyElement = p.openElements.items[1];
                    const bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);
                    if (bodyLocation && !bodyLocation.endTag) {
                        p._setEndLocation(bodyElement, token);
                    }
                }
            }
        }
    }
}
// The "initial" insertion mode
//------------------------------------------------------------------
function doctypeInInitialMode(p, token) {
    p._setDocumentType(token);
    const mode = token.forceQuirks ? DOCUMENT_MODE.QUIRKS : getDocumentMode(token);
    if (!isConforming(token)) {
        p._err(token, ERR.nonConformingDoctype);
    }
    p.treeAdapter.setDocumentMode(p.document, mode);
    p.insertionMode = InsertionMode.BEFORE_HTML;
}
function tokenInInitialMode(p, token) {
    p._err(token, ERR.missingDoctype, true);
    p.treeAdapter.setDocumentMode(p.document, DOCUMENT_MODE.QUIRKS);
    p.insertionMode = InsertionMode.BEFORE_HTML;
    p._processToken(token);
}
// The "before html" insertion mode
//------------------------------------------------------------------
function startTagBeforeHtml(p, token) {
    if (token.tagID === TAG_ID.HTML) {
        p._insertElement(token, NS.HTML);
        p.insertionMode = InsertionMode.BEFORE_HEAD;
    } else {
        tokenBeforeHtml(p, token);
    }
}
function endTagBeforeHtml(p, token) {
    const tn = token.tagID;
    if (tn === TAG_ID.HTML || tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.BR) {
        tokenBeforeHtml(p, token);
    }
}
function tokenBeforeHtml(p, token) {
    p._insertFakeRootElement();
    p.insertionMode = InsertionMode.BEFORE_HEAD;
    p._processToken(token);
}
// The "before head" insertion mode
//------------------------------------------------------------------
function startTagBeforeHead(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.HEAD:
            {
                p._insertElement(token, NS.HTML);
                p.headElement = p.openElements.current;
                p.insertionMode = InsertionMode.IN_HEAD;
                break;
            }
        default:
            {
                tokenBeforeHead(p, token);
            }
    }
}
function endTagBeforeHead(p, token) {
    const tn = token.tagID;
    if (tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.HTML || tn === TAG_ID.BR) {
        tokenBeforeHead(p, token);
    } else {
        p._err(token, ERR.endTagWithoutMatchingOpenElement);
    }
}
function tokenBeforeHead(p, token) {
    p._insertFakeElement(TAG_NAMES.HEAD, TAG_ID.HEAD);
    p.headElement = p.openElements.current;
    p.insertionMode = InsertionMode.IN_HEAD;
    p._processToken(token);
}
// The "in head" insertion mode
//------------------------------------------------------------------
function startTagInHead(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.BASE:
        case TAG_ID.BASEFONT:
        case TAG_ID.BGSOUND:
        case TAG_ID.LINK:
        case TAG_ID.META:
            {
                p._appendElement(token, NS.HTML);
                token.ackSelfClosing = true;
                break;
            }
        case TAG_ID.TITLE:
            {
                p._switchToTextParsing(token, TokenizerMode.RCDATA);
                break;
            }
        case TAG_ID.NOSCRIPT:
            {
                if (p.options.scriptingEnabled) {
                    p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
                } else {
                    p._insertElement(token, NS.HTML);
                    p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
                }
                break;
            }
        case TAG_ID.NOFRAMES:
        case TAG_ID.STYLE:
            {
                p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
                break;
            }
        case TAG_ID.SCRIPT:
            {
                p._switchToTextParsing(token, TokenizerMode.SCRIPT_DATA);
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                p._insertTemplate(token);
                p.activeFormattingElements.insertMarker();
                p.framesetOk = false;
                p.insertionMode = InsertionMode.IN_TEMPLATE;
                p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
                break;
            }
        case TAG_ID.HEAD:
            {
                p._err(token, ERR.misplacedStartTagForHeadElement);
                break;
            }
        default:
            {
                tokenInHead(p, token);
            }
    }
}
function endTagInHead(p, token) {
    switch(token.tagID){
        case TAG_ID.HEAD:
            {
                p.openElements.pop();
                p.insertionMode = InsertionMode.AFTER_HEAD;
                break;
            }
        case TAG_ID.BODY:
        case TAG_ID.BR:
        case TAG_ID.HTML:
            {
                tokenInHead(p, token);
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                templateEndTagInHead(p, token);
                break;
            }
        default:
            {
                p._err(token, ERR.endTagWithoutMatchingOpenElement);
            }
    }
}
function templateEndTagInHead(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.generateImpliedEndTagsThoroughly();
        if (p.openElements.currentTagId !== TAG_ID.TEMPLATE) {
            p._err(token, ERR.closingOfElementWithOpenChildElements);
        }
        p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p.tmplInsertionModeStack.shift();
        p._resetInsertionMode();
    } else {
        p._err(token, ERR.endTagWithoutMatchingOpenElement);
    }
}
function tokenInHead(p, token) {
    p.openElements.pop();
    p.insertionMode = InsertionMode.AFTER_HEAD;
    p._processToken(token);
}
// The "in head no script" insertion mode
//------------------------------------------------------------------
function startTagInHeadNoScript(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.BASEFONT:
        case TAG_ID.BGSOUND:
        case TAG_ID.HEAD:
        case TAG_ID.LINK:
        case TAG_ID.META:
        case TAG_ID.NOFRAMES:
        case TAG_ID.STYLE:
            {
                startTagInHead(p, token);
                break;
            }
        case TAG_ID.NOSCRIPT:
            {
                p._err(token, ERR.nestedNoscriptInHead);
                break;
            }
        default:
            {
                tokenInHeadNoScript(p, token);
            }
    }
}
function endTagInHeadNoScript(p, token) {
    switch(token.tagID){
        case TAG_ID.NOSCRIPT:
            {
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_HEAD;
                break;
            }
        case TAG_ID.BR:
            {
                tokenInHeadNoScript(p, token);
                break;
            }
        default:
            {
                p._err(token, ERR.endTagWithoutMatchingOpenElement);
            }
    }
}
function tokenInHeadNoScript(p, token) {
    const errCode = token.type === TokenType.EOF ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
    p._err(token, errCode);
    p.openElements.pop();
    p.insertionMode = InsertionMode.IN_HEAD;
    p._processToken(token);
}
// The "after head" insertion mode
//------------------------------------------------------------------
function startTagAfterHead(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.BODY:
            {
                p._insertElement(token, NS.HTML);
                p.framesetOk = false;
                p.insertionMode = InsertionMode.IN_BODY;
                break;
            }
        case TAG_ID.FRAMESET:
            {
                p._insertElement(token, NS.HTML);
                p.insertionMode = InsertionMode.IN_FRAMESET;
                break;
            }
        case TAG_ID.BASE:
        case TAG_ID.BASEFONT:
        case TAG_ID.BGSOUND:
        case TAG_ID.LINK:
        case TAG_ID.META:
        case TAG_ID.NOFRAMES:
        case TAG_ID.SCRIPT:
        case TAG_ID.STYLE:
        case TAG_ID.TEMPLATE:
        case TAG_ID.TITLE:
            {
                p._err(token, ERR.abandonedHeadElementChild);
                p.openElements.push(p.headElement, TAG_ID.HEAD);
                startTagInHead(p, token);
                p.openElements.remove(p.headElement);
                break;
            }
        case TAG_ID.HEAD:
            {
                p._err(token, ERR.misplacedStartTagForHeadElement);
                break;
            }
        default:
            {
                tokenAfterHead(p, token);
            }
    }
}
function endTagAfterHead(p, token) {
    switch(token.tagID){
        case TAG_ID.BODY:
        case TAG_ID.HTML:
        case TAG_ID.BR:
            {
                tokenAfterHead(p, token);
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                templateEndTagInHead(p, token);
                break;
            }
        default:
            {
                p._err(token, ERR.endTagWithoutMatchingOpenElement);
            }
    }
}
function tokenAfterHead(p, token) {
    p._insertFakeElement(TAG_NAMES.BODY, TAG_ID.BODY);
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
// The "in body" insertion mode
//------------------------------------------------------------------
function modeInBody(p, token) {
    switch(token.type){
        case TokenType.CHARACTER:
            {
                characterInBody(p, token);
                break;
            }
        case TokenType.WHITESPACE_CHARACTER:
            {
                whitespaceCharacterInBody(p, token);
                break;
            }
        case TokenType.COMMENT:
            {
                appendComment(p, token);
                break;
            }
        case TokenType.START_TAG:
            {
                startTagInBody(p, token);
                break;
            }
        case TokenType.END_TAG:
            {
                endTagInBody(p, token);
                break;
            }
        case TokenType.EOF:
            {
                eofInBody(p, token);
                break;
            }
        default:
    }
}
function whitespaceCharacterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
}
function characterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
    p.framesetOk = false;
}
function htmlStartTagInBody(p, token) {
    if (p.openElements.tmplCount === 0) {
        p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
    }
}
function bodyStartTagInBody(p, token) {
    const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    if (bodyElement && p.openElements.tmplCount === 0) {
        p.framesetOk = false;
        p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
    }
}
function framesetStartTagInBody(p, token) {
    const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    if (p.framesetOk && bodyElement) {
        p.treeAdapter.detachNode(bodyElement);
        p.openElements.popAllUpToHtmlElement();
        p._insertElement(token, NS.HTML);
        p.insertionMode = InsertionMode.IN_FRAMESET;
    }
}
function addressStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    if (p.openElements.currentTagId !== undefined && NUMBERED_HEADERS.has(p.openElements.currentTagId)) {
        p.openElements.pop();
    }
    p._insertElement(token, NS.HTML);
}
function preStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
    //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
    //on to the next one. (Newlines at the start of pre blocks are ignored as an authoring convenience.)
    p.skipNextNewLine = true;
    p.framesetOk = false;
}
function formStartTagInBody(p, token) {
    const inTemplate = p.openElements.tmplCount > 0;
    if (!p.formElement || inTemplate) {
        if (p.openElements.hasInButtonScope(TAG_ID.P)) {
            p._closePElement();
        }
        p._insertElement(token, NS.HTML);
        if (!inTemplate) {
            p.formElement = p.openElements.current;
        }
    }
}
function listItemStartTagInBody(p, token) {
    p.framesetOk = false;
    const tn = token.tagID;
    for(let i = p.openElements.stackTop; i >= 0; i--){
        const elementId = p.openElements.tagIDs[i];
        if (tn === TAG_ID.LI && elementId === TAG_ID.LI || (tn === TAG_ID.DD || tn === TAG_ID.DT) && (elementId === TAG_ID.DD || elementId === TAG_ID.DT)) {
            p.openElements.generateImpliedEndTagsWithExclusion(elementId);
            p.openElements.popUntilTagNamePopped(elementId);
            break;
        }
        if (elementId !== TAG_ID.ADDRESS && elementId !== TAG_ID.DIV && elementId !== TAG_ID.P && p._isSpecialElement(p.openElements.items[i], elementId)) {
            break;
        }
    }
    if (p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
}
function plaintextStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
    p.tokenizer.state = TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
    if (p.openElements.hasInScope(TAG_ID.BUTTON)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(TAG_ID.BUTTON);
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
}
function aStartTagInBody(p, token) {
    const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(TAG_NAMES.A);
    if (activeElementEntry) {
        callAdoptionAgency(p, token);
        p.openElements.remove(activeElementEntry.element);
        p.activeFormattingElements.removeEntry(activeElementEntry);
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    if (p.openElements.hasInScope(TAG_ID.NOBR)) {
        callAdoptionAgency(p, token);
        p._reconstructActiveFormattingElements();
    }
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.insertMarker();
    p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
    if (p.treeAdapter.getDocumentMode(p.document) !== DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
    p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function isHiddenInput(token) {
    const inputType = getTokenAttr(token, ATTRS.TYPE);
    return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, NS.HTML);
    if (!isHiddenInput(token)) {
        p.framesetOk = false;
    }
    token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
    p._appendElement(token, NS.HTML);
    token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    p._appendElement(token, NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
    token.tagName = TAG_NAMES.IMG;
    token.tagID = TAG_ID.IMG;
    areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
    p._insertElement(token, NS.HTML);
    //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
    //on to the next one. (Newlines at the start of textarea elements are ignored as an authoring convenience.)
    p.skipNextNewLine = true;
    p.tokenizer.state = TokenizerMode.RCDATA;
    p.originalInsertionMode = p.insertionMode;
    p.framesetOk = false;
    p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._closePElement();
    }
    p._reconstructActiveFormattingElements();
    p.framesetOk = false;
    p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
    p.framesetOk = false;
    p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
//NOTE: here we assume that we always act as a user agent with enabled plugins/frames, so we parse
//<noembed>/<noframes> as rawtext.
function rawTextStartTagInBody(p, token) {
    p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
    p.insertionMode = p.insertionMode === InsertionMode.IN_TABLE || p.insertionMode === InsertionMode.IN_CAPTION || p.insertionMode === InsertionMode.IN_TABLE_BODY || p.insertionMode === InsertionMode.IN_ROW || p.insertionMode === InsertionMode.IN_CELL ? InsertionMode.IN_SELECT_IN_TABLE : InsertionMode.IN_SELECT;
}
function optgroupStartTagInBody(p, token) {
    if (p.openElements.currentTagId === TAG_ID.OPTION) {
        p.openElements.pop();
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
}
function rbStartTagInBody(p, token) {
    if (p.openElements.hasInScope(TAG_ID.RUBY)) {
        p.openElements.generateImpliedEndTags();
    }
    p._insertElement(token, NS.HTML);
}
function rtStartTagInBody(p, token) {
    if (p.openElements.hasInScope(TAG_ID.RUBY)) {
        p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.RTC);
    }
    p._insertElement(token, NS.HTML);
}
function mathStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    adjustTokenMathMLAttrs(token);
    adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p._appendElement(token, NS.MATHML);
    } else {
        p._insertElement(token, NS.MATHML);
    }
    token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    adjustTokenSVGAttrs(token);
    adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p._appendElement(token, NS.SVG);
    } else {
        p._insertElement(token, NS.SVG);
    }
    token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
}
function startTagInBody(p, token) {
    switch(token.tagID){
        case TAG_ID.I:
        case TAG_ID.S:
        case TAG_ID.B:
        case TAG_ID.U:
        case TAG_ID.EM:
        case TAG_ID.TT:
        case TAG_ID.BIG:
        case TAG_ID.CODE:
        case TAG_ID.FONT:
        case TAG_ID.SMALL:
        case TAG_ID.STRIKE:
        case TAG_ID.STRONG:
            {
                bStartTagInBody(p, token);
                break;
            }
        case TAG_ID.A:
            {
                aStartTagInBody(p, token);
                break;
            }
        case TAG_ID.H1:
        case TAG_ID.H2:
        case TAG_ID.H3:
        case TAG_ID.H4:
        case TAG_ID.H5:
        case TAG_ID.H6:
            {
                numberedHeaderStartTagInBody(p, token);
                break;
            }
        case TAG_ID.P:
        case TAG_ID.DL:
        case TAG_ID.OL:
        case TAG_ID.UL:
        case TAG_ID.DIV:
        case TAG_ID.DIR:
        case TAG_ID.NAV:
        case TAG_ID.MAIN:
        case TAG_ID.MENU:
        case TAG_ID.ASIDE:
        case TAG_ID.CENTER:
        case TAG_ID.FIGURE:
        case TAG_ID.FOOTER:
        case TAG_ID.HEADER:
        case TAG_ID.HGROUP:
        case TAG_ID.DIALOG:
        case TAG_ID.DETAILS:
        case TAG_ID.ADDRESS:
        case TAG_ID.ARTICLE:
        case TAG_ID.SEARCH:
        case TAG_ID.SECTION:
        case TAG_ID.SUMMARY:
        case TAG_ID.FIELDSET:
        case TAG_ID.BLOCKQUOTE:
        case TAG_ID.FIGCAPTION:
            {
                addressStartTagInBody(p, token);
                break;
            }
        case TAG_ID.LI:
        case TAG_ID.DD:
        case TAG_ID.DT:
            {
                listItemStartTagInBody(p, token);
                break;
            }
        case TAG_ID.BR:
        case TAG_ID.IMG:
        case TAG_ID.WBR:
        case TAG_ID.AREA:
        case TAG_ID.EMBED:
        case TAG_ID.KEYGEN:
            {
                areaStartTagInBody(p, token);
                break;
            }
        case TAG_ID.HR:
            {
                hrStartTagInBody(p, token);
                break;
            }
        case TAG_ID.RB:
        case TAG_ID.RTC:
            {
                rbStartTagInBody(p, token);
                break;
            }
        case TAG_ID.RT:
        case TAG_ID.RP:
            {
                rtStartTagInBody(p, token);
                break;
            }
        case TAG_ID.PRE:
        case TAG_ID.LISTING:
            {
                preStartTagInBody(p, token);
                break;
            }
        case TAG_ID.XMP:
            {
                xmpStartTagInBody(p, token);
                break;
            }
        case TAG_ID.SVG:
            {
                svgStartTagInBody(p, token);
                break;
            }
        case TAG_ID.HTML:
            {
                htmlStartTagInBody(p, token);
                break;
            }
        case TAG_ID.BASE:
        case TAG_ID.LINK:
        case TAG_ID.META:
        case TAG_ID.STYLE:
        case TAG_ID.TITLE:
        case TAG_ID.SCRIPT:
        case TAG_ID.BGSOUND:
        case TAG_ID.BASEFONT:
        case TAG_ID.TEMPLATE:
            {
                startTagInHead(p, token);
                break;
            }
        case TAG_ID.BODY:
            {
                bodyStartTagInBody(p, token);
                break;
            }
        case TAG_ID.FORM:
            {
                formStartTagInBody(p, token);
                break;
            }
        case TAG_ID.NOBR:
            {
                nobrStartTagInBody(p, token);
                break;
            }
        case TAG_ID.MATH:
            {
                mathStartTagInBody(p, token);
                break;
            }
        case TAG_ID.TABLE:
            {
                tableStartTagInBody(p, token);
                break;
            }
        case TAG_ID.INPUT:
            {
                inputStartTagInBody(p, token);
                break;
            }
        case TAG_ID.PARAM:
        case TAG_ID.TRACK:
        case TAG_ID.SOURCE:
            {
                paramStartTagInBody(p, token);
                break;
            }
        case TAG_ID.IMAGE:
            {
                imageStartTagInBody(p, token);
                break;
            }
        case TAG_ID.BUTTON:
            {
                buttonStartTagInBody(p, token);
                break;
            }
        case TAG_ID.APPLET:
        case TAG_ID.OBJECT:
        case TAG_ID.MARQUEE:
            {
                appletStartTagInBody(p, token);
                break;
            }
        case TAG_ID.IFRAME:
            {
                iframeStartTagInBody(p, token);
                break;
            }
        case TAG_ID.SELECT:
            {
                selectStartTagInBody(p, token);
                break;
            }
        case TAG_ID.OPTION:
        case TAG_ID.OPTGROUP:
            {
                optgroupStartTagInBody(p, token);
                break;
            }
        case TAG_ID.NOEMBED:
        case TAG_ID.NOFRAMES:
            {
                rawTextStartTagInBody(p, token);
                break;
            }
        case TAG_ID.FRAMESET:
            {
                framesetStartTagInBody(p, token);
                break;
            }
        case TAG_ID.TEXTAREA:
            {
                textareaStartTagInBody(p, token);
                break;
            }
        case TAG_ID.NOSCRIPT:
            {
                if (p.options.scriptingEnabled) {
                    rawTextStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
                break;
            }
        case TAG_ID.PLAINTEXT:
            {
                plaintextStartTagInBody(p, token);
                break;
            }
        case TAG_ID.COL:
        case TAG_ID.TH:
        case TAG_ID.TD:
        case TAG_ID.TR:
        case TAG_ID.HEAD:
        case TAG_ID.FRAME:
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
        case TAG_ID.CAPTION:
        case TAG_ID.COLGROUP:
            {
                break;
            }
        default:
            {
                genericStartTagInBody(p, token);
            }
    }
}
function bodyEndTagInBody(p, token) {
    if (p.openElements.hasInScope(TAG_ID.BODY)) {
        p.insertionMode = InsertionMode.AFTER_BODY;
        //NOTE: <body> is never popped from the stack, so we need to updated
        //the end location explicitly.
        if (p.options.sourceCodeLocationInfo) {
            const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
            if (bodyElement) {
                p._setEndLocation(bodyElement, token);
            }
        }
    }
}
function htmlEndTagInBody(p, token) {
    if (p.openElements.hasInScope(TAG_ID.BODY)) {
        p.insertionMode = InsertionMode.AFTER_BODY;
        endTagAfterBody(p, token);
    }
}
function addressEndTagInBody(p, token) {
    const tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
    }
}
function formEndTagInBody(p) {
    const inTemplate = p.openElements.tmplCount > 0;
    const { formElement } = p;
    if (!inTemplate) {
        p.formElement = null;
    }
    if ((formElement || inTemplate) && p.openElements.hasInScope(TAG_ID.FORM)) {
        p.openElements.generateImpliedEndTags();
        if (inTemplate) {
            p.openElements.popUntilTagNamePopped(TAG_ID.FORM);
        } else if (formElement) {
            p.openElements.remove(formElement);
        }
    }
}
function pEndTagInBody(p) {
    if (!p.openElements.hasInButtonScope(TAG_ID.P)) {
        p._insertFakeElement(TAG_NAMES.P, TAG_ID.P);
    }
    p._closePElement();
}
function liEndTagInBody(p) {
    if (p.openElements.hasInListItemScope(TAG_ID.LI)) {
        p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.LI);
        p.openElements.popUntilTagNamePopped(TAG_ID.LI);
    }
}
function ddEndTagInBody(p, token) {
    const tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTagsWithExclusion(tn);
        p.openElements.popUntilTagNamePopped(tn);
    }
}
function numberedHeaderEndTagInBody(p) {
    if (p.openElements.hasNumberedHeaderInScope()) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilNumberedHeaderPopped();
    }
}
function appletEndTagInBody(p, token) {
    const tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
        p.activeFormattingElements.clearToLastMarker();
    }
}
function brEndTagInBody(p) {
    p._reconstructActiveFormattingElements();
    p._insertFakeElement(TAG_NAMES.BR, TAG_ID.BR);
    p.openElements.pop();
    p.framesetOk = false;
}
function genericEndTagInBody(p, token) {
    const tn = token.tagName;
    const tid = token.tagID;
    for(let i = p.openElements.stackTop; i > 0; i--){
        const element = p.openElements.items[i];
        const elementId = p.openElements.tagIDs[i];
        // Compare the tag name here, as the tag might not be a known tag with an ID.
        if (tid === elementId && (tid !== TAG_ID.UNKNOWN || p.treeAdapter.getTagName(element) === tn)) {
            p.openElements.generateImpliedEndTagsWithExclusion(tid);
            if (p.openElements.stackTop >= i) p.openElements.shortenToLength(i);
            break;
        }
        if (p._isSpecialElement(element, elementId)) {
            break;
        }
    }
}
function endTagInBody(p, token) {
    switch(token.tagID){
        case TAG_ID.A:
        case TAG_ID.B:
        case TAG_ID.I:
        case TAG_ID.S:
        case TAG_ID.U:
        case TAG_ID.EM:
        case TAG_ID.TT:
        case TAG_ID.BIG:
        case TAG_ID.CODE:
        case TAG_ID.FONT:
        case TAG_ID.NOBR:
        case TAG_ID.SMALL:
        case TAG_ID.STRIKE:
        case TAG_ID.STRONG:
            {
                callAdoptionAgency(p, token);
                break;
            }
        case TAG_ID.P:
            {
                pEndTagInBody(p);
                break;
            }
        case TAG_ID.DL:
        case TAG_ID.UL:
        case TAG_ID.OL:
        case TAG_ID.DIR:
        case TAG_ID.DIV:
        case TAG_ID.NAV:
        case TAG_ID.PRE:
        case TAG_ID.MAIN:
        case TAG_ID.MENU:
        case TAG_ID.ASIDE:
        case TAG_ID.BUTTON:
        case TAG_ID.CENTER:
        case TAG_ID.FIGURE:
        case TAG_ID.FOOTER:
        case TAG_ID.HEADER:
        case TAG_ID.HGROUP:
        case TAG_ID.DIALOG:
        case TAG_ID.ADDRESS:
        case TAG_ID.ARTICLE:
        case TAG_ID.DETAILS:
        case TAG_ID.SEARCH:
        case TAG_ID.SECTION:
        case TAG_ID.SUMMARY:
        case TAG_ID.LISTING:
        case TAG_ID.FIELDSET:
        case TAG_ID.BLOCKQUOTE:
        case TAG_ID.FIGCAPTION:
            {
                addressEndTagInBody(p, token);
                break;
            }
        case TAG_ID.LI:
            {
                liEndTagInBody(p);
                break;
            }
        case TAG_ID.DD:
        case TAG_ID.DT:
            {
                ddEndTagInBody(p, token);
                break;
            }
        case TAG_ID.H1:
        case TAG_ID.H2:
        case TAG_ID.H3:
        case TAG_ID.H4:
        case TAG_ID.H5:
        case TAG_ID.H6:
            {
                numberedHeaderEndTagInBody(p);
                break;
            }
        case TAG_ID.BR:
            {
                brEndTagInBody(p);
                break;
            }
        case TAG_ID.BODY:
            {
                bodyEndTagInBody(p, token);
                break;
            }
        case TAG_ID.HTML:
            {
                htmlEndTagInBody(p, token);
                break;
            }
        case TAG_ID.FORM:
            {
                formEndTagInBody(p);
                break;
            }
        case TAG_ID.APPLET:
        case TAG_ID.OBJECT:
        case TAG_ID.MARQUEE:
            {
                appletEndTagInBody(p, token);
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                templateEndTagInHead(p, token);
                break;
            }
        default:
            {
                genericEndTagInBody(p, token);
            }
    }
}
function eofInBody(p, token) {
    if (p.tmplInsertionModeStack.length > 0) {
        eofInTemplate(p, token);
    } else {
        stopParsing(p, token);
    }
}
// The "text" insertion mode
//------------------------------------------------------------------
function endTagInText(p, token) {
    var _a;
    if (token.tagID === TAG_ID.SCRIPT) {
        (_a = p.scriptHandler) === null || _a === void 0 ? void 0 : _a.call(p, p.openElements.current);
    }
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
}
function eofInText(p, token) {
    p._err(token, ERR.eofInElementThatCanContainOnlyText);
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
    p.onEof(token);
}
// The "in table" insertion mode
//------------------------------------------------------------------
function characterInTable(p, token) {
    if (p.openElements.currentTagId !== undefined && TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
        p.pendingCharacterTokens.length = 0;
        p.hasNonWhitespacePendingCharacterToken = false;
        p.originalInsertionMode = p.insertionMode;
        p.insertionMode = InsertionMode.IN_TABLE_TEXT;
        switch(token.type){
            case TokenType.CHARACTER:
                {
                    characterInTableText(p, token);
                    break;
                }
            case TokenType.WHITESPACE_CHARACTER:
                {
                    whitespaceCharacterInTableText(p, token);
                    break;
                }
        }
    } else {
        tokenInTable(p, token);
    }
}
function captionStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.activeFormattingElements.insertMarker();
    p._insertElement(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement(TAG_NAMES.COLGROUP, TAG_ID.COLGROUP);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
    startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement(TAG_NAMES.TBODY, TAG_ID.TBODY);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
    startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
    if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
        p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
        p._resetInsertionMode();
        p._processStartTag(token);
    }
}
function inputStartTagInTable(p, token) {
    if (isHiddenInput(token)) {
        p._appendElement(token, NS.HTML);
    } else {
        tokenInTable(p, token);
    }
    token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
    if (!p.formElement && p.openElements.tmplCount === 0) {
        p._insertElement(token, NS.HTML);
        p.formElement = p.openElements.current;
        p.openElements.pop();
    }
}
function startTagInTable(p, token) {
    switch(token.tagID){
        case TAG_ID.TD:
        case TAG_ID.TH:
        case TAG_ID.TR:
            {
                tdStartTagInTable(p, token);
                break;
            }
        case TAG_ID.STYLE:
        case TAG_ID.SCRIPT:
        case TAG_ID.TEMPLATE:
            {
                startTagInHead(p, token);
                break;
            }
        case TAG_ID.COL:
            {
                colStartTagInTable(p, token);
                break;
            }
        case TAG_ID.FORM:
            {
                formStartTagInTable(p, token);
                break;
            }
        case TAG_ID.TABLE:
            {
                tableStartTagInTable(p, token);
                break;
            }
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
            {
                tbodyStartTagInTable(p, token);
                break;
            }
        case TAG_ID.INPUT:
            {
                inputStartTagInTable(p, token);
                break;
            }
        case TAG_ID.CAPTION:
            {
                captionStartTagInTable(p, token);
                break;
            }
        case TAG_ID.COLGROUP:
            {
                colgroupStartTagInTable(p, token);
                break;
            }
        default:
            {
                tokenInTable(p, token);
            }
    }
}
function endTagInTable(p, token) {
    switch(token.tagID){
        case TAG_ID.TABLE:
            {
                if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
                    p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
                    p._resetInsertionMode();
                }
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                templateEndTagInHead(p, token);
                break;
            }
        case TAG_ID.BODY:
        case TAG_ID.CAPTION:
        case TAG_ID.COL:
        case TAG_ID.COLGROUP:
        case TAG_ID.HTML:
        case TAG_ID.TBODY:
        case TAG_ID.TD:
        case TAG_ID.TFOOT:
        case TAG_ID.TH:
        case TAG_ID.THEAD:
        case TAG_ID.TR:
            {
                break;
            }
        default:
            {
                tokenInTable(p, token);
            }
    }
}
function tokenInTable(p, token) {
    const savedFosterParentingState = p.fosterParentingEnabled;
    p.fosterParentingEnabled = true;
    // Process token in `In Body` mode
    modeInBody(p, token);
    p.fosterParentingEnabled = savedFosterParentingState;
}
// The "in table text" insertion mode
//------------------------------------------------------------------
function whitespaceCharacterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
    p.hasNonWhitespacePendingCharacterToken = true;
}
function tokenInTableText(p, token) {
    let i = 0;
    if (p.hasNonWhitespacePendingCharacterToken) {
        for(; i < p.pendingCharacterTokens.length; i++){
            tokenInTable(p, p.pendingCharacterTokens[i]);
        }
    } else {
        for(; i < p.pendingCharacterTokens.length; i++){
            p._insertCharacters(p.pendingCharacterTokens[i]);
        }
    }
    p.insertionMode = p.originalInsertionMode;
    p._processToken(token);
}
// The "in caption" insertion mode
//------------------------------------------------------------------
const TABLE_VOID_ELEMENTS = new Set([
    TAG_ID.CAPTION,
    TAG_ID.COL,
    TAG_ID.COLGROUP,
    TAG_ID.TBODY,
    TAG_ID.TD,
    TAG_ID.TFOOT,
    TAG_ID.TH,
    TAG_ID.THEAD,
    TAG_ID.TR
]);
function startTagInCaption(p, token) {
    const tn = token.tagID;
    if (TABLE_VOID_ELEMENTS.has(tn)) {
        if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
            p.activeFormattingElements.clearToLastMarker();
            p.insertionMode = InsertionMode.IN_TABLE;
            startTagInTable(p, token);
        }
    } else {
        startTagInBody(p, token);
    }
}
function endTagInCaption(p, token) {
    const tn = token.tagID;
    switch(tn){
        case TAG_ID.CAPTION:
        case TAG_ID.TABLE:
            {
                if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
                    p.openElements.generateImpliedEndTags();
                    p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
                    p.activeFormattingElements.clearToLastMarker();
                    p.insertionMode = InsertionMode.IN_TABLE;
                    if (tn === TAG_ID.TABLE) {
                        endTagInTable(p, token);
                    }
                }
                break;
            }
        case TAG_ID.BODY:
        case TAG_ID.COL:
        case TAG_ID.COLGROUP:
        case TAG_ID.HTML:
        case TAG_ID.TBODY:
        case TAG_ID.TD:
        case TAG_ID.TFOOT:
        case TAG_ID.TH:
        case TAG_ID.THEAD:
        case TAG_ID.TR:
            {
                break;
            }
        default:
            {
                endTagInBody(p, token);
            }
    }
}
// The "in column group" insertion mode
//------------------------------------------------------------------
function startTagInColumnGroup(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.COL:
            {
                p._appendElement(token, NS.HTML);
                token.ackSelfClosing = true;
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                startTagInHead(p, token);
                break;
            }
        default:
            {
                tokenInColumnGroup(p, token);
            }
    }
}
function endTagInColumnGroup(p, token) {
    switch(token.tagID){
        case TAG_ID.COLGROUP:
            {
                if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE;
                }
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                templateEndTagInHead(p, token);
                break;
            }
        case TAG_ID.COL:
            {
                break;
            }
        default:
            {
                tokenInColumnGroup(p, token);
            }
    }
}
function tokenInColumnGroup(p, token) {
    if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
        p.openElements.pop();
        p.insertionMode = InsertionMode.IN_TABLE;
        p._processToken(token);
    }
}
// The "in table body" insertion mode
//------------------------------------------------------------------
function startTagInTableBody(p, token) {
    switch(token.tagID){
        case TAG_ID.TR:
            {
                p.openElements.clearBackToTableBodyContext();
                p._insertElement(token, NS.HTML);
                p.insertionMode = InsertionMode.IN_ROW;
                break;
            }
        case TAG_ID.TH:
        case TAG_ID.TD:
            {
                p.openElements.clearBackToTableBodyContext();
                p._insertFakeElement(TAG_NAMES.TR, TAG_ID.TR);
                p.insertionMode = InsertionMode.IN_ROW;
                startTagInRow(p, token);
                break;
            }
        case TAG_ID.CAPTION:
        case TAG_ID.COL:
        case TAG_ID.COLGROUP:
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
            {
                if (p.openElements.hasTableBodyContextInTableScope()) {
                    p.openElements.clearBackToTableBodyContext();
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE;
                    startTagInTable(p, token);
                }
                break;
            }
        default:
            {
                startTagInTable(p, token);
            }
    }
}
function endTagInTableBody(p, token) {
    const tn = token.tagID;
    switch(token.tagID){
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
            {
                if (p.openElements.hasInTableScope(tn)) {
                    p.openElements.clearBackToTableBodyContext();
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE;
                }
                break;
            }
        case TAG_ID.TABLE:
            {
                if (p.openElements.hasTableBodyContextInTableScope()) {
                    p.openElements.clearBackToTableBodyContext();
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE;
                    endTagInTable(p, token);
                }
                break;
            }
        case TAG_ID.BODY:
        case TAG_ID.CAPTION:
        case TAG_ID.COL:
        case TAG_ID.COLGROUP:
        case TAG_ID.HTML:
        case TAG_ID.TD:
        case TAG_ID.TH:
        case TAG_ID.TR:
            {
                break;
            }
        default:
            {
                endTagInTable(p, token);
            }
    }
}
// The "in row" insertion mode
//------------------------------------------------------------------
function startTagInRow(p, token) {
    switch(token.tagID){
        case TAG_ID.TH:
        case TAG_ID.TD:
            {
                p.openElements.clearBackToTableRowContext();
                p._insertElement(token, NS.HTML);
                p.insertionMode = InsertionMode.IN_CELL;
                p.activeFormattingElements.insertMarker();
                break;
            }
        case TAG_ID.CAPTION:
        case TAG_ID.COL:
        case TAG_ID.COLGROUP:
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
        case TAG_ID.TR:
            {
                if (p.openElements.hasInTableScope(TAG_ID.TR)) {
                    p.openElements.clearBackToTableRowContext();
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE_BODY;
                    startTagInTableBody(p, token);
                }
                break;
            }
        default:
            {
                startTagInTable(p, token);
            }
    }
}
function endTagInRow(p, token) {
    switch(token.tagID){
        case TAG_ID.TR:
            {
                if (p.openElements.hasInTableScope(TAG_ID.TR)) {
                    p.openElements.clearBackToTableRowContext();
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE_BODY;
                }
                break;
            }
        case TAG_ID.TABLE:
            {
                if (p.openElements.hasInTableScope(TAG_ID.TR)) {
                    p.openElements.clearBackToTableRowContext();
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE_BODY;
                    endTagInTableBody(p, token);
                }
                break;
            }
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
            {
                if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope(TAG_ID.TR)) {
                    p.openElements.clearBackToTableRowContext();
                    p.openElements.pop();
                    p.insertionMode = InsertionMode.IN_TABLE_BODY;
                    endTagInTableBody(p, token);
                }
                break;
            }
        case TAG_ID.BODY:
        case TAG_ID.CAPTION:
        case TAG_ID.COL:
        case TAG_ID.COLGROUP:
        case TAG_ID.HTML:
        case TAG_ID.TD:
        case TAG_ID.TH:
            {
                break;
            }
        default:
            {
                endTagInTable(p, token);
            }
    }
}
// The "in cell" insertion mode
//------------------------------------------------------------------
function startTagInCell(p, token) {
    const tn = token.tagID;
    if (TABLE_VOID_ELEMENTS.has(tn)) {
        if (p.openElements.hasInTableScope(TAG_ID.TD) || p.openElements.hasInTableScope(TAG_ID.TH)) {
            p._closeTableCell();
            startTagInRow(p, token);
        }
    } else {
        startTagInBody(p, token);
    }
}
function endTagInCell(p, token) {
    const tn = token.tagID;
    switch(tn){
        case TAG_ID.TD:
        case TAG_ID.TH:
            {
                if (p.openElements.hasInTableScope(tn)) {
                    p.openElements.generateImpliedEndTags();
                    p.openElements.popUntilTagNamePopped(tn);
                    p.activeFormattingElements.clearToLastMarker();
                    p.insertionMode = InsertionMode.IN_ROW;
                }
                break;
            }
        case TAG_ID.TABLE:
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
        case TAG_ID.TR:
            {
                if (p.openElements.hasInTableScope(tn)) {
                    p._closeTableCell();
                    endTagInRow(p, token);
                }
                break;
            }
        case TAG_ID.BODY:
        case TAG_ID.CAPTION:
        case TAG_ID.COL:
        case TAG_ID.COLGROUP:
        case TAG_ID.HTML:
            {
                break;
            }
        default:
            {
                endTagInBody(p, token);
            }
    }
}
// The "in select" insertion mode
//------------------------------------------------------------------
function startTagInSelect(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.OPTION:
            {
                if (p.openElements.currentTagId === TAG_ID.OPTION) {
                    p.openElements.pop();
                }
                p._insertElement(token, NS.HTML);
                break;
            }
        case TAG_ID.OPTGROUP:
            {
                if (p.openElements.currentTagId === TAG_ID.OPTION) {
                    p.openElements.pop();
                }
                if (p.openElements.currentTagId === TAG_ID.OPTGROUP) {
                    p.openElements.pop();
                }
                p._insertElement(token, NS.HTML);
                break;
            }
        case TAG_ID.HR:
            {
                if (p.openElements.currentTagId === TAG_ID.OPTION) {
                    p.openElements.pop();
                }
                if (p.openElements.currentTagId === TAG_ID.OPTGROUP) {
                    p.openElements.pop();
                }
                p._appendElement(token, NS.HTML);
                token.ackSelfClosing = true;
                break;
            }
        case TAG_ID.INPUT:
        case TAG_ID.KEYGEN:
        case TAG_ID.TEXTAREA:
        case TAG_ID.SELECT:
            {
                if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
                    p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
                    p._resetInsertionMode();
                    if (token.tagID !== TAG_ID.SELECT) {
                        p._processStartTag(token);
                    }
                }
                break;
            }
        case TAG_ID.SCRIPT:
        case TAG_ID.TEMPLATE:
            {
                startTagInHead(p, token);
                break;
            }
        default:
    }
}
function endTagInSelect(p, token) {
    switch(token.tagID){
        case TAG_ID.OPTGROUP:
            {
                if (p.openElements.stackTop > 0 && p.openElements.currentTagId === TAG_ID.OPTION && p.openElements.tagIDs[p.openElements.stackTop - 1] === TAG_ID.OPTGROUP) {
                    p.openElements.pop();
                }
                if (p.openElements.currentTagId === TAG_ID.OPTGROUP) {
                    p.openElements.pop();
                }
                break;
            }
        case TAG_ID.OPTION:
            {
                if (p.openElements.currentTagId === TAG_ID.OPTION) {
                    p.openElements.pop();
                }
                break;
            }
        case TAG_ID.SELECT:
            {
                if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
                    p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
                    p._resetInsertionMode();
                }
                break;
            }
        case TAG_ID.TEMPLATE:
            {
                templateEndTagInHead(p, token);
                break;
            }
        default:
    }
}
// The "in select in table" insertion mode
//------------------------------------------------------------------
function startTagInSelectInTable(p, token) {
    const tn = token.tagID;
    if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
        p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
        p._resetInsertionMode();
        p._processStartTag(token);
    } else {
        startTagInSelect(p, token);
    }
}
function endTagInSelectInTable(p, token) {
    const tn = token.tagID;
    if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
        if (p.openElements.hasInTableScope(tn)) {
            p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
            p._resetInsertionMode();
            p.onEndTag(token);
        }
    } else {
        endTagInSelect(p, token);
    }
}
// The "in template" insertion mode
//------------------------------------------------------------------
function startTagInTemplate(p, token) {
    switch(token.tagID){
        // First, handle tags that can start without a mode change
        case TAG_ID.BASE:
        case TAG_ID.BASEFONT:
        case TAG_ID.BGSOUND:
        case TAG_ID.LINK:
        case TAG_ID.META:
        case TAG_ID.NOFRAMES:
        case TAG_ID.SCRIPT:
        case TAG_ID.STYLE:
        case TAG_ID.TEMPLATE:
        case TAG_ID.TITLE:
            {
                startTagInHead(p, token);
                break;
            }
        // Re-process the token in the appropriate mode
        case TAG_ID.CAPTION:
        case TAG_ID.COLGROUP:
        case TAG_ID.TBODY:
        case TAG_ID.TFOOT:
        case TAG_ID.THEAD:
            {
                p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
                p.insertionMode = InsertionMode.IN_TABLE;
                startTagInTable(p, token);
                break;
            }
        case TAG_ID.COL:
            {
                p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
                p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
                startTagInColumnGroup(p, token);
                break;
            }
        case TAG_ID.TR:
            {
                p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
                startTagInTableBody(p, token);
                break;
            }
        case TAG_ID.TD:
        case TAG_ID.TH:
            {
                p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
                p.insertionMode = InsertionMode.IN_ROW;
                startTagInRow(p, token);
                break;
            }
        default:
            {
                p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
                p.insertionMode = InsertionMode.IN_BODY;
                startTagInBody(p, token);
            }
    }
}
function endTagInTemplate(p, token) {
    if (token.tagID === TAG_ID.TEMPLATE) {
        templateEndTagInHead(p, token);
    }
}
function eofInTemplate(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p.tmplInsertionModeStack.shift();
        p._resetInsertionMode();
        p.onEof(token);
    } else {
        stopParsing(p, token);
    }
}
// The "after body" insertion mode
//------------------------------------------------------------------
function startTagAfterBody(p, token) {
    if (token.tagID === TAG_ID.HTML) {
        startTagInBody(p, token);
    } else {
        tokenAfterBody(p, token);
    }
}
function endTagAfterBody(p, token) {
    var _a;
    if (token.tagID === TAG_ID.HTML) {
        if (!p.fragmentContext) {
            p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
        }
        //NOTE: <html> is never popped from the stack, so we need to updated
        //the end location explicitly.
        if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === TAG_ID.HTML) {
            p._setEndLocation(p.openElements.items[0], token);
            // Update the body element, if it doesn't have an end tag
            const bodyElement = p.openElements.items[1];
            if (bodyElement && !((_a = p.treeAdapter.getNodeSourceCodeLocation(bodyElement)) === null || _a === void 0 ? void 0 : _a.endTag)) {
                p._setEndLocation(bodyElement, token);
            }
        }
    } else {
        tokenAfterBody(p, token);
    }
}
function tokenAfterBody(p, token) {
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
// The "in frameset" insertion mode
//------------------------------------------------------------------
function startTagInFrameset(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.FRAMESET:
            {
                p._insertElement(token, NS.HTML);
                break;
            }
        case TAG_ID.FRAME:
            {
                p._appendElement(token, NS.HTML);
                token.ackSelfClosing = true;
                break;
            }
        case TAG_ID.NOFRAMES:
            {
                startTagInHead(p, token);
                break;
            }
        default:
    }
}
function endTagInFrameset(p, token) {
    if (token.tagID === TAG_ID.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
        p.openElements.pop();
        if (!p.fragmentContext && p.openElements.currentTagId !== TAG_ID.FRAMESET) {
            p.insertionMode = InsertionMode.AFTER_FRAMESET;
        }
    }
}
// The "after frameset" insertion mode
//------------------------------------------------------------------
function startTagAfterFrameset(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.NOFRAMES:
            {
                startTagInHead(p, token);
                break;
            }
        default:
    }
}
function endTagAfterFrameset(p, token) {
    if (token.tagID === TAG_ID.HTML) {
        p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
    }
}
// The "after after body" insertion mode
//------------------------------------------------------------------
function startTagAfterAfterBody(p, token) {
    if (token.tagID === TAG_ID.HTML) {
        startTagInBody(p, token);
    } else {
        tokenAfterAfterBody(p, token);
    }
}
function tokenAfterAfterBody(p, token) {
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
// The "after after frameset" insertion mode
//------------------------------------------------------------------
function startTagAfterAfterFrameset(p, token) {
    switch(token.tagID){
        case TAG_ID.HTML:
            {
                startTagInBody(p, token);
                break;
            }
        case TAG_ID.NOFRAMES:
            {
                startTagInHead(p, token);
                break;
            }
        default:
    }
}
// The rules for parsing tokens in foreign content
//------------------------------------------------------------------
function nullCharacterInForeignContent(p, token) {
    token.chars = REPLACEMENT_CHARACTER;
    p._insertCharacters(token);
}
function characterInForeignContent(p, token) {
    p._insertCharacters(token);
    p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
    while(p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML && p.openElements.currentTagId !== undefined && !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)){
        p.openElements.pop();
    }
}
function startTagInForeignContent(p, token) {
    if (causesExit(token)) {
        popUntilHtmlOrIntegrationPoint(p);
        p._startTagOutsideForeignContent(token);
    } else {
        const current = p._getAdjustedCurrentElement();
        const currentNs = p.treeAdapter.getNamespaceURI(current);
        if (currentNs === NS.MATHML) {
            adjustTokenMathMLAttrs(token);
        } else if (currentNs === NS.SVG) {
            adjustTokenSVGTagName(token);
            adjustTokenSVGAttrs(token);
        }
        adjustTokenXMLAttrs(token);
        if (token.selfClosing) {
            p._appendElement(token, currentNs);
        } else {
            p._insertElement(token, currentNs);
        }
        token.ackSelfClosing = true;
    }
}
function endTagInForeignContent(p, token) {
    if (token.tagID === TAG_ID.P || token.tagID === TAG_ID.BR) {
        popUntilHtmlOrIntegrationPoint(p);
        p._endTagOutsideForeignContent(token);
        return;
    }
    for(let i = p.openElements.stackTop; i > 0; i--){
        const element = p.openElements.items[i];
        if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
            p._endTagOutsideForeignContent(token);
            break;
        }
        const tagName = p.treeAdapter.getTagName(element);
        if (tagName.toLowerCase() === token.tagName) {
            //NOTE: update the token tag name for `_setEndLocation`.
            token.tagName = tagName;
            p.openElements.shortenToLength(i);
            break;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/parse5/node_modules/entities/dist/esm/escape.js
const esm_escape_xmlReplacer = /["$&'<>\u0080-\uFFFF]/g;
const escape_xmlCodeMap = new Map([
    [
        34,
        "&quot;"
    ],
    [
        38,
        "&amp;"
    ],
    [
        39,
        "&apos;"
    ],
    [
        60,
        "&lt;"
    ],
    [
        62,
        "&gt;"
    ]
]);
// For compatibility with node < 4, we wrap `codePointAt`
const esm_escape_getCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt == null ? (c, index)=>(c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index) : (input, index)=>input.codePointAt(index);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */ function esm_escape_encodeXML(input) {
    let returnValue = "";
    let lastIndex = 0;
    let match;
    while((match = esm_escape_xmlReplacer.exec(input)) !== null){
        const { index } = match;
        const char = input.charCodeAt(index);
        const next = escape_xmlCodeMap.get(char);
        if (next === undefined) {
            returnValue += `${input.substring(lastIndex, index)}&#x${esm_escape_getCodePoint(input, index).toString(16)};`;
            // Increase by 1 if we have a surrogate pair
            lastIndex = esm_escape_xmlReplacer.lastIndex += Number((char & 64512) === 55296);
        } else {
            returnValue += input.substring(lastIndex, index) + next;
            lastIndex = index + 1;
        }
    }
    return returnValue + input.substr(lastIndex);
}
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */ const esm_escape_escape = (/* unused pure expression or super */ null && (esm_escape_encodeXML));
/**
 * Creates a function that escapes all characters matched by the given regular
 * expression using the given map of characters to escape to their entities.
 *
 * @param regex Regular expression to match characters to escape.
 * @param map Map of characters to escape to their entities.
 *
 * @returns Function that escapes all characters matched by the given regular
 * expression using the given map of characters to escape to their entities.
 */ function escape_getEscaper(regex, map) {
    return function escape(data) {
        let match;
        let lastIndex = 0;
        let result = "";
        while(match = regex.exec(data)){
            if (lastIndex !== match.index) {
                result += data.substring(lastIndex, match.index);
            }
            // We know that this character will be in the map.
            result += map.get(match[0].charCodeAt(0));
            // Every match will be of length 1
            lastIndex = match.index + 1;
        }
        return result + data.substring(lastIndex);
    };
}
/**
 * Encodes all characters not valid in XML documents using XML entities.
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */ const esm_escape_escapeUTF8 = /* #__PURE__ */ (/* unused pure expression or super */ null && (escape_getEscaper(/["&'<>]/g, escape_xmlCodeMap)));
/**
 * Encodes all characters that have to be escaped in HTML attributes,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */ const esm_escape_escapeAttribute = /* #__PURE__ */ escape_getEscaper(/["&\u00A0]/g, new Map([
    [
        34,
        "&quot;"
    ],
    [
        38,
        "&amp;"
    ],
    [
        160,
        "&nbsp;"
    ]
]));
/**
 * Encodes all characters that have to be escaped in HTML text,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */ const esm_escape_escapeText = /* #__PURE__ */ escape_getEscaper(/[&<>\u00A0]/g, new Map([
    [
        38,
        "&amp;"
    ],
    [
        60,
        "&lt;"
    ],
    [
        62,
        "&gt;"
    ],
    [
        160,
        "&nbsp;"
    ]
])); //# sourceMappingURL=escape.js.map

;// CONCATENATED MODULE: ./node_modules/parse5/dist/serializer/index.js



// Sets
const VOID_ELEMENTS = new Set([
    TAG_NAMES.AREA,
    TAG_NAMES.BASE,
    TAG_NAMES.BASEFONT,
    TAG_NAMES.BGSOUND,
    TAG_NAMES.BR,
    TAG_NAMES.COL,
    TAG_NAMES.EMBED,
    TAG_NAMES.FRAME,
    TAG_NAMES.HR,
    TAG_NAMES.IMG,
    TAG_NAMES.INPUT,
    TAG_NAMES.KEYGEN,
    TAG_NAMES.LINK,
    TAG_NAMES.META,
    TAG_NAMES.PARAM,
    TAG_NAMES.SOURCE,
    TAG_NAMES.TRACK,
    TAG_NAMES.WBR
]);
function isVoidElement(node, options) {
    return options.treeAdapter.isElementNode(node) && options.treeAdapter.getNamespaceURI(node) === NS.HTML && VOID_ELEMENTS.has(options.treeAdapter.getTagName(node));
}
const serializer_defaultOpts = {
    treeAdapter: defaultTreeAdapter,
    scriptingEnabled: true
};
/**
 * Serializes an AST node to an HTML string.
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
 *
 * // Serializes a document.
 * const html = parse5.serialize(document);
 *
 * // Serializes the <html> element content.
 * const str = parse5.serialize(document.childNodes[1]);
 *
 * console.log(str); //> '<head></head><body>Hi there!</body>'
 * ```
 *
 * @param node Node to serialize.
 * @param options Serialization options.
 */ function serializer_serialize(node, options) {
    const opts = {
        ...serializer_defaultOpts,
        ...options
    };
    if (isVoidElement(node, opts)) {
        return "";
    }
    return serializeChildNodes(node, opts);
}
/**
 * Serializes an AST element node to an HTML string, including the element node.
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parseFragment('<div>Hello, <b>world</b>!</div>');
 *
 * // Serializes the <div> element.
 * const str = parse5.serializeOuter(document.childNodes[0]);
 *
 * console.log(str); //> '<div>Hello, <b>world</b>!</div>'
 * ```
 *
 * @param node Node to serialize.
 * @param options Serialization options.
 */ function serializeOuter(node, options) {
    const opts = {
        ...serializer_defaultOpts,
        ...options
    };
    return serializeNode(node, opts);
}
function serializeChildNodes(parentNode, options) {
    let html = "";
    // Get container of the child nodes
    const container = options.treeAdapter.isElementNode(parentNode) && options.treeAdapter.getTagName(parentNode) === TAG_NAMES.TEMPLATE && options.treeAdapter.getNamespaceURI(parentNode) === NS.HTML ? options.treeAdapter.getTemplateContent(parentNode) : parentNode;
    const childNodes = options.treeAdapter.getChildNodes(container);
    if (childNodes) {
        for (const currentNode of childNodes){
            html += serializeNode(currentNode, options);
        }
    }
    return html;
}
function serializeNode(node, options) {
    if (options.treeAdapter.isElementNode(node)) {
        return serializeElement(node, options);
    }
    if (options.treeAdapter.isTextNode(node)) {
        return serializeTextNode(node, options);
    }
    if (options.treeAdapter.isCommentNode(node)) {
        return serializeCommentNode(node, options);
    }
    if (options.treeAdapter.isDocumentTypeNode(node)) {
        return serializeDocumentTypeNode(node, options);
    }
    // Return an empty string for unknown nodes
    return "";
}
function serializeElement(node, options) {
    const tn = options.treeAdapter.getTagName(node);
    return `<${tn}${serializeAttributes(node, options)}>${isVoidElement(node, options) ? "" : `${serializeChildNodes(node, options)}</${tn}>`}`;
}
function serializeAttributes(node, { treeAdapter }) {
    let html = "";
    for (const attr of treeAdapter.getAttrList(node)){
        html += " ";
        if (attr.namespace) {
            switch(attr.namespace){
                case NS.XML:
                    {
                        html += `xml:${attr.name}`;
                        break;
                    }
                case NS.XMLNS:
                    {
                        if (attr.name !== "xmlns") {
                            html += "xmlns:";
                        }
                        html += attr.name;
                        break;
                    }
                case NS.XLINK:
                    {
                        html += `xlink:${attr.name}`;
                        break;
                    }
                default:
                    {
                        html += `${attr.prefix}:${attr.name}`;
                    }
            }
        } else {
            html += attr.name;
        }
        html += `="${esm_escape_escapeAttribute(attr.value)}"`;
    }
    return html;
}
function serializeTextNode(node, options) {
    const { treeAdapter } = options;
    const content = treeAdapter.getTextNodeContent(node);
    const parent = treeAdapter.getParentNode(node);
    const parentTn = parent && treeAdapter.isElementNode(parent) && treeAdapter.getTagName(parent);
    return parentTn && treeAdapter.getNamespaceURI(parent) === NS.HTML && hasUnescapedText(parentTn, options.scriptingEnabled) ? content : esm_escape_escapeText(content);
}
function serializeCommentNode(node, { treeAdapter }) {
    return `<!--${treeAdapter.getCommentNodeContent(node)}-->`;
}
function serializeDocumentTypeNode(node, { treeAdapter }) {
    return `<!DOCTYPE ${treeAdapter.getDocumentTypeNodeName(node)}>`;
}

;// CONCATENATED MODULE: ./node_modules/parse5/dist/index.js





/** @internal */ 


/** @internal */ 
// Shorthands
/**
 * Parses an HTML string.
 *
 * @param html Input HTML string.
 * @param options Parsing options.
 * @returns Document
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
 *
 * console.log(document.childNodes[1].tagName); //> 'html'
 *```
 */ function dist_parse(html, options) {
    return parser_Parser.parse(html, options);
}
function parseFragment(fragmentContext, html, options) {
    if (typeof fragmentContext === "string") {
        options = html;
        html = fragmentContext;
        fragmentContext = null;
    }
    const parser = parser_Parser.getFragmentParser(fragmentContext, options);
    parser.tokenizer.write(html, true);
    return parser.getFragment();
}

;// CONCATENATED MODULE: ./node_modules/parse5-htmlparser2-tree-adapter/dist/index.js


function enquoteDoctypeId(id) {
    const quote = id.includes('"') ? "'" : '"';
    return quote + id + quote;
}
/** @internal */ function serializeDoctypeContent(name, publicId, systemId) {
    let str = "!DOCTYPE ";
    if (name) {
        str += name;
    }
    if (publicId) {
        str += ` PUBLIC ${enquoteDoctypeId(publicId)}`;
    } else if (systemId) {
        str += " SYSTEM";
    }
    if (systemId) {
        str += ` ${enquoteDoctypeId(systemId)}`;
    }
    return str;
}
const adapter = {
    // Re-exports from domhandler
    isCommentNode: isComment,
    isElementNode: node_isTag,
    isTextNode: isText,
    //Node construction
    createDocument () {
        const node = new Document([]);
        node["x-mode"] = DOCUMENT_MODE.NO_QUIRKS;
        return node;
    },
    createDocumentFragment () {
        return new Document([]);
    },
    createElement (tagName, namespaceURI, attrs) {
        const attribs = Object.create(null);
        const attribsNamespace = Object.create(null);
        const attribsPrefix = Object.create(null);
        for(let i = 0; i < attrs.length; i++){
            const attrName = attrs[i].name;
            attribs[attrName] = attrs[i].value;
            attribsNamespace[attrName] = attrs[i].namespace;
            attribsPrefix[attrName] = attrs[i].prefix;
        }
        const node = new Element(tagName, attribs, []);
        node.namespace = namespaceURI;
        node["x-attribsNamespace"] = attribsNamespace;
        node["x-attribsPrefix"] = attribsPrefix;
        return node;
    },
    createCommentNode (data) {
        return new node_Comment(data);
    },
    createTextNode (value) {
        return new node_Text(value);
    },
    //Tree mutation
    appendChild (parentNode, newNode) {
        const prev = parentNode.children[parentNode.children.length - 1];
        if (prev) {
            prev.next = newNode;
            newNode.prev = prev;
        }
        parentNode.children.push(newNode);
        newNode.parent = parentNode;
    },
    insertBefore (parentNode, newNode, referenceNode) {
        const insertionIdx = parentNode.children.indexOf(referenceNode);
        const { prev } = referenceNode;
        if (prev) {
            prev.next = newNode;
            newNode.prev = prev;
        }
        referenceNode.prev = newNode;
        newNode.next = referenceNode;
        parentNode.children.splice(insertionIdx, 0, newNode);
        newNode.parent = parentNode;
    },
    setTemplateContent (templateElement, contentElement) {
        adapter.appendChild(templateElement, contentElement);
    },
    getTemplateContent (templateElement) {
        return templateElement.children[0];
    },
    setDocumentType (document, name, publicId, systemId) {
        const data = serializeDoctypeContent(name, publicId, systemId);
        let doctypeNode = document.children.find((node)=>isDirective(node) && node.name === "!doctype");
        if (doctypeNode) {
            doctypeNode.data = data !== null && data !== void 0 ? data : null;
        } else {
            doctypeNode = new ProcessingInstruction("!doctype", data);
            adapter.appendChild(document, doctypeNode);
        }
        doctypeNode["x-name"] = name;
        doctypeNode["x-publicId"] = publicId;
        doctypeNode["x-systemId"] = systemId;
    },
    setDocumentMode (document, mode) {
        document["x-mode"] = mode;
    },
    getDocumentMode (document) {
        return document["x-mode"];
    },
    detachNode (node) {
        if (node.parent) {
            const idx = node.parent.children.indexOf(node);
            const { prev, next } = node;
            node.prev = null;
            node.next = null;
            if (prev) {
                prev.next = next;
            }
            if (next) {
                next.prev = prev;
            }
            node.parent.children.splice(idx, 1);
            node.parent = null;
        }
    },
    insertText (parentNode, text) {
        const lastChild = parentNode.children[parentNode.children.length - 1];
        if (lastChild && isText(lastChild)) {
            lastChild.data += text;
        } else {
            adapter.appendChild(parentNode, adapter.createTextNode(text));
        }
    },
    insertTextBefore (parentNode, text, referenceNode) {
        const prevNode = parentNode.children[parentNode.children.indexOf(referenceNode) - 1];
        if (prevNode && isText(prevNode)) {
            prevNode.data += text;
        } else {
            adapter.insertBefore(parentNode, adapter.createTextNode(text), referenceNode);
        }
    },
    adoptAttributes (recipient, attrs) {
        for(let i = 0; i < attrs.length; i++){
            const attrName = attrs[i].name;
            if (recipient.attribs[attrName] === undefined) {
                recipient.attribs[attrName] = attrs[i].value;
                recipient["x-attribsNamespace"][attrName] = attrs[i].namespace;
                recipient["x-attribsPrefix"][attrName] = attrs[i].prefix;
            }
        }
    },
    //Tree traversing
    getFirstChild (node) {
        return node.children[0];
    },
    getChildNodes (node) {
        return node.children;
    },
    getParentNode (node) {
        return node.parent;
    },
    getAttrList (element) {
        return element.attributes;
    },
    //Node data
    getTagName (element) {
        return element.name;
    },
    getNamespaceURI (element) {
        return element.namespace;
    },
    getTextNodeContent (textNode) {
        return textNode.data;
    },
    getCommentNodeContent (commentNode) {
        return commentNode.data;
    },
    getDocumentTypeNodeName (doctypeNode) {
        var _a;
        return (_a = doctypeNode["x-name"]) !== null && _a !== void 0 ? _a : "";
    },
    getDocumentTypeNodePublicId (doctypeNode) {
        var _a;
        return (_a = doctypeNode["x-publicId"]) !== null && _a !== void 0 ? _a : "";
    },
    getDocumentTypeNodeSystemId (doctypeNode) {
        var _a;
        return (_a = doctypeNode["x-systemId"]) !== null && _a !== void 0 ? _a : "";
    },
    //Node types
    isDocumentTypeNode (node) {
        return isDirective(node) && node.name === "!doctype";
    },
    // Source code location
    setNodeSourceCodeLocation (node, location) {
        if (location) {
            node.startIndex = location.startOffset;
            node.endIndex = location.endOffset;
        }
        node.sourceCodeLocation = location;
    },
    getNodeSourceCodeLocation (node) {
        return node.sourceCodeLocation;
    },
    updateNodeSourceCodeLocation (node, endLocation) {
        if (endLocation.endOffset != null) node.endIndex = endLocation.endOffset;
        node.sourceCodeLocation = {
            ...node.sourceCodeLocation,
            ...endLocation
        };
    }
};

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/parsers/parse5-adapter.js



/**
 * Parse the content with `parse5` in the context of the given `ParentNode`.
 *
 * @param content - The content to parse.
 * @param options - A set of options to use to parse.
 * @param isDocument - Whether to parse the content as a full HTML document.
 * @param context - The context in which to parse the content.
 * @returns The parsed content.
 */ function parseWithParse5(content, options, isDocument, context) {
    const opts = {
        scriptingEnabled: typeof options.scriptingEnabled === "boolean" ? options.scriptingEnabled : true,
        treeAdapter: adapter,
        sourceCodeLocationInfo: options.sourceCodeLocationInfo
    };
    return isDocument ? dist_parse(content, opts) : parseFragment(context, content, opts);
}
const renderOpts = {
    treeAdapter: adapter
};
/**
 * Renders the given DOM tree with `parse5` and returns the result as a string.
 *
 * @param dom - The DOM tree to render.
 * @returns The rendered document.
 */ function renderWithParse5(dom) {
    /*
     * `dom-serializer` passes over the special "root" node and renders the
     * node's children in its place. To mimic this behavior with `parse5`, an
     * equivalent operation must be applied to the input array.
     */ const nodes = "length" in dom ? dom : [
        dom
    ];
    for(let index = 0; index < nodes.length; index += 1){
        const node = nodes[index];
        if (node_isDocument(node)) {
            Array.prototype.splice.call(nodes, index, 1, ...node.children);
        }
    }
    let result = "";
    for(let index = 0; index < nodes.length; index += 1){
        const node = nodes[index];
        result += serializeOuter(node, renderOpts);
    }
    return result;
} //# sourceMappingURL=parse5-adapter.js.map

;// CONCATENATED MODULE: ./node_modules/htmlparser2/lib/esm/Tokenizer.js

var Tokenizer_CharCodes;
(function(CharCodes) {
    CharCodes[CharCodes["Tab"] = 9] = "Tab";
    CharCodes[CharCodes["NewLine"] = 10] = "NewLine";
    CharCodes[CharCodes["FormFeed"] = 12] = "FormFeed";
    CharCodes[CharCodes["CarriageReturn"] = 13] = "CarriageReturn";
    CharCodes[CharCodes["Space"] = 32] = "Space";
    CharCodes[CharCodes["ExclamationMark"] = 33] = "ExclamationMark";
    CharCodes[CharCodes["Number"] = 35] = "Number";
    CharCodes[CharCodes["Amp"] = 38] = "Amp";
    CharCodes[CharCodes["SingleQuote"] = 39] = "SingleQuote";
    CharCodes[CharCodes["DoubleQuote"] = 34] = "DoubleQuote";
    CharCodes[CharCodes["Dash"] = 45] = "Dash";
    CharCodes[CharCodes["Slash"] = 47] = "Slash";
    CharCodes[CharCodes["Zero"] = 48] = "Zero";
    CharCodes[CharCodes["Nine"] = 57] = "Nine";
    CharCodes[CharCodes["Semi"] = 59] = "Semi";
    CharCodes[CharCodes["Lt"] = 60] = "Lt";
    CharCodes[CharCodes["Eq"] = 61] = "Eq";
    CharCodes[CharCodes["Gt"] = 62] = "Gt";
    CharCodes[CharCodes["Questionmark"] = 63] = "Questionmark";
    CharCodes[CharCodes["UpperA"] = 65] = "UpperA";
    CharCodes[CharCodes["LowerA"] = 97] = "LowerA";
    CharCodes[CharCodes["UpperF"] = 70] = "UpperF";
    CharCodes[CharCodes["LowerF"] = 102] = "LowerF";
    CharCodes[CharCodes["UpperZ"] = 90] = "UpperZ";
    CharCodes[CharCodes["LowerZ"] = 122] = "LowerZ";
    CharCodes[CharCodes["LowerX"] = 120] = "LowerX";
    CharCodes[CharCodes["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(Tokenizer_CharCodes || (Tokenizer_CharCodes = {}));
/** All the states the tokenizer can be in. */ var Tokenizer_State;
(function(State) {
    State[State["Text"] = 1] = "Text";
    State[State["BeforeTagName"] = 2] = "BeforeTagName";
    State[State["InTagName"] = 3] = "InTagName";
    State[State["InSelfClosingTag"] = 4] = "InSelfClosingTag";
    State[State["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
    State[State["InClosingTagName"] = 6] = "InClosingTagName";
    State[State["AfterClosingTagName"] = 7] = "AfterClosingTagName";
    // Attributes
    State[State["BeforeAttributeName"] = 8] = "BeforeAttributeName";
    State[State["InAttributeName"] = 9] = "InAttributeName";
    State[State["AfterAttributeName"] = 10] = "AfterAttributeName";
    State[State["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
    State[State["InAttributeValueDq"] = 12] = "InAttributeValueDq";
    State[State["InAttributeValueSq"] = 13] = "InAttributeValueSq";
    State[State["InAttributeValueNq"] = 14] = "InAttributeValueNq";
    // Declarations
    State[State["BeforeDeclaration"] = 15] = "BeforeDeclaration";
    State[State["InDeclaration"] = 16] = "InDeclaration";
    // Processing instructions
    State[State["InProcessingInstruction"] = 17] = "InProcessingInstruction";
    // Comments & CDATA
    State[State["BeforeComment"] = 18] = "BeforeComment";
    State[State["CDATASequence"] = 19] = "CDATASequence";
    State[State["InSpecialComment"] = 20] = "InSpecialComment";
    State[State["InCommentLike"] = 21] = "InCommentLike";
    // Special tags
    State[State["BeforeSpecialS"] = 22] = "BeforeSpecialS";
    State[State["SpecialStartSequence"] = 23] = "SpecialStartSequence";
    State[State["InSpecialTag"] = 24] = "InSpecialTag";
    State[State["BeforeEntity"] = 25] = "BeforeEntity";
    State[State["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
    State[State["InNamedEntity"] = 27] = "InNamedEntity";
    State[State["InNumericEntity"] = 28] = "InNumericEntity";
    State[State["InHexEntity"] = 29] = "InHexEntity";
})(Tokenizer_State || (Tokenizer_State = {}));
function Tokenizer_isWhitespace(c) {
    return c === Tokenizer_CharCodes.Space || c === Tokenizer_CharCodes.NewLine || c === Tokenizer_CharCodes.Tab || c === Tokenizer_CharCodes.FormFeed || c === Tokenizer_CharCodes.CarriageReturn;
}
function isEndOfTagSection(c) {
    return c === Tokenizer_CharCodes.Slash || c === Tokenizer_CharCodes.Gt || Tokenizer_isWhitespace(c);
}
function Tokenizer_isNumber(c) {
    return c >= Tokenizer_CharCodes.Zero && c <= Tokenizer_CharCodes.Nine;
}
function isASCIIAlpha(c) {
    return c >= Tokenizer_CharCodes.LowerA && c <= Tokenizer_CharCodes.LowerZ || c >= Tokenizer_CharCodes.UpperA && c <= Tokenizer_CharCodes.UpperZ;
}
function isHexDigit(c) {
    return c >= Tokenizer_CharCodes.UpperA && c <= Tokenizer_CharCodes.UpperF || c >= Tokenizer_CharCodes.LowerA && c <= Tokenizer_CharCodes.LowerF;
}
var QuoteType;
(function(QuoteType) {
    QuoteType[QuoteType["NoValue"] = 0] = "NoValue";
    QuoteType[QuoteType["Unquoted"] = 1] = "Unquoted";
    QuoteType[QuoteType["Single"] = 2] = "Single";
    QuoteType[QuoteType["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
/**
 * Sequences used to match longer strings.
 *
 * We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
 * sequences with an increased offset.
 */ const Sequences = {
    Cdata: new Uint8Array([
        0x43,
        0x44,
        0x41,
        0x54,
        0x41,
        0x5b
    ]),
    CdataEnd: new Uint8Array([
        0x5d,
        0x5d,
        0x3e
    ]),
    CommentEnd: new Uint8Array([
        0x2d,
        0x2d,
        0x3e
    ]),
    ScriptEnd: new Uint8Array([
        0x3c,
        0x2f,
        0x73,
        0x63,
        0x72,
        0x69,
        0x70,
        0x74
    ]),
    StyleEnd: new Uint8Array([
        0x3c,
        0x2f,
        0x73,
        0x74,
        0x79,
        0x6c,
        0x65
    ]),
    TitleEnd: new Uint8Array([
        0x3c,
        0x2f,
        0x74,
        0x69,
        0x74,
        0x6c,
        0x65
    ])
};
class Tokenizer_Tokenizer {
    constructor({ xmlMode = false, decodeEntities = true }, cbs){
        this.cbs = cbs;
        /** The current state the tokenizer is in. */ this.state = Tokenizer_State.Text;
        /** The read buffer. */ this.buffer = "";
        /** The beginning of the section that is currently being read. */ this.sectionStart = 0;
        /** The index within the buffer that we are currently looking at. */ this.index = 0;
        /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */ this.baseState = Tokenizer_State.Text;
        /** For special parsing behavior inside of script and style tags. */ this.isSpecial = false;
        /** Indicates whether the tokenizer has been paused. */ this.running = true;
        /** The offset of the current buffer. */ this.offset = 0;
        this.currentSequence = undefined;
        this.sequenceIndex = 0;
        this.trieIndex = 0;
        this.trieCurrent = 0;
        /** For named entities, the index of the value. For numeric entities, the code point. */ this.entityResult = 0;
        this.entityExcess = 0;
        this.xmlMode = xmlMode;
        this.decodeEntities = decodeEntities;
        this.entityTrie = xmlMode ? decode_data_xml : decode_data_html;
    }
    reset() {
        this.state = Tokenizer_State.Text;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.baseState = Tokenizer_State.Text;
        this.currentSequence = undefined;
        this.running = true;
        this.offset = 0;
    }
    write(chunk) {
        this.offset += this.buffer.length;
        this.buffer = chunk;
        this.parse();
    }
    end() {
        if (this.running) this.finish();
    }
    pause() {
        this.running = false;
    }
    resume() {
        this.running = true;
        if (this.index < this.buffer.length + this.offset) {
            this.parse();
        }
    }
    /**
     * The current index within all of the written data.
     */ getIndex() {
        return this.index;
    }
    /**
     * The start of the current section.
     */ getSectionStart() {
        return this.sectionStart;
    }
    stateText(c) {
        if (c === Tokenizer_CharCodes.Lt || !this.decodeEntities && this.fastForwardTo(Tokenizer_CharCodes.Lt)) {
            if (this.index > this.sectionStart) {
                this.cbs.ontext(this.sectionStart, this.index);
            }
            this.state = Tokenizer_State.BeforeTagName;
            this.sectionStart = this.index;
        } else if (this.decodeEntities && c === Tokenizer_CharCodes.Amp) {
            this.state = Tokenizer_State.BeforeEntity;
        }
    }
    stateSpecialStartSequence(c) {
        const isEnd = this.sequenceIndex === this.currentSequence.length;
        const isMatch = isEnd ? isEndOfTagSection(c) : (c | 0x20) === this.currentSequence[this.sequenceIndex];
        if (!isMatch) {
            this.isSpecial = false;
        } else if (!isEnd) {
            this.sequenceIndex++;
            return;
        }
        this.sequenceIndex = 0;
        this.state = Tokenizer_State.InTagName;
        this.stateInTagName(c);
    }
    /** Look for an end tag. For <title> tags, also decode entities. */ stateInSpecialTag(c) {
        if (this.sequenceIndex === this.currentSequence.length) {
            if (c === Tokenizer_CharCodes.Gt || Tokenizer_isWhitespace(c)) {
                const endOfText = this.index - this.currentSequence.length;
                if (this.sectionStart < endOfText) {
                    // Spoof the index so that reported locations match up.
                    const actualIndex = this.index;
                    this.index = endOfText;
                    this.cbs.ontext(this.sectionStart, endOfText);
                    this.index = actualIndex;
                }
                this.isSpecial = false;
                this.sectionStart = endOfText + 2; // Skip over the `</`
                this.stateInClosingTagName(c);
                return; // We are done; skip the rest of the function.
            }
            this.sequenceIndex = 0;
        }
        if ((c | 0x20) === this.currentSequence[this.sequenceIndex]) {
            this.sequenceIndex += 1;
        } else if (this.sequenceIndex === 0) {
            if (this.currentSequence === Sequences.TitleEnd) {
                // We have to parse entities in <title> tags.
                if (this.decodeEntities && c === Tokenizer_CharCodes.Amp) {
                    this.state = Tokenizer_State.BeforeEntity;
                }
            } else if (this.fastForwardTo(Tokenizer_CharCodes.Lt)) {
                // Outside of <title> tags, we can fast-forward.
                this.sequenceIndex = 1;
            }
        } else {
            // If we see a `<`, set the sequence index to 1; useful for eg. `<</script>`.
            this.sequenceIndex = Number(c === Tokenizer_CharCodes.Lt);
        }
    }
    stateCDATASequence(c) {
        if (c === Sequences.Cdata[this.sequenceIndex]) {
            if (++this.sequenceIndex === Sequences.Cdata.length) {
                this.state = Tokenizer_State.InCommentLike;
                this.currentSequence = Sequences.CdataEnd;
                this.sequenceIndex = 0;
                this.sectionStart = this.index + 1;
            }
        } else {
            this.sequenceIndex = 0;
            this.state = Tokenizer_State.InDeclaration;
            this.stateInDeclaration(c); // Reconsume the character
        }
    }
    /**
     * When we wait for one specific character, we can speed things up
     * by skipping through the buffer until we find it.
     *
     * @returns Whether the character was found.
     */ fastForwardTo(c) {
        while(++this.index < this.buffer.length + this.offset){
            if (this.buffer.charCodeAt(this.index - this.offset) === c) {
                return true;
            }
        }
        /*
         * We increment the index at the end of the `parse` loop,
         * so set it to `buffer.length - 1` here.
         *
         * TODO: Refactor `parse` to increment index before calling states.
         */ this.index = this.buffer.length + this.offset - 1;
        return false;
    }
    /**
     * Comments and CDATA end with `-->` and `]]>`.
     *
     * Their common qualities are:
     * - Their end sequences have a distinct character they start with.
     * - That character is then repeated, so we have to check multiple repeats.
     * - All characters but the start character of the sequence can be skipped.
     */ stateInCommentLike(c) {
        if (c === this.currentSequence[this.sequenceIndex]) {
            if (++this.sequenceIndex === this.currentSequence.length) {
                if (this.currentSequence === Sequences.CdataEnd) {
                    this.cbs.oncdata(this.sectionStart, this.index, 2);
                } else {
                    this.cbs.oncomment(this.sectionStart, this.index, 2);
                }
                this.sequenceIndex = 0;
                this.sectionStart = this.index + 1;
                this.state = Tokenizer_State.Text;
            }
        } else if (this.sequenceIndex === 0) {
            // Fast-forward to the first character of the sequence
            if (this.fastForwardTo(this.currentSequence[0])) {
                this.sequenceIndex = 1;
            }
        } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
            // Allow long sequences, eg. --->, ]]]>
            this.sequenceIndex = 0;
        }
    }
    /**
     * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
     *
     * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
     * We allow anything that wouldn't end the tag.
     */ isTagStartChar(c) {
        return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
    }
    startSpecial(sequence, offset) {
        this.isSpecial = true;
        this.currentSequence = sequence;
        this.sequenceIndex = offset;
        this.state = Tokenizer_State.SpecialStartSequence;
    }
    stateBeforeTagName(c) {
        if (c === Tokenizer_CharCodes.ExclamationMark) {
            this.state = Tokenizer_State.BeforeDeclaration;
            this.sectionStart = this.index + 1;
        } else if (c === Tokenizer_CharCodes.Questionmark) {
            this.state = Tokenizer_State.InProcessingInstruction;
            this.sectionStart = this.index + 1;
        } else if (this.isTagStartChar(c)) {
            const lower = c | 0x20;
            this.sectionStart = this.index;
            if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
                this.startSpecial(Sequences.TitleEnd, 3);
            } else {
                this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? Tokenizer_State.BeforeSpecialS : Tokenizer_State.InTagName;
            }
        } else if (c === Tokenizer_CharCodes.Slash) {
            this.state = Tokenizer_State.BeforeClosingTagName;
        } else {
            this.state = Tokenizer_State.Text;
            this.stateText(c);
        }
    }
    stateInTagName(c) {
        if (isEndOfTagSection(c)) {
            this.cbs.onopentagname(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = Tokenizer_State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        }
    }
    stateBeforeClosingTagName(c) {
        if (Tokenizer_isWhitespace(c)) {
        // Ignore
        } else if (c === Tokenizer_CharCodes.Gt) {
            this.state = Tokenizer_State.Text;
        } else {
            this.state = this.isTagStartChar(c) ? Tokenizer_State.InClosingTagName : Tokenizer_State.InSpecialComment;
            this.sectionStart = this.index;
        }
    }
    stateInClosingTagName(c) {
        if (c === Tokenizer_CharCodes.Gt || Tokenizer_isWhitespace(c)) {
            this.cbs.onclosetag(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = Tokenizer_State.AfterClosingTagName;
            this.stateAfterClosingTagName(c);
        }
    }
    stateAfterClosingTagName(c) {
        // Skip everything until ">"
        if (c === Tokenizer_CharCodes.Gt || this.fastForwardTo(Tokenizer_CharCodes.Gt)) {
            this.state = Tokenizer_State.Text;
            this.baseState = Tokenizer_State.Text;
            this.sectionStart = this.index + 1;
        }
    }
    stateBeforeAttributeName(c) {
        if (c === Tokenizer_CharCodes.Gt) {
            this.cbs.onopentagend(this.index);
            if (this.isSpecial) {
                this.state = Tokenizer_State.InSpecialTag;
                this.sequenceIndex = 0;
            } else {
                this.state = Tokenizer_State.Text;
            }
            this.baseState = this.state;
            this.sectionStart = this.index + 1;
        } else if (c === Tokenizer_CharCodes.Slash) {
            this.state = Tokenizer_State.InSelfClosingTag;
        } else if (!Tokenizer_isWhitespace(c)) {
            this.state = Tokenizer_State.InAttributeName;
            this.sectionStart = this.index;
        }
    }
    stateInSelfClosingTag(c) {
        if (c === Tokenizer_CharCodes.Gt) {
            this.cbs.onselfclosingtag(this.index);
            this.state = Tokenizer_State.Text;
            this.baseState = Tokenizer_State.Text;
            this.sectionStart = this.index + 1;
            this.isSpecial = false; // Reset special state, in case of self-closing special tags
        } else if (!Tokenizer_isWhitespace(c)) {
            this.state = Tokenizer_State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        }
    }
    stateInAttributeName(c) {
        if (c === Tokenizer_CharCodes.Eq || isEndOfTagSection(c)) {
            this.cbs.onattribname(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.state = Tokenizer_State.AfterAttributeName;
            this.stateAfterAttributeName(c);
        }
    }
    stateAfterAttributeName(c) {
        if (c === Tokenizer_CharCodes.Eq) {
            this.state = Tokenizer_State.BeforeAttributeValue;
        } else if (c === Tokenizer_CharCodes.Slash || c === Tokenizer_CharCodes.Gt) {
            this.cbs.onattribend(QuoteType.NoValue, this.index);
            this.state = Tokenizer_State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        } else if (!Tokenizer_isWhitespace(c)) {
            this.cbs.onattribend(QuoteType.NoValue, this.index);
            this.state = Tokenizer_State.InAttributeName;
            this.sectionStart = this.index;
        }
    }
    stateBeforeAttributeValue(c) {
        if (c === Tokenizer_CharCodes.DoubleQuote) {
            this.state = Tokenizer_State.InAttributeValueDq;
            this.sectionStart = this.index + 1;
        } else if (c === Tokenizer_CharCodes.SingleQuote) {
            this.state = Tokenizer_State.InAttributeValueSq;
            this.sectionStart = this.index + 1;
        } else if (!Tokenizer_isWhitespace(c)) {
            this.sectionStart = this.index;
            this.state = Tokenizer_State.InAttributeValueNq;
            this.stateInAttributeValueNoQuotes(c); // Reconsume token
        }
    }
    handleInAttributeValue(c, quote) {
        if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.cbs.onattribend(quote === Tokenizer_CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
            this.state = Tokenizer_State.BeforeAttributeName;
        } else if (this.decodeEntities && c === Tokenizer_CharCodes.Amp) {
            this.baseState = this.state;
            this.state = Tokenizer_State.BeforeEntity;
        }
    }
    stateInAttributeValueDoubleQuotes(c) {
        this.handleInAttributeValue(c, Tokenizer_CharCodes.DoubleQuote);
    }
    stateInAttributeValueSingleQuotes(c) {
        this.handleInAttributeValue(c, Tokenizer_CharCodes.SingleQuote);
    }
    stateInAttributeValueNoQuotes(c) {
        if (Tokenizer_isWhitespace(c) || c === Tokenizer_CharCodes.Gt) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = -1;
            this.cbs.onattribend(QuoteType.Unquoted, this.index);
            this.state = Tokenizer_State.BeforeAttributeName;
            this.stateBeforeAttributeName(c);
        } else if (this.decodeEntities && c === Tokenizer_CharCodes.Amp) {
            this.baseState = this.state;
            this.state = Tokenizer_State.BeforeEntity;
        }
    }
    stateBeforeDeclaration(c) {
        if (c === Tokenizer_CharCodes.OpeningSquareBracket) {
            this.state = Tokenizer_State.CDATASequence;
            this.sequenceIndex = 0;
        } else {
            this.state = c === Tokenizer_CharCodes.Dash ? Tokenizer_State.BeforeComment : Tokenizer_State.InDeclaration;
        }
    }
    stateInDeclaration(c) {
        if (c === Tokenizer_CharCodes.Gt || this.fastForwardTo(Tokenizer_CharCodes.Gt)) {
            this.cbs.ondeclaration(this.sectionStart, this.index);
            this.state = Tokenizer_State.Text;
            this.sectionStart = this.index + 1;
        }
    }
    stateInProcessingInstruction(c) {
        if (c === Tokenizer_CharCodes.Gt || this.fastForwardTo(Tokenizer_CharCodes.Gt)) {
            this.cbs.onprocessinginstruction(this.sectionStart, this.index);
            this.state = Tokenizer_State.Text;
            this.sectionStart = this.index + 1;
        }
    }
    stateBeforeComment(c) {
        if (c === Tokenizer_CharCodes.Dash) {
            this.state = Tokenizer_State.InCommentLike;
            this.currentSequence = Sequences.CommentEnd;
            // Allow short comments (eg. <!-->)
            this.sequenceIndex = 2;
            this.sectionStart = this.index + 1;
        } else {
            this.state = Tokenizer_State.InDeclaration;
        }
    }
    stateInSpecialComment(c) {
        if (c === Tokenizer_CharCodes.Gt || this.fastForwardTo(Tokenizer_CharCodes.Gt)) {
            this.cbs.oncomment(this.sectionStart, this.index, 0);
            this.state = Tokenizer_State.Text;
            this.sectionStart = this.index + 1;
        }
    }
    stateBeforeSpecialS(c) {
        const lower = c | 0x20;
        if (lower === Sequences.ScriptEnd[3]) {
            this.startSpecial(Sequences.ScriptEnd, 4);
        } else if (lower === Sequences.StyleEnd[3]) {
            this.startSpecial(Sequences.StyleEnd, 4);
        } else {
            this.state = Tokenizer_State.InTagName;
            this.stateInTagName(c); // Consume the token again
        }
    }
    stateBeforeEntity(c) {
        // Start excess with 1 to include the '&'
        this.entityExcess = 1;
        this.entityResult = 0;
        if (c === Tokenizer_CharCodes.Number) {
            this.state = Tokenizer_State.BeforeNumericEntity;
        } else if (c === Tokenizer_CharCodes.Amp) {
        // We have two `&` characters in a row. Stay in the current state.
        } else {
            this.trieIndex = 0;
            this.trieCurrent = this.entityTrie[0];
            this.state = Tokenizer_State.InNamedEntity;
            this.stateInNamedEntity(c);
        }
    }
    stateInNamedEntity(c) {
        this.entityExcess += 1;
        this.trieIndex = determineBranch(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);
        if (this.trieIndex < 0) {
            this.emitNamedEntity();
            this.index--;
            return;
        }
        this.trieCurrent = this.entityTrie[this.trieIndex];
        const masked = this.trieCurrent & BinTrieFlags.VALUE_LENGTH;
        // If the branch is a value, store it and continue
        if (masked) {
            // The mask is the number of bytes of the value, including the current byte.
            const valueLength = (masked >> 14) - 1;
            // If we have a legacy entity while parsing strictly, just skip the number of bytes
            if (!this.allowLegacyEntity() && c !== Tokenizer_CharCodes.Semi) {
                this.trieIndex += valueLength;
            } else {
                // Add 1 as we have already incremented the excess
                const entityStart = this.index - this.entityExcess + 1;
                if (entityStart > this.sectionStart) {
                    this.emitPartial(this.sectionStart, entityStart);
                }
                // If this is a surrogate pair, consume the next two bytes
                this.entityResult = this.trieIndex;
                this.trieIndex += valueLength;
                this.entityExcess = 0;
                this.sectionStart = this.index + 1;
                if (valueLength === 0) {
                    this.emitNamedEntity();
                }
            }
        }
    }
    emitNamedEntity() {
        this.state = this.baseState;
        if (this.entityResult === 0) {
            return;
        }
        const valueLength = (this.entityTrie[this.entityResult] & BinTrieFlags.VALUE_LENGTH) >> 14;
        switch(valueLength){
            case 1:
                {
                    this.emitCodePoint(this.entityTrie[this.entityResult] & ~BinTrieFlags.VALUE_LENGTH);
                    break;
                }
            case 2:
                {
                    this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
                    break;
                }
            case 3:
                {
                    this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
                    this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
                }
        }
    }
    stateBeforeNumericEntity(c) {
        if ((c | 0x20) === Tokenizer_CharCodes.LowerX) {
            this.entityExcess++;
            this.state = Tokenizer_State.InHexEntity;
        } else {
            this.state = Tokenizer_State.InNumericEntity;
            this.stateInNumericEntity(c);
        }
    }
    emitNumericEntity(strict) {
        const entityStart = this.index - this.entityExcess - 1;
        const numberStart = entityStart + 2 + Number(this.state === Tokenizer_State.InHexEntity);
        if (numberStart !== this.index) {
            // Emit leading data if any
            if (entityStart > this.sectionStart) {
                this.emitPartial(this.sectionStart, entityStart);
            }
            this.sectionStart = this.index + Number(strict);
            this.emitCodePoint(replaceCodePoint(this.entityResult));
        }
        this.state = this.baseState;
    }
    stateInNumericEntity(c) {
        if (c === Tokenizer_CharCodes.Semi) {
            this.emitNumericEntity(true);
        } else if (Tokenizer_isNumber(c)) {
            this.entityResult = this.entityResult * 10 + (c - Tokenizer_CharCodes.Zero);
            this.entityExcess++;
        } else {
            if (this.allowLegacyEntity()) {
                this.emitNumericEntity(false);
            } else {
                this.state = this.baseState;
            }
            this.index--;
        }
    }
    stateInHexEntity(c) {
        if (c === Tokenizer_CharCodes.Semi) {
            this.emitNumericEntity(true);
        } else if (Tokenizer_isNumber(c)) {
            this.entityResult = this.entityResult * 16 + (c - Tokenizer_CharCodes.Zero);
            this.entityExcess++;
        } else if (isHexDigit(c)) {
            this.entityResult = this.entityResult * 16 + ((c | 0x20) - Tokenizer_CharCodes.LowerA + 10);
            this.entityExcess++;
        } else {
            if (this.allowLegacyEntity()) {
                this.emitNumericEntity(false);
            } else {
                this.state = this.baseState;
            }
            this.index--;
        }
    }
    allowLegacyEntity() {
        return !this.xmlMode && (this.baseState === Tokenizer_State.Text || this.baseState === Tokenizer_State.InSpecialTag);
    }
    /**
     * Remove data that has already been consumed from the buffer.
     */ cleanup() {
        // If we are inside of text or attributes, emit what we already have.
        if (this.running && this.sectionStart !== this.index) {
            if (this.state === Tokenizer_State.Text || this.state === Tokenizer_State.InSpecialTag && this.sequenceIndex === 0) {
                this.cbs.ontext(this.sectionStart, this.index);
                this.sectionStart = this.index;
            } else if (this.state === Tokenizer_State.InAttributeValueDq || this.state === Tokenizer_State.InAttributeValueSq || this.state === Tokenizer_State.InAttributeValueNq) {
                this.cbs.onattribdata(this.sectionStart, this.index);
                this.sectionStart = this.index;
            }
        }
    }
    shouldContinue() {
        return this.index < this.buffer.length + this.offset && this.running;
    }
    /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */ parse() {
        while(this.shouldContinue()){
            const c = this.buffer.charCodeAt(this.index - this.offset);
            switch(this.state){
                case Tokenizer_State.Text:
                    {
                        this.stateText(c);
                        break;
                    }
                case Tokenizer_State.SpecialStartSequence:
                    {
                        this.stateSpecialStartSequence(c);
                        break;
                    }
                case Tokenizer_State.InSpecialTag:
                    {
                        this.stateInSpecialTag(c);
                        break;
                    }
                case Tokenizer_State.CDATASequence:
                    {
                        this.stateCDATASequence(c);
                        break;
                    }
                case Tokenizer_State.InAttributeValueDq:
                    {
                        this.stateInAttributeValueDoubleQuotes(c);
                        break;
                    }
                case Tokenizer_State.InAttributeName:
                    {
                        this.stateInAttributeName(c);
                        break;
                    }
                case Tokenizer_State.InCommentLike:
                    {
                        this.stateInCommentLike(c);
                        break;
                    }
                case Tokenizer_State.InSpecialComment:
                    {
                        this.stateInSpecialComment(c);
                        break;
                    }
                case Tokenizer_State.BeforeAttributeName:
                    {
                        this.stateBeforeAttributeName(c);
                        break;
                    }
                case Tokenizer_State.InTagName:
                    {
                        this.stateInTagName(c);
                        break;
                    }
                case Tokenizer_State.InClosingTagName:
                    {
                        this.stateInClosingTagName(c);
                        break;
                    }
                case Tokenizer_State.BeforeTagName:
                    {
                        this.stateBeforeTagName(c);
                        break;
                    }
                case Tokenizer_State.AfterAttributeName:
                    {
                        this.stateAfterAttributeName(c);
                        break;
                    }
                case Tokenizer_State.InAttributeValueSq:
                    {
                        this.stateInAttributeValueSingleQuotes(c);
                        break;
                    }
                case Tokenizer_State.BeforeAttributeValue:
                    {
                        this.stateBeforeAttributeValue(c);
                        break;
                    }
                case Tokenizer_State.BeforeClosingTagName:
                    {
                        this.stateBeforeClosingTagName(c);
                        break;
                    }
                case Tokenizer_State.AfterClosingTagName:
                    {
                        this.stateAfterClosingTagName(c);
                        break;
                    }
                case Tokenizer_State.BeforeSpecialS:
                    {
                        this.stateBeforeSpecialS(c);
                        break;
                    }
                case Tokenizer_State.InAttributeValueNq:
                    {
                        this.stateInAttributeValueNoQuotes(c);
                        break;
                    }
                case Tokenizer_State.InSelfClosingTag:
                    {
                        this.stateInSelfClosingTag(c);
                        break;
                    }
                case Tokenizer_State.InDeclaration:
                    {
                        this.stateInDeclaration(c);
                        break;
                    }
                case Tokenizer_State.BeforeDeclaration:
                    {
                        this.stateBeforeDeclaration(c);
                        break;
                    }
                case Tokenizer_State.BeforeComment:
                    {
                        this.stateBeforeComment(c);
                        break;
                    }
                case Tokenizer_State.InProcessingInstruction:
                    {
                        this.stateInProcessingInstruction(c);
                        break;
                    }
                case Tokenizer_State.InNamedEntity:
                    {
                        this.stateInNamedEntity(c);
                        break;
                    }
                case Tokenizer_State.BeforeEntity:
                    {
                        this.stateBeforeEntity(c);
                        break;
                    }
                case Tokenizer_State.InHexEntity:
                    {
                        this.stateInHexEntity(c);
                        break;
                    }
                case Tokenizer_State.InNumericEntity:
                    {
                        this.stateInNumericEntity(c);
                        break;
                    }
                default:
                    {
                        // `this._state === State.BeforeNumericEntity`
                        this.stateBeforeNumericEntity(c);
                    }
            }
            this.index++;
        }
        this.cleanup();
    }
    finish() {
        if (this.state === Tokenizer_State.InNamedEntity) {
            this.emitNamedEntity();
        }
        // If there is remaining data, emit it in a reasonable way
        if (this.sectionStart < this.index) {
            this.handleTrailingData();
        }
        this.cbs.onend();
    }
    /** Handle any trailing data. */ handleTrailingData() {
        const endIndex = this.buffer.length + this.offset;
        if (this.state === Tokenizer_State.InCommentLike) {
            if (this.currentSequence === Sequences.CdataEnd) {
                this.cbs.oncdata(this.sectionStart, endIndex, 0);
            } else {
                this.cbs.oncomment(this.sectionStart, endIndex, 0);
            }
        } else if (this.state === Tokenizer_State.InNumericEntity && this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
        // All trailing data will have been consumed
        } else if (this.state === Tokenizer_State.InHexEntity && this.allowLegacyEntity()) {
            this.emitNumericEntity(false);
        // All trailing data will have been consumed
        } else if (this.state === Tokenizer_State.InTagName || this.state === Tokenizer_State.BeforeAttributeName || this.state === Tokenizer_State.BeforeAttributeValue || this.state === Tokenizer_State.AfterAttributeName || this.state === Tokenizer_State.InAttributeName || this.state === Tokenizer_State.InAttributeValueSq || this.state === Tokenizer_State.InAttributeValueDq || this.state === Tokenizer_State.InAttributeValueNq || this.state === Tokenizer_State.InClosingTagName) {
        /*
             * If we are currently in an opening or closing tag, us not calling the
             * respective callback signals that the tag should be ignored.
             */ } else {
            this.cbs.ontext(this.sectionStart, endIndex);
        }
    }
    emitPartial(start, endIndex) {
        if (this.baseState !== Tokenizer_State.Text && this.baseState !== Tokenizer_State.InSpecialTag) {
            this.cbs.onattribdata(start, endIndex);
        } else {
            this.cbs.ontext(start, endIndex);
        }
    }
    emitCodePoint(cp) {
        if (this.baseState !== Tokenizer_State.Text && this.baseState !== Tokenizer_State.InSpecialTag) {
            this.cbs.onattribentity(cp);
        } else {
            this.cbs.ontextentity(cp);
        }
    }
} //# sourceMappingURL=Tokenizer.js.map

;// CONCATENATED MODULE: ./node_modules/htmlparser2/lib/esm/Parser.js


const formTags = new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea"
]);
const pTag = new Set([
    "p"
]);
const tableSectionTags = new Set([
    "thead",
    "tbody"
]);
const ddtTags = new Set([
    "dd",
    "dt"
]);
const rtpTags = new Set([
    "rt",
    "rp"
]);
const openImpliesClose = new Map([
    [
        "tr",
        new Set([
            "tr",
            "th",
            "td"
        ])
    ],
    [
        "th",
        new Set([
            "th"
        ])
    ],
    [
        "td",
        new Set([
            "thead",
            "th",
            "td"
        ])
    ],
    [
        "body",
        new Set([
            "head",
            "link",
            "script"
        ])
    ],
    [
        "li",
        new Set([
            "li"
        ])
    ],
    [
        "p",
        pTag
    ],
    [
        "h1",
        pTag
    ],
    [
        "h2",
        pTag
    ],
    [
        "h3",
        pTag
    ],
    [
        "h4",
        pTag
    ],
    [
        "h5",
        pTag
    ],
    [
        "h6",
        pTag
    ],
    [
        "select",
        formTags
    ],
    [
        "input",
        formTags
    ],
    [
        "output",
        formTags
    ],
    [
        "button",
        formTags
    ],
    [
        "datalist",
        formTags
    ],
    [
        "textarea",
        formTags
    ],
    [
        "option",
        new Set([
            "option"
        ])
    ],
    [
        "optgroup",
        new Set([
            "optgroup",
            "option"
        ])
    ],
    [
        "dd",
        ddtTags
    ],
    [
        "dt",
        ddtTags
    ],
    [
        "address",
        pTag
    ],
    [
        "article",
        pTag
    ],
    [
        "aside",
        pTag
    ],
    [
        "blockquote",
        pTag
    ],
    [
        "details",
        pTag
    ],
    [
        "div",
        pTag
    ],
    [
        "dl",
        pTag
    ],
    [
        "fieldset",
        pTag
    ],
    [
        "figcaption",
        pTag
    ],
    [
        "figure",
        pTag
    ],
    [
        "footer",
        pTag
    ],
    [
        "form",
        pTag
    ],
    [
        "header",
        pTag
    ],
    [
        "hr",
        pTag
    ],
    [
        "main",
        pTag
    ],
    [
        "nav",
        pTag
    ],
    [
        "ol",
        pTag
    ],
    [
        "pre",
        pTag
    ],
    [
        "section",
        pTag
    ],
    [
        "table",
        pTag
    ],
    [
        "ul",
        pTag
    ],
    [
        "rt",
        rtpTags
    ],
    [
        "rp",
        rtpTags
    ],
    [
        "tbody",
        tableSectionTags
    ],
    [
        "tfoot",
        tableSectionTags
    ]
]);
const voidElements = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);
const foreignContextElements = new Set([
    "math",
    "svg"
]);
const htmlIntegrationElements = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignobject",
    "desc",
    "title"
]);
const reNameEnd = /\s|\//;
class Parser_Parser {
    constructor(cbs, options = {}){
        var _a, _b, _c, _d, _e;
        this.options = options;
        /** The start index of the last event. */ this.startIndex = 0;
        /** The end index of the last event. */ this.endIndex = 0;
        /**
         * Store the start index of the current open tag,
         * so we can update the start index for attributes.
         */ this.openTagStart = 0;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.buffers = [];
        this.bufferOffset = 0;
        /** The index of the last written buffer. Used when resuming after a `pause()`. */ this.writeIndex = 0;
        /** Indicates whether the parser has finished running / `.end` has been called. */ this.ended = false;
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
        this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_Tokenizer)(this.options, this);
        (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
    }
    // Tokenizer event handlers
    /** @internal */ ontext(start, endIndex) {
        var _a, _b;
        const data = this.getSlice(start, endIndex);
        this.endIndex = endIndex - 1;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
        this.startIndex = endIndex;
    }
    /** @internal */ ontextentity(cp) {
        var _a, _b;
        /*
         * Entities can be emitted on the character, or directly after.
         * We use the section start here to get accurate indices.
         */ const index = this.tokenizer.getSectionStart();
        this.endIndex = index - 1;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, decode_codepoint_fromCodePoint(cp));
        this.startIndex = index;
    }
    isVoidElement(name) {
        return !this.options.xmlMode && voidElements.has(name);
    }
    /** @internal */ onopentagname(start, endIndex) {
        this.endIndex = endIndex;
        let name = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        this.emitOpenTag(name);
    }
    emitOpenTag(name) {
        var _a, _b, _c, _d;
        this.openTagStart = this.startIndex;
        this.tagname = name;
        const impliesClose = !this.options.xmlMode && openImpliesClose.get(name);
        if (impliesClose) {
            while(this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])){
                const element = this.stack.pop();
                (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, element, true);
            }
        }
        if (!this.isVoidElement(name)) {
            this.stack.push(name);
            if (foreignContextElements.has(name)) {
                this.foreignContext.push(true);
            } else if (htmlIntegrationElements.has(name)) {
                this.foreignContext.push(false);
            }
        }
        (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
        if (this.cbs.onopentag) this.attribs = {};
    }
    endOpenTag(isImplied) {
        var _a, _b;
        this.startIndex = this.openTagStart;
        if (this.attribs) {
            (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs, isImplied);
            this.attribs = null;
        }
        if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
            this.cbs.onclosetag(this.tagname, true);
        }
        this.tagname = "";
    }
    /** @internal */ onopentagend(endIndex) {
        this.endIndex = endIndex;
        this.endOpenTag(false);
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    }
    /** @internal */ onclosetag(start, endIndex) {
        var _a, _b, _c, _d, _e, _f;
        this.endIndex = endIndex;
        let name = this.getSlice(start, endIndex);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
            this.foreignContext.pop();
        }
        if (!this.isVoidElement(name)) {
            const pos = this.stack.lastIndexOf(name);
            if (pos !== -1) {
                if (this.cbs.onclosetag) {
                    let count = this.stack.length - pos;
                    while(count--){
                        // We know the stack has sufficient elements.
                        this.cbs.onclosetag(this.stack.pop(), count !== 0);
                    }
                } else this.stack.length = pos;
            } else if (!this.options.xmlMode && name === "p") {
                // Implicit open before close
                this.emitOpenTag("p");
                this.closeCurrentTag(true);
            }
        } else if (!this.options.xmlMode && name === "br") {
            // We can't use `emitOpenTag` for implicit open, as `br` would be implicitly closed.
            (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, "br");
            (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
            (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", false);
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    }
    /** @internal */ onselfclosingtag(endIndex) {
        this.endIndex = endIndex;
        if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
            this.closeCurrentTag(false);
            // Set `startIndex` for next node
            this.startIndex = endIndex + 1;
        } else {
            // Ignore the fact that the tag is self-closing.
            this.onopentagend(endIndex);
        }
    }
    closeCurrentTag(isOpenImplied) {
        var _a, _b;
        const name = this.tagname;
        this.endOpenTag(isOpenImplied);
        // Self-closing tags will be on the top of the stack
        if (this.stack[this.stack.length - 1] === name) {
            // If the opening tag isn't implied, the closing tag has to be implied.
            (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name, !isOpenImplied);
            this.stack.pop();
        }
    }
    /** @internal */ onattribname(start, endIndex) {
        this.startIndex = start;
        const name = this.getSlice(start, endIndex);
        this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
    }
    /** @internal */ onattribdata(start, endIndex) {
        this.attribvalue += this.getSlice(start, endIndex);
    }
    /** @internal */ onattribentity(cp) {
        this.attribvalue += decode_codepoint_fromCodePoint(cp);
    }
    /** @internal */ onattribend(quote, endIndex) {
        var _a, _b;
        this.endIndex = endIndex;
        (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? undefined : null);
        if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
            this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribvalue = "";
    }
    getInstructionName(value) {
        const index = value.search(reNameEnd);
        let name = index < 0 ? value : value.substr(0, index);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        return name;
    }
    /** @internal */ ondeclaration(start, endIndex) {
        this.endIndex = endIndex;
        const value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
            const name = this.getInstructionName(value);
            this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    }
    /** @internal */ onprocessinginstruction(start, endIndex) {
        this.endIndex = endIndex;
        const value = this.getSlice(start, endIndex);
        if (this.cbs.onprocessinginstruction) {
            const name = this.getInstructionName(value);
            this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    }
    /** @internal */ oncomment(start, endIndex, offset) {
        var _a, _b, _c, _d;
        this.endIndex = endIndex;
        (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, this.getSlice(start, endIndex - offset));
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    }
    /** @internal */ oncdata(start, endIndex, offset) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.endIndex = endIndex;
        const value = this.getSlice(start, endIndex - offset);
        if (this.options.xmlMode || this.options.recognizeCDATA) {
            (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
            (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
        } else {
            (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
            (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1;
    }
    /** @internal */ onend() {
        var _a, _b;
        if (this.cbs.onclosetag) {
            // Set the end index for all remaining tags
            this.endIndex = this.startIndex;
            for(let index = this.stack.length; index > 0; this.cbs.onclosetag(this.stack[--index], true));
        }
        (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    /**
     * Resets the parser to a blank state, ready to parse a new HTML document
     */ reset() {
        var _a, _b, _c, _d;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack.length = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
        this.buffers.length = 0;
        this.bufferOffset = 0;
        this.writeIndex = 0;
        this.ended = false;
    }
    /**
     * Resets the parser, then parses a complete document and
     * pushes it to the handler.
     *
     * @param data Document to parse.
     */ parseComplete(data) {
        this.reset();
        this.end(data);
    }
    getSlice(start, end) {
        while(start - this.bufferOffset >= this.buffers[0].length){
            this.shiftBuffer();
        }
        let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
        while(end - this.bufferOffset > this.buffers[0].length){
            this.shiftBuffer();
            slice += this.buffers[0].slice(0, end - this.bufferOffset);
        }
        return slice;
    }
    shiftBuffer() {
        this.bufferOffset += this.buffers[0].length;
        this.writeIndex--;
        this.buffers.shift();
    }
    /**
     * Parses a chunk of data and calls the corresponding callbacks.
     *
     * @param chunk Chunk to parse.
     */ write(chunk) {
        var _a, _b;
        if (this.ended) {
            (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, new Error(".write() after done!"));
            return;
        }
        this.buffers.push(chunk);
        if (this.tokenizer.running) {
            this.tokenizer.write(chunk);
            this.writeIndex++;
        }
    }
    /**
     * Parses the end of the buffer and clears the stack, calls onend.
     *
     * @param chunk Optional final chunk to parse.
     */ end(chunk) {
        var _a, _b;
        if (this.ended) {
            (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, new Error(".end() after done!"));
            return;
        }
        if (chunk) this.write(chunk);
        this.ended = true;
        this.tokenizer.end();
    }
    /**
     * Pauses parsing. The parser won't emit events until `resume` is called.
     */ pause() {
        this.tokenizer.pause();
    }
    /**
     * Resumes parsing after `pause` was called.
     */ resume() {
        this.tokenizer.resume();
        while(this.tokenizer.running && this.writeIndex < this.buffers.length){
            this.tokenizer.write(this.buffers[this.writeIndex++]);
        }
        if (this.ended) this.tokenizer.end();
    }
    /**
     * Alias of `write`, for backwards compatibility.
     *
     * @param chunk Chunk to parse.
     * @deprecated
     */ parseChunk(chunk) {
        this.write(chunk);
    }
    /**
     * Alias of `end`, for backwards compatibility.
     *
     * @param chunk Optional final chunk to parse.
     * @deprecated
     */ done(chunk) {
        this.end(chunk);
    }
} //# sourceMappingURL=Parser.js.map

;// CONCATENATED MODULE: ./node_modules/htmlparser2/lib/esm/index.js




// Helper methods
/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */ function parseDocument(data, options) {
    const handler = new esm_DomHandler(undefined, options);
    new Parser_Parser(handler, options).end(data);
    return handler.root;
}
/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */ function parseDOM(data, options) {
    return parseDocument(data, options).children;
}
/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param callback A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCallback An optional callback that will be called every time a tag has been completed inside of the DOM.
 */ function createDomStream(callback, options, elementCallback) {
    const handler = new DomHandler(callback, options, elementCallback);
    return new Parser(handler, options);
}

/*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */ 


const parseFeedDefaultOptions = {
    xmlMode: true
};
/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
 */ function parseFeed(feed, options = parseFeedDefaultOptions) {
    return getFeed(parseDOM(feed, options));
}
 //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/cheerio/lib/esm/index.js
/**
 * Types used in signatures of Cheerio methods.
 *
 * @category Cheerio
 */ 





const esm_parse = getParse((content, options, isDocument, context)=>options.xmlMode || options._useHtmlParser2 ? parseDocument(content, options) : parseWithParse5(content, options, isDocument, context));
// Duplicate docs due to https://github.com/TypeStrong/typedoc/issues/1616
/**
 * Create a querying function, bound to a document created from the provided markup.
 *
 * Note that similar to web browser contexts, this operation may introduce
 * `<html>`, `<head>`, and `<body>` elements; set `isDocument` to `false` to
 * switch to fragment mode and disable this.
 *
 * @param content - Markup to be loaded.
 * @param options - Options for the created instance.
 * @param isDocument - Allows parser to be switched to fragment mode.
 * @returns The loaded document.
 * @see {@link https://cheerio.js.org#loading} for additional usage information.
 */ const load = getLoad(esm_parse, (dom, options)=>options.xmlMode || options._useHtmlParser2 ? lib_esm(dom, options) : renderWithParse5(dom));
/**
 * The default cheerio instance.
 *
 * @deprecated Use the function returned by `load` instead.
 */ /* harmony default export */ const cheerio_lib_esm = (load([]));


/**
 * In order to promote consistency with the jQuery library, users are encouraged
 * to instead use the static method of the same name.
 *
 * @deprecated
 * @example
 *
 * ```js
 * const $ = cheerio.load('<div><p></p></div>');
 *
 * $.contains($('div').get(0), $('p').get(0));
 * //=> true
 *
 * $.contains($('p').get(0), $('div').get(0));
 * //=> false
 * ```
 *
 * @returns {boolean}
 */ const { contains: esm_contains } = static_namespaceObject;
/**
 * In order to promote consistency with the jQuery library, users are encouraged
 * to instead use the static method of the same name.
 *
 * @deprecated
 * @example
 *
 * ```js
 * const $ = cheerio.load('');
 *
 * $.merge([1, 2], [3, 4]);
 * //=> [1, 2, 3, 4]
 * ```
 */ const { merge: esm_merge } = static_namespaceObject;
/**
 * In order to promote consistency with the jQuery library, users are encouraged
 * to instead use the static method of the same name as it is defined on the
 * "loaded" Cheerio factory function.
 *
 * @deprecated See {@link static/parseHTML}.
 * @example
 *
 * ```js
 * const $ = cheerio.load('');
 * $.parseHTML('<b>markup</b>');
 * ```
 */ const { parseHTML: esm_parseHTML } = static_namespaceObject;
/**
 * Users seeking to access the top-level element of a parsed document should
 * instead use the `root` static method of a "loaded" Cheerio function.
 *
 * @deprecated
 * @example
 *
 * ```js
 * const $ = cheerio.load('');
 * $.root();
 * ```
 */ const { root: esm_root } = static_namespaceObject; //# sourceMappingURL=index.js.map


/***/ })

};
;