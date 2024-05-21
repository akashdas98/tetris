import styles from "./home.module.css";
import MainMenu from "../Components/MainMenu";

export default function HomePage() {
  return (
    <div className={styles.App}>
      <div className={styles.mainMenuContainer}>
        <MainMenu />
      </div>
    </div>
  );
}
