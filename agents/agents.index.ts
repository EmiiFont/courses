import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { describeTablesTool, listTables, runSqlQueryTool } from "./tools/sql";
import { SystemMessage } from "langchain/schema";

// testing dynamic tools
const tables = await listTables();

const chat = new ChatOpenAI({});
const prompt = new ChatPromptTemplate({
  inputVariables: ["input", "agent_scratchpad"],
  promptMessages: [
    new SystemMessage({
      content: `You are an AI that has access to a SQLite Database\n
    the databse hs tables of: ${tables}\n
    Do no make assumptions about what tables exist in the database
    or what columns exist. Instead, use the 'describe_tables' function
` }),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
  ]
});

const tools = [runSqlQueryTool, describeTablesTool];

const agent = await createOpenAIToolsAgent({
  llm: chat,
  tools,
  prompt: prompt,
});

const agentExecutor = new AgentExecutor({ agent: agent, tools: tools, verbose: true });
const res = await agentExecutor.invoke({ input: "How many users provided a shipping address in the database?" });
//const res = await agentExecutor.invoke({ input: "How many users are in the system?" });
console.log(res);
