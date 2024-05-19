import styles from "../style/home.module.css";
import Game from "../Components/GameComponent";
import Background from "../Components/BackgroundComponent";

export default function HomePage() {
  return (
    <div className={styles.App}>
      <Background />
      <div className={styles.gameContainer}>
        <Game />
      </div>
    </div>
  );
}
