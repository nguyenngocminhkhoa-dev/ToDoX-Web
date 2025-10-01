import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterType } from "@/lib/data";
import { Filter } from "lucide-react";
import React from "react";

type StatsAndFiltersProps = {
  completedTasksCount?: number;
  activeTasksCount?: number;
  filter?: string;
};

const StatsAndFilters = ({
  completedTasksCount = 0,
  activeTasksCount = 0,
  filter = "all",
  setFilter,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* phần thống kê */}
      <div className="flex gap-3">
        <Badge
          className="bg-white/50 text-accent-foreground border-gray-200"
          variant="secondary"
        >
          {activeTasksCount} {FilterType.active}
        </Badge>
        <Badge
          className="bg-white/50 text-accent-foreground border-gray-200"
          variant="secondary"
        >
          {completedTasksCount} {FilterType.completed}
        </Badge>
      </div>

      {/* phần filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {Object.keys(FilterType).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "ghost"}
            size="sm"
            className="capitalize flex items-center gap-1"
            onClick={() => {
              setFilter(type);
            }}
          >
            <Filter className="size-4" />
            {FilterType[type]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StatsAndFilters;
