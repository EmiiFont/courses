import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
function writeReport(fileName: string, html: string): void {
  //const res = fs.writeFileSync(fileName, html); 
  Bun.write(fileName, html);
}

export const reportTool = new DynamicStructuredTool({
  name: "write_report",
  description: "Write an html file to disk. Use this tool whenever someone ask for a report.",
  func: async ({ fileName, html }): Promise<string> => {
    writeReport(fileName, html);
    return "success";
  },
  schema: z.object({
    fileName: z.string(),
    html: z.string(),
  }),
});
