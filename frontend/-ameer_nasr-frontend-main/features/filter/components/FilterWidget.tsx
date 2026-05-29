"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChevronRight, Filter, LucideChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface FilterOption {
  value: string;
  label: string;
  count: number;
  children?: FilterOption[];
}

interface BaseFilter {
  id: string;
  label: string;
}

interface CheckboxFilter extends BaseFilter {
  type: "checkbox";
  options: FilterOption[];
}

interface RadioFilter extends BaseFilter {
  type: "radio";
  options: FilterOption[];
}

interface NestedFilter extends BaseFilter {
  type: "nested";
  options: FilterOption[];
}

type Filter = CheckboxFilter | RadioFilter | NestedFilter;

interface FilterConfig {
  filters: Filter[];
}

interface FilterStyles {
  container?: string;
  header?: string;
  headerText?: string;
  filterSection?: string;
  option?: string;
}

interface FilterPanelProps {
  config: FilterConfig;
  styles?: FilterStyles;
  onFilterChange?: (filters: Record<string, string | string[]>) => void;
}

interface NestedFilterState {
  currentLevel: FilterOption[];
  history: FilterOption[][];
  selectedPath: string[];
}

function FilterContent({
  config,
  styles = {},
  selectedFilters,
  expandedFilters,
  nestedFilterStates,
  isPending,
  onToggleFilter,
  onCheckbox,
  onRadio,
  onNestedSelect,
  onNestedBack,
  onClearAll,
  getCurrentValue,
}: {
  config: FilterConfig;
  styles?: FilterStyles;
  selectedFilters: Record<string, string | string[]>;
  expandedFilters: Record<string, boolean>;
  nestedFilterStates: Record<string, NestedFilterState>;
  isPending: boolean;
  onToggleFilter: (filterId: string) => void;
  onCheckbox: (filterId: string, optionValue: string) => void;
  onRadio: (filterId: string, optionValue: string) => void;
  onNestedSelect: (filterId: string, option: FilterOption) => void;
  onNestedBack: (filterId: string) => void;
  onClearAll: () => void;
  getCurrentValue: (filterId: string) => string | string[];
}) {
  const activeFilters = config.filters.filter((f) => {
    const value = getCurrentValue(f.id);
    return Array.isArray(value) ? value.length > 0 : !!value;
  });

  const renderNestedFilter = (filter: NestedFilter) => {
    const state = nestedFilterStates[filter.id];
    const currentLevel = state?.currentLevel || filter.options;
    const hasHistory = state?.history && state.history.length > 0;
    const currentValues = getCurrentValue(filter.id);
    const currentArray = Array.isArray(currentValues) ? currentValues : [];

    const handleNestedCheckbox = (optionValue: string) => {
      const newArray = currentArray.includes(optionValue)
        ? currentArray.filter((v) => v !== optionValue)
        : [...currentArray, optionValue];

      // Update the filter with new array
      const newFilters = { ...selectedFilters };
      if (newArray.length > 0) {
        newFilters[filter.id] = newArray;
      } else {
        delete newFilters[filter.id];
      }

      // We'll handle the URL update in the parent component
      // For now, we'll use the checkbox handler
      onCheckbox(filter.id, optionValue);
    };

    return (
      <div className="space-y-2">
        {/* Breadcrumb */}
        {hasHistory && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNestedBack(filter.id)}
              className="p-1 h-auto text-xs flex items-center gap-1 hover:bg-gray-100"
            >
              <ChevronRight size={12} className="rotate-180" />
              Back
            </Button>
          </div>
        )}

        {/* Current Level Options */}
        <div className="space-y-1">
          {currentLevel.map((option) => {
            const hasChildren = option.children && option.children.length > 0;
            const isSelected = currentArray.includes(option.value);

            return (
              <div key={option.value} className="space-y-1">
                {/* Main option with checkbox */}
                <label
                  className={cn(
                    styles.option ||
                      "flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors",
                    isSelected && "bg-green-50 border border-green-200",
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 font-medium">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleNestedCheckbox(option.value);
                      }}
                      className="size-4 accent-primary-500 flex-shrink-0 border border-gray-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-800 truncate cursor-pointer">
                      {option.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm text-gray-700">
                      ({option.count})
                    </span>
                    {hasChildren && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNestedSelect(filter.id, option);
                        }}
                        className="p-1 h-auto hover:bg-gray-200 rounded"
                      >
                        <ChevronRight size={16} className="text-gray-400" />
                      </Button>
                    )}
                  </div>
                </label>

                {/* Show selected children if this option has children and is selected */}
                {hasChildren && isSelected && (
                  <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-3">
                    {option.children?.map((childOption) => {
                      const isChildSelected = currentArray.includes(
                        childOption.value,
                      );
                      const hasGrandChildren =
                        childOption.children && childOption.children.length > 0;

                      return (
                        <div key={childOption.value} className="space-y-1">
                          <label
                            className={cn(
                              "flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors",
                              isChildSelected &&
                                "bg-green-50 border border-green-200",
                            )}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChildSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleNestedCheckbox(childOption.value);
                                }}
                                className="size-4 accent-primary-500 flex-shrink-0 border border-gray-500 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700 truncate cursor-pointer">
                                {childOption.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm text-gray-600">
                                ({childOption.count})
                              </span>
                              {hasGrandChildren && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNestedSelect(filter.id, childOption);
                                  }}
                                  className="p-1 h-auto hover:bg-gray-200 rounded"
                                >
                                  <ChevronRight
                                    size={14}
                                    className="text-gray-400"
                                  />
                                </Button>
                              )}
                            </div>
                          </label>

                          {/* Show selected grandchildren */}
                          {hasGrandChildren && isChildSelected && (
                            <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                              {childOption.children?.map((grandChildOption) => {
                                const isGrandChildSelected =
                                  currentArray.includes(grandChildOption.value);

                                return (
                                  <label
                                    key={grandChildOption.value}
                                    className={cn(
                                      "flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors",
                                      isGrandChildSelected &&
                                        "bg-green-50 border border-green-200",
                                    )}
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <input
                                        type="checkbox"
                                        checked={isGrandChildSelected}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleNestedCheckbox(
                                            grandChildOption.value,
                                          );
                                        }}
                                        className="size-4 accent-primary-500 flex-shrink-0 border border-gray-500 cursor-pointer"
                                      />
                                      <span className="text-sm text-gray-600 truncate cursor-pointer">
                                        {grandChildOption.label}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-600 flex-shrink-0">
                                      ({grandChildOption.count})
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {activeFilters.length > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <Button
            onClick={onClearAll}
            disabled={isPending}
            variant="destructive"
            size="sm"
            className="w-full bg-transparent text-rose-500 hover:text-white"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      <div
        className={`p-4 space-y-4 overflow-y-auto ${
          isPending ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {config.filters.map((filter) => {
          const currentValue = getCurrentValue(filter.id);
          const isExpanded = expandedFilters[filter.id];

          return (
            <div
              key={filter.id}
              className={styles.filterSection || "border-b last:border-0 pb-2"}
            >
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onToggleFilter(filter.id)}
                className="w-full flex items-center justify-between font-semibold px-2 mb-2"
              >
                <span>{filter.label}</span>
                <span
                  className={cn(
                    "text-gray-500 text-sm transition-transform pointer-events-none",
                    isExpanded && "rotate-180",
                  )}
                >
                  <LucideChevronDown size={16} />
                </span>
              </Button>

              <AnimatePresence mode="wait" initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1"
                  >
                    {filter.type === "nested"
                      ? renderNestedFilter(filter as NestedFilter)
                      : filter.options.map((option) => {
                          const isChecked =
                            filter.type === "checkbox"
                              ? Array.isArray(currentValue) &&
                                currentValue.includes(option.value)
                              : currentValue === option.value;

                          return (
                            <label
                              key={option.value}
                              className={
                                styles.option ||
                                "flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                              }
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0 font-medium">
                                <input
                                  type={filter.type}
                                  name={filter.id}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    filter.type === "checkbox"
                                      ? onCheckbox(filter.id, option.value)
                                      : onRadio(filter.id, option.value);
                                  }}
                                  className="size-4 accent-primary-500 flex-shrink-0 border border-gray-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-800 truncate cursor-pointer">
                                  {option.label}
                                </span>
                              </div>
                              <span className="text-sm text-gray-700 flex-shrink-0">
                                ({option.count})
                              </span>
                            </label>
                          );
                        })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function FilterPanel({
  config,
  styles = {},
  onFilterChange,
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({});
  const [nestedFilterStates, setNestedFilterStates] = useState<
    Record<string, NestedFilterState>
  >({});
  const [initialized, setInitialized] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Initialize expandedFilters only once, all expanded by default
  useEffect(() => {
    if (!initialized) {
      const expandedState: Record<string, boolean> = {};
      const nestedState: Record<string, NestedFilterState> = {};

      config.filters.forEach((f) => {
        expandedState[f.id] = true;
        if (f.type === "nested") {
          nestedState[f.id] = {
            currentLevel: f.options,
            history: [],
            selectedPath: [],
          };
        }
      });

      setExpandedFilters(expandedState);
      setNestedFilterStates(nestedState);
      setInitialized(true);
    }
  }, [config.filters, initialized]);

  // Parse current filters from URL
  const getCurrentFilters = (): Record<string, string | string[]> => {
    const filters: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== "page") {
        try {
          filters[key] = JSON.parse(value);
        } catch {
          filters[key] = value;
        }
      }
    });
    return filters;
  };

  const selectedFilters = getCurrentFilters();

  const getCurrentValue = (filterId: string): string | string[] => {
    return selectedFilters[filterId] || [];
  };

  const updateURL = (newFilters: Record<string, string | string[]>) => {
    const params = new URLSearchParams();

    // Always preserve page parameter if it exists
    const currentPage = searchParams.get("page");
    if (currentPage) {
      params.set("page", currentPage);
    }

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, JSON.stringify(value));
        } else if (!Array.isArray(value) && value !== "") {
          params.set(key, JSON.stringify(value));
        }
      }
    });

    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(newPath, { scroll: false });
    });

    onFilterChange?.(newFilters);
  };

  const updateFilter = (filterId: string, value: string | string[] | null) => {
    const newFilters = { ...selectedFilters };
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }
    updateURL(newFilters);
  };

  const handleCheckbox = (filterId: string, optionValue: string) => {
    const current = getCurrentValue(filterId);
    const currentArray = Array.isArray(current) ? current : [];

    const newArray = currentArray.includes(optionValue)
      ? currentArray.filter((v) => v !== optionValue)
      : [...currentArray, optionValue];

    updateFilter(filterId, newArray.length > 0 ? newArray : null);
  };

  const handleRadio = (filterId: string, optionValue: string) => {
    const current = getCurrentValue(filterId);
    updateFilter(filterId, current === optionValue ? null : optionValue);
  };

  const handleNestedSelect = (filterId: string, option: FilterOption) => {
    if (option.children && option.children.length > 0) {
      // Navigate to children level
      setNestedFilterStates((prev) => {
        const currentState = prev[filterId];
        return {
          ...prev,
          [filterId]: {
            currentLevel: option.children!,
            history: [
              ...(currentState?.history || []),
              currentState?.currentLevel || [],
            ],
            selectedPath: [...(currentState?.selectedPath || []), option.value],
          },
        };
      });
    }
    // Don't auto-select when navigating, let user check the checkboxes manually
  };

  const handleNestedBack = (filterId: string) => {
    setNestedFilterStates((prev) => {
      const currentState = prev[filterId];
      if (!currentState || currentState.history.length === 0) return prev;

      const newHistory = [...currentState.history];
      const previousLevel = newHistory.pop();
      const newSelectedPath = [...currentState.selectedPath];
      newSelectedPath.pop();

      return {
        ...prev,
        [filterId]: {
          currentLevel: previousLevel!,
          history: newHistory,
          selectedPath: newSelectedPath,
        },
      };
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });

    // Reset nested states
    const resetNestedStates: Record<string, NestedFilterState> = {};
    config.filters.forEach((f) => {
      if (f.type === "nested") {
        resetNestedStates[f.id] = {
          currentLevel: f.options,
          history: [],
          selectedPath: [],
        };
      }
    });
    setNestedFilterStates(resetNestedStates);

    onFilterChange?.({});
  };

  const toggleFilter = (filterId: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const activeFilters = config.filters.filter((f) => {
    const value = getCurrentValue(f.id);
    return Array.isArray(value) ? value.length > 0 : !!value;
  });

  return (
    <>
      {/* Mobile Filter Button - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[99]">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg px-6 py-6 rounded-full z-[99]! relative"
            >
              <Filter size={20} className="mr-2" />
              Filter
              {activeFilters.length > 0 && (
                <span className="ml-2 bg-white text-green-600 rounded-full size-6 flex items-center justify-center text-sm font-semibold">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <SheetHeader className="bg-green-600 text-white p-4 sticky top-0 z-10">
              <SheetTitle className="text-white text-xl flex items-center justify-between">
                <span>Filter By</span>
                {activeFilters.length > 0 && (
                  <span className="bg-white text-green-600 rounded-full size-6 flex items-center justify-center text-sm font-semibold">
                    {activeFilters.length}
                  </span>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full">
              <FilterContent
                config={config}
                styles={styles}
                selectedFilters={selectedFilters}
                expandedFilters={expandedFilters}
                nestedFilterStates={nestedFilterStates}
                isPending={isPending}
                onToggleFilter={toggleFilter}
                onCheckbox={handleCheckbox}
                onRadio={handleRadio}
                onNestedSelect={handleNestedSelect}
                onNestedBack={handleNestedBack}
                onClearAll={clearAll}
                getCurrentValue={getCurrentValue}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:block w-72 bg-white shadow rounded lg:sticky lg:top-4",
          styles.container,
        )}
      >
        <div
          className={
            styles.header ||
            "bg-green-600 text-white p-4 rounded-t font-semibold flex justify-between items-center"
          }
        >
          <span className={cn(styles.headerText, "text-xl")}>Filter By</span>
          {activeFilters.length > 0 && (
            <span className="bg-white text-green-600 rounded-full size-6 flex items-center justify-center text-sm font-semibold">
              {activeFilters.length}
            </span>
          )}
        </div>

        <FilterContent
          config={config}
          styles={styles}
          selectedFilters={selectedFilters}
          expandedFilters={expandedFilters}
          nestedFilterStates={nestedFilterStates}
          isPending={isPending}
          onToggleFilter={toggleFilter}
          onCheckbox={handleCheckbox}
          onRadio={handleRadio}
          onNestedSelect={handleNestedSelect}
          onNestedBack={handleNestedBack}
          onClearAll={clearAll}
          getCurrentValue={getCurrentValue}
        />
      </div>
    </>
  );
}
