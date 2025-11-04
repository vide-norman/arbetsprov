export const getTimeDifference = (date: Date) =>
  date.getTime() - new Date().getTime()

export const isFutureDate = (date: Date) => getTimeDifference(date) > 0
