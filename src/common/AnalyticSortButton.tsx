import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SortButtonProps {
  options: { value: string; label: string }[];
  value: string; // 👈 make it controlled
  defaultOption?: string;
  onSelect: (value: string) => void;
}

const AnalyticSortButton = ({ options, value, defaultOption, onSelect }: SortButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onSelect(val);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ||
    options.find((opt) => opt.value === defaultOption)?.label ||
    "Select";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="h-40px w-full flex items-center justify-between gap-2 border-1 !border-[#585DF9] text-[#585DF9] !rounded-md px-3 py-2 !bg-white text-sm font-semibold hover:bg-[#f6f4ff] transition"
      >
        {selectedLabel}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 rounded-md border-1 border-gray-200 bg-white shadow-lg z-10">
          <ul className="text-sm text-[#3F4354] p-0">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold ${
                  option.value === value ? "font-bold text-[#585DF9]" : ""
                }`}
                onClick={() => handleSelect(option.value)}
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

export default AnalyticSortButton;
