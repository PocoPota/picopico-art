import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
  label: string;
  size?: "small" | "medium" | "large";
  color?: "primary";
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset" | undefined;
  target?: string;
};

export default function Button({
  label,
  size = "medium",
  color = "primary",
  className,
  href,
  target,
  type,
  onClick,
  ...props
}: ButtonProps) {
  const classNames = clsx(
    styles.button,
    styles[size],
    styles[color],
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={classNames}
        onClick={onClick}
        {...props}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      className={classNames}
      onClick={onClick}
      type={type}
      {...props}
    >
      {label}
    </button>
  );
}
