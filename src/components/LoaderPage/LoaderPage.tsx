
import styles from './LoaderPage.module.scss'

export default function LoaderPage() {
  return (
    <div className={styles["loader-wrapper"]}>
      <div className={styles["loader-page"]}>
        {/*  13 div-ов для анимации */}
        {[...Array(13)].map((_, i) => (
          <div key={i}></div>
        ))}
      </div>
    </div>
  );
}

