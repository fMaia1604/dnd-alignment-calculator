import { Button, DialogTrigger, Popover } from "react-aria-components";
import "./App.css";
import Calculator from "./components/Calculator";
import { useState } from "react";

type ThemeButton = {
  label: string;
  lawfulScale: "LAWFUL" | "NEUTRAL" | "CHAOTIC";
  goodScale: "GOOD" | "NEUTRAL" | "EVIL";
};

const themeButtons: ThemeButton[] = [
  {
    label: "Lawful Good",
    lawfulScale: "LAWFUL",
    goodScale: "GOOD",
  },
  {
    label: "Neutral Good",
    lawfulScale: "NEUTRAL",
    goodScale: "GOOD",
  },
  {
    label: "Chaotic Good",
    lawfulScale: "CHAOTIC",
    goodScale: "GOOD",
  },
  {
    label: "Lawful Neutral",
    lawfulScale: "LAWFUL",
    goodScale: "NEUTRAL",
  },
  {
    label: "True Neutral",
    lawfulScale: "NEUTRAL",
    goodScale: "NEUTRAL",
  },
  {
    label: "Chaotic Neutral",
    lawfulScale: "CHAOTIC",
    goodScale: "NEUTRAL",
  },
  {
    label: "Lawful Evil",
    lawfulScale: "LAWFUL",
    goodScale: "EVIL",
  },
  {
    label: "Neutral Evil",
    lawfulScale: "NEUTRAL",
    goodScale: "EVIL",
  },
  {
    label: "Chaotic Evil",
    lawfulScale: "CHAOTIC",
    goodScale: "EVIL",
  },
];

function App() {
  const [lawfulScale, setLawfulScale] = useState<
    ThemeButton["lawfulScale"] | null
  >(null);
  const [goodScale, setGoodScale] = useState<ThemeButton["goodScale"] | null>(
    null
  );
  return (
    <div className="flex flex-row w-full ">
      <div className="flex w-full flex-col relative mx-auto">
        <Calculator />
      </div>
      <DialogTrigger>
        <Button className="absolute right-5 top-5 bg-gray p-2 h-fit rounded-xl">
          Change Theme
        </Button>
        <Popover placement="bottom end">
          <div className="grid grid-cols-3 bg-gray-500 rounded-xl gap-2 p-2">
            {themeButtons.map((b) => (
              <button
                className="rounded-xl p-2"
                onClick={() => {
                  setLawfulScale(b.lawfulScale);
                  setGoodScale(b.goodScale);
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
