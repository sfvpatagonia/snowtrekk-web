import { Link } from "react-router-dom";
import styles from "./adCard.module.css";

const AdCard = ({ item, color }) => {
  return (
    <Link to={`/shop/products/${item.id}`} className={styles.container}>
      <img
        src={
          item.img ? item.img[0] : `https://placehold.co/400x400/${color ? 'pink' : 'green'}/white`
        }
        className={styles.img}
      />
      <p className={styles.adName}>{item.name}</p>
      <p className={styles.adPrice}>${item.price}</p>
    </Link>
  );
};

export default AdCard;
