export function getInitialDate(daysFromToday = 30) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  return date;
}
