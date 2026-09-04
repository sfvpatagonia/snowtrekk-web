







import AdCard from "../adCard/AdCard";
import styles from "./advertise.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef, useState } from 'react';

const Advertise = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    carouselRef.current.style.scrollBehavior = 'auto';
    carouselRef.current.scrollLeft += e.deltaX;
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    carouselRef.current.style.scrollBehavior = 'smooth';
  };

  const carouselRef = useRef(null);

  const items = [
    { name: "Skis 4FRNT Raven", price: "759.00" },
    { name: "Skis 4FRNT Devastator", price: "769.00" },
    { name: "Skis 4FRNT Devastator", price: "769.00" },
    { name: "Skis 4FRNT Devastator", price: "769.00" },
 
    // {
    //   name: "Skis Fischer rc4 The Curv Race Allride",
    //   price: "69.99",
    // },
  ];
  return (
    <div className={styles.container}>
      <ArrowBackIosIcon onClick={() => carouselRef.current.scrollLeft -= 200} />
      <div
        ref={carouselRef}
        className={styles.carousel}
        onDrag={isDragging ? handleDragStart : null}
        onDragEnd={handleDragEnd}
        draggable
      >
        {items.map((item, index) => (
          <AdCard item={item} key={index} color={true}/>
        ))}
      </div>
      <ArrowForwardIosIcon onClick={() => carouselRef.current.scrollLeft += 200} />
    </div>
  );
};

export default Advertise;