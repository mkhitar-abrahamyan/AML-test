import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = '', ...rest }: InputProps) {
  return (
    <label className={`${styles.label} ${className}`}>
      <span className={styles.labelText}>{label}</span>
      <input className={styles.field} {...rest} />
    </label>
  );
}
