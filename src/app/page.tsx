import styles from "../style/home.module.css";
import GameComponent from "../Components/GameComponent";
import BackgroundCanvas from "../Components/BackgroundCanvas";

export default function HomePage() {
  return (
    <div className={styles.App} style={{ background: "#000000" }}>
      <div className={styles.backgroundContainer}>
        <BackgroundCanvas />
      </div>
      <div className={styles.gameContainer}>
        <GameComponent />
      </div>
    </div>
  );
}
