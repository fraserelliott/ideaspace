import {
  parseDateFormatString,
  formatDate as feFormatDate,
} from "@fraserelliott/date-formatter";

const DATE_FORMAT = parseDateFormatString("DD-MMM-YYYY");

export function formatDate(date) {
  return feFormatDate(new Date(date), DATE_FORMAT);
}
