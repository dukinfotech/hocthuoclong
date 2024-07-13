import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import useData from "../hooks/useData";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { REMEMBER_FIELD } from "../const";

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
    const div = document.createElement("div");
    div.classList.add("px-5");
    div.style.fontSize = `${stickyWindow.fontSize}px`;

    if (_texts.length === 1) {
      div.innerHTML = _texts[0];
    } else if (_texts.length > 1) {
      _texts.forEach((_text) => {
        const _div = document.createElement("div");
        _div.innerHTML = _text;
        div.appendChild(_div);
      });
    }

    const stickyWindowElm = document.getElementById("sticky-window");
    const draggableStickyElm = document.getElementById("draggable-sticky");

    stickyWindowElm.appendChild(div);
    const width = draggableStickyElm.clientWidth + div.clientWidth;
    const height = stickyWindowElm.clientHeight;
    console.log(width, div.clientWidth);
    stickyWindowElm.removeChild(div);

    await window.ipc.invoke("stickyWindow.resize", { width, height });
  };

  const randomCounter = (max: number) => {
    return Math.floor(Math.random() * (max + 1));
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
    <div
      id="sticky-window"
      className="flex items-center"
      style={{ whiteSpace: "nowrap", fontSize: `${stickyWindow.fontSize}px` }}
      onMouseEnter={pauseInterval}
      onMouseLeave={startInterval}
    >
      <RiDraggable className="draggable" id="draggable-sticky" />
      <div className="px-5">
        {texts.map((text, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: text }}></div>
        ))}
      </div>
    </div>
  );
}
