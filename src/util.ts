import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

// We use UTC for the present TZ because the dates in the data
// are all midnight Eastern Time, which lines up with UTC
// but not with, e.g. Pacific Time.
export function formatDate(strDate: string) {
  const date = dayjs.utc(strDate);
  const today = dayjs.utc(new Date());
  if (
    date.date() === today.date() &&
    date.month() === today.month() &&
    date.year() === today.year()
  ) {
    return `Today`;
  } else if (date.year() === today.year()) {
    return date.format("DD MMM");
  } else {
    return date.format("DD MMM YYYY");
  }
}

export function interpolateString(template: string, params: object) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  if (template.includes("`")) {
    throw Error("Template may not include backticks");
  }
  return new Function(...names, `return \`${template}\`;`)(...vals);
}
