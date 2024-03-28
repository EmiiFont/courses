import { Database } from "bun:sqlite";


const conn = new Database("db.sqlite");

function listTables() {
  const result = conn.query("SELECT name FROM sqlite_master WHERE type='table';");
  const rest = result.all();
  return rest.map((r: any) => r.name).join("\n");
}

function runSqlliteQuery(sql: string): any {
  const queryResult = conn.query(sql);
  return queryResult.get();
}

console.log(listTables()); const rest = await runSqlliteQuery("SELECT COUNT(*) FROM users");
console.log(rest["COUNT(*)"]);
