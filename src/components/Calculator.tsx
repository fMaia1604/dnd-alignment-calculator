import React, { useEffect, useState } from "react";
import "./Calculator.css";

const BUTTONS: Array<{ label: string; value?: string; className?: string }> = [
  { label: "C", className: "btn function", value: "clear" },
  { label: "+/-", className: "btn function", value: "negate" },
  { label: "%", className: "btn function", value: "percent" },
  { label: "/", className: "btn operator", value: "/" },

  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "*", className: "btn operator", value: "*" },

  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "-", className: "btn operator", value: "-" },

  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "+", className: "btn operator", value: "+" },

  { label: "0", value: "0", className: "btn zero" },
  { label: ".", value: "." },
  { label: "=", className: "btn operator equals", value: "=" },
];

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNew, setWaitingForNew] = useState<boolean>(false);

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
    const result = performOperation(previous, input, operator);
    updateDisplay(Number.isNaN(result) ? "Error" : String(result));
    setPrevious(null);
    setOperator(null);
    setWaitingForNew(true);
  }

  function onButton(value?: string) {
    if (!value) return;
    if (/^[0-9]$/.test(value) || value === ".") return handleInput(value);
    if (value === "clear") return clearAll();
    if (value === "negate") return negate();
    if (value === "percent") return percent();
    if (value === "=") return handleEquals();
    if (["+", "-", "*", "/"].includes(value)) return handleOperator(value);
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
        {BUTTONS.map((b, idx) => (
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
