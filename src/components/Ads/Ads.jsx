import styles from "./ads.module.css";
import AdCard from "../adCard/AdCard";

const Ads = () => {
  return (
    <>
      <div className={styles.containerAds}>
        {/* {ads.map((ad) => (
          <div key={ad.id} className={styles.containerAd}>
            <iframe
              className={styles.iframe}
              src={ad.url}
              title={ad.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))} */}
        {/* <AdCard item={{ name: "hola", price: 256 }} /> */}
        <AdCard item={{ name: "hola", price: 256 }} color={false} />
        <AdCard item={{ name: "hola", price: 256 }} color={false} />
      </div>
    </>
  );
};

export default Ads;
