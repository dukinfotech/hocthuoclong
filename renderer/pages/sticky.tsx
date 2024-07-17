import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import useData from "../hooks/useData";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { REMEMBER_FIELD, STICKY_WINDOW_DEFAULT_FONTSIZE } from "../const";

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
          replaceText(_texts);
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

  const replaceText = async (_texts: string[]) => {
    const div = document.createElement("div");
    div.style.fontSize = `${stickyWindow.fontSize}px`;

    if (_texts.length === 1) {
      div.innerHTML = _texts[0];
    } else if (_texts.length > 1) {
      _texts.forEach((_text) => {
        const _div = document.createElement("div");
        _div.innerHTML = _text + "<hr/>";
        div.appendChild(_div);
      });
    }

    const stickyWindowElm = document.getElementById("sticky-window");
    const stickyContentElm = document.getElementById("sticky-content");

    if (stickyContentElm.hasChildNodes()) {
      stickyContentElm.innerHTML = div.outerHTML;
    } else {
      stickyContentElm.append(div);
    }

    if (stickyWindow.autoResize) {
      const width = stickyWindowElm.clientWidth + STICKY_WINDOW_DEFAULT_FONTSIZE;
      const height = stickyWindowElm.clientHeight;
      console.log(width, height);

      await window.ipc.invoke("stickyWindow.resize", { width, height });
    }
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
      <RiDraggable className="draggable mr-2" />
      <div id="sticky-content"></div>
    </div>
  );
}
