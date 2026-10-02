const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** 'YYYY-MM' -> 'Apr 2026'. Throws on malformed input so bad data fails the build. */
export const formatMonth = (value: string): string => {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match || !month) throw new Error(`Invalid month "${value}", expected YYYY-MM`);
  return `${month} ${match[1]}`;
};

export const formatRange = (start: string, end: string): string =>
  `${formatMonth(start)} – ${end === 'present' ? 'Present' : formatMonth(end)}`;
