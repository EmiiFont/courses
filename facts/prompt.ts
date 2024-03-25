import { RetrievalQAChain } from "langchain/chains";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RedudantFilterRetriever } from "./RedudantFilterRetriever";

const chat = new ChatOpenAI({});
const embeddings = new OpenAIEmbeddings();

const db = new Chroma(embeddings, { url: "http://localhost:8000", collectionName: "emb" });
const retriever = db.asRetriever();

const chain = RetrievalQAChain.fromLLM(chat, retriever);

const result = await chain.run("What is an interesting fact about English?");

console.log(result);
