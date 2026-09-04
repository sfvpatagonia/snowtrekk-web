import { useEffect } from "react";
import styles from "./productsTab.module.css";
import { useNavigate } from "react-router-dom";

export default function ProductsTab() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/maintenance");
  }, [navigate]);
  return <main className={styles.container}>ProductsTab</main>;
}
