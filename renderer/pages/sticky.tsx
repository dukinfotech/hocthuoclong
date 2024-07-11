import { Code } from "@nextui-org/react";
import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import useDatabase from "../hooks/useDatabase";

export default function NextPage() {
  const { selectedDB, stickyWindow, loadSettings } = useSettingStore();

  // Fetch data from database
  const data = useDatabase(selectedDB);

  const [counter, setCounter] = useState<number>(0);
  const text = useMemo(() => {
    let _text = "";
    if (data.length > 0) {
      const selectedDataObject = data[counter];
      if (selectedDataObject) {
        _text = Object.values(selectedDataObject).join(" ");
      }
    }
    return _text;
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
      const interval = setInterval(() => {
        if (stickyWindow.isRandom) {
          const _randomCounter = randomCounter(data.length);
          setCounter(_randomCounter);
        } else {
          setCounter((prevCounter) =>
            prevCounter >= data.length - 1 ? 0 : prevCounter + 1
          );
        }
      }, stickyWindow.interval);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [data.length]);

  return (
    <React.Fragment>
      <Code color="default" style={{ display: "flex", alignItems: "center" }}>
        <RiDraggable className="draggable" />
        <span>{text}</span>
      </Code>
    </React.Fragment>
  );
}
