"use client";

import * as React from "react";
import LocationSelect from "./LocationSelect";
import SearchButton from "./SearchButton";
import SearchPanel, { SearchPanelLeft, SearchPanelRight } from "./SearchPanel";
import { SingleCalendar } from "./SingleCalender";
import { IoLocationOutline } from "react-icons/io5";

export default function TransportationSearch() {
  // State for selected date
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // State for popover open/close
  const [open, setOpen] = React.useState(false);

  return (
    <SearchPanel>
      <SearchPanelLeft>
        <div>
          <SingleCalendar
            date={date}
            setDate={setDate}
            open={open}
            setOpen={setOpen}
            label="Select tour date"
          />
        </div>
        <LocationSelect
          placeholder=<>
            <IoLocationOutline className="text-rose-500" /> Pick-up location
          </>
        />
      </SearchPanelLeft>

      <SearchPanelRight>
        <SearchButton />
      </SearchPanelRight>
    </SearchPanel>
  );
}
