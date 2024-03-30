import { Database } from "bun:sqlite";


const conn = new Database("db.sqlite");

function listTables() {
  const result = conn.query("SELECT name FROM sqlite_master WHERE type='table';");
  const rest = result.all();
  return rest.map((r: any) => r.name);
}

function runSqlliteQuery(sql: string): any {
  const queryResult = conn.query(sql);
  return queryResult.get();
}
function describTables(tablesNames: any) {
  let tables = "";
  for (const table of tablesNames) {
    tables += `"${table}"` + ",";
  }
  tables = tables.slice(0, -1);
  const queryResult = conn.query(`SELECT sql FROM sqlite_master WHERE type='table' AND name IN (${tables});`);
  const rest = queryResult.all();
  return rest.map((s: any) => s.sql).join("\n");
}

console.log(describTables(listTables()));
const rest = await runSqlliteQuery("SELECT COUNT(DISTINCT user_id) FROM addresses");
// select first key value from rest
console.log(Object.values(rest)[0]);

