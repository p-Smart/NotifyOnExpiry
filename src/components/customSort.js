
export const customSort = (arr) => {
  arr = arr.map(item => parseInt(item))
    arr.sort((a, b) => {
      const nameA = a;
      const nameB = b;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return [...new Set(arr)]
}