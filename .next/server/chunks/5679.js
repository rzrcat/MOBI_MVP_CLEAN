"use strict";
exports.id = 5679;
exports.ids = [5679];
exports.modules = {

/***/ 55679:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  t: () => (/* binding */ drizzle)
});

// UNUSED EXPORTS: BetterSQLite3Database

// EXTERNAL MODULE: external "better-sqlite3"
var external_better_sqlite3_ = __webpack_require__(85890);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(69574);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/logger.js

class ConsoleLogWriter {
    static{
        this[entity/* entityKind */.Q] = "ConsoleLogWriter";
    }
    write(message) {
        ;
    }
}
class DefaultLogger {
    static{
        this[entity/* entityKind */.Q] = "DefaultLogger";
    }
    constructor(config){
        this.writer = config?.writer ?? new ConsoleLogWriter();
    }
    logQuery(query, params) {
        const stringifiedParams = params.map((p)=>{
            try {
                return JSON.stringify(p);
            } catch  {
                return String(p);
            }
        });
        const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
        this.writer.write(`Query: ${query}${paramsStr}`);
    }
}
class NoopLogger {
    static{
        this[entity/* entityKind */.Q] = "NoopLogger";
    }
    logQuery() {}
}
 //# sourceMappingURL=logger.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/relations.js + 3 modules
var relations = __webpack_require__(2260);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/column.js
var column = __webpack_require__(51582);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/sql.js + 8 modules
var sql = __webpack_require__(54410);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/table.js
var drizzle_orm_table = __webpack_require__(67611);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/view-common.js
var view_common = __webpack_require__(43498);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/alias.js





class ColumnAliasProxyHandler {
    constructor(table){
        this.table = table;
    }
    static{
        this[entity/* entityKind */.Q] = "ColumnAliasProxyHandler";
    }
    get(columnObj, prop) {
        if (prop === "table") {
            return this.table;
        }
        return columnObj[prop];
    }
}
class TableAliasProxyHandler {
    constructor(alias, replaceOriginalName){
        this.alias = alias;
        this.replaceOriginalName = replaceOriginalName;
    }
    static{
        this[entity/* entityKind */.Q] = "TableAliasProxyHandler";
    }
    get(target, prop) {
        if (prop === drizzle_orm_table/* Table */.iA.Symbol.IsAlias) {
            return true;
        }
        if (prop === drizzle_orm_table/* Table */.iA.Symbol.Name) {
            return this.alias;
        }
        if (this.replaceOriginalName && prop === drizzle_orm_table/* Table */.iA.Symbol.OriginalName) {
            return this.alias;
        }
        if (prop === view_common/* ViewBaseConfig */.d) {
            return {
                ...target[view_common/* ViewBaseConfig */.d],
                name: this.alias,
                isAlias: true
            };
        }
        if (prop === drizzle_orm_table/* Table */.iA.Symbol.Columns) {
            const columns = target[drizzle_orm_table/* Table */.iA.Symbol.Columns];
            if (!columns) {
                return columns;
            }
            const proxiedColumns = {};
            Object.keys(columns).map((key)=>{
                proxiedColumns[key] = new Proxy(columns[key], new ColumnAliasProxyHandler(new Proxy(target, this)));
            });
            return proxiedColumns;
        }
        const value = target[prop];
        if ((0,entity.is)(value, column/* Column */.s)) {
            return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
        }
        return value;
    }
}
class RelationTableAliasProxyHandler {
    constructor(alias){
        this.alias = alias;
    }
    static{
        this[entity/* entityKind */.Q] = "RelationTableAliasProxyHandler";
    }
    get(target, prop) {
        if (prop === "sourceTable") {
            return aliasedTable(target.sourceTable, this.alias);
        }
        return target[prop];
    }
}
function aliasedTable(table, tableAlias) {
    return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedRelation(relation, tableAlias) {
    return new Proxy(relation, new RelationTableAliasProxyHandler(tableAlias));
}
function aliasedTableColumn(column, tableAlias) {
    return new Proxy(column, new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false))));
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
    return new sql/* SQL */.$s.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
    return sql/* sql */.i6.join(query.queryChunks.map((c)=>{
        if ((0,entity.is)(c, column/* Column */.s)) {
            return aliasedTableColumn(c, alias);
        }
        if ((0,entity.is)(c, sql/* SQL */.$s)) {
            return mapColumnsInSQLToAlias(c, alias);
        }
        if ((0,entity.is)(c, sql/* SQL */.$s.Aliased)) {
            return mapColumnsInAliasedSQLToAlias(c, alias);
        }
        return c;
    }));
}
 //# sourceMappingURL=alias.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/subquery.js
var drizzle_orm_subquery = __webpack_require__(98724);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/selection-proxy.js






class SelectionProxyHandler {
    static{
        this[entity/* entityKind */.Q] = "SelectionProxyHandler";
    }
    constructor(config){
        this.config = {
            ...config
        };
    }
    get(subquery, prop) {
        if (prop === "_") {
            return {
                ...subquery["_"],
                selectedFields: new Proxy(subquery._.selectedFields, this)
            };
        }
        if (prop === view_common/* ViewBaseConfig */.d) {
            return {
                ...subquery[view_common/* ViewBaseConfig */.d],
                selectedFields: new Proxy(subquery[view_common/* ViewBaseConfig */.d].selectedFields, this)
            };
        }
        if (typeof prop === "symbol") {
            return subquery[prop];
        }
        const columns = (0,entity.is)(subquery, drizzle_orm_subquery/* Subquery */.k) ? subquery._.selectedFields : (0,entity.is)(subquery, sql/* View */.G7) ? subquery[view_common/* ViewBaseConfig */.d].selectedFields : subquery;
        const value = columns[prop];
        if ((0,entity.is)(value, sql/* SQL */.$s.Aliased)) {
            if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
                return value.sql;
            }
            const newValue = value.clone();
            newValue.isSelectionField = true;
            return newValue;
        }
        if ((0,entity.is)(value, sql/* SQL */.$s)) {
            if (this.config.sqlBehavior === "sql") {
                return value;
            }
            throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
        }
        if ((0,entity.is)(value, column/* Column */.s)) {
            if (this.config.alias) {
                return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(value.table, new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false))));
            }
            return value;
        }
        if (typeof value !== "object" || value === null) {
            return value;
        }
        return new Proxy(value, new SelectionProxyHandler(this.config));
    }
}
 //# sourceMappingURL=selection-proxy.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/casing.js


function toSnakeCase(input) {
    const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
    return words.map((word)=>word.toLowerCase()).join("_");
}
function toCamelCase(input) {
    const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
    return words.reduce((acc, word, i)=>{
        const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
        return acc + formattedWord;
    }, "");
}
function noopCase(input) {
    return input;
}
class CasingCache {
    static{
        this[entity/* entityKind */.Q] = "CasingCache";
    }
    constructor(casing){
        /** @internal */ this.cache = {};
        this.cachedTables = {};
        this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
    }
    getColumnCasing(column) {
        if (!column.keyAsName) return column.name;
        const schema = column.table[drizzle_orm_table/* Table */.iA.Symbol.Schema] ?? "public";
        const tableName = column.table[drizzle_orm_table/* Table */.iA.Symbol.OriginalName];
        const key = `${schema}.${tableName}.${column.name}`;
        if (!this.cache[key]) {
            this.cacheTable(column.table);
        }
        return this.cache[key];
    }
    cacheTable(table) {
        const schema = table[drizzle_orm_table/* Table */.iA.Symbol.Schema] ?? "public";
        const tableName = table[drizzle_orm_table/* Table */.iA.Symbol.OriginalName];
        const tableKey = `${schema}.${tableName}`;
        if (!this.cachedTables[tableKey]) {
            for (const column of Object.values(table[drizzle_orm_table/* Table */.iA.Symbol.Columns])){
                const columnKey = `${tableKey}.${column.name}`;
                this.cache[columnKey] = this.convert(column.name);
            }
            this.cachedTables[tableKey] = true;
        }
    }
    clearCache() {
        this.cache = {};
        this.cachedTables = {};
    }
}
 //# sourceMappingURL=casing.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/errors.js

class DrizzleError extends Error {
    static{
        this[entity/* entityKind */.Q] = "DrizzleError";
    }
    constructor({ message, cause }){
        super(message);
        this.name = "DrizzleError";
        this.cause = cause;
    }
}
class TransactionRollbackError extends DrizzleError {
    static{
        this[entity/* entityKind */.Q] = "TransactionRollbackError";
    }
    constructor(){
        super({
            message: "Rollback"
        });
    }
}
 //# sourceMappingURL=errors.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/expressions/conditions.js
var conditions = __webpack_require__(60466);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/common.js + 2 modules
var common = __webpack_require__(26209);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sqlite-core/table.js + 4 modules
var sqlite_core_table = __webpack_require__(40821);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/utils.js
var utils = __webpack_require__(66323);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/view-base.js


class SQLiteViewBase extends sql/* View */.G7 {
    static{
        this[entity/* entityKind */.Q] = "SQLiteViewBase";
    }
}
 //# sourceMappingURL=view-base.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/dialect.js















class SQLiteDialect {
    static{
        this[entity/* entityKind */.Q] = "SQLiteDialect";
    }
    constructor(config){
        this.casing = new CasingCache(config?.casing);
    }
    escapeName(name) {
        return `"${name}"`;
    }
    escapeParam(_num) {
        return "?";
    }
    escapeString(str) {
        return `'${str.replace(/'/g, "''")}'`;
    }
    buildWithCTE(queries) {
        if (!queries?.length) return void 0;
        const withSqlChunks = [
            sql/* sql */.i6`with `
        ];
        for (const [i, w] of queries.entries()){
            withSqlChunks.push(sql/* sql */.i6`${sql/* sql */.i6.identifier(w._.alias)} as (${w._.sql})`);
            if (i < queries.length - 1) {
                withSqlChunks.push(sql/* sql */.i6`, `);
            }
        }
        withSqlChunks.push(sql/* sql */.i6` `);
        return sql/* sql */.i6.join(withSqlChunks);
    }
    buildDeleteQuery({ table, where, returning, withList, limit, orderBy }) {
        const withSql = this.buildWithCTE(withList);
        const returningSql = returning ? sql/* sql */.i6` returning ${this.buildSelection(returning, {
            isSingleTable: true
        })}` : void 0;
        const whereSql = where ? sql/* sql */.i6` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql/* sql */.i6`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
    }
    buildUpdateSet(table, set) {
        const tableColumns = table[drizzle_orm_table/* Table */.iA.Symbol.Columns];
        const columnNames = Object.keys(tableColumns).filter((colName)=>set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0);
        const setSize = columnNames.length;
        return sql/* sql */.i6.join(columnNames.flatMap((colName, i)=>{
            const col = tableColumns[colName];
            const value = set[colName] ?? sql/* sql */.i6.param(col.onUpdateFn(), col);
            const res = sql/* sql */.i6`${sql/* sql */.i6.identifier(this.casing.getColumnCasing(col))} = ${value}`;
            if (i < setSize - 1) {
                return [
                    res,
                    sql/* sql */.i6.raw(", ")
                ];
            }
            return [
                res
            ];
        }));
    }
    buildUpdateQuery({ table, set, where, returning, withList, joins, from, limit, orderBy }) {
        const withSql = this.buildWithCTE(withList);
        const setSql = this.buildUpdateSet(table, set);
        const fromSql = from && sql/* sql */.i6.join([
            sql/* sql */.i6.raw(" from "),
            this.buildFromTable(from)
        ]);
        const joinsSql = this.buildJoins(joins);
        const returningSql = returning ? sql/* sql */.i6` returning ${this.buildSelection(returning, {
            isSingleTable: true
        })}` : void 0;
        const whereSql = where ? sql/* sql */.i6` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql/* sql */.i6`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
    }
    /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */ buildSelection(fields, { isSingleTable = false } = {}) {
        const columnsLen = fields.length;
        const chunks = fields.flatMap(({ field }, i)=>{
            const chunk = [];
            if ((0,entity.is)(field, sql/* SQL */.$s.Aliased) && field.isSelectionField) {
                chunk.push(sql/* sql */.i6.identifier(field.fieldAlias));
            } else if ((0,entity.is)(field, sql/* SQL */.$s.Aliased) || (0,entity.is)(field, sql/* SQL */.$s)) {
                const query = (0,entity.is)(field, sql/* SQL */.$s.Aliased) ? field.sql : field;
                if (isSingleTable) {
                    chunk.push(new sql/* SQL */.$s(query.queryChunks.map((c)=>{
                        if ((0,entity.is)(c, column/* Column */.s)) {
                            return sql/* sql */.i6.identifier(this.casing.getColumnCasing(c));
                        }
                        return c;
                    })));
                } else {
                    chunk.push(query);
                }
                if ((0,entity.is)(field, sql/* SQL */.$s.Aliased)) {
                    chunk.push(sql/* sql */.i6` as ${sql/* sql */.i6.identifier(field.fieldAlias)}`);
                }
            } else if ((0,entity.is)(field, column/* Column */.s)) {
                const tableName = field.table[drizzle_orm_table/* Table */.iA.Symbol.Name];
                if (field.columnType === "SQLiteNumericBigInt") {
                    if (isSingleTable) {
                        chunk.push(sql/* sql */.i6`cast(${sql/* sql */.i6.identifier(this.casing.getColumnCasing(field))} as text)`);
                    } else {
                        chunk.push(sql/* sql */.i6`cast(${sql/* sql */.i6.identifier(tableName)}.${sql/* sql */.i6.identifier(this.casing.getColumnCasing(field))} as text)`);
                    }
                } else {
                    if (isSingleTable) {
                        chunk.push(sql/* sql */.i6.identifier(this.casing.getColumnCasing(field)));
                    } else {
                        chunk.push(sql/* sql */.i6`${sql/* sql */.i6.identifier(tableName)}.${sql/* sql */.i6.identifier(this.casing.getColumnCasing(field))}`);
                    }
                }
            }
            if (i < columnsLen - 1) {
                chunk.push(sql/* sql */.i6`, `);
            }
            return chunk;
        });
        return sql/* sql */.i6.join(chunks);
    }
    buildJoins(joins) {
        if (!joins || joins.length === 0) {
            return void 0;
        }
        const joinsArray = [];
        if (joins) {
            for (const [index, joinMeta] of joins.entries()){
                if (index === 0) {
                    joinsArray.push(sql/* sql */.i6` `);
                }
                const table = joinMeta.table;
                const onSql = joinMeta.on ? sql/* sql */.i6` on ${joinMeta.on}` : void 0;
                if ((0,entity.is)(table, sqlite_core_table/* SQLiteTable */.xA)) {
                    const tableName = table[sqlite_core_table/* SQLiteTable */.xA.Symbol.Name];
                    const tableSchema = table[sqlite_core_table/* SQLiteTable */.xA.Symbol.Schema];
                    const origTableName = table[sqlite_core_table/* SQLiteTable */.xA.Symbol.OriginalName];
                    const alias = tableName === origTableName ? void 0 : joinMeta.alias;
                    joinsArray.push(sql/* sql */.i6`${sql/* sql */.i6.raw(joinMeta.joinType)} join ${tableSchema ? sql/* sql */.i6`${sql/* sql */.i6.identifier(tableSchema)}.` : void 0}${sql/* sql */.i6.identifier(origTableName)}${alias && sql/* sql */.i6` ${sql/* sql */.i6.identifier(alias)}`}${onSql}`);
                } else {
                    joinsArray.push(sql/* sql */.i6`${sql/* sql */.i6.raw(joinMeta.joinType)} join ${table}${onSql}`);
                }
                if (index < joins.length - 1) {
                    joinsArray.push(sql/* sql */.i6` `);
                }
            }
        }
        return sql/* sql */.i6.join(joinsArray);
    }
    buildLimit(limit) {
        return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql/* sql */.i6` limit ${limit}` : void 0;
    }
    buildOrderBy(orderBy) {
        const orderByList = [];
        if (orderBy) {
            for (const [index, orderByValue] of orderBy.entries()){
                orderByList.push(orderByValue);
                if (index < orderBy.length - 1) {
                    orderByList.push(sql/* sql */.i6`, `);
                }
            }
        }
        return orderByList.length > 0 ? sql/* sql */.i6` order by ${sql/* sql */.i6.join(orderByList)}` : void 0;
    }
    buildFromTable(table) {
        if ((0,entity.is)(table, drizzle_orm_table/* Table */.iA) && table[drizzle_orm_table/* Table */.iA.Symbol.IsAlias]) {
            return sql/* sql */.i6`${sql/* sql */.i6`${sql/* sql */.i6.identifier(table[drizzle_orm_table/* Table */.iA.Symbol.Schema] ?? "")}.`.if(table[drizzle_orm_table/* Table */.iA.Symbol.Schema])}${sql/* sql */.i6.identifier(table[drizzle_orm_table/* Table */.iA.Symbol.OriginalName])} ${sql/* sql */.i6.identifier(table[drizzle_orm_table/* Table */.iA.Symbol.Name])}`;
        }
        return table;
    }
    buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, distinct, setOperators }) {
        const fieldsList = fieldsFlat ?? (0,utils/* orderSelectedFields */.ZS)(fields);
        for (const f of fieldsList){
            if ((0,entity.is)(f.field, column/* Column */.s) && (0,drizzle_orm_table/* getTableName */.SP)(f.field.table) !== ((0,entity.is)(table, drizzle_orm_subquery/* Subquery */.k) ? table._.alias : (0,entity.is)(table, SQLiteViewBase) ? table[view_common/* ViewBaseConfig */.d].name : (0,entity.is)(table, sql/* SQL */.$s) ? void 0 : (0,drizzle_orm_table/* getTableName */.SP)(table)) && !((table2)=>joins?.some(({ alias })=>alias === (table2[drizzle_orm_table/* Table */.iA.Symbol.IsAlias] ? (0,drizzle_orm_table/* getTableName */.SP)(table2) : table2[drizzle_orm_table/* Table */.iA.Symbol.BaseName])))(f.field.table)) {
                const tableName = (0,drizzle_orm_table/* getTableName */.SP)(f.field.table);
                throw new Error(`Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
            }
        }
        const isSingleTable = !joins || joins.length === 0;
        const withSql = this.buildWithCTE(withList);
        const distinctSql = distinct ? sql/* sql */.i6` distinct` : void 0;
        const selection = this.buildSelection(fieldsList, {
            isSingleTable
        });
        const tableSql = this.buildFromTable(table);
        const joinsSql = this.buildJoins(joins);
        const whereSql = where ? sql/* sql */.i6` where ${where}` : void 0;
        const havingSql = having ? sql/* sql */.i6` having ${having}` : void 0;
        const groupByList = [];
        if (groupBy) {
            for (const [index, groupByValue] of groupBy.entries()){
                groupByList.push(groupByValue);
                if (index < groupBy.length - 1) {
                    groupByList.push(sql/* sql */.i6`, `);
                }
            }
        }
        const groupBySql = groupByList.length > 0 ? sql/* sql */.i6` group by ${sql/* sql */.i6.join(groupByList)}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        const offsetSql = offset ? sql/* sql */.i6` offset ${offset}` : void 0;
        const finalQuery = sql/* sql */.i6`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
        if (setOperators.length > 0) {
            return this.buildSetOperations(finalQuery, setOperators);
        }
        return finalQuery;
    }
    buildSetOperations(leftSelect, setOperators) {
        const [setOperator, ...rest] = setOperators;
        if (!setOperator) {
            throw new Error("Cannot pass undefined values to any set operator");
        }
        if (rest.length === 0) {
            return this.buildSetOperationQuery({
                leftSelect,
                setOperator
            });
        }
        return this.buildSetOperations(this.buildSetOperationQuery({
            leftSelect,
            setOperator
        }), rest);
    }
    buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset } }) {
        const leftChunk = sql/* sql */.i6`${leftSelect.getSQL()} `;
        const rightChunk = sql/* sql */.i6`${rightSelect.getSQL()}`;
        let orderBySql;
        if (orderBy && orderBy.length > 0) {
            const orderByValues = [];
            for (const singleOrderBy of orderBy){
                if ((0,entity.is)(singleOrderBy, common/* SQLiteColumn */.l)) {
                    orderByValues.push(sql/* sql */.i6.identifier(singleOrderBy.name));
                } else if ((0,entity.is)(singleOrderBy, sql/* SQL */.$s)) {
                    for(let i = 0; i < singleOrderBy.queryChunks.length; i++){
                        const chunk = singleOrderBy.queryChunks[i];
                        if ((0,entity.is)(chunk, common/* SQLiteColumn */.l)) {
                            singleOrderBy.queryChunks[i] = sql/* sql */.i6.identifier(this.casing.getColumnCasing(chunk));
                        }
                    }
                    orderByValues.push(sql/* sql */.i6`${singleOrderBy}`);
                } else {
                    orderByValues.push(sql/* sql */.i6`${singleOrderBy}`);
                }
            }
            orderBySql = sql/* sql */.i6` order by ${sql/* sql */.i6.join(orderByValues, sql/* sql */.i6`, `)}`;
        }
        const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql/* sql */.i6` limit ${limit}` : void 0;
        const operatorChunk = sql/* sql */.i6.raw(`${type} ${isAll ? "all " : ""}`);
        const offsetSql = offset ? sql/* sql */.i6` offset ${offset}` : void 0;
        return sql/* sql */.i6`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
    }
    buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select }) {
        const valuesSqlList = [];
        const columns = table[drizzle_orm_table/* Table */.iA.Symbol.Columns];
        const colEntries = Object.entries(columns).filter(([_, col])=>!col.shouldDisableInsert());
        const insertOrder = colEntries.map(([, column])=>sql/* sql */.i6.identifier(this.casing.getColumnCasing(column)));
        if (select) {
            const select2 = valuesOrSelect;
            if ((0,entity.is)(select2, sql/* SQL */.$s)) {
                valuesSqlList.push(select2);
            } else {
                valuesSqlList.push(select2.getSQL());
            }
        } else {
            const values = valuesOrSelect;
            valuesSqlList.push(sql/* sql */.i6.raw("values "));
            for (const [valueIndex, value] of values.entries()){
                const valueList = [];
                for (const [fieldName, col] of colEntries){
                    const colValue = value[fieldName];
                    if (colValue === void 0 || (0,entity.is)(colValue, sql/* Param */.dO) && colValue.value === void 0) {
                        let defaultValue;
                        if (col.default !== null && col.default !== void 0) {
                            defaultValue = (0,entity.is)(col.default, sql/* SQL */.$s) ? col.default : sql/* sql */.i6.param(col.default, col);
                        } else if (col.defaultFn !== void 0) {
                            const defaultFnResult = col.defaultFn();
                            defaultValue = (0,entity.is)(defaultFnResult, sql/* SQL */.$s) ? defaultFnResult : sql/* sql */.i6.param(defaultFnResult, col);
                        } else if (!col.default && col.onUpdateFn !== void 0) {
                            const onUpdateFnResult = col.onUpdateFn();
                            defaultValue = (0,entity.is)(onUpdateFnResult, sql/* SQL */.$s) ? onUpdateFnResult : sql/* sql */.i6.param(onUpdateFnResult, col);
                        } else {
                            defaultValue = sql/* sql */.i6`null`;
                        }
                        valueList.push(defaultValue);
                    } else {
                        valueList.push(colValue);
                    }
                }
                valuesSqlList.push(valueList);
                if (valueIndex < values.length - 1) {
                    valuesSqlList.push(sql/* sql */.i6`, `);
                }
            }
        }
        const withSql = this.buildWithCTE(withList);
        const valuesSql = sql/* sql */.i6.join(valuesSqlList);
        const returningSql = returning ? sql/* sql */.i6` returning ${this.buildSelection(returning, {
            isSingleTable: true
        })}` : void 0;
        const onConflictSql = onConflict?.length ? sql/* sql */.i6.join(onConflict) : void 0;
        return sql/* sql */.i6`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
    }
    sqlToQuery(sql2, invokeSource) {
        return sql2.toQuery({
            casing: this.casing,
            escapeName: this.escapeName,
            escapeParam: this.escapeParam,
            escapeString: this.escapeString,
            invokeSource
        });
    }
    buildRelationalQuery({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config, tableAlias, nestedQueryRelation, joinOn }) {
        let selection = [];
        let limit, offset, orderBy = [], where;
        const joins = [];
        if (config === true) {
            const selectionEntries = Object.entries(tableConfig.columns);
            selection = selectionEntries.map(([key, value])=>({
                    dbKey: value.name,
                    tsKey: key,
                    field: aliasedTableColumn(value, tableAlias),
                    relationTableTsKey: void 0,
                    isJson: false,
                    selection: []
                }));
        } else {
            const aliasedColumns = Object.fromEntries(Object.entries(tableConfig.columns).map(([key, value])=>[
                    key,
                    aliasedTableColumn(value, tableAlias)
                ]));
            if (config.where) {
                const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, (0,relations/* getOperators */.vU)()) : config.where;
                where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
            }
            const fieldsSelection = [];
            let selectedColumns = [];
            if (config.columns) {
                let isIncludeMode = false;
                for (const [field, value] of Object.entries(config.columns)){
                    if (value === void 0) {
                        continue;
                    }
                    if (field in tableConfig.columns) {
                        if (!isIncludeMode && value === true) {
                            isIncludeMode = true;
                        }
                        selectedColumns.push(field);
                    }
                }
                if (selectedColumns.length > 0) {
                    selectedColumns = isIncludeMode ? selectedColumns.filter((c)=>config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key)=>!selectedColumns.includes(key));
                }
            } else {
                selectedColumns = Object.keys(tableConfig.columns);
            }
            for (const field of selectedColumns){
                const column = tableConfig.columns[field];
                fieldsSelection.push({
                    tsKey: field,
                    value: column
                });
            }
            let selectedRelations = [];
            if (config.with) {
                selectedRelations = Object.entries(config.with).filter((entry)=>!!entry[1]).map(([tsKey, queryConfig])=>({
                        tsKey,
                        queryConfig,
                        relation: tableConfig.relations[tsKey]
                    }));
            }
            let extras;
            if (config.extras) {
                extras = typeof config.extras === "function" ? config.extras(aliasedColumns, {
                    sql: sql/* sql */.i6
                }) : config.extras;
                for (const [tsKey, value] of Object.entries(extras)){
                    fieldsSelection.push({
                        tsKey,
                        value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
                    });
                }
            }
            for (const { tsKey, value } of fieldsSelection){
                selection.push({
                    dbKey: (0,entity.is)(value, sql/* SQL */.$s.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
                    tsKey,
                    field: (0,entity.is)(value, column/* Column */.s) ? aliasedTableColumn(value, tableAlias) : value,
                    relationTableTsKey: void 0,
                    isJson: false,
                    selection: []
                });
            }
            let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, (0,relations/* getOrderByOperators */.pl)()) : config.orderBy ?? [];
            if (!Array.isArray(orderByOrig)) {
                orderByOrig = [
                    orderByOrig
                ];
            }
            orderBy = orderByOrig.map((orderByValue)=>{
                if ((0,entity.is)(orderByValue, column/* Column */.s)) {
                    return aliasedTableColumn(orderByValue, tableAlias);
                }
                return mapColumnsInSQLToAlias(orderByValue, tableAlias);
            });
            limit = config.limit;
            offset = config.offset;
            for (const { tsKey: selectedRelationTsKey, queryConfig: selectedRelationConfigValue, relation } of selectedRelations){
                const normalizedRelation = (0,relations/* normalizeRelation */.wG)(schema, tableNamesMap, relation);
                const relationTableName = (0,drizzle_orm_table/* getTableUniqueName */.Q0)(relation.referencedTable);
                const relationTableTsName = tableNamesMap[relationTableName];
                const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
                const joinOn2 = (0,conditions/* and */.xD)(...normalizedRelation.fields.map((field2, i)=>(0,conditions.eq)(aliasedTableColumn(normalizedRelation.references[i], relationTableAlias), aliasedTableColumn(field2, tableAlias))));
                const builtRelation = this.buildRelationalQuery({
                    fullSchema,
                    schema,
                    tableNamesMap,
                    table: fullSchema[relationTableTsName],
                    tableConfig: schema[relationTableTsName],
                    queryConfig: (0,entity.is)(relation, relations/* One */.fh) ? selectedRelationConfigValue === true ? {
                        limit: 1
                    } : {
                        ...selectedRelationConfigValue,
                        limit: 1
                    } : selectedRelationConfigValue,
                    tableAlias: relationTableAlias,
                    joinOn: joinOn2,
                    nestedQueryRelation: relation
                });
                const field = sql/* sql */.i6`(${builtRelation.sql})`.as(selectedRelationTsKey);
                selection.push({
                    dbKey: selectedRelationTsKey,
                    tsKey: selectedRelationTsKey,
                    field,
                    relationTableTsKey: relationTableTsName,
                    isJson: true,
                    selection: builtRelation.selection
                });
            }
        }
        if (selection.length === 0) {
            throw new DrizzleError({
                message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
            });
        }
        let result;
        where = (0,conditions/* and */.xD)(joinOn, where);
        if (nestedQueryRelation) {
            let field = sql/* sql */.i6`json_array(${sql/* sql */.i6.join(selection.map(({ field: field2 })=>(0,entity.is)(field2, common/* SQLiteColumn */.l) ? sql/* sql */.i6.identifier(this.casing.getColumnCasing(field2)) : (0,entity.is)(field2, sql/* SQL */.$s.Aliased) ? field2.sql : field2), sql/* sql */.i6`, `)})`;
            if ((0,entity.is)(nestedQueryRelation, relations/* Many */.sj)) {
                field = sql/* sql */.i6`coalesce(json_group_array(${field}), json_array())`;
            }
            const nestedSelection = [
                {
                    dbKey: "data",
                    tsKey: "data",
                    field: field.as("data"),
                    isJson: true,
                    relationTableTsKey: tableConfig.tsName,
                    selection
                }
            ];
            const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
            if (needsSubquery) {
                result = this.buildSelectQuery({
                    table: aliasedTable(table, tableAlias),
                    fields: {},
                    fieldsFlat: [
                        {
                            path: [],
                            field: sql/* sql */.i6.raw("*")
                        }
                    ],
                    where,
                    limit,
                    offset,
                    orderBy,
                    setOperators: []
                });
                where = void 0;
                limit = void 0;
                offset = void 0;
                orderBy = void 0;
            } else {
                result = aliasedTable(table, tableAlias);
            }
            result = this.buildSelectQuery({
                table: (0,entity.is)(result, sqlite_core_table/* SQLiteTable */.xA) ? result : new drizzle_orm_subquery/* Subquery */.k(result, {}, tableAlias),
                fields: {},
                fieldsFlat: nestedSelection.map(({ field: field2 })=>({
                        path: [],
                        field: (0,entity.is)(field2, column/* Column */.s) ? aliasedTableColumn(field2, tableAlias) : field2
                    })),
                joins,
                where,
                limit,
                offset,
                orderBy,
                setOperators: []
            });
        } else {
            result = this.buildSelectQuery({
                table: aliasedTable(table, tableAlias),
                fields: {},
                fieldsFlat: selection.map(({ field })=>({
                        path: [],
                        field: (0,entity.is)(field, column/* Column */.s) ? aliasedTableColumn(field, tableAlias) : field
                    })),
                joins,
                where,
                limit,
                offset,
                orderBy,
                setOperators: []
            });
        }
        return {
            tableTsKey: tableConfig.tsName,
            sql: result,
            selection
        };
    }
}
class SQLiteSyncDialect extends SQLiteDialect {
    static{
        this[entity/* entityKind */.Q] = "SQLiteSyncDialect";
    }
    migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql/* sql */.i6`
			CREATE TABLE IF NOT EXISTS ${sql/* sql */.i6.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        session.run(migrationTableCreate);
        const dbMigrations = session.values(sql/* sql */.i6`SELECT id, hash, created_at FROM ${sql/* sql */.i6.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
        const lastDbMigration = dbMigrations[0] ?? void 0;
        session.run(sql/* sql */.i6`BEGIN`);
        try {
            for (const migration of migrations){
                if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
                    for (const stmt of migration.sql){
                        session.run(sql/* sql */.i6.raw(stmt));
                    }
                    session.run(sql/* sql */.i6`INSERT INTO ${sql/* sql */.i6.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`);
                }
            }
            session.run(sql/* sql */.i6`COMMIT`);
        } catch (e) {
            session.run(sql/* sql */.i6`ROLLBACK`);
            throw e;
        }
    }
}
class SQLiteAsyncDialect extends SQLiteDialect {
    static{
        this[entity/* entityKind */.Q] = "SQLiteAsyncDialect";
    }
    async migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql/* sql */.i6`
			CREATE TABLE IF NOT EXISTS ${sql/* sql */.i6.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        await session.run(migrationTableCreate);
        const dbMigrations = await session.values(sql/* sql */.i6`SELECT id, hash, created_at FROM ${sql/* sql */.i6.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`);
        const lastDbMigration = dbMigrations[0] ?? void 0;
        await session.transaction(async (tx)=>{
            for (const migration of migrations){
                if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
                    for (const stmt of migration.sql){
                        await tx.run(sql/* sql */.i6.raw(stmt));
                    }
                    await tx.run(sql/* sql */.i6`INSERT INTO ${sql/* sql */.i6.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`);
                }
            }
        });
    }
}
 //# sourceMappingURL=dialect.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/query-builders/query-builder.js

class TypedQueryBuilder {
    static{
        this[entity/* entityKind */.Q] = "TypedQueryBuilder";
    }
    /** @internal */ getSelectedFields() {
        return this._.selectedFields;
    }
}
 //# sourceMappingURL=query-builder.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/query-promise.js

let prop;
class QueryPromise {
    static{
        prop = Symbol.toStringTag;
    }
    static{
        this[entity/* entityKind */.Q] = "QueryPromise";
    }
    catch(onRejected) {
        return this.then(void 0, onRejected);
    }
    finally(onFinally) {
        return this.then((value)=>{
            onFinally?.();
            return value;
        }, (reason)=>{
            onFinally?.();
            throw reason;
        });
    }
    then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
    }
    constructor(){
        this[prop] = "QueryPromise";
    }
}
 //# sourceMappingURL=query-promise.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/select.js










class SQLiteSelectBuilder {
    static{
        this[entity/* entityKind */.Q] = "SQLiteSelectBuilder";
    }
    constructor(config){
        this.fields = config.fields;
        this.session = config.session;
        this.dialect = config.dialect;
        this.withList = config.withList;
        this.distinct = config.distinct;
    }
    from(source) {
        const isPartialSelect = !!this.fields;
        let fields;
        if (this.fields) {
            fields = this.fields;
        } else if ((0,entity.is)(source, drizzle_orm_subquery/* Subquery */.k)) {
            fields = Object.fromEntries(Object.keys(source._.selectedFields).map((key)=>[
                    key,
                    source[key]
                ]));
        } else if ((0,entity.is)(source, SQLiteViewBase)) {
            fields = source[view_common/* ViewBaseConfig */.d].selectedFields;
        } else if ((0,entity.is)(source, sql/* SQL */.$s)) {
            fields = {};
        } else {
            fields = (0,utils/* getTableColumns */.SS)(source);
        }
        return new SQLiteSelectBase({
            table: source,
            fields,
            isPartialSelect,
            session: this.session,
            dialect: this.dialect,
            withList: this.withList,
            distinct: this.distinct
        });
    }
}
class SQLiteSelectQueryBuilderBase extends TypedQueryBuilder {
    static{
        this[entity/* entityKind */.Q] = "SQLiteSelectQueryBuilder";
    }
    constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }){
        super();
        /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */ this.leftJoin = this.createJoin("left");
        /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */ this.rightJoin = this.createJoin("right");
        /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */ this.innerJoin = this.createJoin("inner");
        /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */ this.fullJoin = this.createJoin("full");
        /**
   * Executes a `cross join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
   *
   * @param table the table to join.
   *
   * @example
   *
   * ```ts
   * // Select all users, each user with every pet
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .crossJoin(pets)
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .crossJoin(pets)
   * ```
   */ this.crossJoin = this.createJoin("cross");
        /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/sqlite-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */ this.union = this.createSetOperator("union", false);
        /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/sqlite-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */ this.unionAll = this.createSetOperator("union", true);
        /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/sqlite-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */ this.intersect = this.createSetOperator("intersect", false);
        /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/sqlite-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */ this.except = this.createSetOperator("except", false);
        this.config = {
            withList,
            table,
            fields: {
                ...fields
            },
            distinct,
            setOperators: []
        };
        this.isPartialSelect = isPartialSelect;
        this.session = session;
        this.dialect = dialect;
        this._ = {
            selectedFields: fields
        };
        this.tableName = (0,utils/* getTableLikeName */.dP)(table);
        this.joinsNotNullableMap = typeof this.tableName === "string" ? {
            [this.tableName]: true
        } : {};
    }
    createJoin(joinType) {
        return (table, on)=>{
            const baseTableName = this.tableName;
            const tableName = (0,utils/* getTableLikeName */.dP)(table);
            if (typeof tableName === "string" && this.config.joins?.some((join)=>join.alias === tableName)) {
                throw new Error(`Alias "${tableName}" is already used in this query`);
            }
            if (!this.isPartialSelect) {
                if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
                    this.config.fields = {
                        [baseTableName]: this.config.fields
                    };
                }
                if (typeof tableName === "string" && !(0,entity.is)(table, sql/* SQL */.$s)) {
                    const selection = (0,entity.is)(table, drizzle_orm_subquery/* Subquery */.k) ? table._.selectedFields : (0,entity.is)(table, sql/* View */.G7) ? table[view_common/* ViewBaseConfig */.d].selectedFields : table[drizzle_orm_table/* Table */.iA.Symbol.Columns];
                    this.config.fields[tableName] = selection;
                }
            }
            if (typeof on === "function") {
                on = on(new Proxy(this.config.fields, new SelectionProxyHandler({
                    sqlAliasedBehavior: "sql",
                    sqlBehavior: "sql"
                })));
            }
            if (!this.config.joins) {
                this.config.joins = [];
            }
            this.config.joins.push({
                on,
                table,
                joinType,
                alias: tableName
            });
            if (typeof tableName === "string") {
                switch(joinType){
                    case "left":
                        {
                            this.joinsNotNullableMap[tableName] = false;
                            break;
                        }
                    case "right":
                        {
                            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key])=>[
                                    key,
                                    false
                                ]));
                            this.joinsNotNullableMap[tableName] = true;
                            break;
                        }
                    case "cross":
                    case "inner":
                        {
                            this.joinsNotNullableMap[tableName] = true;
                            break;
                        }
                    case "full":
                        {
                            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key])=>[
                                    key,
                                    false
                                ]));
                            this.joinsNotNullableMap[tableName] = false;
                            break;
                        }
                }
            }
            return this;
        };
    }
    createSetOperator(type, isAll) {
        return (rightSelection)=>{
            const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
            if (!(0,utils/* haveSameKeys */.ux)(this.getSelectedFields(), rightSelect.getSelectedFields())) {
                throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
            }
            this.config.setOperators.push({
                type,
                isAll,
                rightSelect
            });
            return this;
        };
    }
    /** @internal */ addSetOperators(setOperators) {
        this.config.setOperators.push(...setOperators);
        return this;
    }
    /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */ where(where) {
        if (typeof where === "function") {
            where = where(new Proxy(this.config.fields, new SelectionProxyHandler({
                sqlAliasedBehavior: "sql",
                sqlBehavior: "sql"
            })));
        }
        this.config.where = where;
        return this;
    }
    /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */ having(having) {
        if (typeof having === "function") {
            having = having(new Proxy(this.config.fields, new SelectionProxyHandler({
                sqlAliasedBehavior: "sql",
                sqlBehavior: "sql"
            })));
        }
        this.config.having = having;
        return this;
    }
    groupBy(...columns) {
        if (typeof columns[0] === "function") {
            const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
                sqlAliasedBehavior: "alias",
                sqlBehavior: "sql"
            })));
            this.config.groupBy = Array.isArray(groupBy) ? groupBy : [
                groupBy
            ];
        } else {
            this.config.groupBy = columns;
        }
        return this;
    }
    orderBy(...columns) {
        if (typeof columns[0] === "function") {
            const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
                sqlAliasedBehavior: "alias",
                sqlBehavior: "sql"
            })));
            const orderByArray = Array.isArray(orderBy) ? orderBy : [
                orderBy
            ];
            if (this.config.setOperators.length > 0) {
                this.config.setOperators.at(-1).orderBy = orderByArray;
            } else {
                this.config.orderBy = orderByArray;
            }
        } else {
            const orderByArray = columns;
            if (this.config.setOperators.length > 0) {
                this.config.setOperators.at(-1).orderBy = orderByArray;
            } else {
                this.config.orderBy = orderByArray;
            }
        }
        return this;
    }
    /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */ limit(limit) {
        if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).limit = limit;
        } else {
            this.config.limit = limit;
        }
        return this;
    }
    /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */ offset(offset) {
        if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).offset = offset;
        } else {
            this.config.offset = offset;
        }
        return this;
    }
    /** @internal */ getSQL() {
        return this.dialect.buildSelectQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    as(alias) {
        return new Proxy(new drizzle_orm_subquery/* Subquery */.k(this.getSQL(), this.config.fields, alias), new SelectionProxyHandler({
            alias,
            sqlAliasedBehavior: "alias",
            sqlBehavior: "error"
        }));
    }
    /** @internal */ getSelectedFields() {
        return new Proxy(this.config.fields, new SelectionProxyHandler({
            alias: this.tableName,
            sqlAliasedBehavior: "alias",
            sqlBehavior: "error"
        }));
    }
    $dynamic() {
        return this;
    }
}
class SQLiteSelectBase extends SQLiteSelectQueryBuilderBase {
    static{
        this[entity/* entityKind */.Q] = "SQLiteSelect";
    }
    /** @internal */ _prepare(isOneTimeQuery = true) {
        if (!this.session) {
            throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
        }
        const fieldsList = (0,utils/* orderSelectedFields */.ZS)(this.config.fields);
        const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), fieldsList, "all", true);
        query.joinsNotNullableMap = this.joinsNotNullableMap;
        return query;
    }
    prepare() {
        return this._prepare(false);
    }
    async execute() {
        return this.all();
    }
    constructor(...args){
        super(...args);
        this.run = (placeholderValues)=>{
            return this._prepare().run(placeholderValues);
        };
        this.all = (placeholderValues)=>{
            return this._prepare().all(placeholderValues);
        };
        this.get = (placeholderValues)=>{
            return this._prepare().get(placeholderValues);
        };
        this.values = (placeholderValues)=>{
            return this._prepare().values(placeholderValues);
        };
    }
}
(0,utils/* applyMixins */.ef)(SQLiteSelectBase, [
    QueryPromise
]);
function createSetOperator(type, isAll) {
    return (leftSelect, rightSelect, ...restSelects)=>{
        const setOperators = [
            rightSelect,
            ...restSelects
        ].map((select)=>({
                type,
                isAll,
                rightSelect: select
            }));
        for (const setOperator of setOperators){
            if (!(0,utils/* haveSameKeys */.ux)(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
                throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
            }
        }
        return leftSelect.addSetOperators(setOperators);
    };
}
const getSQLiteSetOperators = ()=>({
        union,
        unionAll,
        intersect,
        except
    });
const union = createSetOperator("union", false);
const unionAll = createSetOperator("union", true);
const intersect = createSetOperator("intersect", false);
const except = createSetOperator("except", false);
 //# sourceMappingURL=select.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js





class QueryBuilder {
    static{
        this[entity/* entityKind */.Q] = "SQLiteQueryBuilder";
    }
    constructor(dialect){
        this.$with = (alias, selection)=>{
            const queryBuilder = this;
            const as = (qb)=>{
                if (typeof qb === "function") {
                    qb = qb(queryBuilder);
                }
                return new Proxy(new drizzle_orm_subquery/* WithSubquery */.S(qb.getSQL(), selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true), new SelectionProxyHandler({
                    alias,
                    sqlAliasedBehavior: "alias",
                    sqlBehavior: "error"
                }));
            };
            return {
                as
            };
        };
        this.dialect = (0,entity.is)(dialect, SQLiteDialect) ? dialect : void 0;
        this.dialectConfig = (0,entity.is)(dialect, SQLiteDialect) ? void 0 : dialect;
    }
    with(...queries) {
        const self = this;
        function select(fields) {
            return new SQLiteSelectBuilder({
                fields: fields ?? void 0,
                session: void 0,
                dialect: self.getDialect(),
                withList: queries
            });
        }
        function selectDistinct(fields) {
            return new SQLiteSelectBuilder({
                fields: fields ?? void 0,
                session: void 0,
                dialect: self.getDialect(),
                withList: queries,
                distinct: true
            });
        }
        return {
            select,
            selectDistinct
        };
    }
    select(fields) {
        return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: this.getDialect()
        });
    }
    selectDistinct(fields) {
        return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: this.getDialect(),
            distinct: true
        });
    }
    // Lazy load dialect to avoid circular dependency
    getDialect() {
        if (!this.dialect) {
            this.dialect = new SQLiteSyncDialect(this.dialectConfig);
        }
        return this.dialect;
    }
}
 //# sourceMappingURL=query-builder.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/update.js









class SQLiteUpdateBuilder {
    constructor(table, session, dialect, withList){
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteUpdateBuilder";
    }
    set(values) {
        return new SQLiteUpdateBase(this.table, (0,utils/* mapUpdateSet */.M6)(this.table, values), this.session, this.dialect, this.withList);
    }
}
class SQLiteUpdateBase extends QueryPromise {
    constructor(table, set, session, dialect, withList){
        super();
        this.leftJoin = this.createJoin("left");
        this.rightJoin = this.createJoin("right");
        this.innerJoin = this.createJoin("inner");
        this.fullJoin = this.createJoin("full");
        this.run = (placeholderValues)=>{
            return this._prepare().run(placeholderValues);
        };
        this.all = (placeholderValues)=>{
            return this._prepare().all(placeholderValues);
        };
        this.get = (placeholderValues)=>{
            return this._prepare().get(placeholderValues);
        };
        this.values = (placeholderValues)=>{
            return this._prepare().values(placeholderValues);
        };
        this.session = session;
        this.dialect = dialect;
        this.config = {
            set,
            table,
            withList,
            joins: []
        };
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteUpdate";
    }
    from(source) {
        this.config.from = source;
        return this;
    }
    createJoin(joinType) {
        return (table, on)=>{
            const tableName = (0,utils/* getTableLikeName */.dP)(table);
            if (typeof tableName === "string" && this.config.joins.some((join)=>join.alias === tableName)) {
                throw new Error(`Alias "${tableName}" is already used in this query`);
            }
            if (typeof on === "function") {
                const from = this.config.from ? (0,entity.is)(table, sqlite_core_table/* SQLiteTable */.xA) ? table[drizzle_orm_table/* Table */.iA.Symbol.Columns] : (0,entity.is)(table, drizzle_orm_subquery/* Subquery */.k) ? table._.selectedFields : (0,entity.is)(table, SQLiteViewBase) ? table[view_common/* ViewBaseConfig */.d].selectedFields : void 0 : void 0;
                on = on(new Proxy(this.config.table[drizzle_orm_table/* Table */.iA.Symbol.Columns], new SelectionProxyHandler({
                    sqlAliasedBehavior: "sql",
                    sqlBehavior: "sql"
                })), from && new Proxy(from, new SelectionProxyHandler({
                    sqlAliasedBehavior: "sql",
                    sqlBehavior: "sql"
                })));
            }
            this.config.joins.push({
                on,
                table,
                joinType,
                alias: tableName
            });
            return this;
        };
    }
    /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */ where(where) {
        this.config.where = where;
        return this;
    }
    orderBy(...columns) {
        if (typeof columns[0] === "function") {
            const orderBy = columns[0](new Proxy(this.config.table[drizzle_orm_table/* Table */.iA.Symbol.Columns], new SelectionProxyHandler({
                sqlAliasedBehavior: "alias",
                sqlBehavior: "sql"
            })));
            const orderByArray = Array.isArray(orderBy) ? orderBy : [
                orderBy
            ];
            this.config.orderBy = orderByArray;
        } else {
            const orderByArray = columns;
            this.config.orderBy = orderByArray;
        }
        return this;
    }
    limit(limit) {
        this.config.limit = limit;
        return this;
    }
    returning(fields = this.config.table[sqlite_core_table/* SQLiteTable */.xA.Symbol.Columns]) {
        this.config.returning = (0,utils/* orderSelectedFields */.ZS)(fields);
        return this;
    }
    /** @internal */ getSQL() {
        return this.dialect.buildUpdateQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    /** @internal */ _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? "all" : "run", true);
    }
    prepare() {
        return this._prepare(false);
    }
    async execute() {
        return this.config.returning ? this.all() : this.run();
    }
    $dynamic() {
        return this;
    }
}
 //# sourceMappingURL=update.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/insert.js







class SQLiteInsertBuilder {
    constructor(table, session, dialect, withList){
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteInsertBuilder";
    }
    values(values) {
        values = Array.isArray(values) ? values : [
            values
        ];
        if (values.length === 0) {
            throw new Error("values() must be called with at least one value");
        }
        const mappedValues = values.map((entry)=>{
            const result = {};
            const cols = this.table[drizzle_orm_table/* Table */.iA.Symbol.Columns];
            for (const colKey of Object.keys(entry)){
                const colValue = entry[colKey];
                result[colKey] = (0,entity.is)(colValue, sql/* SQL */.$s) ? colValue : new sql/* Param */.dO(colValue, cols[colKey]);
            }
            return result;
        });
        return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
    }
    select(selectQuery) {
        const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
        if (!(0,entity.is)(select, sql/* SQL */.$s) && !(0,utils/* haveSameKeys */.ux)(this.table[drizzle_orm_table/* Columns */.oe], select._.selectedFields)) {
            throw new Error("Insert select error: selected fields are not the same or are in a different order compared to the table definition");
        }
        return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
    }
}
class SQLiteInsertBase extends QueryPromise {
    constructor(table, values, session, dialect, withList, select){
        super();
        this.run = (placeholderValues)=>{
            return this._prepare().run(placeholderValues);
        };
        this.all = (placeholderValues)=>{
            return this._prepare().all(placeholderValues);
        };
        this.get = (placeholderValues)=>{
            return this._prepare().get(placeholderValues);
        };
        this.values = (placeholderValues)=>{
            return this._prepare().values(placeholderValues);
        };
        this.session = session;
        this.dialect = dialect;
        this.config = {
            table,
            values,
            withList,
            select
        };
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteInsert";
    }
    returning(fields = this.config.table[sqlite_core_table/* SQLiteTable */.xA.Symbol.Columns]) {
        this.config.returning = (0,utils/* orderSelectedFields */.ZS)(fields);
        return this;
    }
    /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */ onConflictDoNothing(config = {}) {
        if (!this.config.onConflict) this.config.onConflict = [];
        if (config.target === void 0) {
            this.config.onConflict.push(sql/* sql */.i6` on conflict do nothing`);
        } else {
            const targetSql = Array.isArray(config.target) ? sql/* sql */.i6`${config.target}` : sql/* sql */.i6`${[
                config.target
            ]}`;
            const whereSql = config.where ? sql/* sql */.i6` where ${config.where}` : sql/* sql */.i6``;
            this.config.onConflict.push(sql/* sql */.i6` on conflict ${targetSql} do nothing${whereSql}`);
        }
        return this;
    }
    /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */ onConflictDoUpdate(config) {
        if (config.where && (config.targetWhere || config.setWhere)) {
            throw new Error('You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.');
        }
        if (!this.config.onConflict) this.config.onConflict = [];
        const whereSql = config.where ? sql/* sql */.i6` where ${config.where}` : void 0;
        const targetWhereSql = config.targetWhere ? sql/* sql */.i6` where ${config.targetWhere}` : void 0;
        const setWhereSql = config.setWhere ? sql/* sql */.i6` where ${config.setWhere}` : void 0;
        const targetSql = Array.isArray(config.target) ? sql/* sql */.i6`${config.target}` : sql/* sql */.i6`${[
            config.target
        ]}`;
        const setSql = this.dialect.buildUpdateSet(this.config.table, (0,utils/* mapUpdateSet */.M6)(this.config.table, config.set));
        this.config.onConflict.push(sql/* sql */.i6` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`);
        return this;
    }
    /** @internal */ getSQL() {
        return this.dialect.buildInsertQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    /** @internal */ _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? "all" : "run", true);
    }
    prepare() {
        return this._prepare(false);
    }
    async execute() {
        return this.config.returning ? this.all() : this.run();
    }
    $dynamic() {
        return this;
    }
}
 //# sourceMappingURL=insert.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/delete.js






class SQLiteDeleteBase extends QueryPromise {
    constructor(table, session, dialect, withList){
        super();
        this.run = (placeholderValues)=>{
            return this._prepare().run(placeholderValues);
        };
        this.all = (placeholderValues)=>{
            return this._prepare().all(placeholderValues);
        };
        this.get = (placeholderValues)=>{
            return this._prepare().get(placeholderValues);
        };
        this.values = (placeholderValues)=>{
            return this._prepare().values(placeholderValues);
        };
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.config = {
            table,
            withList
        };
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteDelete";
    }
    /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */ where(where) {
        this.config.where = where;
        return this;
    }
    orderBy(...columns) {
        if (typeof columns[0] === "function") {
            const orderBy = columns[0](new Proxy(this.config.table[drizzle_orm_table/* Table */.iA.Symbol.Columns], new SelectionProxyHandler({
                sqlAliasedBehavior: "alias",
                sqlBehavior: "sql"
            })));
            const orderByArray = Array.isArray(orderBy) ? orderBy : [
                orderBy
            ];
            this.config.orderBy = orderByArray;
        } else {
            const orderByArray = columns;
            this.config.orderBy = orderByArray;
        }
        return this;
    }
    limit(limit) {
        this.config.limit = limit;
        return this;
    }
    returning(fields = this.table[sqlite_core_table/* SQLiteTable */.xA.Symbol.Columns]) {
        this.config.returning = (0,utils/* orderSelectedFields */.ZS)(fields);
        return this;
    }
    /** @internal */ getSQL() {
        return this.dialect.buildDeleteQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    /** @internal */ _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? "all" : "run", true);
    }
    prepare() {
        return this._prepare(false);
    }
    async execute(placeholderValues) {
        return this._prepare().execute(placeholderValues);
    }
    $dynamic() {
        return this;
    }
}
 //# sourceMappingURL=delete.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/count.js


let count_prop;
class SQLiteCountBuilder extends sql/* SQL */.$s {
    static{
        count_prop = Symbol.toStringTag;
    }
    constructor(params){
        super(SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
        this[count_prop] = "SQLiteCountBuilderAsync";
        this.params = params;
        this.session = params.session;
        this.sql = SQLiteCountBuilder.buildCount(params.source, params.filters);
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteCountBuilderAsync";
    }
    static buildEmbeddedCount(source, filters) {
        return sql/* sql */.i6`(select count(*) from ${source}${sql/* sql */.i6.raw(" where ").if(filters)}${filters})`;
    }
    static buildCount(source, filters) {
        return sql/* sql */.i6`select count(*) from ${source}${sql/* sql */.i6.raw(" where ").if(filters)}${filters}`;
    }
    then(onfulfilled, onrejected) {
        return Promise.resolve(this.session.count(this.sql)).then(onfulfilled, onrejected);
    }
    catch(onRejected) {
        return this.then(void 0, onRejected);
    }
    finally(onFinally) {
        return this.then((value)=>{
            onFinally?.();
            return value;
        }, (reason)=>{
            onFinally?.();
            throw reason;
        });
    }
}
 //# sourceMappingURL=count.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/query.js



class RelationalQueryBuilder {
    constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session){
        this.mode = mode;
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteAsyncRelationalQueryBuilder";
    }
    findMany(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many") : new SQLiteRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many");
    }
    findFirst(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? {
            ...config,
            limit: 1
        } : {
            limit: 1
        }, "first") : new SQLiteRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? {
            ...config,
            limit: 1
        } : {
            limit: 1
        }, "first");
    }
}
class SQLiteRelationalQuery extends QueryPromise {
    constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode){
        super();
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
        this.config = config;
        this.mode = mode;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteAsyncRelationalQuery";
    }
    /** @internal */ getSQL() {
        return this.dialect.buildRelationalQuery({
            fullSchema: this.fullSchema,
            schema: this.schema,
            tableNamesMap: this.tableNamesMap,
            table: this.table,
            tableConfig: this.tableConfig,
            queryConfig: this.config,
            tableAlias: this.tableConfig.tsName
        }).sql;
    }
    /** @internal */ _prepare(isOneTimeQuery = false) {
        const { query, builtQuery } = this._toSQL();
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](builtQuery, void 0, this.mode === "first" ? "get" : "all", true, (rawRows, mapColumnValue)=>{
            const rows = rawRows.map((row)=>(0,relations/* mapRelationalRow */.WX)(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
            if (this.mode === "first") {
                return rows[0];
            }
            return rows;
        });
    }
    prepare() {
        return this._prepare(false);
    }
    _toSQL() {
        const query = this.dialect.buildRelationalQuery({
            fullSchema: this.fullSchema,
            schema: this.schema,
            tableNamesMap: this.tableNamesMap,
            table: this.table,
            tableConfig: this.tableConfig,
            queryConfig: this.config,
            tableAlias: this.tableConfig.tsName
        });
        const builtQuery = this.dialect.sqlToQuery(query.sql);
        return {
            query,
            builtQuery
        };
    }
    toSQL() {
        return this._toSQL().builtQuery;
    }
    /** @internal */ executeRaw() {
        if (this.mode === "first") {
            return this._prepare(false).get();
        }
        return this._prepare(false).all();
    }
    async execute() {
        return this.executeRaw();
    }
}
class SQLiteSyncRelationalQuery extends SQLiteRelationalQuery {
    static{
        this[entity/* entityKind */.Q] = "SQLiteSyncRelationalQuery";
    }
    sync() {
        return this.executeRaw();
    }
}
 //# sourceMappingURL=query.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/query-builders/raw.js


class SQLiteRaw extends QueryPromise {
    constructor(execute, getSQL, action, dialect, mapBatchResult){
        super();
        this.execute = execute;
        this.getSQL = getSQL;
        this.dialect = dialect;
        this.mapBatchResult = mapBatchResult;
        this.config = {
            action
        };
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteRaw";
    }
    getQuery() {
        return {
            ...this.dialect.sqlToQuery(this.getSQL()),
            method: this.config.action
        };
    }
    mapResult(result, isFromBatch) {
        return isFromBatch ? this.mapBatchResult(result) : result;
    }
    _prepare() {
        return this;
    }
    /** @internal */ isResponseInArrayMode() {
        return false;
    }
}
 //# sourceMappingURL=raw.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/db.js








class BaseSQLiteDatabase {
    constructor(resultKind, dialect, session, schema){
        /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */ this.$with = (alias, selection)=>{
            const self = this;
            const as = (qb)=>{
                if (typeof qb === "function") {
                    qb = qb(new QueryBuilder(self.dialect));
                }
                return new Proxy(new drizzle_orm_subquery/* WithSubquery */.S(qb.getSQL(), selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true), new SelectionProxyHandler({
                    alias,
                    sqlAliasedBehavior: "alias",
                    sqlBehavior: "error"
                }));
            };
            return {
                as
            };
        };
        this.resultKind = resultKind;
        this.dialect = dialect;
        this.session = session;
        this._ = schema ? {
            schema: schema.schema,
            fullSchema: schema.fullSchema,
            tableNamesMap: schema.tableNamesMap
        } : {
            schema: void 0,
            fullSchema: {},
            tableNamesMap: {}
        };
        this.query = {};
        const query = this.query;
        if (this._.schema) {
            for (const [tableName, columns] of Object.entries(this._.schema)){
                query[tableName] = new RelationalQueryBuilder(resultKind, schema.fullSchema, this._.schema, this._.tableNamesMap, schema.fullSchema[tableName], columns, dialect, session);
            }
        }
    }
    static{
        this[entity/* entityKind */.Q] = "BaseSQLiteDatabase";
    }
    $count(source, filters) {
        return new SQLiteCountBuilder({
            source,
            filters,
            session: this.session
        });
    }
    /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */ with(...queries) {
        const self = this;
        function select(fields) {
            return new SQLiteSelectBuilder({
                fields: fields ?? void 0,
                session: self.session,
                dialect: self.dialect,
                withList: queries
            });
        }
        function selectDistinct(fields) {
            return new SQLiteSelectBuilder({
                fields: fields ?? void 0,
                session: self.session,
                dialect: self.dialect,
                withList: queries,
                distinct: true
            });
        }
        function update(table) {
            return new SQLiteUpdateBuilder(table, self.session, self.dialect, queries);
        }
        function insert(into) {
            return new SQLiteInsertBuilder(into, self.session, self.dialect, queries);
        }
        function delete_(from) {
            return new SQLiteDeleteBase(from, self.session, self.dialect, queries);
        }
        return {
            select,
            selectDistinct,
            update,
            insert,
            delete: delete_
        };
    }
    select(fields) {
        return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: this.session,
            dialect: this.dialect
        });
    }
    selectDistinct(fields) {
        return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: this.session,
            dialect: this.dialect,
            distinct: true
        });
    }
    /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */ update(table) {
        return new SQLiteUpdateBuilder(table, this.session, this.dialect);
    }
    /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */ insert(into) {
        return new SQLiteInsertBuilder(into, this.session, this.dialect);
    }
    /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */ delete(from) {
        return new SQLiteDeleteBase(from, this.session, this.dialect);
    }
    run(query) {
        const sequel = typeof query === "string" ? sql/* sql */.i6.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
            return new SQLiteRaw(async ()=>this.session.run(sequel), ()=>sequel, "run", this.dialect, this.session.extractRawRunValueFromBatchResult.bind(this.session));
        }
        return this.session.run(sequel);
    }
    all(query) {
        const sequel = typeof query === "string" ? sql/* sql */.i6.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
            return new SQLiteRaw(async ()=>this.session.all(sequel), ()=>sequel, "all", this.dialect, this.session.extractRawAllValueFromBatchResult.bind(this.session));
        }
        return this.session.all(sequel);
    }
    get(query) {
        const sequel = typeof query === "string" ? sql/* sql */.i6.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
            return new SQLiteRaw(async ()=>this.session.get(sequel), ()=>sequel, "get", this.dialect, this.session.extractRawGetValueFromBatchResult.bind(this.session));
        }
        return this.session.get(sequel);
    }
    values(query) {
        const sequel = typeof query === "string" ? sql/* sql */.i6.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
            return new SQLiteRaw(async ()=>this.session.values(sequel), ()=>sequel, "values", this.dialect, this.session.extractRawValuesValueFromBatchResult.bind(this.session));
        }
        return this.session.values(sequel);
    }
    transaction(transaction, config) {
        return this.session.transaction(transaction, config);
    }
}
const withReplicas = (primary, replicas, getReplica = ()=>replicas[Math.floor(Math.random() * replicas.length)])=>{
    const select = (...args)=>getReplica(replicas).select(...args);
    const selectDistinct = (...args)=>getReplica(replicas).selectDistinct(...args);
    const $count = (...args)=>getReplica(replicas).$count(...args);
    const $with = (...args)=>getReplica(replicas).with(...args);
    const update = (...args)=>primary.update(...args);
    const insert = (...args)=>primary.insert(...args);
    const $delete = (...args)=>primary.delete(...args);
    const run = (...args)=>primary.run(...args);
    const all = (...args)=>primary.all(...args);
    const get = (...args)=>primary.get(...args);
    const values = (...args)=>primary.values(...args);
    const transaction = (...args)=>primary.transaction(...args);
    return {
        ...primary,
        update,
        insert,
        delete: $delete,
        run,
        all,
        get,
        values,
        transaction,
        $primary: primary,
        select,
        selectDistinct,
        $count,
        with: $with,
        get query () {
            return getReplica(replicas).query;
        }
    };
};
 //# sourceMappingURL=db.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/session.js




class ExecuteResultSync extends QueryPromise {
    constructor(resultCb){
        super();
        this.resultCb = resultCb;
    }
    static{
        this[entity/* entityKind */.Q] = "ExecuteResultSync";
    }
    async execute() {
        return this.resultCb();
    }
    sync() {
        return this.resultCb();
    }
}
class SQLitePreparedQuery {
    constructor(mode, executeMethod, query){
        this.mode = mode;
        this.executeMethod = executeMethod;
        this.query = query;
    }
    static{
        this[entity/* entityKind */.Q] = "PreparedQuery";
    }
    getQuery() {
        return this.query;
    }
    mapRunResult(result, _isFromBatch) {
        return result;
    }
    mapAllResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
    }
    mapGetResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
    }
    execute(placeholderValues) {
        if (this.mode === "async") {
            return this[this.executeMethod](placeholderValues);
        }
        return new ExecuteResultSync(()=>this[this.executeMethod](placeholderValues));
    }
    mapResult(response, isFromBatch) {
        switch(this.executeMethod){
            case "run":
                {
                    return this.mapRunResult(response, isFromBatch);
                }
            case "all":
                {
                    return this.mapAllResult(response, isFromBatch);
                }
            case "get":
                {
                    return this.mapGetResult(response, isFromBatch);
                }
        }
    }
}
class SQLiteSession {
    constructor(dialect){
        this.dialect = dialect;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteSession";
    }
    prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode) {
        return this.prepareQuery(query, fields, executeMethod, isResponseInArrayMode);
    }
    run(query) {
        const staticQuery = this.dialect.sqlToQuery(query);
        try {
            return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
        } catch (err) {
            throw new DrizzleError({
                cause: err,
                message: `Failed to run the query '${staticQuery.sql}'`
            });
        }
    }
    /** @internal */ extractRawRunValueFromBatchResult(result) {
        return result;
    }
    all(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
    }
    /** @internal */ extractRawAllValueFromBatchResult(_result) {
        throw new Error("Not implemented");
    }
    get(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
    }
    /** @internal */ extractRawGetValueFromBatchResult(_result) {
        throw new Error("Not implemented");
    }
    values(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
    }
    async count(sql) {
        const result = await this.values(sql);
        return result[0][0];
    }
    /** @internal */ extractRawValuesValueFromBatchResult(_result) {
        throw new Error("Not implemented");
    }
}
class SQLiteTransaction extends BaseSQLiteDatabase {
    constructor(resultType, dialect, session, schema, nestedIndex = 0){
        super(resultType, dialect, session, schema);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteTransaction";
    }
    rollback() {
        throw new TransactionRollbackError();
    }
}
 //# sourceMappingURL=session.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/better-sqlite3/session.js






class BetterSQLiteSession extends SQLiteSession {
    constructor(client, dialect, schema, options = {}){
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.logger = options.logger ?? new NoopLogger();
    }
    static{
        this[entity/* entityKind */.Q] = "BetterSQLiteSession";
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        const stmt = this.client.prepare(query.sql);
        return new PreparedQuery(stmt, query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    transaction(transaction, config = {}) {
        const tx = new BetterSQLiteTransaction("sync", this.dialect, this, this.schema);
        const nativeTx = this.client.transaction(transaction);
        return nativeTx[config.behavior ?? "deferred"](tx);
    }
}
class BetterSQLiteTransaction extends SQLiteTransaction {
    static{
        this[entity/* entityKind */.Q] = "BetterSQLiteTransaction";
    }
    transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new BetterSQLiteTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
        this.session.run(sql/* sql */.i6.raw(`savepoint ${savepointName}`));
        try {
            const result = transaction(tx);
            this.session.run(sql/* sql */.i6.raw(`release savepoint ${savepointName}`));
            return result;
        } catch (err) {
            this.session.run(sql/* sql */.i6.raw(`rollback to savepoint ${savepointName}`));
            throw err;
        }
    }
}
class PreparedQuery extends SQLitePreparedQuery {
    constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper){
        super("sync", executeMethod, query);
        this.stmt = stmt;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
    }
    static{
        this[entity/* entityKind */.Q] = "BetterSQLitePreparedQuery";
    }
    run(placeholderValues) {
        const params = (0,sql/* fillPlaceholders */.Pr)(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.stmt.run(...params);
    }
    all(placeholderValues) {
        const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = (0,sql/* fillPlaceholders */.Pr)(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return stmt.all(...params);
        }
        const rows = this.values(placeholderValues);
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return rows.map((row)=>(0,utils/* mapResultRow */.M4)(fields, row, joinsNotNullableMap));
    }
    get(placeholderValues) {
        const params = (0,sql/* fillPlaceholders */.Pr)(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        const { fields, stmt, joinsNotNullableMap, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            return stmt.get(...params);
        }
        const row = stmt.raw().get(...params);
        if (!row) {
            return void 0;
        }
        if (customResultMapper) {
            return customResultMapper([
                row
            ]);
        }
        return (0,utils/* mapResultRow */.M4)(fields, row, joinsNotNullableMap);
    }
    values(placeholderValues) {
        const params = (0,sql/* fillPlaceholders */.Pr)(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.stmt.raw().all(...params);
    }
    /** @internal */ isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
 //# sourceMappingURL=session.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/better-sqlite3/driver.js








class BetterSQLite3Database extends BaseSQLiteDatabase {
    static{
        this[entity/* entityKind */.Q] = "BetterSQLite3Database";
    }
}
function construct(client, config = {}) {
    const dialect = new SQLiteSyncDialect({
        casing: config.casing
    });
    let logger;
    if (config.logger === true) {
        logger = new DefaultLogger();
    } else if (config.logger !== false) {
        logger = config.logger;
    }
    let schema;
    if (config.schema) {
        const tablesConfig = (0,relations/* extractTablesRelationalConfig */.pb)(config.schema, relations/* createTableRelationsHelpers */._J);
        schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap
        };
    }
    const session = new BetterSQLiteSession(client, dialect, schema, {
        logger
    });
    const db = new BetterSQLite3Database("sync", dialect, session, schema);
    db.$client = client;
    return db;
}
function drizzle(...params) {
    if (params[0] === void 0 || typeof params[0] === "string") {
        const instance = params[0] === void 0 ? new external_better_sqlite3_() : new external_better_sqlite3_(params[0]);
        return construct(instance, params[1]);
    }
    if ((0,utils/* isConfig */.wM)(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client) return construct(client, drizzleConfig);
        if (typeof connection === "object") {
            const { source, ...options } = connection;
            const instance2 = new external_better_sqlite3_(source, options);
            return construct(instance2, drizzleConfig);
        }
        const instance = new external_better_sqlite3_(connection);
        return construct(instance, drizzleConfig);
    }
    return construct(params[0], params[1]);
}
((drizzle2)=>{
    function mock(config) {
        return construct({}, config);
    }
    drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
 //# sourceMappingURL=driver.js.map


/***/ }),

/***/ 46721:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ ColumnBuilder)
/* harmony export */ });
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69574);

class ColumnBuilder {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_0__/* .entityKind */ .Q] = "ColumnBuilder";
    }
    constructor(name, dataType, columnType){
        /**
   * Alias for {@link $defaultFn}.
   */ this.$default = this.$defaultFn;
        /**
   * Alias for {@link $onUpdateFn}.
   */ this.$onUpdate = this.$onUpdateFn;
        this.config = {
            name,
            keyAsName: name === "",
            notNull: false,
            default: void 0,
            hasDefault: false,
            primaryKey: false,
            isUnique: false,
            uniqueName: void 0,
            uniqueType: void 0,
            dataType,
            columnType,
            generated: void 0
        };
    }
    /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */ $type() {
        return this;
    }
    /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */ notNull() {
        this.config.notNull = true;
        return this;
    }
    /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */ default(value) {
        this.config.default = value;
        this.config.hasDefault = true;
        return this;
    }
    /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */ $defaultFn(fn) {
        this.config.defaultFn = fn;
        this.config.hasDefault = true;
        return this;
    }
    /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */ $onUpdateFn(fn) {
        this.config.onUpdateFn = fn;
        this.config.hasDefault = true;
        return this;
    }
    /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */ primaryKey() {
        this.config.primaryKey = true;
        this.config.notNull = true;
        return this;
    }
    /** @internal Sets the name of the column to the key within the table definition if a name was not given. */ setName(name) {
        if (this.config.name !== "") return;
        this.config.name = name;
    }
}
 //# sourceMappingURL=column-builder.js.map


/***/ }),

/***/ 51582:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   s: () => (/* binding */ Column)
/* harmony export */ });
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69574);

class Column {
    constructor(table, config){
        this.enumValues = void 0;
        this.generated = void 0;
        this.generatedIdentity = void 0;
        this.table = table;
        this.config = config;
        this.name = config.name;
        this.keyAsName = config.keyAsName;
        this.notNull = config.notNull;
        this.default = config.default;
        this.defaultFn = config.defaultFn;
        this.onUpdateFn = config.onUpdateFn;
        this.hasDefault = config.hasDefault;
        this.primary = config.primaryKey;
        this.isUnique = config.isUnique;
        this.uniqueName = config.uniqueName;
        this.uniqueType = config.uniqueType;
        this.dataType = config.dataType;
        this.columnType = config.columnType;
        this.generated = config.generated;
        this.generatedIdentity = config.generatedIdentity;
    }
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_0__/* .entityKind */ .Q] = "Column";
    }
    mapFromDriverValue(value) {
        return value;
    }
    mapToDriverValue(value) {
        return value;
    }
    // ** @internal */
    shouldDisableInsert() {
        return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
    }
}
 //# sourceMappingURL=column.js.map


/***/ }),

/***/ 69574:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ entityKind),
/* harmony export */   is: () => (/* binding */ is)
/* harmony export */ });
/* unused harmony export hasOwnEntityKind */
const entityKind = Symbol.for("drizzle:entityKind");
const hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
    if (!value || typeof value !== "object") {
        return false;
    }
    if (value instanceof type) {
        return true;
    }
    if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
        throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
    }
    let cls = Object.getPrototypeOf(value).constructor;
    if (cls) {
        while(cls){
            if (entityKind in cls && cls[entityKind] === type[entityKind]) {
                return true;
            }
            cls = Object.getPrototypeOf(cls);
        }
    }
    return false;
}
 //# sourceMappingURL=entity.js.map


/***/ }),

/***/ 2260:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  sj: () => (/* binding */ Many),
  fh: () => (/* binding */ One),
  _J: () => (/* binding */ createTableRelationsHelpers),
  pb: () => (/* binding */ extractTablesRelationalConfig),
  vU: () => (/* binding */ getOperators),
  pl: () => (/* binding */ getOrderByOperators),
  WX: () => (/* binding */ mapRelationalRow),
  wG: () => (/* binding */ normalizeRelation),
  lE: () => (/* binding */ relations)
});

// UNUSED EXPORTS: Relation, Relations, createMany, createOne

// EXTERNAL MODULE: ./node_modules/drizzle-orm/table.js
var table = __webpack_require__(67611);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/column.js
var column = __webpack_require__(51582);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(69574);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/pg-core/table.js



const InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
const EnableRLS = Symbol.for("drizzle:EnableRLS");
let prop, prop1;
class PgTable extends table/* Table */.iA {
    static{
        prop = table/* Table */.iA.Symbol.ExtraConfigBuilder;
        prop1 = table/* Table */.iA.Symbol.ExtraConfigColumns;
    }
    static{
        this[entity/* entityKind */.Q] = "PgTable";
    }
    static{
        /** @internal */ this.Symbol = Object.assign({}, table/* Table */.iA.Symbol, {
            InlineForeignKeys,
            EnableRLS
        });
    }
    constructor(...args){
        super(...args);
        /**@internal */ this[InlineForeignKeys] = [];
        /** @internal */ this[EnableRLS] = false;
        /** @internal */ this[prop] = void 0;
        /** @internal */ this[prop1] = {};
    }
}
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new PgTable(name, schema, baseName);
    const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
    const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name2, colBuilderBase])=>{
        const colBuilder = colBuilderBase;
        colBuilder.setName(name2);
        const column = colBuilder.build(rawTable);
        rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
        return [
            name2,
            column
        ];
    }));
    const builtColumnsForExtraConfig = Object.fromEntries(Object.entries(parsedColumns).map(([name2, colBuilderBase])=>{
        const colBuilder = colBuilderBase;
        colBuilder.setName(name2);
        const column = colBuilder.buildExtraConfigColumn(rawTable);
        return [
            name2,
            column
        ];
    }));
    const table = Object.assign(rawTable, builtColumns);
    table[Table.Symbol.Columns] = builtColumns;
    table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
    if (extraConfig) {
        table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return Object.assign(table, {
        enableRLS: ()=>{
            table[PgTable.Symbol.EnableRLS] = true;
            return table;
        }
    });
}
const pgTable = (name, columns, extraConfig)=>{
    return pgTableWithSchema(name, columns, extraConfig, void 0);
};
function pgTableCreator(customizeTableName) {
    return (name, columns, extraConfig)=>{
        return pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
    };
}
 //# sourceMappingURL=table.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/pg-core/primary-keys.js


function primaryKey(...config) {
    if (config[0].columns) {
        return new PrimaryKeyBuilder(config[0].columns, config[0].name);
    }
    return new PrimaryKeyBuilder(config);
}
class PrimaryKeyBuilder {
    static{
        this[entity/* entityKind */.Q] = "PgPrimaryKeyBuilder";
    }
    constructor(columns, name){
        this.columns = columns;
        this.name = name;
    }
    /** @internal */ build(table) {
        return new PrimaryKey(table, this.columns, this.name);
    }
}
class PrimaryKey {
    constructor(table, columns, name){
        this.table = table;
        this.columns = columns;
        this.name = name;
    }
    static{
        this[entity/* entityKind */.Q] = "PgPrimaryKey";
    }
    getName() {
        return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column)=>column.name).join("_")}_pk`;
    }
}
 //# sourceMappingURL=primary-keys.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/expressions/conditions.js
var conditions = __webpack_require__(60466);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/sql.js + 8 modules
var sql = __webpack_require__(54410);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sql/expressions/select.js

function asc(column) {
    return sql/* sql */.i6`${column} asc`;
}
function desc(column) {
    return sql/* sql */.i6`${column} desc`;
}
 //# sourceMappingURL=select.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/relations.js






class Relation {
    constructor(sourceTable, referencedTable, relationName){
        this.sourceTable = sourceTable;
        this.referencedTable = referencedTable;
        this.relationName = relationName;
        this.referencedTableName = referencedTable[table/* Table */.iA.Symbol.Name];
    }
    static{
        this[entity/* entityKind */.Q] = "Relation";
    }
}
class Relations {
    constructor(table, config){
        this.table = table;
        this.config = config;
    }
    static{
        this[entity/* entityKind */.Q] = "Relations";
    }
}
class One extends Relation {
    constructor(sourceTable, referencedTable, config, isNullable){
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
        this.isNullable = isNullable;
    }
    static{
        this[entity/* entityKind */.Q] = "One";
    }
    withFieldName(fieldName) {
        const relation = new One(this.sourceTable, this.referencedTable, this.config, this.isNullable);
        relation.fieldName = fieldName;
        return relation;
    }
}
class Many extends Relation {
    constructor(sourceTable, referencedTable, config){
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
    }
    static{
        this[entity/* entityKind */.Q] = "Many";
    }
    withFieldName(fieldName) {
        const relation = new Many(this.sourceTable, this.referencedTable, this.config);
        relation.fieldName = fieldName;
        return relation;
    }
}
function getOperators() {
    return {
        and: conditions/* and */.xD,
        between: conditions/* between */.vX,
        eq: conditions.eq,
        exists: conditions/* exists */.Gg,
        gt: conditions.gt,
        gte: conditions/* gte */.eg,
        ilike: conditions/* ilike */.o$,
        inArray: conditions/* inArray */.d3,
        isNull: conditions/* isNull */.Ft,
        isNotNull: conditions/* isNotNull */.K0,
        like: conditions/* like */.vL,
        lt: conditions.lt,
        lte: conditions/* lte */.G,
        ne: conditions.ne,
        not: conditions/* not */.ff,
        notBetween: conditions/* notBetween */.OL,
        notExists: conditions/* notExists */.UN,
        notLike: conditions/* notLike */.Qg,
        notIlike: conditions/* notIlike */.mM,
        notInArray: conditions/* notInArray */.Nl,
        or: conditions.or,
        sql: sql/* sql */.i6
    };
}
function getOrderByOperators() {
    return {
        sql: sql/* sql */.i6,
        asc: asc,
        desc: desc
    };
}
function extractTablesRelationalConfig(schema, configHelpers) {
    if (Object.keys(schema).length === 1 && "default" in schema && !(0,entity.is)(schema["default"], table/* Table */.iA)) {
        schema = schema["default"];
    }
    const tableNamesMap = {};
    const relationsBuffer = {};
    const tablesConfig = {};
    for (const [key, value] of Object.entries(schema)){
        if ((0,entity.is)(value, table/* Table */.iA)) {
            const dbName = (0,table/* getTableUniqueName */.Q0)(value);
            const bufferedRelations = relationsBuffer[dbName];
            tableNamesMap[dbName] = key;
            tablesConfig[key] = {
                tsName: key,
                dbName: value[table/* Table */.iA.Symbol.Name],
                schema: value[table/* Table */.iA.Symbol.Schema],
                columns: value[table/* Table */.iA.Symbol.Columns],
                relations: bufferedRelations?.relations ?? {},
                primaryKey: bufferedRelations?.primaryKey ?? []
            };
            for (const column of Object.values(value[table/* Table */.iA.Symbol.Columns])){
                if (column.primary) {
                    tablesConfig[key].primaryKey.push(column);
                }
            }
            const extraConfig = value[table/* Table */.iA.Symbol.ExtraConfigBuilder]?.(value[table/* Table */.iA.Symbol.ExtraConfigColumns]);
            if (extraConfig) {
                for (const configEntry of Object.values(extraConfig)){
                    if ((0,entity.is)(configEntry, PrimaryKeyBuilder)) {
                        tablesConfig[key].primaryKey.push(...configEntry.columns);
                    }
                }
            }
        } else if ((0,entity.is)(value, Relations)) {
            const dbName = (0,table/* getTableUniqueName */.Q0)(value.table);
            const tableName = tableNamesMap[dbName];
            const relations2 = value.config(configHelpers(value.table));
            let primaryKey;
            for (const [relationName, relation] of Object.entries(relations2)){
                if (tableName) {
                    const tableConfig = tablesConfig[tableName];
                    tableConfig.relations[relationName] = relation;
                    if (primaryKey) {
                        tableConfig.primaryKey.push(...primaryKey);
                    }
                } else {
                    if (!(dbName in relationsBuffer)) {
                        relationsBuffer[dbName] = {
                            relations: {},
                            primaryKey
                        };
                    }
                    relationsBuffer[dbName].relations[relationName] = relation;
                }
            }
        }
    }
    return {
        tables: tablesConfig,
        tableNamesMap
    };
}
function relations(table, relations2) {
    return new Relations(table, (helpers)=>Object.fromEntries(Object.entries(relations2(helpers)).map(([key, value])=>[
                key,
                value.withFieldName(key)
            ])));
}
function createOne(sourceTable) {
    return function one(table, config) {
        return new One(sourceTable, table, config, config?.fields.reduce((res, f)=>res && f.notNull, true) ?? false);
    };
}
function createMany(sourceTable) {
    return function many(referencedTable, config) {
        return new Many(sourceTable, referencedTable, config);
    };
}
function normalizeRelation(schema, tableNamesMap, relation) {
    if ((0,entity.is)(relation, One) && relation.config) {
        return {
            fields: relation.config.fields,
            references: relation.config.references
        };
    }
    const referencedTableTsName = tableNamesMap[(0,table/* getTableUniqueName */.Q0)(relation.referencedTable)];
    if (!referencedTableTsName) {
        throw new Error(`Table "${relation.referencedTable[table/* Table */.iA.Symbol.Name]}" not found in schema`);
    }
    const referencedTableConfig = schema[referencedTableTsName];
    if (!referencedTableConfig) {
        throw new Error(`Table "${referencedTableTsName}" not found in schema`);
    }
    const sourceTable = relation.sourceTable;
    const sourceTableTsName = tableNamesMap[(0,table/* getTableUniqueName */.Q0)(sourceTable)];
    if (!sourceTableTsName) {
        throw new Error(`Table "${sourceTable[table/* Table */.iA.Symbol.Name]}" not found in schema`);
    }
    const reverseRelations = [];
    for (const referencedTableRelation of Object.values(referencedTableConfig.relations)){
        if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
            reverseRelations.push(referencedTableRelation);
        }
    }
    if (reverseRelations.length > 1) {
        throw relation.relationName ? new Error(`There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`) : new Error(`There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[table/* Table */.iA.Symbol.Name]}". Please specify relation name`);
    }
    if (reverseRelations[0] && (0,entity.is)(reverseRelations[0], One) && reverseRelations[0].config) {
        return {
            fields: reverseRelations[0].config.references,
            references: reverseRelations[0].config.fields
        };
    }
    throw new Error(`There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`);
}
function createTableRelationsHelpers(sourceTable) {
    return {
        one: createOne(sourceTable),
        many: createMany(sourceTable)
    };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value)=>value) {
    const result = {};
    for (const [selectionItemIndex, selectionItem] of buildQueryResultSelection.entries()){
        if (selectionItem.isJson) {
            const relation = tableConfig.relations[selectionItem.tsKey];
            const rawSubRows = row[selectionItemIndex];
            const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
            result[selectionItem.tsKey] = (0,entity.is)(relation, One) ? subRows && mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRows, selectionItem.selection, mapColumnValue) : subRows.map((subRow)=>mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRow, selectionItem.selection, mapColumnValue));
        } else {
            const value = mapColumnValue(row[selectionItemIndex]);
            const field = selectionItem.field;
            let decoder;
            if ((0,entity.is)(field, column/* Column */.s)) {
                decoder = field;
            } else if ((0,entity.is)(field, sql/* SQL */.$s)) {
                decoder = field.decoder;
            } else {
                decoder = field.sql.decoder;
            }
            result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
        }
    }
    return result;
}
 //# sourceMappingURL=relations.js.map


/***/ }),

/***/ 60466:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ft: () => (/* binding */ isNull),
/* harmony export */   G: () => (/* binding */ lte),
/* harmony export */   Gg: () => (/* binding */ exists),
/* harmony export */   K0: () => (/* binding */ isNotNull),
/* harmony export */   Nl: () => (/* binding */ notInArray),
/* harmony export */   OL: () => (/* binding */ notBetween),
/* harmony export */   Qg: () => (/* binding */ notLike),
/* harmony export */   UN: () => (/* binding */ notExists),
/* harmony export */   d3: () => (/* binding */ inArray),
/* harmony export */   eg: () => (/* binding */ gte),
/* harmony export */   eq: () => (/* binding */ eq),
/* harmony export */   ff: () => (/* binding */ not),
/* harmony export */   gt: () => (/* binding */ gt),
/* harmony export */   lt: () => (/* binding */ lt),
/* harmony export */   mM: () => (/* binding */ notIlike),
/* harmony export */   ne: () => (/* binding */ ne),
/* harmony export */   o$: () => (/* binding */ ilike),
/* harmony export */   or: () => (/* binding */ or),
/* harmony export */   vL: () => (/* binding */ like),
/* harmony export */   vX: () => (/* binding */ between),
/* harmony export */   xD: () => (/* binding */ and)
/* harmony export */ });
/* unused harmony exports arrayContained, arrayContains, arrayOverlaps, bindIfParam */
/* harmony import */ var _column_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(51582);
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69574);
/* harmony import */ var _table_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67611);
/* harmony import */ var _sql_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54410);




function bindIfParam(value, column) {
    if ((0,_sql_js__WEBPACK_IMPORTED_MODULE_0__/* .isDriverValueEncoder */ ._B)(column) && !(0,_sql_js__WEBPACK_IMPORTED_MODULE_0__/* .isSQLWrapper */ .zl)(value) && !(0,_entity_js__WEBPACK_IMPORTED_MODULE_1__.is)(value, _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .Param */ .dO) && !(0,_entity_js__WEBPACK_IMPORTED_MODULE_1__.is)(value, _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .Placeholder */ .Vm) && !(0,_entity_js__WEBPACK_IMPORTED_MODULE_1__.is)(value, _column_js__WEBPACK_IMPORTED_MODULE_2__/* .Column */ .s) && !(0,_entity_js__WEBPACK_IMPORTED_MODULE_1__.is)(value, _table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA) && !(0,_entity_js__WEBPACK_IMPORTED_MODULE_1__.is)(value, _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .View */ .G7)) {
        return new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .Param */ .dO(value, column);
    }
    return value;
}
const eq = (left, right)=>{
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${left} = ${bindIfParam(right, left)}`;
};
const ne = (left, right)=>{
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c)=>c !== void 0);
    if (conditions.length === 0) {
        return void 0;
    }
    if (conditions.length === 1) {
        return new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .SQL */ .$s(conditions);
    }
    return new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .SQL */ .$s([
        new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .StringChunk */ .Zm("("),
        _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6.join(conditions, new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .StringChunk */ .Zm(" and ")),
        new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .StringChunk */ .Zm(")")
    ]);
}
function or(...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c)=>c !== void 0);
    if (conditions.length === 0) {
        return void 0;
    }
    if (conditions.length === 1) {
        return new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .SQL */ .$s(conditions);
    }
    return new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .SQL */ .$s([
        new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .StringChunk */ .Zm("("),
        _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6.join(conditions, new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .StringChunk */ .Zm(" or ")),
        new _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .StringChunk */ .Zm(")")
    ]);
}
function not(condition) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`not ${condition}`;
}
const gt = (left, right)=>{
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${left} > ${bindIfParam(right, left)}`;
};
const gte = (left, right)=>{
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${left} >= ${bindIfParam(right, left)}`;
};
const lt = (left, right)=>{
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${left} < ${bindIfParam(right, left)}`;
};
const lte = (left, right)=>{
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`false`;
        }
        return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} in ${values.map((v)=>bindIfParam(v, column))}`;
    }
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`true`;
        }
        return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} not in ${values.map((v)=>bindIfParam(v, column))}`;
    }
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${value} is null`;
}
function isNotNull(value) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${value} is not null`;
}
function exists(subquery) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`exists ${subquery}`;
}
function notExists(subquery) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`not exists ${subquery}`;
}
function between(column, min, max) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function notBetween(column, min, max) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} like ${value}`;
}
function notLike(column, value) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} not like ${value}`;
}
function ilike(column, value) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} ilike ${value}`;
}
function notIlike(column, value) {
    return _sql_js__WEBPACK_IMPORTED_MODULE_0__/* .sql */ .i6`${column} not ilike ${value}`;
}
function arrayContains(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error("arrayContains requires at least one value");
        }
        const array = sql`${bindIfParam(values, column)}`;
        return sql`${column} @> ${array}`;
    }
    return sql`${column} @> ${bindIfParam(values, column)}`;
}
function arrayContained(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error("arrayContained requires at least one value");
        }
        const array = sql`${bindIfParam(values, column)}`;
        return sql`${column} <@ ${array}`;
    }
    return sql`${column} <@ ${bindIfParam(values, column)}`;
}
function arrayOverlaps(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error("arrayOverlaps requires at least one value");
        }
        const array = sql`${bindIfParam(values, column)}`;
        return sql`${column} && ${array}`;
    }
    return sql`${column} && ${bindIfParam(values, column)}`;
}
 //# sourceMappingURL=conditions.js.map


/***/ }),

/***/ 54410:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  dO: () => (/* binding */ Param),
  Vm: () => (/* binding */ Placeholder),
  $s: () => (/* binding */ SQL),
  Zm: () => (/* binding */ StringChunk),
  G7: () => (/* binding */ View),
  Pr: () => (/* binding */ fillPlaceholders),
  _B: () => (/* binding */ isDriverValueEncoder),
  zl: () => (/* binding */ isSQLWrapper),
  i6: () => (/* binding */ sql)
});

// UNUSED EXPORTS: FakePrimitiveParam, Name, getViewName, isView, name, noopDecoder, noopEncoder, noopMapper, param, placeholder

// EXTERNAL MODULE: ./node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(69574);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/column-builder.js
var column_builder = __webpack_require__(46721);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/column.js
var column = __webpack_require__(51582);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/table.utils.js
var table_utils = __webpack_require__(85211);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/pg-core/foreign-keys.js


class ForeignKeyBuilder {
    static{
        this[entity/* entityKind */.Q] = "PgForeignKeyBuilder";
    }
    constructor(config, actions){
        /** @internal */ this._onUpdate = "no action";
        /** @internal */ this._onDelete = "no action";
        this.reference = ()=>{
            const { name, columns, foreignColumns } = config();
            return {
                name,
                columns,
                foreignTable: foreignColumns[0].table,
                foreignColumns
            };
        };
        if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
        }
    }
    onUpdate(action) {
        this._onUpdate = action === void 0 ? "no action" : action;
        return this;
    }
    onDelete(action) {
        this._onDelete = action === void 0 ? "no action" : action;
        return this;
    }
    /** @internal */ build(table) {
        return new ForeignKey(table, this);
    }
}
class ForeignKey {
    constructor(table, builder){
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
    }
    static{
        this[entity/* entityKind */.Q] = "PgForeignKey";
    }
    getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column)=>column.name);
        const foreignColumnNames = foreignColumns.map((column)=>column.name);
        const chunks = [
            this.table[table_utils/* TableName */.m],
            ...columnNames,
            foreignColumns[0].table[table_utils/* TableName */.m],
            ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
    }
}
function foreignKey(config) {
    function mappedConfig() {
        const { name, columns, foreignColumns } = config;
        return {
            name,
            columns,
            foreignColumns
        };
    }
    return new ForeignKeyBuilder(mappedConfig);
}
 //# sourceMappingURL=foreign-keys.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
    return fn(...args);
}
 //# sourceMappingURL=tracing-utils.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/pg-core/unique-constraint.js


function unique(name) {
    return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
    return `${table[table_utils/* TableName */.m]}_${columns.join("_")}_unique`;
}
class UniqueConstraintBuilder {
    constructor(columns, name){
        /** @internal */ this.nullsNotDistinctConfig = false;
        this.name = name;
        this.columns = columns;
    }
    static{
        this[entity/* entityKind */.Q] = "PgUniqueConstraintBuilder";
    }
    nullsNotDistinct() {
        this.nullsNotDistinctConfig = true;
        return this;
    }
    /** @internal */ build(table) {
        return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
    }
}
class UniqueOnConstraintBuilder {
    static{
        this[entity/* entityKind */.Q] = "PgUniqueOnConstraintBuilder";
    }
    constructor(name){
        this.name = name;
    }
    on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
    }
}
class UniqueConstraint {
    constructor(table, columns, nullsNotDistinct, name){
        this.nullsNotDistinct = false;
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column)=>column.name));
        this.nullsNotDistinct = nullsNotDistinct;
    }
    static{
        this[entity/* entityKind */.Q] = "PgUniqueConstraint";
    }
    getName() {
        return this.name;
    }
}
 //# sourceMappingURL=unique-constraint.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
    for(let i = startFrom; i < arrayString.length; i++){
        const char = arrayString[i];
        if (char === "\\") {
            i++;
            continue;
        }
        if (char === '"') {
            return [
                arrayString.slice(startFrom, i).replace(/\\/g, ""),
                i + 1
            ];
        }
        if (inQuotes) {
            continue;
        }
        if (char === "," || char === "}") {
            return [
                arrayString.slice(startFrom, i).replace(/\\/g, ""),
                i
            ];
        }
    }
    return [
        arrayString.slice(startFrom).replace(/\\/g, ""),
        arrayString.length
    ];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
    const result = [];
    let i = startFrom;
    let lastCharIsComma = false;
    while(i < arrayString.length){
        const char = arrayString[i];
        if (char === ",") {
            if (lastCharIsComma || i === startFrom) {
                result.push("");
            }
            lastCharIsComma = true;
            i++;
            continue;
        }
        lastCharIsComma = false;
        if (char === "\\") {
            i += 2;
            continue;
        }
        if (char === '"') {
            const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
            result.push(value2);
            i = startFrom2;
            continue;
        }
        if (char === "}") {
            return [
                result,
                i + 1
            ];
        }
        if (char === "{") {
            const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
            result.push(value2);
            i = startFrom2;
            continue;
        }
        const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
        result.push(value);
        i = newStartFrom;
    }
    return [
        result,
        i
    ];
}
function parsePgArray(arrayString) {
    const [result] = parsePgNestedArray(arrayString, 1);
    return result;
}
function makePgArray(array) {
    return `{${array.map((item)=>{
        if (Array.isArray(item)) {
            return makePgArray(item);
        }
        if (typeof item === "string") {
            return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
        }
        return `${item}`;
    }).join(",")}}`;
}
 //# sourceMappingURL=array.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/pg-core/columns/common.js







class PgColumnBuilder extends column_builder/* ColumnBuilder */.L {
    static{
        this[entity/* entityKind */.Q] = "PgColumnBuilder";
    }
    array(size) {
        return new PgArrayBuilder(this.config.name, this, size);
    }
    references(ref, actions = {}) {
        this.foreignKeyConfigs.push({
            ref,
            actions
        });
        return this;
    }
    unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
    }
    generatedAlwaysAs(as) {
        this.config.generated = {
            as,
            type: "always",
            mode: "stored"
        };
        return this;
    }
    /** @internal */ buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions })=>{
            return iife((ref2, actions2)=>{
                const builder = new ForeignKeyBuilder(()=>{
                    const foreignColumn = ref2();
                    return {
                        columns: [
                            column
                        ],
                        foreignColumns: [
                            foreignColumn
                        ]
                    };
                });
                if (actions2.onUpdate) {
                    builder.onUpdate(actions2.onUpdate);
                }
                if (actions2.onDelete) {
                    builder.onDelete(actions2.onDelete);
                }
                return builder.build(table);
            }, ref, actions);
        });
    }
    /** @internal */ buildExtraConfigColumn(table) {
        return new ExtraConfigColumn(table, this.config);
    }
    constructor(...args){
        super(...args);
        this.foreignKeyConfigs = [];
    }
}
class PgColumn extends column/* Column */.s {
    constructor(table, config){
        if (!config.uniqueName) {
            config.uniqueName = uniqueKeyName(table, [
                config.name
            ]);
        }
        super(table, config);
        this.table = table;
    }
    static{
        this[entity/* entityKind */.Q] = "PgColumn";
    }
}
class ExtraConfigColumn extends PgColumn {
    static{
        this[entity/* entityKind */.Q] = "ExtraConfigColumn";
    }
    getSQLType() {
        return this.getSQLType();
    }
    asc() {
        this.indexConfig.order = "asc";
        return this;
    }
    desc() {
        this.indexConfig.order = "desc";
        return this;
    }
    nullsFirst() {
        this.indexConfig.nulls = "first";
        return this;
    }
    nullsLast() {
        this.indexConfig.nulls = "last";
        return this;
    }
    /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */ op(opClass) {
        this.indexConfig.opClass = opClass;
        return this;
    }
    constructor(...args){
        super(...args);
        this.indexConfig = {
            order: this.config.order ?? "asc",
            nulls: this.config.nulls ?? "last",
            opClass: this.config.opClass
        };
        this.defaultConfig = {
            order: "asc",
            nulls: "last",
            opClass: void 0
        };
    }
}
class IndexedColumn {
    static{
        this[entity/* entityKind */.Q] = "IndexedColumn";
    }
    constructor(name, keyAsName, type, indexConfig){
        this.name = name;
        this.keyAsName = keyAsName;
        this.type = type;
        this.indexConfig = indexConfig;
    }
}
class PgArrayBuilder extends PgColumnBuilder {
    static{
        this[entity/* entityKind */.Q] = "PgArrayBuilder";
    }
    constructor(name, baseBuilder, size){
        super(name, "array", "PgArray");
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
    }
    /** @internal */ build(table) {
        const baseColumn = this.config.baseBuilder.build(table);
        return new PgArray(table, this.config, baseColumn);
    }
}
class PgArray extends PgColumn {
    constructor(table, config, baseColumn, range){
        super(table, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
    }
    static{
        this[entity/* entityKind */.Q] = "PgArray";
    }
    getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            value = parsePgArray(value);
        }
        return value.map((v)=>this.baseColumn.mapFromDriverValue(v));
    }
    mapToDriverValue(value, isNestedArray = false) {
        const a = value.map((v)=>v === null ? null : (0,entity.is)(this.baseColumn, PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v));
        if (isNestedArray) return a;
        return makePgArray(a);
    }
}
 //# sourceMappingURL=common.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/pg-core/columns/enum.js


class PgEnumObjectColumnBuilder extends PgColumnBuilder {
    static{
        this[entity/* entityKind */.Q] = "PgEnumObjectColumnBuilder";
    }
    constructor(name, enumInstance){
        super(name, "string", "PgEnumObjectColumn");
        this.config.enum = enumInstance;
    }
    /** @internal */ build(table) {
        return new PgEnumObjectColumn(table, this.config);
    }
}
class PgEnumObjectColumn extends PgColumn {
    static{
        this[entity/* entityKind */.Q] = "PgEnumObjectColumn";
    }
    constructor(table, config){
        super(table, config);
        this.enumValues = this.config.enum.enumValues;
        this.enum = config.enum;
    }
    getSQLType() {
        return this.enum.enumName;
    }
}
const isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
    return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
class PgEnumColumnBuilder extends PgColumnBuilder {
    static{
        this[entity/* entityKind */.Q] = "PgEnumColumnBuilder";
    }
    constructor(name, enumInstance){
        super(name, "string", "PgEnumColumn");
        this.config.enum = enumInstance;
    }
    /** @internal */ build(table) {
        return new PgEnumColumn(table, this.config);
    }
}
class PgEnumColumn extends PgColumn {
    static{
        this[entity/* entityKind */.Q] = "PgEnumColumn";
    }
    constructor(table, config){
        super(table, config);
        this.enum = this.config.enum;
        this.enumValues = this.config.enum.enumValues;
        this.enum = config.enum;
    }
    getSQLType() {
        return this.enum.enumName;
    }
}
function pgEnum(enumName, input) {
    return Array.isArray(input) ? pgEnumWithSchema(enumName, [
        ...input
    ], void 0) : pgEnumObjectWithSchema(enumName, input, void 0);
}
function pgEnumWithSchema(enumName, values, schema) {
    const enumInstance = Object.assign((name)=>new PgEnumColumnBuilder(name ?? "", enumInstance), {
        enumName,
        enumValues: values,
        schema,
        [isPgEnumSym]: true
    });
    return enumInstance;
}
function pgEnumObjectWithSchema(enumName, values, schema) {
    const enumInstance = Object.assign((name)=>new PgEnumObjectColumnBuilder(name ?? "", enumInstance), {
        enumName,
        enumValues: Object.values(values),
        schema,
        [isPgEnumSym]: true
    });
    return enumInstance;
}
 //# sourceMappingURL=enum.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/subquery.js
var subquery = __webpack_require__(98724);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/version.js
// package.json
var version = "0.43.1";
// src/version.ts
var compatibilityVersion = 10;


;// CONCATENATED MODULE: ./node_modules/drizzle-orm/tracing.js


let otel;
let rawTracer;
const tracer = {
    startActiveSpan (name, fn) {
        if (!otel) {
            return fn();
        }
        if (!rawTracer) {
            rawTracer = otel.trace.getTracer("drizzle-orm", version);
        }
        return iife((otel2, rawTracer2)=>rawTracer2.startActiveSpan(name, (span)=>{
                try {
                    return fn(span);
                } catch (e) {
                    span.setStatus({
                        code: otel2.SpanStatusCode.ERROR,
                        message: e instanceof Error ? e.message : "Unknown error"
                    });
                    throw e;
                } finally{
                    span.end();
                }
            }), otel, rawTracer);
    }
};
 //# sourceMappingURL=tracing.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/view-common.js
var view_common = __webpack_require__(43498);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/table.js
var table = __webpack_require__(67611);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sql/sql.js







class FakePrimitiveParam {
    static{
        this[entity/* entityKind */.Q] = "FakePrimitiveParam";
    }
}
function isSQLWrapper(value) {
    return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
    const result = {
        sql: "",
        params: []
    };
    for (const query of queries){
        result.sql += query.sql;
        result.params.push(...query.params);
        if (query.typings?.length) {
            if (!result.typings) {
                result.typings = [];
            }
            result.typings.push(...query.typings);
        }
    }
    return result;
}
class StringChunk {
    static{
        this[entity/* entityKind */.Q] = "StringChunk";
    }
    constructor(value){
        this.value = Array.isArray(value) ? value : [
            value
        ];
    }
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
class SQL {
    constructor(queryChunks){
        /** @internal */ this.decoder = noopDecoder;
        this.shouldInlineParams = false;
        this.queryChunks = queryChunks;
    }
    static{
        this[entity/* entityKind */.Q] = "SQL";
    }
    append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
    }
    toQuery(config) {
        return tracer.startActiveSpan("drizzle.buildSQL", (span)=>{
            const query = this.buildQueryFromSourceParams(this.queryChunks, config);
            span?.setAttributes({
                "drizzle.query.text": query.sql,
                "drizzle.query.params": JSON.stringify(query.params)
            });
            return query;
        });
    }
    buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
            inlineParams: _config.inlineParams || this.shouldInlineParams,
            paramStartIndex: _config.paramStartIndex || {
                value: 0
            }
        });
        const { casing, escapeName, escapeParam, prepareTyping, inlineParams, paramStartIndex } = config;
        return mergeQueries(chunks.map((chunk)=>{
            if ((0,entity.is)(chunk, StringChunk)) {
                return {
                    sql: chunk.value.join(""),
                    params: []
                };
            }
            if ((0,entity.is)(chunk, Name)) {
                return {
                    sql: escapeName(chunk.value),
                    params: []
                };
            }
            if (chunk === void 0) {
                return {
                    sql: "",
                    params: []
                };
            }
            if (Array.isArray(chunk)) {
                const result = [
                    new StringChunk("(")
                ];
                for (const [i, p] of chunk.entries()){
                    result.push(p);
                    if (i < chunk.length - 1) {
                        result.push(new StringChunk(", "));
                    }
                }
                result.push(new StringChunk(")"));
                return this.buildQueryFromSourceParams(result, config);
            }
            if ((0,entity.is)(chunk, SQL)) {
                return this.buildQueryFromSourceParams(chunk.queryChunks, {
                    ...config,
                    inlineParams: inlineParams || chunk.shouldInlineParams
                });
            }
            if ((0,entity.is)(chunk, table/* Table */.iA)) {
                const schemaName = chunk[table/* Table */.iA.Symbol.Schema];
                const tableName = chunk[table/* Table */.iA.Symbol.Name];
                return {
                    sql: schemaName === void 0 || chunk[table/* IsAlias */.Zk] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
                    params: []
                };
            }
            if ((0,entity.is)(chunk, column/* Column */.s)) {
                const columnName = casing.getColumnCasing(chunk);
                if (_config.invokeSource === "indexes") {
                    return {
                        sql: escapeName(columnName),
                        params: []
                    };
                }
                const schemaName = chunk.table[table/* Table */.iA.Symbol.Schema];
                return {
                    sql: chunk.table[table/* IsAlias */.Zk] || schemaName === void 0 ? escapeName(chunk.table[table/* Table */.iA.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[table/* Table */.iA.Symbol.Name]) + "." + escapeName(columnName),
                    params: []
                };
            }
            if ((0,entity.is)(chunk, View)) {
                const schemaName = chunk[view_common/* ViewBaseConfig */.d].schema;
                const viewName = chunk[view_common/* ViewBaseConfig */.d].name;
                return {
                    sql: schemaName === void 0 || chunk[view_common/* ViewBaseConfig */.d].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
                    params: []
                };
            }
            if ((0,entity.is)(chunk, Param)) {
                if ((0,entity.is)(chunk.value, Placeholder)) {
                    return {
                        sql: escapeParam(paramStartIndex.value++, chunk),
                        params: [
                            chunk
                        ],
                        typings: [
                            "none"
                        ]
                    };
                }
                const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
                if ((0,entity.is)(mappedValue, SQL)) {
                    return this.buildQueryFromSourceParams([
                        mappedValue
                    ], config);
                }
                if (inlineParams) {
                    return {
                        sql: this.mapInlineParam(mappedValue, config),
                        params: []
                    };
                }
                let typings = [
                    "none"
                ];
                if (prepareTyping) {
                    typings = [
                        prepareTyping(chunk.encoder)
                    ];
                }
                return {
                    sql: escapeParam(paramStartIndex.value++, mappedValue),
                    params: [
                        mappedValue
                    ],
                    typings
                };
            }
            if ((0,entity.is)(chunk, Placeholder)) {
                return {
                    sql: escapeParam(paramStartIndex.value++, chunk),
                    params: [
                        chunk
                    ],
                    typings: [
                        "none"
                    ]
                };
            }
            if ((0,entity.is)(chunk, SQL.Aliased) && chunk.fieldAlias !== void 0) {
                return {
                    sql: escapeName(chunk.fieldAlias),
                    params: []
                };
            }
            if ((0,entity.is)(chunk, subquery/* Subquery */.k)) {
                if (chunk._.isWith) {
                    return {
                        sql: escapeName(chunk._.alias),
                        params: []
                    };
                }
                return this.buildQueryFromSourceParams([
                    new StringChunk("("),
                    chunk._.sql,
                    new StringChunk(") "),
                    new Name(chunk._.alias)
                ], config);
            }
            if (isPgEnum(chunk)) {
                if (chunk.schema) {
                    return {
                        sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName),
                        params: []
                    };
                }
                return {
                    sql: escapeName(chunk.enumName),
                    params: []
                };
            }
            if (isSQLWrapper(chunk)) {
                if (chunk.shouldOmitSQLParens?.()) {
                    return this.buildQueryFromSourceParams([
                        chunk.getSQL()
                    ], config);
                }
                return this.buildQueryFromSourceParams([
                    new StringChunk("("),
                    chunk.getSQL(),
                    new StringChunk(")")
                ], config);
            }
            if (inlineParams) {
                return {
                    sql: this.mapInlineParam(chunk, config),
                    params: []
                };
            }
            return {
                sql: escapeParam(paramStartIndex.value++, chunk),
                params: [
                    chunk
                ],
                typings: [
                    "none"
                ]
            };
        }));
    }
    mapInlineParam(chunk, { escapeString }) {
        if (chunk === null) {
            return "null";
        }
        if (typeof chunk === "number" || typeof chunk === "boolean") {
            return chunk.toString();
        }
        if (typeof chunk === "string") {
            return escapeString(chunk);
        }
        if (typeof chunk === "object") {
            const mappedValueAsString = chunk.toString();
            if (mappedValueAsString === "[object Object]") {
                return escapeString(JSON.stringify(chunk));
            }
            return escapeString(mappedValueAsString);
        }
        throw new Error("Unexpected param value: " + chunk);
    }
    getSQL() {
        return this;
    }
    as(alias) {
        if (alias === void 0) {
            return this;
        }
        return new SQL.Aliased(this, alias);
    }
    mapWith(decoder) {
        this.decoder = typeof decoder === "function" ? {
            mapFromDriverValue: decoder
        } : decoder;
        return this;
    }
    inlineParams() {
        this.shouldInlineParams = true;
        return this;
    }
    /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */ if(condition) {
        return condition ? this : void 0;
    }
}
class Name {
    constructor(value){
        this.value = value;
    }
    static{
        this[entity/* entityKind */.Q] = "Name";
    }
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function sql_name(value) {
    return new Name(value);
}
function isDriverValueEncoder(value) {
    return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
const noopDecoder = {
    mapFromDriverValue: (value)=>value
};
const noopEncoder = {
    mapToDriverValue: (value)=>value
};
const noopMapper = {
    ...noopDecoder,
    ...noopEncoder
};
class Param {
    /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */ constructor(value, encoder = noopEncoder){
        this.value = value;
        this.encoder = encoder;
    }
    static{
        this[entity/* entityKind */.Q] = "Param";
    }
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function param(value, encoder) {
    return new Param(value, encoder);
}
function sql(strings, ...params) {
    const queryChunks = [];
    if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
        queryChunks.push(new StringChunk(strings[0]));
    }
    for (const [paramIndex, param2] of params.entries()){
        queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
    }
    return new SQL(queryChunks);
}
((sql2)=>{
    function empty() {
        return new SQL([]);
    }
    sql2.empty = empty;
    function fromList(list) {
        return new SQL(list);
    }
    sql2.fromList = fromList;
    function raw(str) {
        return new SQL([
            new StringChunk(str)
        ]);
    }
    sql2.raw = raw;
    function join(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()){
            if (i > 0 && separator !== void 0) {
                result.push(separator);
            }
            result.push(chunk);
        }
        return new SQL(result);
    }
    sql2.join = join;
    function identifier(value) {
        return new Name(value);
    }
    sql2.identifier = identifier;
    function placeholder2(name2) {
        return new Placeholder(name2);
    }
    sql2.placeholder = placeholder2;
    function param2(value, encoder) {
        return new Param(value, encoder);
    }
    sql2.param = param2;
})(sql || (sql = {}));
((SQL2)=>{
    class Aliased {
        constructor(sql2, fieldAlias){
            /** @internal */ this.isSelectionField = false;
            this.sql = sql2;
            this.fieldAlias = fieldAlias;
        }
        static{
            this[entity/* entityKind */.Q] = "SQL.Aliased";
        }
        getSQL() {
            return this.sql;
        }
        /** @internal */ clone() {
            return new Aliased(this.sql, this.fieldAlias);
        }
    }
    SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
class Placeholder {
    constructor(name2){
        this.name = name2;
    }
    static{
        this[entity/* entityKind */.Q] = "Placeholder";
    }
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function placeholder(name2) {
    return new Placeholder(name2);
}
function fillPlaceholders(params, values) {
    return params.map((p)=>{
        if ((0,entity.is)(p, Placeholder)) {
            if (!(p.name in values)) {
                throw new Error(`No value for placeholder "${p.name}" was provided`);
            }
            return values[p.name];
        }
        if ((0,entity.is)(p, Param) && (0,entity.is)(p.value, Placeholder)) {
            if (!(p.value.name in values)) {
                throw new Error(`No value for placeholder "${p.value.name}" was provided`);
            }
            return p.encoder.mapToDriverValue(values[p.value.name]);
        }
        return p;
    });
}
const IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
class View {
    static{
        this[entity/* entityKind */.Q] = "View";
    }
    constructor({ name: name2, schema, selectedFields, query }){
        /** @internal */ this[IsDrizzleView] = true;
        this[view_common/* ViewBaseConfig */.d] = {
            name: name2,
            originalName: name2,
            schema,
            selectedFields,
            query,
            isExisting: !query,
            isAlias: false
        };
    }
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function isView(view) {
    return typeof view === "object" && view !== null && IsDrizzleView in view;
}
function getViewName(view) {
    return view[ViewBaseConfig].name;
}
column/* Column */.s.prototype.getSQL = function() {
    return new SQL([
        this
    ]);
};
table/* Table */.iA.prototype.getSQL = function() {
    return new SQL([
        this
    ]);
};
subquery/* Subquery */.k.prototype.getSQL = function() {
    return new SQL([
        this
    ]);
};
 //# sourceMappingURL=sql.js.map


/***/ }),

/***/ 26209:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  l: () => (/* binding */ SQLiteColumn),
  d: () => (/* binding */ SQLiteColumnBuilder)
});

// EXTERNAL MODULE: ./node_modules/drizzle-orm/column-builder.js
var column_builder = __webpack_require__(46721);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/column.js
var column = __webpack_require__(51582);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(69574);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/table.utils.js
var table_utils = __webpack_require__(85211);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/foreign-keys.js


class ForeignKeyBuilder {
    static{
        this[entity/* entityKind */.Q] = "SQLiteForeignKeyBuilder";
    }
    constructor(config, actions){
        this.reference = ()=>{
            const { name, columns, foreignColumns } = config();
            return {
                name,
                columns,
                foreignTable: foreignColumns[0].table,
                foreignColumns
            };
        };
        if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
        }
    }
    onUpdate(action) {
        this._onUpdate = action;
        return this;
    }
    onDelete(action) {
        this._onDelete = action;
        return this;
    }
    /** @internal */ build(table) {
        return new ForeignKey(table, this);
    }
}
class ForeignKey {
    constructor(table, builder){
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteForeignKey";
    }
    getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column)=>column.name);
        const foreignColumnNames = foreignColumns.map((column)=>column.name);
        const chunks = [
            this.table[table_utils/* TableName */.m],
            ...columnNames,
            foreignColumns[0].table[table_utils/* TableName */.m],
            ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
    }
}
function foreignKey(config) {
    function mappedConfig() {
        if (typeof config === "function") {
            const { name, columns, foreignColumns } = config();
            return {
                name,
                columns,
                foreignColumns
            };
        }
        return config;
    }
    return new ForeignKeyBuilder(mappedConfig);
}
 //# sourceMappingURL=foreign-keys.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/unique-constraint.js


function uniqueKeyName(table, columns) {
    return `${table[table_utils/* TableName */.m]}_${columns.join("_")}_unique`;
}
function unique(name) {
    return new UniqueOnConstraintBuilder(name);
}
class UniqueConstraintBuilder {
    constructor(columns, name){
        this.name = name;
        this.columns = columns;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteUniqueConstraintBuilder";
    }
    /** @internal */ build(table) {
        return new UniqueConstraint(table, this.columns, this.name);
    }
}
class UniqueOnConstraintBuilder {
    static{
        this[entity/* entityKind */.Q] = "SQLiteUniqueOnConstraintBuilder";
    }
    constructor(name){
        this.name = name;
    }
    on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
    }
}
class UniqueConstraint {
    constructor(table, columns, name){
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column)=>column.name));
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteUniqueConstraint";
    }
    getName() {
        return this.name;
    }
}
 //# sourceMappingURL=unique-constraint.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/common.js





class SQLiteColumnBuilder extends column_builder/* ColumnBuilder */.L {
    static{
        this[entity/* entityKind */.Q] = "SQLiteColumnBuilder";
    }
    references(ref, actions = {}) {
        this.foreignKeyConfigs.push({
            ref,
            actions
        });
        return this;
    }
    unique(name) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        return this;
    }
    generatedAlwaysAs(as, config) {
        this.config.generated = {
            as,
            type: "always",
            mode: config?.mode ?? "virtual"
        };
        return this;
    }
    /** @internal */ buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions })=>{
            return ((ref2, actions2)=>{
                const builder = new ForeignKeyBuilder(()=>{
                    const foreignColumn = ref2();
                    return {
                        columns: [
                            column
                        ],
                        foreignColumns: [
                            foreignColumn
                        ]
                    };
                });
                if (actions2.onUpdate) {
                    builder.onUpdate(actions2.onUpdate);
                }
                if (actions2.onDelete) {
                    builder.onDelete(actions2.onDelete);
                }
                return builder.build(table);
            })(ref, actions);
        });
    }
    constructor(...args){
        super(...args);
        this.foreignKeyConfigs = [];
    }
}
class SQLiteColumn extends column/* Column */.s {
    constructor(table, config){
        if (!config.uniqueName) {
            config.uniqueName = uniqueKeyName(table, [
                config.name
            ]);
        }
        super(table, config);
        this.table = table;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteColumn";
    }
}
 //# sourceMappingURL=common.js.map


/***/ }),

/***/ 77294:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _L: () => (/* binding */ integer)
/* harmony export */ });
/* unused harmony exports SQLiteBaseInteger, SQLiteBaseIntegerBuilder, SQLiteBoolean, SQLiteBooleanBuilder, SQLiteInteger, SQLiteIntegerBuilder, SQLiteTimestamp, SQLiteTimestampBuilder, int */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69574);
/* harmony import */ var _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(54410);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(66323);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26209);




class SQLiteBaseIntegerBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .d {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteBaseIntegerBuilder";
    }
    constructor(name, dataType, columnType){
        super(name, dataType, columnType);
        this.config.autoIncrement = false;
    }
    primaryKey(config) {
        if (config?.autoIncrement) {
            this.config.autoIncrement = true;
        }
        this.config.hasDefault = true;
        return super.primaryKey();
    }
}
class SQLiteBaseInteger extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .l {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteBaseInteger";
    }
    getSQLType() {
        return "integer";
    }
    constructor(...args){
        super(...args);
        this.autoIncrement = this.config.autoIncrement;
    }
}
class SQLiteIntegerBuilder extends SQLiteBaseIntegerBuilder {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteIntegerBuilder";
    }
    constructor(name){
        super(name, "number", "SQLiteInteger");
    }
    build(table) {
        return new SQLiteInteger(table, this.config);
    }
}
class SQLiteInteger extends SQLiteBaseInteger {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteInteger";
    }
}
class SQLiteTimestampBuilder extends SQLiteBaseIntegerBuilder {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteTimestampBuilder";
    }
    constructor(name, mode){
        super(name, "date", "SQLiteTimestamp");
        this.config.mode = mode;
    }
    /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */ defaultNow() {
        return this.default(_sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .sql */ .i6`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
    }
    build(table) {
        return new SQLiteTimestamp(table, this.config);
    }
}
class SQLiteTimestamp extends SQLiteBaseInteger {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteTimestamp";
    }
    mapFromDriverValue(value) {
        if (this.config.mode === "timestamp") {
            return new Date(value * 1e3);
        }
        return new Date(value);
    }
    mapToDriverValue(value) {
        const unix = value.getTime();
        if (this.config.mode === "timestamp") {
            return Math.floor(unix / 1e3);
        }
        return unix;
    }
    constructor(...args){
        super(...args);
        this.mode = this.config.mode;
    }
}
class SQLiteBooleanBuilder extends SQLiteBaseIntegerBuilder {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteBooleanBuilder";
    }
    constructor(name, mode){
        super(name, "boolean", "SQLiteBoolean");
        this.config.mode = mode;
    }
    build(table) {
        return new SQLiteBoolean(table, this.config);
    }
}
class SQLiteBoolean extends SQLiteBaseInteger {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteBoolean";
    }
    mapFromDriverValue(value) {
        return Number(value) === 1;
    }
    mapToDriverValue(value) {
        return value ? 1 : 0;
    }
    constructor(...args){
        super(...args);
        this.mode = this.config.mode;
    }
}
function integer(a, b) {
    const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .getColumnNameAndConfig */ .An)(a, b);
    if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
        return new SQLiteTimestampBuilder(name, config.mode);
    }
    if (config?.mode === "boolean") {
        return new SQLiteBooleanBuilder(name, config.mode);
    }
    return new SQLiteIntegerBuilder(name);
}
const int = (/* unused pure expression or super */ null && (integer));
 //# sourceMappingURL=integer.js.map


/***/ }),

/***/ 42946:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kw: () => (/* binding */ real)
/* harmony export */ });
/* unused harmony exports SQLiteReal, SQLiteRealBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69574);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26209);


class SQLiteRealBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .d {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteRealBuilder";
    }
    constructor(name){
        super(name, "number", "SQLiteReal");
    }
    /** @internal */ build(table) {
        return new SQLiteReal(table, this.config);
    }
}
class SQLiteReal extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .l {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteReal";
    }
    getSQLType() {
        return "real";
    }
}
function real(name) {
    return new SQLiteRealBuilder(name ?? "");
}
 //# sourceMappingURL=real.js.map


/***/ }),

/***/ 9921:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fL: () => (/* binding */ text)
/* harmony export */ });
/* unused harmony exports SQLiteText, SQLiteTextBuilder, SQLiteTextJson, SQLiteTextJsonBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69574);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(66323);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26209);



class SQLiteTextBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .d {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteTextBuilder";
    }
    constructor(name, config){
        super(name, "string", "SQLiteText");
        this.config.enumValues = config.enum;
        this.config.length = config.length;
    }
    /** @internal */ build(table) {
        return new SQLiteText(table, this.config);
    }
}
class SQLiteText extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .l {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteText";
    }
    constructor(table, config){
        super(table, config);
        this.enumValues = this.config.enumValues;
        this.length = this.config.length;
    }
    getSQLType() {
        return `text${this.config.length ? `(${this.config.length})` : ""}`;
    }
}
class SQLiteTextJsonBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .d {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteTextJsonBuilder";
    }
    constructor(name){
        super(name, "json", "SQLiteTextJson");
    }
    /** @internal */ build(table) {
        return new SQLiteTextJson(table, this.config);
    }
}
class SQLiteTextJson extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .l {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .Q] = "SQLiteTextJson";
    }
    getSQLType() {
        return "text";
    }
    mapFromDriverValue(value) {
        return JSON.parse(value);
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
}
function text(a, b = {}) {
    const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .An)(a, b);
    if (config.mode === "json") {
        return new SQLiteTextJsonBuilder(name);
    }
    return new SQLiteTextBuilder(name, config);
}
 //# sourceMappingURL=text.js.map


/***/ }),

/***/ 40821:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  xA: () => (/* binding */ SQLiteTable),
  Px: () => (/* binding */ sqliteTable)
});

// UNUSED EXPORTS: InlineForeignKeys, sqliteTableCreator

// EXTERNAL MODULE: ./node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(69574);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/table.js
var drizzle_orm_table = __webpack_require__(67611);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/utils.js
var utils = __webpack_require__(66323);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/common.js + 2 modules
var common = __webpack_require__(26209);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/blob.js



class SQLiteBigIntBuilder extends common/* SQLiteColumnBuilder */.d {
    static{
        this[entity/* entityKind */.Q] = "SQLiteBigIntBuilder";
    }
    constructor(name){
        super(name, "bigint", "SQLiteBigInt");
    }
    /** @internal */ build(table) {
        return new SQLiteBigInt(table, this.config);
    }
}
class SQLiteBigInt extends common/* SQLiteColumn */.l {
    static{
        this[entity/* entityKind */.Q] = "SQLiteBigInt";
    }
    getSQLType() {
        return "blob";
    }
    mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
            return BigInt(value.toString());
        }
        if (value instanceof ArrayBuffer) {
            const decoder = new TextDecoder();
            return BigInt(decoder.decode(value));
        }
        return BigInt(String.fromCodePoint(...value));
    }
    mapToDriverValue(value) {
        return Buffer.from(value.toString());
    }
}
class SQLiteBlobJsonBuilder extends common/* SQLiteColumnBuilder */.d {
    static{
        this[entity/* entityKind */.Q] = "SQLiteBlobJsonBuilder";
    }
    constructor(name){
        super(name, "json", "SQLiteBlobJson");
    }
    /** @internal */ build(table) {
        return new SQLiteBlobJson(table, this.config);
    }
}
class SQLiteBlobJson extends common/* SQLiteColumn */.l {
    static{
        this[entity/* entityKind */.Q] = "SQLiteBlobJson";
    }
    getSQLType() {
        return "blob";
    }
    mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
            return JSON.parse(value.toString());
        }
        if (value instanceof ArrayBuffer) {
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(value));
        }
        return JSON.parse(String.fromCodePoint(...value));
    }
    mapToDriverValue(value) {
        return Buffer.from(JSON.stringify(value));
    }
}
class SQLiteBlobBufferBuilder extends common/* SQLiteColumnBuilder */.d {
    static{
        this[entity/* entityKind */.Q] = "SQLiteBlobBufferBuilder";
    }
    constructor(name){
        super(name, "buffer", "SQLiteBlobBuffer");
    }
    /** @internal */ build(table) {
        return new SQLiteBlobBuffer(table, this.config);
    }
}
class SQLiteBlobBuffer extends common/* SQLiteColumn */.l {
    static{
        this[entity/* entityKind */.Q] = "SQLiteBlobBuffer";
    }
    mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
            return value;
        }
        return Buffer.from(value);
    }
    getSQLType() {
        return "blob";
    }
}
function blob(a, b) {
    const { name, config } = (0,utils/* getColumnNameAndConfig */.An)(a, b);
    if (config?.mode === "json") {
        return new SQLiteBlobJsonBuilder(name);
    }
    if (config?.mode === "bigint") {
        return new SQLiteBigIntBuilder(name);
    }
    return new SQLiteBlobBufferBuilder(name);
}
 //# sourceMappingURL=blob.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/custom.js



class SQLiteCustomColumnBuilder extends common/* SQLiteColumnBuilder */.d {
    static{
        this[entity/* entityKind */.Q] = "SQLiteCustomColumnBuilder";
    }
    constructor(name, fieldConfig, customTypeParams){
        super(name, "custom", "SQLiteCustomColumn");
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
    }
    /** @internal */ build(table) {
        return new SQLiteCustomColumn(table, this.config);
    }
}
class SQLiteCustomColumn extends common/* SQLiteColumn */.l {
    static{
        this[entity/* entityKind */.Q] = "SQLiteCustomColumn";
    }
    constructor(table, config){
        super(table, config);
        this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
        this.mapTo = config.customTypeParams.toDriver;
        this.mapFrom = config.customTypeParams.fromDriver;
    }
    getSQLType() {
        return this.sqlName;
    }
    mapFromDriverValue(value) {
        return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
    }
    mapToDriverValue(value) {
        return typeof this.mapTo === "function" ? this.mapTo(value) : value;
    }
}
function customType(customTypeParams) {
    return (a, b)=>{
        const { name, config } = (0,utils/* getColumnNameAndConfig */.An)(a, b);
        return new SQLiteCustomColumnBuilder(name, config, customTypeParams);
    };
}
 //# sourceMappingURL=custom.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/integer.js
var integer = __webpack_require__(77294);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/numeric.js



class SQLiteNumericBuilder extends common/* SQLiteColumnBuilder */.d {
    static{
        this[entity/* entityKind */.Q] = "SQLiteNumericBuilder";
    }
    constructor(name){
        super(name, "string", "SQLiteNumeric");
    }
    /** @internal */ build(table) {
        return new SQLiteNumeric(table, this.config);
    }
}
class SQLiteNumeric extends common/* SQLiteColumn */.l {
    static{
        this[entity/* entityKind */.Q] = "SQLiteNumeric";
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        return String(value);
    }
    getSQLType() {
        return "numeric";
    }
}
class SQLiteNumericNumberBuilder extends common/* SQLiteColumnBuilder */.d {
    static{
        this[entity/* entityKind */.Q] = "SQLiteNumericNumberBuilder";
    }
    constructor(name){
        super(name, "number", "SQLiteNumericNumber");
    }
    /** @internal */ build(table) {
        return new SQLiteNumericNumber(table, this.config);
    }
}
class SQLiteNumericNumber extends common/* SQLiteColumn */.l {
    static{
        this[entity/* entityKind */.Q] = "SQLiteNumericNumber";
    }
    mapFromDriverValue(value) {
        if (typeof value === "number") return value;
        return Number(value);
    }
    getSQLType() {
        return "numeric";
    }
    constructor(...args){
        super(...args);
        this.mapToDriverValue = String;
    }
}
class SQLiteNumericBigIntBuilder extends common/* SQLiteColumnBuilder */.d {
    static{
        this[entity/* entityKind */.Q] = "SQLiteNumericBigIntBuilder";
    }
    constructor(name){
        super(name, "bigint", "SQLiteNumericBigInt");
    }
    /** @internal */ build(table) {
        return new SQLiteNumericBigInt(table, this.config);
    }
}
class SQLiteNumericBigInt extends common/* SQLiteColumn */.l {
    static{
        this[entity/* entityKind */.Q] = "SQLiteNumericBigInt";
    }
    getSQLType() {
        return "numeric";
    }
    constructor(...args){
        super(...args);
        this.mapFromDriverValue = BigInt;
        this.mapToDriverValue = String;
    }
}
function numeric(a, b) {
    const { name, config } = (0,utils/* getColumnNameAndConfig */.An)(a, b);
    const mode = config?.mode;
    return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
 //# sourceMappingURL=numeric.js.map

// EXTERNAL MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/real.js
var real = __webpack_require__(42946);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/text.js
var columns_text = __webpack_require__(9921);
;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/columns/all.js






function getSQLiteColumnBuilders() {
    return {
        blob: blob,
        customType: customType,
        integer: integer/* integer */._L,
        numeric: numeric,
        real: real/* real */.kw,
        text: columns_text/* text */.fL
    };
}
 //# sourceMappingURL=all.js.map

;// CONCATENATED MODULE: ./node_modules/drizzle-orm/sqlite-core/table.js



const InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
let prop, prop1;
class SQLiteTable extends drizzle_orm_table/* Table */.iA {
    static{
        prop = drizzle_orm_table/* Table */.iA.Symbol.Columns;
        prop1 = drizzle_orm_table/* Table */.iA.Symbol.ExtraConfigBuilder;
    }
    static{
        this[entity/* entityKind */.Q] = "SQLiteTable";
    }
    static{
        /** @internal */ this.Symbol = Object.assign({}, drizzle_orm_table/* Table */.iA.Symbol, {
            InlineForeignKeys
        });
    }
    constructor(...args){
        super(...args);
        /** @internal */ this[InlineForeignKeys] = [];
        /** @internal */ this[prop1] = void 0;
    }
}
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new SQLiteTable(name, schema, baseName);
    const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
    const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name2, colBuilderBase])=>{
        const colBuilder = colBuilderBase;
        colBuilder.setName(name2);
        const column = colBuilder.build(rawTable);
        rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
        return [
            name2,
            column
        ];
    }));
    const table = Object.assign(rawTable, builtColumns);
    table[drizzle_orm_table/* Table */.iA.Symbol.Columns] = builtColumns;
    table[drizzle_orm_table/* Table */.iA.Symbol.ExtraConfigColumns] = builtColumns;
    if (extraConfig) {
        table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return table;
}
const sqliteTable = (name, columns, extraConfig)=>{
    return sqliteTableBase(name, columns, extraConfig);
};
function sqliteTableCreator(customizeTableName) {
    return (name, columns, extraConfig)=>{
        return sqliteTableBase(customizeTableName(name), columns, extraConfig, void 0, name);
    };
}
 //# sourceMappingURL=table.js.map


/***/ }),

/***/ 98724:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ WithSubquery),
/* harmony export */   k: () => (/* binding */ Subquery)
/* harmony export */ });
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69574);

class Subquery {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_0__/* .entityKind */ .Q] = "Subquery";
    }
    constructor(sql, selection, alias, isWith = false){
        this._ = {
            brand: "Subquery",
            sql,
            selectedFields: selection,
            alias,
            isWith
        };
    }
}
class WithSubquery extends Subquery {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_0__/* .entityKind */ .Q] = "WithSubquery";
    }
}
 //# sourceMappingURL=subquery.js.map


/***/ }),

/***/ 67611:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q0: () => (/* binding */ getTableUniqueName),
/* harmony export */   SP: () => (/* binding */ getTableName),
/* harmony export */   Zk: () => (/* binding */ IsAlias),
/* harmony export */   iA: () => (/* binding */ Table),
/* harmony export */   oe: () => (/* binding */ Columns)
/* harmony export */ });
/* unused harmony exports BaseName, ExtraConfigBuilder, ExtraConfigColumns, OriginalName, Schema, isTable */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69574);
/* harmony import */ var _table_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85211);


const Schema = Symbol.for("drizzle:Schema");
const Columns = Symbol.for("drizzle:Columns");
const ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
const OriginalName = Symbol.for("drizzle:OriginalName");
const BaseName = Symbol.for("drizzle:BaseName");
const IsAlias = Symbol.for("drizzle:IsAlias");
const ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
const IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
class Table {
    static{
        this[_entity_js__WEBPACK_IMPORTED_MODULE_0__/* .entityKind */ .Q] = "Table";
    }
    static{
        /** @internal */ this.Symbol = {
            Name: _table_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .TableName */ .m,
            Schema,
            OriginalName,
            Columns,
            ExtraConfigColumns,
            BaseName,
            IsAlias,
            ExtraConfigBuilder
        };
    }
    constructor(name, schema, baseName){
        /** @internal */ this[IsAlias] = false;
        /** @internal */ this[IsDrizzleTable] = true;
        /** @internal */ this[ExtraConfigBuilder] = void 0;
        this[_table_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .TableName */ .m] = this[OriginalName] = name;
        this[Schema] = schema;
        this[BaseName] = baseName;
    }
}
function isTable(table) {
    return typeof table === "object" && table !== null && IsDrizzleTable in table;
}
function getTableName(table) {
    return table[_table_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .TableName */ .m];
}
function getTableUniqueName(table) {
    return `${table[Schema] ?? "public"}.${table[_table_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .TableName */ .m]}`;
}
 //# sourceMappingURL=table.js.map


/***/ }),

/***/ 85211:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ TableName)
/* harmony export */ });
const TableName = Symbol.for("drizzle:Name");
 //# sourceMappingURL=table.utils.js.map


/***/ }),

/***/ 66323:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   An: () => (/* binding */ getColumnNameAndConfig),
/* harmony export */   M4: () => (/* binding */ mapResultRow),
/* harmony export */   M6: () => (/* binding */ mapUpdateSet),
/* harmony export */   SS: () => (/* binding */ getTableColumns),
/* harmony export */   ZS: () => (/* binding */ orderSelectedFields),
/* harmony export */   dP: () => (/* binding */ getTableLikeName),
/* harmony export */   ef: () => (/* binding */ applyMixins),
/* harmony export */   ux: () => (/* binding */ haveSameKeys),
/* harmony export */   wM: () => (/* binding */ isConfig)
/* harmony export */ });
/* unused harmony export getViewSelectedFields */
/* harmony import */ var _column_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(51582);
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69574);
/* harmony import */ var _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(54410);
/* harmony import */ var _subquery_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(98724);
/* harmony import */ var _table_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67611);
/* harmony import */ var _view_common_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(43498);






function mapResultRow(columns, row, joinsNotNullableMap) {
    const nullifyMap = {};
    const result = columns.reduce((result2, { path, field }, columnIndex)=>{
        let decoder;
        if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .s)) {
            decoder = field;
        } else if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .$s)) {
            decoder = field.decoder;
        } else {
            decoder = field.sql.decoder;
        }
        let node = result2;
        for (const [pathChunkIndex, pathChunk] of path.entries()){
            if (pathChunkIndex < path.length - 1) {
                if (!(pathChunk in node)) {
                    node[pathChunk] = {};
                }
                node = node[pathChunk];
            } else {
                const rawValue = row[columnIndex];
                const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
                if (joinsNotNullableMap && (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .s) && path.length === 2) {
                    const objectName = path[0];
                    if (!(objectName in nullifyMap)) {
                        nullifyMap[objectName] = value === null ? (0,_table_js__WEBPACK_IMPORTED_MODULE_3__/* .getTableName */ .SP)(field.table) : false;
                    } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== (0,_table_js__WEBPACK_IMPORTED_MODULE_3__/* .getTableName */ .SP)(field.table)) {
                        nullifyMap[objectName] = false;
                    }
                }
            }
        }
        return result2;
    }, {});
    if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
        for (const [objectName, tableName] of Object.entries(nullifyMap)){
            if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
                result[objectName] = null;
            }
        }
    }
    return result;
}
function orderSelectedFields(fields, pathPrefix) {
    return Object.entries(fields).reduce((result, [name, field])=>{
        if (typeof name !== "string") {
            return result;
        }
        const newPath = pathPrefix ? [
            ...pathPrefix,
            name
        ] : [
            name
        ];
        if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .s) || (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .$s) || (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .$s.Aliased)) {
            result.push({
                path: newPath,
                field
            });
        } else if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA)) {
            result.push(...orderSelectedFields(field[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA.Symbol.Columns], newPath));
        } else {
            result.push(...orderSelectedFields(field, newPath));
        }
        return result;
    }, []);
}
function haveSameKeys(left, right) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
        return false;
    }
    for (const [index, key] of leftKeys.entries()){
        if (key !== rightKeys[index]) {
            return false;
        }
    }
    return true;
}
function mapUpdateSet(table, values) {
    const entries = Object.entries(values).filter(([, value])=>value !== void 0).map(([key, value])=>{
        if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(value, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .$s) || (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(value, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .s)) {
            return [
                key,
                value
            ];
        } else {
            return [
                key,
                new _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .Param */ .dO(value, table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA.Symbol.Columns][key])
            ];
        }
    });
    if (entries.length === 0) {
        throw new Error("No values to set");
    }
    return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
    for (const extendedClass of extendedClasses){
        for (const name of Object.getOwnPropertyNames(extendedClass.prototype)){
            if (name === "constructor") continue;
            Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null));
        }
    }
}
function getTableColumns(table) {
    return table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA.Symbol.Columns];
}
function getViewSelectedFields(view) {
    return view[ViewBaseConfig].selectedFields;
}
function getTableLikeName(table) {
    return (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(table, _subquery_js__WEBPACK_IMPORTED_MODULE_4__/* .Subquery */ .k) ? table._.alias : (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(table, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .View */ .G7) ? table[_view_common_js__WEBPACK_IMPORTED_MODULE_5__/* .ViewBaseConfig */ .d].name : (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(table, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .$s) ? void 0 : table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA.Symbol.IsAlias] ? table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA.Symbol.Name] : table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .iA.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
    return {
        name: typeof a === "string" && a.length > 0 ? a : "",
        config: typeof a === "object" ? a : b
    };
}
const _ = {};
const __ = {};
function isConfig(data) {
    if (typeof data !== "object" || data === null) return false;
    if (data.constructor.name !== "Object") return false;
    if ("logger" in data) {
        const type = typeof data["logger"];
        if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined") return false;
        return true;
    }
    if ("schema" in data) {
        const type = typeof data["schema"];
        if (type !== "object" && type !== "undefined") return false;
        return true;
    }
    if ("casing" in data) {
        const type = typeof data["casing"];
        if (type !== "string" && type !== "undefined") return false;
        return true;
    }
    if ("mode" in data) {
        if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0) return false;
        return true;
    }
    if ("connection" in data) {
        const type = typeof data["connection"];
        if (type !== "string" && type !== "object" && type !== "undefined") return false;
        return true;
    }
    if ("client" in data) {
        const type = typeof data["client"];
        if (type !== "object" && type !== "function" && type !== "undefined") return false;
        return true;
    }
    if (Object.keys(data).length === 0) return true;
    return false;
}
 //# sourceMappingURL=utils.js.map


/***/ }),

/***/ 43498:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ ViewBaseConfig)
/* harmony export */ });
const ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
 //# sourceMappingURL=view-common.js.map


/***/ })

};
;