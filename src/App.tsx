import { Button, DialogTrigger, Popover } from "react-aria-components";
import "./App.css";
import Calculator from "./components/Calculator";
import { useEffect, useState } from "react";
import { applyTheme } from "./themes/utils";
import { DEFAULT_THEME } from "./themes";
import { ChatHistory } from "./components/ChatHistory";

export type ThemeButton = {
  label: string;
  lawfulScale: "LAWFUL" | "NEUTRAL" | "CHAOTIC";
  goodScale: "GOOD" | "NEUTRAL" | "EVIL";
  theme: string;
};

export type ChatBubble = {
  message: string;
  sender: "USER" | "BOT";
};

const themeButtons: ThemeButton[] = [
  {
    label: "Lawful Good",
    lawfulScale: "LAWFUL",
    goodScale: "GOOD",
    theme: "lawfulGood",
  },
  {
    label: "Neutral Good",
    lawfulScale: "NEUTRAL",
    goodScale: "GOOD",
    theme: "neutralGood",
  },
  {
    label: "Chaotic Good",
    lawfulScale: "CHAOTIC",
    goodScale: "GOOD",
    theme: "chaoticGood",
  },
  {
    label: "Lawful Neutral",
    lawfulScale: "LAWFUL",
    goodScale: "NEUTRAL",
    theme: "lawfulNeutral",
  },
  {
    label: "True Neutral",
    lawfulScale: "NEUTRAL",
    goodScale: "NEUTRAL",
    theme: "trueNeutral",
  },
  {
    label: "Chaotic Neutral",
    lawfulScale: "CHAOTIC",
    goodScale: "NEUTRAL",
    theme: "chaoticNeutral",
  },
  {
    label: "Lawful Evil",
    lawfulScale: "LAWFUL",
    goodScale: "EVIL",
    theme: "lawfulEvil",
  },
  {
    label: "Neutral Evil",
    lawfulScale: "NEUTRAL",
    goodScale: "EVIL",
    theme: "neutralEvil",
  },
  {
    label: "Chaotic Evil",
    lawfulScale: "CHAOTIC",
    goodScale: "EVIL",
    theme: "chaoticEvil",
  },
];

function App() {
  const [lawfulScale, setLawfulScale] =
    useState<ThemeButton["lawfulScale"]>("LAWFUL");
  const [goodScale, setGoodScale] = useState<ThemeButton["goodScale"]>("GOOD");
  const [chatHistory, setChatHistory] = useState<ChatBubble[]>([]);

  const addChatBubble = (bubble: ChatBubble) =>
    setChatHistory((prev) => [...prev, bubble]);

  useEffect(() => {
    applyTheme(DEFAULT_THEME);
  }, []);

  return (
    <div className="flex flex-row w-full ">
      <div className="flex w-full flex-col relative mx-auto">
        <ChatHistory chatHistory={chatHistory} />
        <Calculator
          lawfulScale={lawfulScale}
          goodScale={goodScale}
          addChatBubble={addChatBubble}
        />
      </div>
      <DialogTrigger>
        <Button className="absolute right-5 top-5 bg-gray p-2 h-fit rounded-xl">
          Change Theme
        </Button>
        <Popover placement="bottom end">
          <div className="grid grid-cols-3 bg-primary rounded-xl gap-2 p-2">
            {themeButtons.map((b) => (
              <button
                className="rounded-xl p-2"
                onClick={() => {
                  setLawfulScale(b.lawfulScale);
                  setGoodScale(b.goodScale);
                  if (b.theme) applyTheme(b.theme);
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </Popover>
      </DialogTrigger>
    </div>
  );
}

export default App;
