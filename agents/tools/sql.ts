import { Database, SQLiteError } from "bun:sqlite";
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";


const conn = new Database("db.sqlite");


export function listTables() {
  const result = conn.query("SELECT name FROM sqlite_master WHERE type='table';");
  const rest = result.all();
  return rest.map((r: any) => r.name);
}

function runSqlliteQuery(sql: string): any {
  try {
    const result = conn.query(sql);
    const rest: any = result.get();
    return Object.values(rest)[0];
  } catch (err) {
    console.log(err);
    return `the following error occured: ${err}`;
  }
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

export const runSqlQueryTool = new DynamicStructuredTool({
  name: "run_sql_query",
  description: "run a sql query to return the total number of users",
  schema: z.object({
    query: z.string(),
  }),
  func: async ({ query }): Promise<string> => {
    const res = await runSqlliteQuery(query);
    return res.toString();
  },
});

export const describeTablesTool = new DynamicStructuredTool({
  name: "describe_tables",
  description: "Given a list of tables names, returns the schema of each table",
  schema: z.object({
    tableNames: z.array(z.string())
  }),
  func: async ({ tableNames }): Promise<string> => {
    const res = describTables(tableNames);
    return res.toString();
  },
});

