import { EllipsisVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SortButtonProps {
  options: { value: any; label: string }[];
  defaultOption?: string;
  onSelect: (value: string) => void;
}

const ActionButton = ({ options, defaultOption, onSelect }: SortButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the matching label for the default value
  const getDefaultValue = () => {
    const defaultItem = options.find((opt) => opt.value === defaultOption);
    return defaultItem ? defaultItem.value : options[0]?.value;
  };

  const [selectedValue, setSelectedValue] = useState<string>(getDefaultValue());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative text-center" ref={dropdownRef}>
      <div className="h-40px cursor-pointer text-center flex justify-center" onClick={toggleDropdown}>
        <EllipsisVertical className="w-5 h-5" />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border-1 border-gray-100 bg-white shadow-lg z-10">
          <ul className="text-sm text-start text-[#3F4354] p-0 mb-0">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold ${
                  option.value === selectedValue ? "font-bold text-[#585DF9]" : ""
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

export default ActionButton