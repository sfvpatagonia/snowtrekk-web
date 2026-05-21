import styles from "./notFound.module.css";
import Header from "@/components/header/Header";
import notFound from "@/assets/404.jpg";
import Footer from "@/components/footer/Footer";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <img className={styles.img} src={notFound} />
        <div className={styles.menu}>
          <h1 className={styles.title}>Sorry, not found</h1>
          <div className={styles.buttonContainer}>
            <button className="button" onClick={() => navigate("/")}>
              Go home
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
};

export default NotFound;
