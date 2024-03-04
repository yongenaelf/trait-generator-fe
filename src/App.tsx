import "./App.css";

import { useEffect, useState } from "react";

import { saveAs } from "file-saver";

const randomElement = (myArray: Array<string>) =>
  myArray[Math.floor(Math.random() * myArray.length)];

interface Data {
  [key: string]: Array<string>;
}

function App() {
  const [numGen, setNumGen] = useState(1000);
  const [textarea, setTextarea] = useState("");
  const [format, setFormat] = useState(
    "Create a cat, wearing %necklace%, wearing %clothes% clothes, %eyes%, wearing %hat%, with %mouth% mouth, with %pet% pet"
  );
  const [data, setData] = useState<Data>({});

  useEffect(() => {
    async function getData() {
      const data = await (await fetch(`/example.json`)).json();

      return data as Data;
    }

    getData().then((data) => {
      setData(data);

      const keys = Object.keys(data);
      setFormat(
        `Create a cat, ${keys.reduce(
          (acc, cur, idx) => acc + `${idx !== 0 ? ", " : ""}wears %${cur}%`,
          ""
        )}`
      );
    });
  }, []);

  const generate = () => {
    let testcases = [];

    for (let i = 0; i < numGen; i++) {
      const randomise = Object.keys(data).reduce(
        (acc, cur) => ({ ...acc, [cur]: randomElement(data[cur]) }),
        {} as { [key: string]: string }
      );

      const testcase = Object.keys(data).reduce(
        (acc, cur) => acc.replace(RegExp(`%${cur}%`, "g"), randomise[cur]),
        format
      );

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
