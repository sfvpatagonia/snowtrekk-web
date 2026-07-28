export const sortArray = (array, name) => {
  array.sort((a, b) => {
    if (a.name === name) return -1;
    if (b.name === name) return 1;
    return 0;
  });
  return array;
};
