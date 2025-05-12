"use client";

import { SketchPicker, ColorResult } from "react-color";

type Props = {
  color: string;
  onChange: (color: ColorResult) => void;
};

export default function ColorPicker({ color, onChange }: Props) {
  return (
    <SketchPicker
      color={color}
      onChange={onChange}
      presetColors={[
        "#FF6900",
        "#FCB900",
        "#7BDCB5",
        "#00D084",
        "#8ED1FC",
        "#0693E3",
        "#ABB8C3",
        "#EB144C",
        "#fe8fc6",
        "#9900EF",
        "#ffffff",
      ]}
    />
  );
}
