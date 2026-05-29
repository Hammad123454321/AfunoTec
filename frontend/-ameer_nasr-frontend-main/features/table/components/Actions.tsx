"use client";

import React, { useState } from "react";
import {
  LucideTrash2,
  LucideEdit,
  LucideEye,
  LucideFileText,
  LucideBan,
  LucideCheckCircle,
  LucideMoreVertical,
  LucideLoader,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ============= TYPES =============

export type ActionVariant = "default" | "danger" | "success" | "warning";

export interface Action<TItem> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: ActionVariant;
  onClick: (item: TItem) => void | Promise<void>;
  show?: (item: TItem) => boolean;
  disabled?: (item: TItem) => boolean;
}

interface ActionsProps<TItem> {
  item?: TItem;
  actions?: ReadonlyArray<Action<TItem>>;
}

// ============= COMPONENT =============

export default function Actions<TItem>({
  item = {} as TItem,
  actions = [],
}: ActionsProps<TItem>) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Default demo actions if none provided
  const defaultActions: Action<TItem>[] = [
    {
      label: "View",
      icon: LucideEye,
      onClick: async (item) => {
        console.log("Viewing:", item);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    },
    {
      label: "Edit",
      icon: LucideEdit,
      onClick: async (item) => {
        console.log("Editing:", item);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    },
    {
      label: "Delete",
      icon: LucideTrash2,
      variant: "danger",
      onClick: async (item) => {
        console.log("Deleting:", item);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    },
    {
      label: "Block",
      icon: LucideTrash2,
      variant: "danger",
      onClick: async (item) => {
        console.log("Deleting:", item);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    },
    {
      label: "Unblock",
      icon: LucideTrash2,
      variant: "danger",
      onClick: async (item) => {
        console.log("Deleting:", item);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    },
  ];

  const actionsList = actions.length > 0 ? actions : defaultActions;

  const visibleActions = actionsList.filter((action) =>
    action.show ? action.show(item) : true
  );

  if (visibleActions.length === 0) return null;

  const handleAction = async (action: Action<TItem>) => {
    setLoadingAction(action.label);
    try {
      await action.onClick(item);
    } catch (error) {
      console.error("Action error:", error);
    } finally {
      setLoadingAction(null);
      setIsOpen(false);
    }
  };

  const getVariantClass = (variant?: ActionVariant): string => {
    switch (variant) {
      case "danger":
        return "text-red-600 focus:bg-red-50 focus:text-red-600";
      case "success":
        return "text-green-600 focus:bg-green-50 focus:text-green-600";
      case "warning":
        return "text-amber-600 focus:bg-amber-50 focus:text-amber-600";
      default:
        return "";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <LucideMoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="border border-gray-50">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          const isLoading = loadingAction === action.label;
          const isDisabled = isLoading || (action.disabled?.(item) ?? false);

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => handleAction(action)}
              disabled={isDisabled}
              className={`gap-2 ${getVariantClass(action.variant)}`}
            >
              {isLoading ? (
                <LucideLoader className="h-4 w-4 animate-spin" />
              ) : Icon ? (
                <Icon className="h-4 w-4" />
              ) : null}
              <span>{action.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============= ACTION BUILDERS =============

export const createAction = {
  edit: <TItem,>(
    onClick: (item: TItem) => void | Promise<void>,
    options?: Partial<Omit<Action<TItem>, "onClick" | "label">>
  ): Action<TItem> => ({
    label: "Edit",
    icon: LucideEdit,
    onClick,
    ...options,
  }),

  delete: <TItem,>(
    onClick: (item: TItem) => void | Promise<void>,
    options?: Partial<Omit<Action<TItem>, "onClick" | "label">>
  ): Action<TItem> => ({
    label: "Delete",
    icon: LucideTrash2,
    variant: "danger",
    onClick,
    ...options,
  }),

  view: <TItem,>(
    onClick: (item: TItem) => void | Promise<void>,
    options?: Partial<Omit<Action<TItem>, "onClick" | "label">>
  ): Action<TItem> => ({
    label: "View",
    icon: LucideEye,
    onClick,
    ...options,
  }),

  draft: <TItem,>(
    onClick: (item: TItem) => void | Promise<void>,
    options?: Partial<Omit<Action<TItem>, "onClick" | "label">>
  ): Action<TItem> => ({
    label: "Draft",
    icon: LucideFileText,
    variant: "warning",
    onClick,
    ...options,
  }),

  block: <TItem,>(
    onClick: (item: TItem) => void | Promise<void>,
    options?: Partial<Omit<Action<TItem>, "onClick" | "label">>
  ): Action<TItem> => ({
    label: "Block",
    icon: LucideBan,
    variant: "danger",
    onClick,
    ...options,
  }),

  unblock: <TItem,>(
    onClick: (item: TItem) => void | Promise<void>,
    options?: Partial<Omit<Action<TItem>, "onClick" | "label">>
  ): Action<TItem> => ({
    label: "Unblock",
    icon: LucideCheckCircle,
    variant: "success",
    onClick,
    ...options,
  }),

  custom: <TItem,>(
    label: string,
    onClick: (item: TItem) => void | Promise<void>,
    options?: Partial<Omit<Action<TItem>, "onClick" | "label">>
  ): Action<TItem> => ({
    label,
    onClick,
    ...options,
  }),
};
