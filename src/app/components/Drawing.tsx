"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";

import { Stage, Layer, Line } from "react-konva";

import styles from "./Drawing.module.scss";
import Button from "./Button";

const ColorPicker = dynamic(() => import("./ColorPicker"), { ssr: false });

export default function Drawing() {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const [hex, setHex] = useState("#fe8fc6");
  const [lineWidth, setLineWidth] = useState(5);
  const [isDisplayColorPicker, setIsDisplayColorPicker] = useState(false);
  const onClickDisplayColorPicker = () => {
    setIsDisplayColorPicker(!isDisplayColorPicker);
  };
  const [history, setHistory] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const position = e.target.getStage().getPointerPosition();
    const newLine = {
      tool,
      points: [position.x, position.y],
      color: hex,
      strokeWidth: lineWidth,
    };
    const newLines = [...lines, newLine];
    setLines(newLines);

    const snapshot = JSON.parse(JSON.stringify(newLines));
    setHistory([...history, snapshot]);

    setRedoStack([]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    const position = e.target.getStage().getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([position.x, position.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const onClickChangeTool = (tool: string) => {
    setTool(tool);
  };

  const handleLineWidthChange = (e: any) => {
    setLineWidth(Number(e.target.value));
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const prevLines = history.length > 1 ? history[history.length - 2] : [];

    const currentLines = JSON.parse(JSON.stringify(lines));
    setRedoStack([...redoStack, currentLines]);
    setLines(prevLines);
    setHistory(history.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const restored = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    setHistory([...history, restored]);
    setLines(restored);
    setRedoStack(newRedoStack);
  };

  const handleReset = ()=>{
    setLines([]);
    setHistory([]);
    setRedoStack([]);
  }

  return (
    <div className={styles.drawing}>
      <div className={styles.stage}>
        <Stage
          width={800}
          height={400}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div className={styles.toolbar}>
        <Button
          label="ペン"
          onClick={() => onClickChangeTool("pen")}
          size="small"
        />
        <Button
          label="消しゴム"
          onClick={() => onClickChangeTool("eraser")}
          size="small"
        />
        <Button
          label="カラー"
          onClick={onClickDisplayColorPicker}
          size="small"
          />
        <Button
          label="←戻る"
          onClick={handleUndo}
          size="small"
          />
        <Button
          label="進む→"
          onClick={handleRedo}
          size="small"
        />
        <Button
          label="リセット"
          onClick={handleReset}
          size="small"
        />
      </div>
      <div style={{ display: isDisplayColorPicker ? "block" : "none" }}>
        <ColorPicker
          color={hex}
          onChange={(color) => setHex(color.hex)}
        />
      </div>
      <div className={styles.lineWidth}>
        <input
          type="range"
          min={1}
          max={20}
          value={lineWidth}
          onChange={handleLineWidthChange}
        ></input>
        {lineWidth}
      </div>
    </div>
  );
}
