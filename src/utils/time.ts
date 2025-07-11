/**
 * @param date - The date object or ISO date string to format.
 * @returns The formatted time string.
 */
export const formatTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
