import { useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import { Chip, Spacer } from "@nextui-org/react";

interface BgColorPickerProps {
  bgColor: string;
  onChange: (color: string) => void;
}

export default function BgColorPicker({
  bgColor,
  onChange,
}: BgColorPickerProps) {
  const [color, setColor] = useState<string>();

  useEffect(() => {
    setColor(bgColor);
  }, [bgColor]);

  const handleChangeColor = (color: string) => {
    setColor(color);
    onChange(color);
  };

  return (
    <>
      <Chip style={{ backgroundColor: color }}>Màu nền sticky</Chip>
      <Spacer y={3} />
      <TwitterPicker
        color={color}
        onChangeComplete={(color) => handleChangeColor(color.hex)}
      />
    </>
  );
}
