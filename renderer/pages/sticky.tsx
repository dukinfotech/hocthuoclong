import { Code } from "@nextui-org/react";
import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import useDatabase from "../hooks/useDatabase";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

export default function NextPage() {
  const { selectedDB, stickyWindow, loadSettings } = useSettingStore();

  // Fetch data from database
  const data = useDatabase(selectedDB);

  // Furigana
  const kuroshiro = new Kuroshiro();

  const [counter, setCounter] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const interval = useRef<any>(0);

  useEffect(() => {
    if (data.length > 0) {
      (async () => {
        const selectedDataObject = data[counter];
        if (selectedDataObject) {
          const arrayValues = Object.values(selectedDataObject);
          const id = arrayValues.shift();
          let _text = `${id}. ` + arrayValues.join(stickyWindow.splitedBy);
          await kuroshiro.init(
            new KuromojiAnalyzer({ dictPath: "kuromoji/dict" })
          );
          _text = await kuroshiro.convert(_text, {
            mode: "furigana",
            to: "hiragana",
          });
          setText(_text);
        }
      })();
    }
  }, [counter, data.length]);

  function randomCounter(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  useEffect(() => {
    window.resizeTo(text.length * 10, stickyWindow.height);
  }, [text.length]);

  useEffect(() => {
    window.ipc.invoke("stickyWindow.ready", true).then(() => {
      window.ipc.on("setting.load", (settings) => {
        loadSettings(settings);
      });
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      startInterval();
      return () => pauseInterval(); // Cleanup interval on component unmount
    }
  }, [data.length]);

  const startInterval = () => {
    console.log("startInterval");
    interval.current = setInterval(() => {
      if (stickyWindow.isRandom) {
        const _randomCounter = randomCounter(data.length);
        setCounter(_randomCounter);
      } else {
        setCounter((prevCounter) =>
          prevCounter >= data.length - 1 ? 0 : prevCounter + 1
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
        <span
          className="pl-2"
          dangerouslySetInnerHTML={{ __html: text }}
        ></span>
      </Code>
    </React.Fragment>
  );
}
