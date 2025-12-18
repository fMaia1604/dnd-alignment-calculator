import type { ChatBubble } from "../App";
import { AnimatePresence, motion } from "framer-motion";

export function ChatHistory({ chatHistory }: { chatHistory: ChatBubble[] }) {
  return (
    <AnimatePresence>
      <div className="h-40 flex flex-col overflow-y-auto gap-8 ">
        {chatHistory.map((chat, index) => (
          <ChatBubble key={index} chatBubble={chat} />
        ))}
      </div>
    </AnimatePresence>
  );
}

function ChatBubble({ chatBubble }: { chatBubble: ChatBubble }) {
  return (
    <motion.div
      className={`${
        chatBubble.sender === "BOT"
          ? "bg-gray-400 text-black"
          : "bg-black text-white"
      }  h-10 w-fit px-6 py-2`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {chatBubble.message}
    </motion.div>
  );
}
