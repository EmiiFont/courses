import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";


const loader = new TextLoader("facts.txt");
const splitter = new CharacterTextSplitter({ separator: "\n", chunkSize: 200, chunkOverlap: 0 });
const docs = await loader.loadAndSplit(splitter);

for (let doc of docs) {
  console.log(doc);
}
