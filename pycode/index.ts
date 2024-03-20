import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";


const args = Bun.argv;
let language = "python";
let task = "return a list of numbers";

if (args.length > 2) {
  const firstArgument = args[2];
  language = firstArgument;
  task = args[3];
}

const openai = new ChatOpenAI({
});

const prompt = new PromptTemplate({
  template: "Write a very short {language} function that will {task}",
  inputVariables: ["language", "task"]
});


const testPrompt = new PromptTemplate({
  inputVariables: ["language", "code"],
  template: "Write a test for the following {language} code: \n {code}"
});

const codeChain = new LLMChain({
  llm: openai,
  prompt: prompt,
  outputKey: "code"
});

const testChain = new LLMChain({
  llm: openai,
  prompt: testPrompt,
  outputKey: "test"
});

const chain = new SequentialChain({
  chains: [codeChain, testChain],
  inputVariables: ["task", "language"],
  outputVariables: ["code", "test"]
});

const response = await chain.invoke({
  language: language,
  task: task
});

console.log("Result code ---->");
console.log(response.code);
console.log("Result test ---->");
console.log(response.test);

