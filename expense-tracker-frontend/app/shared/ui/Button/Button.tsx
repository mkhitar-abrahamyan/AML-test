import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function Button({ label, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`${styles.btn} ${className}`} {...rest}>
      {label}
    </button>
  );
}
