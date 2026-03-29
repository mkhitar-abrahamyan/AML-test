import styles from './Card.module.css';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`${styles.card} ${className}`}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </section>
  );
}
