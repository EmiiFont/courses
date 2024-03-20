import { ChatOpenAI } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory"
import { HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const chat = new ChatOpenAI({})
const memory = new ConversationSummaryMemory({
  memoryKey: "messages",
  returnMessages: true,
  llm: chat,
});

const prompt = new ChatPromptTemplate({
  inputVariables: ["content", "messages"],
  promptMessages: [
    new MessagesPlaceholder({ variableName: "messages" }),
    HumanMessagePromptTemplate.fromTemplate(
      "{content}"
    ),
  ]
});

const chain = new LLMChain({
  llm: chat,
  prompt: prompt,
  memory: memory,
  verbose: true,
});

const terminalPrompt = ">>";
process.stdout.write(terminalPrompt);

for await (const line of console) {
  const res = await chain.invoke({ content: line });
  console.log(res.text);
}
