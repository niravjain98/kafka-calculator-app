import React, { useState } from "react";
import "./calculator.css";
import {
  addition,
  subtraction,
  multiplication,
  division,
} from "../services/calculation";

const Calculator = () => {
  type ArrayType = [string, string];
  const [fDigit, setfDigit] = useState("");
  const [lDigit, setlDigit] = useState("");

  const [arithBool, setarithBool] = useState(false);

  const [arithmetic, setArithmetic] = useState("");
  const [display, setDisplay] = useState("0");

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newDigit = e.currentTarget.innerHTML;
    if (!arithBool) {
      setfDigit((prev) => {
        const newDisplay = prev + newDigit;
        setDisplay(newDisplay);
        return newDisplay;
      });
    } else {
      setlDigit((prev) => {
        const newDisplay = prev + newDigit;
        setDisplay(newDisplay);
        return newDisplay;
      });
    }
  };

  const arithmeticHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fDigit && !lDigit && !arithBool) {
      const arithmeticSign = e.currentTarget.innerHTML;
      setArithmetic(arithmeticSign);
      setDisplay(arithmeticSign);
      setarithBool(true);
    }
  };

  const clearHandler = () => {
    setDisplay("0");
    setarithBool(false);
    setArithmetic("");
    setlDigit("");
    setfDigit("");
  };

  const calculateVal = async () => {
    if (lDigit && fDigit && arithBool && arithmetic) {
      const operands: ArrayType = [fDigit, lDigit];
      let result;
      switch (arithmetic) {
        case "+":
          result = await addition(operands);
          setfDigit(result.result.toString());
          setlDigit("");
          setarithBool(false);
          setArithmetic("");
          break;
        case "-":
          result = await subtraction(operands);
          setfDigit(result.result.toString());
          setlDigit("");
          setarithBool(false);
          setArithmetic("");
          break;
        case "*":
          result = await multiplication(operands);
          setfDigit(result.result.toString());
          setlDigit("");
          setarithBool(false);
          setArithmetic("");
          break;
        case "/":
          result = await division(operands);
          setfDigit(result.result.toString());
          setlDigit("");
          setarithBool(false);
          setArithmetic("");
          break;
        default:
          return;
      }
      setDisplay(result.result.toString());
    }
  };

  return (
    <div className="calculator">
      <input type="text" id="display" value={display} disabled />
      <br />
      <button id="btn1" onClick={clickHandler}>
        1
      </button>
      <button id="btn2" onClick={clickHandler}>
        2
      </button>
      <button id="btn3" onClick={clickHandler}>
        3
      </button>
      <button id="btnPlus" onClick={arithmeticHandler}>
        +
      </button>
      <br />
      <button id="btn4" onClick={clickHandler}>
        4
      </button>
      <button id="btn5" onClick={clickHandler}>
        5
      </button>
      <button id="btn6" onClick={clickHandler}>
        6
      </button>
      <button id="btnMinus" onClick={arithmeticHandler}>
        -
      </button>
      <br />
      <button id="btn7" onClick={clickHandler}>
        7
      </button>
      <button id="btn8" onClick={clickHandler}>
        8
      </button>
      <button id="btn9" onClick={clickHandler}>
        9
      </button>
      <button id="btnMultiply" onClick={arithmeticHandler}>
        *
      </button>
      <br />
      <button id="btn0" onClick={clickHandler}>
        0
      </button>
      <button id="btnDivide" onClick={arithmeticHandler}>
        /
      </button>
      <button id="btnClear" onClick={clearHandler}>
        CLR
      </button>
      <button id="btnEquals" onClick={calculateVal}>
        =
      </button>
    </div>
  );
};

export default Calculator;
