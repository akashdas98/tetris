import styles from "../style/home.module.css";
import GameComponent from "../Components/GameComponent";
import Background from "../Components/Background";

export default function HomePage() {
  return (
    <div className={styles.App}>
      <Background />
      <div className={styles.gameContainer}>
        <GameComponent />
      </div>
    </div>
  );
}
