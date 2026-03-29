import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, options, placeholder, className = '', ...rest }: SelectProps) {
  return (
    <label className={`${styles.label} ${className}`}>
      <span className={styles.labelText}>{label}</span>
      <select className={styles.field} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
