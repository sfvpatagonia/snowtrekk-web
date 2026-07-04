import styles from "./filterList.module.css";

const FilterList = ({ itemList, selectedItem, setSelectedItem }) => {
  return (
    <ul className={styles.listContainer}>
      {itemList.map((item, index) => {
        return (
          <li
            key={index}
            className={selectedItem === item && styles.active}
            onClick={() => setSelectedItem(item)}
          >
            {item}{" "}
          </li>
        );
      })}
    </ul>
  );
};

export default FilterList;
