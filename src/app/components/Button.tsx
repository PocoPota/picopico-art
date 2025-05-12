import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
  label: string;
  size?: "small" | "medium" | "large";
  color?: "primary";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  label,
  size = "medium",
  color = "primary",
  className,
  ...props
}: ButtonProps) {
  const classNames = clsx(
    styles.button,
    styles[size],
    styles[color],
    className,
  );
  return (
    <button
      className={classNames}
      {...props}
    >
      {label}
    </button>
  );
}
