import React from "react";
import styles from "./Input.module.scss";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  as?: "input" | "textarea";
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  as = "input",
  type,
  ...props
}) => {
  const isFileInput = type === "file";
  const useTextarea = as === "textarea" && !isFileInput;

  const commonProps = {
    className: `${styles[useTextarea ? "textarea" : "input"]} ${
      error ? styles.inputError : ""
    } ${className || ""}`,
    type,
    ...props,
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      {useTextarea ? (
        <textarea
          {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default Input;
