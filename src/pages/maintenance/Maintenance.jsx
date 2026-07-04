import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import toolbox from "@/assets/toolbox.png";
import styles from "./maintenance.module.css";
import { useNavigate } from "react-router-dom";

export default function Maintenance() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <img className={styles.img} src={toolbox} />
        <div className={styles.menu}>
          <h1 className={styles.title}>Website under construction</h1>
          <p className={styles.subtitle}>
            Our website is currently under construction
          </p>
          <p className={styles.subtitle}>This section will be available soon</p>
          <div className={styles.buttonContainer}>
            <button className="button" onClick={() => navigate("/")}>
              Go home
            </button>
            <button className="button" onClick={() => navigate(-2)}>
              Go back
            </button>
            {/* <button className="button" onClick={() => navigate("/")}>
          Surprise me!
        </button> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
