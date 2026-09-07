"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export interface ScheduleDisplayEntry {
  day: string;
  time: string;
  className: string;
  href?: string;
  venueName: string;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ALL = "all";
const BRAND = "#5e703a";

interface FilterOption {
  label: string;
  value: string;
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((option) => option.value === value)?.label ?? label;

  return (
    <div ref={containerRef} className="relative">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND }}>
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{ backgroundColor: BRAND }}
        className="mt-1.5 flex min-w-[11rem] items-center justify-between gap-4 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <span>{selectedLabel}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-full min-w-[11rem] overflow-hidden rounded-lg bg-white py-1 shadow-xl"
        >
          {options.map((option) => (
            <li key={option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={{ color: BRAND }}
                className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#5e703a]/10 ${
                  option.value === value ? "bg-[#5e703a]/10" : ""
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TimetableFilterableList({ entries }: { entries: ScheduleDisplayEntry[] }) {
  const [location, setLocation] = useState(ALL);
  const [classType, setClassType] = useState(ALL);

  const locationOptions = useMemo<FilterOption[]>(
    () => [
      { label: "All locations", value: ALL },
      ...Array.from(new Set(entries.map((entry) => entry.venueName)))
        .sort()
        .map((name) => ({ label: name, value: name })),
    ],
    [entries]
  );
  const classTypeOptions = useMemo<FilterOption[]>(
    () => [
      { label: "All classes", value: ALL },
      ...Array.from(new Set(entries.map((entry) => entry.className)))
        .sort()
        .map((name) => ({ label: name, value: name })),
    ],
    [entries]
  );

  const filtered = entries.filter(
    (entry) =>
      (location === ALL || entry.venueName === location) &&
      (classType === ALL || entry.className === classType)
  );

  const days = DAY_ORDER.filter((day) => filtered.some((entry) => entry.day === day));

  return (
    <div>
      <div className="flex flex-wrap justify-end gap-4">
        <FilterDropdown label="Location" value={location} options={locationOptions} onChange={setLocation} />
        <FilterDropdown label="Class type" value={classType} options={classTypeOptions} onChange={setClassType} />
      </div>

      <div className="mt-8 space-y-8">
        {days.map((day) => (
          <div key={day}>
            <h2 className="text-lg font-semibold">{day}</h2>
            <ul className="mt-3 divide-y divide-black/5 border-y border-black/5">
              {filtered
                .filter((entry) => entry.day === day)
                .map((entry, index) => (
                  <li
                    key={index}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
                  >
                    {entry.href ? (
                      <Link href={entry.href} className="font-medium underline-offset-2 hover:underline">
                        {entry.className}
                      </Link>
                    ) : (
                      <span className="font-medium">{entry.className}</span>
                    )}
                    <span className="text-sm text-zinc-500">
                      {entry.time} · {entry.venueName}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {!days.length && (
          <p className="text-sm text-zinc-500">No classes match those filters.</p>
        )}
      </div>
    </div>
  );
}
