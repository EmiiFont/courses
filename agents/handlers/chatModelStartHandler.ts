import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { Serialized } from "langchain/load/serializable";
import { BaseMessage } from "langchain/schema";
import boxen from "boxen";

export class ChatModelStartHandler extends BaseCallbackHandler {
  name: string = "chatModelStartHandler";
  onChatModelStart() {
    console.log("Chat model started");
  }

  boxenPrint(msg: string, options: {}) {
    console.log(boxen(msg, options));
  }

  async handleChatModelStart(llm: Serialized, messages: BaseMessage[][]) {
    // console.log(messages);
    console.log("\n\n\n =========== Sending Messages ========== \n\n\n")
    for (const message of messages[0]) {
      switch (message._getType()) {
        case "system":
          this.boxenPrint(message.content.toString(), { title: "System", borderColor: "yellow" });
          break;
        case "human":
          this.boxenPrint(message.content.toString(), { title: "Human", borderColor: "green" });
          break;
        case "ai":
          this.boxenPrint(message.content.toString(), { title: "Agent", borderColor: "blue" });
          break;
        case "function":
          this.boxenPrint(message.content.toString(), { title: "Function", borderColor: "red" });
          break;
        default:
          this.boxenPrint(message.content.toString(), { title: message._getType(), borderColor: "magenta" });
          break;
      }
    }
  }
}
