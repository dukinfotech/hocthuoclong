import { Code } from "@nextui-org/react";
import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import useData from "../hooks/useData";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { REMEMBER_FIELD, STICKY_WINDOW_DEFAULT_HEIGHT } from "../const";
import { textContentFromHTML } from "../helpers/utils";

export default function NextPage() {
  const { selectedDB, stickyWindow, loadSettings } = useSettingStore();

  // Fetch data from database
  const { data } = useData(selectedDB);
  let prettyData = data.filter(
    (dataObject) => dataObject[REMEMBER_FIELD] === "false"
  );

  // Furigana
  const kuroshiro = new Kuroshiro();

  const [counter, setCounter] = useState<number>(0);
  const [texts, setTexts] = useState<string[]>([]);
  const interval = useRef<any>(0);

  // Convert to furigana
  useEffect(() => {
    if (prettyData.length > 0) {
      const selectedDataObject = prettyData[counter];

      if (selectedDataObject) {
        const arrayValues = Object.values(selectedDataObject);
        const id = arrayValues.shift();
        arrayValues.shift(); // remove isRemembered

        concatValuesToString(id, arrayValues).then((_texts) => {
          resizeStickyWindow(_texts).then((_texts2) => {
            setTexts(_texts);
          });
        });
      }
    }
  }, [counter, prettyData.length]);

  // Load settings
  useEffect(() => {
    window.ipc.invoke("stickyWindow.ready", true).then(() => {
      window.ipc.on("setting.load", (settings) => {
        loadSettings(settings);
      });
    });
  }, []);

  // Run interval
  useEffect(() => {
    if (prettyData.length > 0) {
      startInterval();
      return () => pauseInterval(); // Cleanup interval on component unmount
    }
  }, [prettyData.length]);

  useEffect(() => {
    document.getElementById("__next");
  }, []);

  const concatValuesToString = (id: string, values: string[]) => {
    return new Promise<string[]>(async (resolve, reject) => {
      let _texts = [];

      await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "kuromoji/dict" }));

      if (stickyWindow.isBreakLine) {
        for (const value of values) {
          let _text = await kuroshiro.convert(value, {
            mode: "furigana",
            to: "hiragana",
          });
          _texts.push(_text);
        }
      } else {
        let _text = `${id}. ` + values.join(stickyWindow.splitedBy);
        _text = await kuroshiro.convert(_text, {
          mode: "furigana",
          to: "hiragana",
        });
        _texts = [_text];
      }

      resolve(_texts);
    });
  };

  const resizeStickyWindow = async (_texts: string[]) => {
    let width: number = 0;
    let height: number = 0;
    let WIDTH_EACH_CHARACTER = 15;
    let HEIGHT_EACH_ROW = STICKY_WINDOW_DEFAULT_HEIGHT - 5;

    if (_texts.length === 1) {
      width = textContentFromHTML(_texts[0]).length * WIDTH_EACH_CHARACTER;
      height = HEIGHT_EACH_ROW;
    } else if (_texts.length > 1) {
      const plainTexts = _texts.map((_text) => textContentFromHTML(_text));
      const maxLengthText = findMaxLengthText(plainTexts);

      width = maxLengthText.length * WIDTH_EACH_CHARACTER;
      console.log(maxLengthText, maxLengthText.length);
      height = HEIGHT_EACH_ROW * _texts.length;
    }

    await window.ipc.invoke("stickyWindow.resize", { width, height });
  };

  const randomCounter = (max: number) => {
    return Math.floor(Math.random() * (max + 1));
  };

  const findMaxLengthText = (_texts: string[]) => {
    return _texts.reduce((longest, current) => {
      return current.length > longest.length ? current : longest;
    }, "");
  };

  const startInterval = () => {
    console.log("startInterval");
    interval.current = setInterval(() => {
      if (stickyWindow.isRandom) {
        const _randomCounter = randomCounter(prettyData.length);
        setCounter(_randomCounter);
      } else {
        setCounter((prevCounter) =>
          prevCounter >= prettyData.length - 1 ? 0 : prevCounter + 1
        );
      }
    }, stickyWindow.interval);
  };

  const pauseInterval = () => {
    console.log("pauseInterval");
    clearInterval(interval.current);
  };

  // Trigger for CSS only this page
  useEffect(() => {
    document.getElementsByTagName("body").item(0).classList.add("h-screen");
    document
      .getElementById("__next")
      .classList.add("h-full", "flex", "items-center");
  }, []);

  return (
    <React.Fragment>
      <Code
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
        onMouseEnter={pauseInterval}
        onMouseLeave={startInterval}
      >
        <RiDraggable className="draggable" />
        <div>
          {texts.map((text, i) => (
            <div
              key={i}
              className="pl-2"
              dangerouslySetInnerHTML={{ __html: text }}
            ></div>
          ))}
        </div>
      </Code>
    </React.Fragment>
  );
}
