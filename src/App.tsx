import "./App.css";

import { useState } from "react";

import breed from "./assets/breed.json";
import clothes from "./assets/clothes.json";
import eyes from "./assets/eyes.json";
import hats from "./assets/hats.json";
import mouth from "./assets/mouth.json";
import pet from "./assets/pet.json";

import { saveAs } from "file-saver";

const randomElement = (myArray: Array<string>) =>
  myArray[Math.floor(Math.random() * myArray.length)];

function App() {
  const [numGen, setNumGen] = useState(1000);
  const [textarea, setTextarea] = useState("");
  const [format, setFormat] = useState(
    "Create a %breed% cat, wearing %clothes% clothes, %eyes%, wearing %hat%, with %mouth% mouth, with %pet% pet"
  );

  const generate = () => {
    let testcases = [];

    for (let i = 0; i < numGen; i++) {
      const _breed = randomElement(breed);
      const _clothes = randomElement(clothes);
      const _eyes = randomElement(eyes);
      const _hats = randomElement(hats);
      const _mouth = randomElement(mouth);
      const _pet = randomElement(pet);

      const testcase = format
        .replace(/%breed%/g, _breed)
        .replace(/%clothes%/g, _clothes)
        .replace(/%eyes%/g, _eyes)
        .replace(/%hat%/g, _hats)
        .replace(/%mouth%/g, _mouth)
        .replace(/%pet%/g, _pet);

      testcases.push(testcase);
    }

    setTextarea(testcases.join("\n"));
  };

  return (
    <>
      <div>
        <label>
          Format
          <textarea
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          />
        </label>
        <label>
          Number of generations
          <input
            type="number"
            min={1}
            value={numGen}
            onChange={(e) => setNumGen(Number(e.target.value))}
          />
        </label>
        <br />
        <button onClick={generate}>Generate</button>
        <br />
        <textarea rows={30} value={textarea} />
        <br />
        <button
          onClick={() => {
            navigator.clipboard.writeText(textarea);
          }}
        >
          Copy
        </button>
        <br />
        <button
          onClick={() => {
            const json = textarea.split("\n");

            var file = new File([JSON.stringify(json)], "prompts.json", {
              type: "application/json;charset=utf-8",
            });
            saveAs(file);
          }}
        >
          download JSON
        </button>
      </div>
    </>
  );
}

export default App;
