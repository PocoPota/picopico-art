import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
  label: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  label,
  size = "medium",
  className,
  ...props
}: ButtonProps) {
  const classNames = clsx(styles.button, styles[size], className);
  return <button className={classNames} {...props}>{label}</button>;
}
