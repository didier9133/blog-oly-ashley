function parseISODuration(duration: string): number | null {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function sumDurationsToISO(
  prep?: string | null,
  cook?: string | null,
): string | null {
  const prepSeconds = prep ? parseISODuration(prep) : null;
  const cookSeconds = cook ? parseISODuration(cook) : null;
  if (prepSeconds === null && cookSeconds === null) return null;
  const totalSeconds = (prepSeconds ?? 0) + (cookSeconds ?? 0);
  if (totalSeconds === 0) return null;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let result = "PT";
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  if (seconds > 0) result += `${seconds}S`;
  return result;
}
