import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChromaClient } from "chromadb";

const loader = new TextLoader("facts.txt");

const embeddings = new OpenAIEmbeddings();
const splitter = new CharacterTextSplitter({ separator: "\n", chunkSize: 200, chunkOverlap: 0 });
const docs = await loader.loadAndSplit(splitter);

const chromaClient = new ChromaClient({});
chromaClient.deleteCollection({ name: "emb" });
const chrome = await Chroma.fromDocuments(docs, embeddings, { collectionName: "emb", url: "http://localhost:8000" });

const results = await chrome.similaritySearch("What is an interesting fact about English?", 1);

for (const res of results) {
  console.log("\n");
  console.log(res.pageContent);
}
