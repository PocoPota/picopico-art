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
  ...props
}) => {
  const commonProps = {
    className: `${styles[as]} ${error ? styles.inputError : ""} ${className || ""}`,
    ...props,
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      {as === "textarea" ? (
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
