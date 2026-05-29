import LocationSelect from "./LocationSelect";
import SearchButton from "./SearchButton";
import SearchPanel, { SearchPanelLeft, SearchPanelRight } from "./SearchPanel";

export default function ActivitySearch() {
  return (
    <SearchPanel>
      <SearchPanelLeft>
        <LocationSelect placeholder={undefined} />
        <LocationSelect placeholder={undefined} />
      </SearchPanelLeft>
      <SearchPanelRight>
        <SearchButton />
      </SearchPanelRight>
    </SearchPanel>
  );
}
