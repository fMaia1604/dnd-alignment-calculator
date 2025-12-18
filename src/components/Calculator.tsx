import React, { useEffect, useState } from "react";
import "./Calculator.css";
import type { ChatBubble, ThemeButton } from "../App";

const BUTTONS: Array<{
  label: string;
  romanLabel?: string;
  binaryLabel?: string;
  value?: string;
  className?: string;
}> = [
  { label: "C", className: "btn function", value: "clear" },
  { label: "+/-", className: "btn function", value: "negate" },
  { label: "%", className: "btn function", value: "percent" },
  { label: "/", className: "btn operator", value: "/" },

  { label: "7", value: "7", romanLabel: "VII", binaryLabel: "0111" },
  { label: "8", value: "8", romanLabel: "VIII", binaryLabel: "1000" },
  { label: "9", value: "9", romanLabel: "IX", binaryLabel: "1001" },
  { label: "*", className: "btn operator", value: "*" },

  { label: "4", value: "4", romanLabel: "IV", binaryLabel: "0100" },
  { label: "5", value: "5", romanLabel: "V", binaryLabel: "0101" },
  { label: "6", value: "6", romanLabel: "VI", binaryLabel: "0110" },
  { label: "-", className: "btn operator", value: "-" },

  { label: "1", value: "1", romanLabel: "I", binaryLabel: "0001" },
  { label: "2", value: "2", romanLabel: "II", binaryLabel: "0010" },
  { label: "3", value: "3", romanLabel: "III", binaryLabel: "0011" },
  { label: "+", className: "btn operator", value: "+" },

  { label: "0", value: "0", romanLabel: "Ø", binaryLabel: "0000" },
  { label: ".", value: "." },
  { label: "=", className: "btn operator equals", value: "=" },
];

export default function Calculator({
  lawfulScale,
  goodScale,
  addChatBubble,
}: {
  lawfulScale: ThemeButton["lawfulScale"];
  goodScale: ThemeButton["goodScale"];
  addChatBubble: (b: ChatBubble) => void;
}) {
  const [buttons, setButtons] = useState<
    {
      label: string;
      value?: string;
      className?: string;
    }[]
  >(BUTTONS);
  const [display, setDisplay] = useState<string>("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNew, setWaitingForNew] = useState<boolean>(false);

  useEffect(() => {
    setButtons(BUTTONS);
  }, [lawfulScale, goodScale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if ((key >= "0" && key <= "9") || key === ".") {
        e.preventDefault();
        handleInput(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        e.preventDefault();
        handleOperator(key);
      } else if (key === "Escape") {
        e.preventDefault();
        clearAll();
      } else if (key === "Backspace") {
        e.preventDefault();
        backspace();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, previous, operator, waitingForNew]);

  function updateDisplay(next: string) {
    // sanitize leading zeros
    if (next === "") next = "0";
    setDisplay(next);
  }

  function handleInput(val: string) {
    if (waitingForNew) {
      // start new number
      updateDisplay(val === "." ? "0." : val);
      setWaitingForNew(false);
      return;
    }

    if (val === ".") {
      if (display.includes(".")) return;
      updateDisplay(display + ".");
      return;
    }

    if (display === "0") updateDisplay(val);
    else updateDisplay(display + val);
  }

  function clearAll() {
    updateDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaitingForNew(false);
  }

  function backspace() {
    if (waitingForNew) return;
    if (display.length === 1) updateDisplay("0");
    else updateDisplay(display.slice(0, -1));
  }

  function formatNumber(n: number) {
    if (!isFinite(n)) return "Error";
    // round to avoid floating point noise, then trim trailing zeros
    const fixed = Number.parseFloat(n.toFixed(12));
    return String(fixed);
  }

  function negate() {
    const num = parseFloat(display);
    if (isNaN(num)) return;
    updateDisplay(formatNumber(num * -1));
  }

  function percent() {
    const num = parseFloat(display);
    if (isNaN(num)) return;
    let result: number;

    // For addition/subtraction percent is relative to the previous value (e.g., 100 + 25% -> 125)
    if (
      previous != null &&
      operator != null &&
      (operator === "+" || operator === "-")
    ) {
      result = (previous * num) / 100;
    } else {
      // For multiply/divide or no previous value, use the simple percentage
      result = num / 100;
    }

    updateDisplay(formatNumber(result));
  }

  function performOperation(prev: number, next: number, op: string) {
    switch (op) {
      case "+":
        return prev + next;
      case "-":
        return prev - next;
      case "*":
        return prev * next;
      case "/":
        return next === 0 ? NaN : prev / next;
      default:
        return next;
    }
  }

  function handleOperator(op: string) {
    const input = parseFloat(display);
    if (previous == null) {
      setPrevious(input);
    } else if (!waitingForNew) {
      const result = performOperation(previous, input, operator || op);
      setPrevious(result);
      updateDisplay(Number.isNaN(result) ? "Error" : String(result));
    }
    setOperator(op);
    setWaitingForNew(true);
  }

  function handleEquals() {
    if (operator == null || previous == null) return;
    const input = parseFloat(display);
    addChatBubble({
      message: `${previous}${operator}${input}`,
      sender: "USER",
    });
    const result = performOperation(previous, input, operator);
    updateDisplay(Number.isNaN(result) ? "Error" : String(result));
    setPrevious(null);
    setOperator(null);
    setWaitingForNew(true);
    setTimeout(
      () =>
        addChatBubble({ message: getRandomSentence(result), sender: "BOT" }),
      1000
    );
  }

  function changeLabel(
    b: (typeof BUTTONS)[number],
    label: "romanLabel" | "binaryLabel" | "label"
  ) {
    return b[label] ? b[label] : b["label"];
  }

  function onButton(value?: string) {
    let tempButtons = buttons;
    if (
      lawfulScale === "CHAOTIC" ||
      (lawfulScale === "NEUTRAL" && Math.random() > 0.5)
    ) {
      tempButtons = tempButtons
        .map((b) => ({ sort: Math.random(), value: b }))
        .sort((a, b) => a.sort - b.sort)
        .map((b) => b.value);
    }
    if (
      lawfulScale === "CHAOTIC" ||
      (lawfulScale === "NEUTRAL" && Math.random() > 0.5)
    ) {
      const random = Math.random();
      if (random < 0.33)
        tempButtons = tempButtons.map((b) => ({
          ...b,
          label: changeLabel(
            BUTTONS.find((i) => i.value === b.value)!,
            "romanLabel"
          ),
        }));
      else if (random < 0.67)
        tempButtons = tempButtons.map((b) => ({
          ...b,
          label: changeLabel(
            BUTTONS.find((i) => i.value === b.value)!,
            "binaryLabel"
          ),
        }));
      else
        tempButtons = tempButtons.map((b) => ({
          ...b,
          label: changeLabel(
            BUTTONS.find((i) => i.value === b.value)!,
            "label"
          ),
        }));
    }

    setButtons(tempButtons);
    if (!value) return;
    if (/^[0-9]$/.test(value) || value === ".") return handleInput(value);
    if (value === "clear") return clearAll();
    if (value === "negate") return negate();
    if (value === "percent") return percent();
    if (value === "=") return handleEquals();
    if (["+", "-", "*", "/"].includes(value)) return handleOperator(value);
  }

  function getRandomSentence(result: number) {
    if (lawfulScale === "LAWFUL" && goodScale === "GOOD")
      return [
        `The correct result, calculated honestly and fairly, is ${result}.`,
        `Justice and math agree: the answer is ${result}.`,
        `I have followed every rule. The result is ${result}.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "NEUTRAL" && goodScale === "GOOD")
      return [
        `Here you go — the answer is ${result}. Hope it helps.`,
        `I did the math so you don’t have to. It’s ${result}.`,
        `The result is ${result}. Use it wisely.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "CHAOTIC" && goodScale === "GOOD")
      return [
        `Boom! The answer is ${result} — go make something cool with it.`,
        `Rules bent, math intact: ${result}.`,
        `I might’ve taken a wild path, but the answer is ${result}.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "LAWFUL" && goodScale === "NEUTRAL")
      return [
        `According to the defined inputs, the result is ${result}.`,
        `Calculation complete. Output: ${result}.`,
        `No interpretation needed. The answer is ${result}.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "NEUTRAL" && goodScale === "NEUTRAL")
      return [
        `The numbers balance out to ${result}.`,
        `After processing the values, the result is ${result}.`,
        `It is neither right nor wrong. It is ${result}.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "CHAOTIC" && goodScale === "NEUTRAL")
      return [
        `I pressed some buttons. The answer is ${result}.`,
        `Math happened. Don’t ask how. It’s ${result}.`,
        `Could’ve gone differently, but here we are: ${result}.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "LAWFUL" && goodScale === "EVIL")
      return [
        `The calculation is complete. The answer is ${result}.`,
        `By strict logic and cold precision, the result is ${result}.`,
        `You follow the formula. You get ${result}.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "NEUTRAL" && goodScale === "EVIL")
      return [
        `The answer is ${result}. Do what you want with it.`,
        `You needed a result. Here’s ${result}.`,
        `It benefits me to tell you the answer is ${result}.`,
      ][Math.floor(Math.random() * 3)];

    if (lawfulScale === "CHAOTIC" && goodScale === "EVIL")
      return [
        `HAHA. The numbers scream ${result}.`,
        `I tore the math apart and got ${result}.`,
        `Everything burns, but the answer is ${result}.`,
      ][Math.floor(Math.random() * 3)];

    // Fallback (should never happen)
    return `The answer is ${result}.`;
  }

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <div className="display">
        <div className="history">
          {previous !== null && operator ? `${previous} ${operator}` : ""}
        </div>
        <div className="value" aria-live="polite">
          {display}
        </div>
      </div>
      <div className="buttons">
        {buttons.map((b, idx) => (
          <button
            key={idx}
            className={`btn ${b.className || ""}`}
            onClick={() => onButton(b.value)}
            aria-label={b.label}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
