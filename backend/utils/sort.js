export function sortByPoints(list) {
  const sortedList = list.sort((a, b) => b.points - a.points);
  return sortedList;
}

export function sortByValue(list) {
  const sortedList = list.sort((a, b) => b.value - a.value);
  return sortedList;
}
