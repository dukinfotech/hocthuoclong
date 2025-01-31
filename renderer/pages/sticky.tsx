import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { SHOWN_COLUMNS, STICKY_WINDOW_DEFAULT_FONTSIZE } from "../const";
import useDataBase from "../hooks/useDatabase";

export default function NextPage() {
  const [shownColumns, setShownColumns] = useState<number[]>();
  const { selectedDB, stickyWindow, loadSettings } = useSettingStore();
  const [data, setData] = useState<Array<any>>([]);
  const { selectData } = useDataBase();

  useEffect(() => {
    if (selectedDB) {
      (async () => {
        const _data = await selectData(selectedDB);
        setData(_data);
      })();
    }
  }, [selectedDB]);

  // Furigana
  const kuroshiro = new Kuroshiro();

  const [counter, setCounter] = useState<number>(0);
  const interval = useRef<any>(0);

  useEffect(() => {
    let _shownColumns: number[] | undefined = undefined;
    try {
      _shownColumns = JSON.parse(localStorage.getItem(SHOWN_COLUMNS));
    } finally {
      setShownColumns(_shownColumns);
    }
  }, []);

  // Convert to furigana
  useEffect(() => {
    if (data.length > 0) {
      const row = data[counter];

      
      if (row) {
        let arrayValues = Object.values(row);
        const id = arrayValues[0] as number;
        
        if (shownColumns) {
          arrayValues = arrayValues.filter((arrayValue, i) => {
            return shownColumns.includes(i - 1);
          });
        }

        concatValuesToString(id, arrayValues).then((_texts) => {
          replaceText(_texts);
        });
      }
    }
  }, [counter, data.length]);

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
    if (data.length > 0) {
      startInterval();
      return () => pauseInterval(); // Cleanup interval on component unmount
    }
  }, [data.length]);

  useEffect(() => {
    document.getElementById("__next");
  }, []);

  const concatValuesToString = (id: number, values: any[]) => {
    return new Promise<string[]>(async (resolve, reject) => {
      let _texts = [];

      if (stickyWindow.isBreakLine) {
        for (const value of values) {
          let _text = value;
          if (stickyWindow.isFurigana) {
            await kuroshiro.init(
              new KuromojiAnalyzer({ dictPath: "/sticky/kuromoji/dict" })
            );
            _text = await kuroshiro.convert(value, {
              mode: "furigana",
              to: "hiragana",
            });
          }
          _texts.push(_text);
        }
      } else {
        let _text = `${id}. ` + values.join(stickyWindow.splitedBy);
        if (stickyWindow.isFurigana) {
          await kuroshiro.init(
            new KuromojiAnalyzer({ dictPath: "/sticky/kuromoji/dict" })
          );
          _text = await kuroshiro.convert(_text, {
            mode: "furigana",
            to: "hiragana",
          });
        }
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
      let visibleTexts = _texts.filter((_text) => Boolean(_text));
      visibleTexts.forEach((_text, i) => {
        const _div = document.createElement("div");
        _div.innerHTML = i < visibleTexts.length - 1 ? _text + "<hr/>" : _text;
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
      const width =
        stickyWindowElm.clientWidth + STICKY_WINDOW_DEFAULT_FONTSIZE;
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

  // Trigger for CSS only this page
  useEffect(() => {
    if (stickyWindow.fontSize > 0) {
      // Trigger for detect settings loaded
      const bodyTag = document.getElementsByTagName("body").item(0);
      bodyTag.style.backgroundColor = stickyWindow.bgColor;
      bodyTag.classList.add("h-screen", "w-screen");

      document
        .getElementById("__next")
        .classList.add("h-full", "flex", "items-center");
    }
  }, [stickyWindow]);

  return (
    <div
      id="sticky-window"
      className="flex items-center"
      style={{
        whiteSpace: "nowrap",
        fontSize: `${stickyWindow.fontSize}px`,
      }}
      onMouseEnter={pauseInterval}
      onMouseLeave={startInterval}
    >
      <RiDraggable className="draggable mr-2" />
      <div id="sticky-content"></div>
    </div>
  );
}
