import { useEffect, useRef } from "react";
import type { ChatBubble } from "../App";
import { AnimatePresence, motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export function ChatHistory({ chatHistory }: { chatHistory: ChatBubble[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory]);

  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        className="bg-accent/40 px-4 pt-4 h-full flex flex-col overflow-y-auto gap-6 hide-scrollbar"
      >
        {chatHistory.map((chat, index) => (
          <ChatBubble key={index} chatBubble={chat} />
        ))}
        {/* sentinel element that we scroll into view */}
        <div ref={endRef} />
      </div>
    </AnimatePresence>
  );
}

function ChatBubble({ chatBubble }: { chatBubble: ChatBubble }) {
  return (
    <motion.div
      className={`rounded-md ${
        chatBubble.sender === "BOT"
          ? "bg-[#e6e9ef] text-black text-left"
          : "ml-auto bg-black text-white text-right"
      }  h-fit w-fit px-6 py-2`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <TypeAnimation
        sequence={[chatBubble.message]}
        wrapper="span"
        cursor={false}
        style={{ display: "inline-block" }}
      ></TypeAnimation>
    </motion.div>
  );
}
