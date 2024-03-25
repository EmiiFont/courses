import { Embeddings } from "langchain/embeddings/base";
import { BaseRetriever } from "langchain/schema/retriever";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { CallbackManagerForRetrieverRun } from "langchain/callbacks";
import { Document } from "langchain/document";

export class RedudantFilterRetriever extends BaseRetriever {
  lc_namespace: string[] = [];
  embeddings: Embeddings | undefined;
  chroma: Chroma | undefined;

  constructor(embeddings: Embeddings, chroma: Chroma) {
    super();
    this.embeddings = embeddings;
    this.chroma = chroma;
  }
  async _getRelevantDocuments(_query: string, _callbacks?: CallbackManagerForRetrieverRun | undefined): Promise<Document[]> {
    // calculate embeddings for the query string.
    const emb = await this.embeddings!.embedQuery(_query);
    // take embeddings and feed them into the chroma maxMarginalRelevanceSearchVector method.
    if (this.chroma === undefined) {
      throw new Error("Chroma is not defined");
    }
    return this.chroma.similaritySearch(_query, 1);
  }
}

