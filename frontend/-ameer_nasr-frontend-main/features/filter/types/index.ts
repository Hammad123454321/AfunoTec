export interface FilterOption {
  value: string;
  label: string;
  count: number;
  children?: FilterOption[];
}

export interface BaseFilter {
  id: string;
  label: string;
}

export interface CheckboxFilter extends BaseFilter {
  type: "checkbox";
  options: FilterOption[];
}

export interface RadioFilter extends BaseFilter {
  type: "radio";
  options: FilterOption[];
}

export interface NestedFilter extends BaseFilter {
  type: "nested";
  options: FilterOption[];
}

export type Filter = CheckboxFilter | RadioFilter | NestedFilter;

export interface FilterConfig {
  filters: Filter[];
}

export interface FilterStyles {
  container?: string;
  header?: string;
  headerText?: string;
  clearButton?: string;
  filterSection?: string;
  filterLabel?: string;
  option?: string;
  activeTag?: string;
}
