import * as React from "react";

const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border-1 border-gray-300 !bg-white px-3 py-2 text-base 
          placeholder:text-[#73737D] focus-visible:outline-none
          ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
