export * from './stringFunctions';
export * from './filterData';
export * from './formatDate';
export * from './countryAbbreviation';
export * from './locationUtils';

export function toHHMMSS(secs: any) {
  const sec_num = parseInt(secs, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

export const textSlice = (item: string, length : number) => {
  if (item.length <= length) {
    return item; // Return the entire string if it's shorter or equal to 30
  }
  // Slice the first 30 characters and return
  return item.slice(0, length) + '...';
}

export const formatDuration = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};