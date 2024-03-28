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
    return rest["COUNT(*)"];
  } catch (err) {
    console.log(err);
    return `the following error occured: ${err}`;
  }
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
