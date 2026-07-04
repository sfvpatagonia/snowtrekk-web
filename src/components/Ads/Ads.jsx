import React, { useState } from "react";
import styles from "./ads.module.css";
import Advertise from "../advertise/Advertise";
import AdCard from "../adCard/AdCard";

const ads = [
  {
    id: 1,
    title: "Ad 1",
    url: "https://www.youtube.com/embed/9g3--WYH8SY",
  },
  {
    id: 2,
    title: "Ad 2",
    url: "https://www.youtube.com/embed/9g3--WYH8SY",
  },
  {
    id: 3,
    title: "Ad 3",
    url: "https://www.youtube.com/embed/9g3--WYH8SY",
  },
];

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
