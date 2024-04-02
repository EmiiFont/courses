import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { describeTablesTool, listTables, runSqlQueryTool } from "./tools/sql";
import { SystemMessage } from "langchain/schema";
import { reportTool } from "./tools/report";
import { BufferMemory } from "langchain/memory";

const tables = listTables();

const chat = new ChatOpenAI({});
const prompt = new ChatPromptTemplate({
  inputVariables: ["input", "agent_scratchpad", "chat_history"],
  promptMessages: [
    new SystemMessage({
      content: `You are an AI that has access to a SQLite Database\n
    the databse hs tables of: ${tables}\n
    Do no make assumptions about what tables exist in the database
    or what columns exist. Instead, use the 'describe_tables' function
` }),
    new MessagesPlaceholder({ variableName: "chat_history" }),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
  ]
});

const memory = new BufferMemory({ memoryKey: "chat_history", returnMessages: true, inputKey: "input", outputKey: "output" });
const tools = [runSqlQueryTool, describeTablesTool, reportTool];

const agent = await createOpenAIToolsAgent({
  llm: chat,
  tools,
  prompt: prompt,
});

const agentExecutor = new AgentExecutor({ agent: agent, tools: tools, verbose: true, memory: memory });
await agentExecutor.invoke({ input: "how many orders are there?. write the results to an html report." });
await agentExecutor.invoke({ input: "repeat the same process but for users" });
