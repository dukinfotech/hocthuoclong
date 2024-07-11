import { Code } from "@nextui-org/react";
import { RiDraggable } from "react-icons/ri";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import useDatabase from "../hooks/useDatabase";

export default function NextPage() {
  const { selectedDB, stickyWindow, loadSettings } = useSettingStore();

  console.log(stickyWindow.isRandom)

  // Fetch data from database
  const data = useDatabase(selectedDB);

  const [counter, setCounter] = useState<number>(0);
  const text = useMemo(() => {
    if (data.length > 0) {
      const selectedDataObject = data[counter];
      if (selectedDataObject) {
        return Object.values(selectedDataObject).join(" ");
      }
    }
    return "";
  }, [counter, data.length]);

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
        setCounter((prevCounter) =>
          prevCounter >= data.length - 1 ? 0 : prevCounter + 1
        );
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
