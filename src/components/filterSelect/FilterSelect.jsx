import styles from "./filterSelect.module.css";
import { useState } from "react";

const FilterSelect = ({ itemList, selectedItem, setSelectedItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.defaultValue} onClick={() => setIsOpen(true)}>
          {selectedItem}
        </div>
      </div>
      {isOpen && (
        <div className={styles.modal}>
          <ul className={styles.listContainer}>
            {itemList.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => setSelectedItem(item)}
                  className={selectedItem === item && styles.active}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default FilterSelect;
