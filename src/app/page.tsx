import styles from "../style/home.module.css";
import MainMenu from "../Components/MainMenu";

export default function HomePage() {
  return (
    <div className={styles.App}>
      <MainMenu />
    </div>
  );
}
