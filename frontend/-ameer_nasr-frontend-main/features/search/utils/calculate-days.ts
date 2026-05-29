import type { DateRange } from "react-day-picker";

export const calculateNights = (date: DateRange) =>
  date?.from && date?.to
    ? Math.ceil(
        (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;
