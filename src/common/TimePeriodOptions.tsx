import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const timePeriodOptions = [
  { value: "last3Months", label: "Last 3 Months" },
  { value: "last6Months", label: "Last 6 Months" },
  { value: "lastYear", label: "Last Year" },
];

interface TimePeriodDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const TimePeriodDropdown: React.FC<TimePeriodDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    timePeriodOptions.find((option) => option.value === value)?.label || "Select";

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-40px w-full flex items-center justify-between gap-2 border-1 !border-[#585DF9] text-[#585DF9] !rounded-md px-3 py-2 !bg-white text-sm font-semibold hover:bg-[#f6f4ff] transition"
      >
        {selectedLabel}
        <ChevronDown className="w-3 h-3"/>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 rounded-md border-1 border-gray-200 bg-white shadow-lg z-10">
          <ul className="text-sm text-[#3F4354] p-0">
          {timePeriodOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold ${
                option.value === value ? "font-bold text-[#585DF9]" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
};

export default TimePeriodDropdown;
