import { Code } from "@nextui-org/react";
import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import useData from "../hooks/useData";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { REMEMBER_FIELD } from "../const";
import { shuffleArray } from "../helpers/utils";

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
  const [longestText, setLongestText] = useState<string>("");
  const interval = useRef<any>(0);

  useEffect(() => {
    if (prettyData.length > 0) {
      (async () => {
        const selectedDataObject = prettyData[counter];
        if (selectedDataObject) {
          const arrayValues = Object.values(selectedDataObject);
          const id = arrayValues.shift();

          await kuroshiro.init(
            new KuromojiAnalyzer({ dictPath: "kuromoji/dict" })
          );

          if (stickyWindow.isBreakLine) {
            let _texts = [];
            setLongestText(findLongestText(arrayValues));

            arrayValues.forEach(async (arrayValue) => {
              let _text = await kuroshiro.convert(arrayValue, {
                mode: "furigana",
                to: "hiragana",
              });
              _texts.push(_text);
            });

            setTexts(_texts);
          } else {
            let _text = `${id}. ` + arrayValues.join(stickyWindow.splitedBy);
            _text = await kuroshiro.convert(_text, {
              mode: "furigana",
              to: "hiragana",
            });
            setTexts([_text]);
          }
        }
      })();
    }
  }, [counter, prettyData.length]);

  function randomCounter(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  const findLongestText = (array: string[]) => {
    return array.reduce((longest, current) => {
      return current.length > longest.length ? current : longest;
    }, "");
  };

  useEffect(() => {
    if (texts.length === 1) {
      window.resizeTo(texts[0].length * 10, stickyWindow.height);
    } else if (texts.length > 1) {
      window.resizeTo(
        longestText.length * 10,
        stickyWindow.height * texts.length
      );
    }
  }, [counter]);

  useEffect(() => {
    window.ipc.invoke("stickyWindow.ready", true).then(() => {
      window.ipc.on("setting.load", (settings) => {
        loadSettings(settings);
      });
    });
  }, []);

  useEffect(() => {
    if (prettyData.length > 0) {
      startInterval();
      return () => pauseInterval(); // Cleanup interval on component unmount
    }
  }, [prettyData.length]);

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

  return (
    <React.Fragment>
      <Code
        color="default"
        style={{ display: "flex", alignItems: "center" }}
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
