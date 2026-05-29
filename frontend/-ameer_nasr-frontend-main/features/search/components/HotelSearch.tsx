"use client";

import { useMemo, useState } from "react";
import { DualCalender } from "./DualCalender";
import SearchPanel, { SearchPanelLeft, SearchPanelRight } from "./SearchPanel";
import SearchButton from "./SearchButton";
import { FaUmbrellaBeach } from "react-icons/fa";
import Separator from "../../../components/Separator";
import Placeholder from "./Placeholder";
import GuestSelector from "./GuestSelector";
import { DateRange } from "react-day-picker";

// explicit BookingDates type
interface BookingDates {
  checkInDate?: Date;
  checkOutDate?: Date;
}

export default function HotelSearch() {
  const [bookingDates, setBookingDates] = useState<BookingDates>({});
  const [openCheckIn, setOpenCheckIn] = useState<boolean>(false);
  const [openCheckOut, setOpenCheckOut] = useState<boolean>(false);

  const nights = useMemo(() => {
    const { checkInDate, checkOutDate } = bookingDates;
    if (checkInDate && checkOutDate) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  }, [bookingDates]);

  const formatDate = (date?: Date): string | null =>
    date
      ? date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  // Convert bookingDates -> DateRange for DualCalender
  const getDateRange = (): DateRange | undefined =>
    bookingDates.checkInDate && bookingDates.checkOutDate
      ? { from: bookingDates.checkInDate, to: bookingDates.checkOutDate }
      : undefined;

  // Unified date setter from DualCalender (value may be DateRange | undefined OR updater function)
  const handleDateChange = (range: DateRange | undefined): void => {
    setBookingDates({
      checkInDate: range?.from,
      checkOutDate: range?.to,
    });
  };

  // Wrapper to accept React setter contract (Dispatch<SetStateAction<DateRange|undefined>>)
  const wrapSetDateForDual = (
    setter: (range: DateRange | undefined) => void
  ): React.Dispatch<React.SetStateAction<DateRange | undefined>> => {
    return (value) => {
      // prevRange corresponds to current DateRange
      const prevRange = getDateRange();
      const next: DateRange | undefined =
        typeof value === "function"
          ? (value as (prev: DateRange | undefined) => DateRange | undefined)(
              prevRange
            )
          : value;
      setter(next);
    };
  };

  return (
    <SearchPanel>
      <SearchPanelLeft>
        {/* Check-In Calendar */}
        <div className="flex items-center justify-between">
          <DualCalender
            open={openCheckIn}
            // setOpen wrapper like earlier (supports updater or boolean)
            setOpen={(v) => {
              const next = typeof v === "function" ? v(openCheckIn) : v;
              setOpenCheckIn(next);
              if (next) setOpenCheckOut(false);
            }}
            date={getDateRange()}
            // pass wrapped setter so DualCalender can receive Dispatch<SetStateAction<DateRange|undefined>>
            setDate={wrapSetDateForDual(handleDateChange)}
            label={
              <Placeholder>
                {formatDate(bookingDates.checkInDate) || "Check In"}
              </Placeholder>
            }
          />

          <Separator />
        </div>

        {/* Check-Out Calendar */}
        <div className="flex items-center justify-center! lg:justify-between">
          <DualCalender
            open={openCheckOut}
            setOpen={(v) => {
              const next = typeof v === "function" ? v(openCheckOut) : v;
              setOpenCheckOut(next);
              if (next) setOpenCheckIn(false);
            }}
            date={getDateRange()}
            setDate={wrapSetDateForDual(handleDateChange)}
            label={
              <Placeholder>
                {formatDate(bookingDates.checkOutDate) || "Check Out"}
              </Placeholder>
            }
          />

          <Separator />
        </div>

        <div className="flex items-center justify-between">
          {/* Nights */}
          <div className="flex items-center gap-2 px-4">
            <FaUmbrellaBeach className="w-5 h-5 text-rose-500" />
            <Placeholder>
              {nights > 0
                ? `${nights} Night${nights > 1 ? "s" : ""}`
                : "0 Night(s)"}
            </Placeholder>
          </div>

          <Separator />
        </div>

        {/* Guest Selector */}
        <div className="flex items-center justify-between">
          <GuestSelector />
        </div>
      </SearchPanelLeft>

      <SearchPanelRight>
        <SearchButton />
      </SearchPanelRight>
    </SearchPanel>
  );
}
