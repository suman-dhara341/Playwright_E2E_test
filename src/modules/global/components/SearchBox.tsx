import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trophy,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useGetSearchEmployeesQuery } from "../queries/globalQuery";
import Avatar from "../../../common/Avatar";

const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("employee");
  const [searchCategoryShowDropdown, setSearchCategoryShowDropdown] =
    useState(false);
  const [showSearchResultDropdown, setShowSearchResultDropdown] =
    useState(false);
  const [selectedSearchResultIndex, setSelectedSearchResultIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const updateDebouncedTerm = debounce(
    (term: string) => setDebouncedTerm(term),
    500
  );

  useEffect(() => {
    updateDebouncedTerm(searchTerm);
    return () => {
      updateDebouncedTerm.cancel();
    };
  }, [searchTerm]);

  const {
    data: responseData,
    isLoading,
    error,
    isFetching,
  } = useGetSearchEmployeesQuery(
    { ORG_ID, keyword: debouncedTerm, category: searchCategory },
    { skip: !debouncedTerm }
  );

  const searchData = isLoading ? [] : responseData?.data || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSearchResultDropdown(true);
    setSelectedSearchResultIndex(0);
    setSearchCategoryShowDropdown(false);
  };

  const handleCategoryChange = (category: string) => {
    setSearchCategory(category);
    setSearchTerm("");
    setSelectedSearchResultIndex(0);
    setShowSearchResultDropdown(false);
    setSearchCategoryShowDropdown(false);
  };

  const handleSelectItem = useCallback(
    (item: any) => {
      let route = "";

      if (searchCategory === "employee") {
        route = `/profile/${item.employeeId}`;
      } else if (searchCategory === "award") {
        route = `/awards/${item.awardId}`;
      }

      navigate(route);
      setShowSearchResultDropdown(false);
    },
    [searchCategory, navigate]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchData.length) return;

    if (e.key === "ArrowDown") {
      setSelectedSearchResultIndex((prev) => (prev + 1) % searchData.length);
    } else if (e.key === "ArrowUp") {
      setSelectedSearchResultIndex(
        (prev) => (prev - 1 + searchData.length) % searchData.length
      );
    } else if (e.key === "Enter") {
      handleSelectItem(searchData[selectedSearchResultIndex]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSearchResultDropdown(false);
        setSearchCategoryShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      {/* Search Input */}
      <div className="flex items-center bg-white border-1 border-[#E8E8EC] rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <Search className="text-[#73737D] mr-2" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full ml-2 outline-none text-[#3F4354] focus:outline-none focus:ring-0 focus-visible:outline-none"
        />

        <div className="relative ml-4">
          <button
            onClick={() => setSearchCategoryShowDropdown((prev) => !prev)}
            className="flex items-center text-[#73737D] hover:text-[#585DF9] transition-colors"
          >
            {searchCategory === "employee" && (
              <Users className="w-4 h-4 mr-1" />
            )}
            {searchCategory === "award" && <Award className="w-4 h-4 mr-1" />}
            <span className="font-semibold">
              {searchCategory.charAt(0).toUpperCase() + searchCategory.slice(1)}
            </span>
            {showSearchResultDropdown ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>

          {searchCategoryShowDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border-1rounded-md shadow-lg z-[11] overflow-hidden">
              <button
                onClick={() => handleCategoryChange("employee")}
                className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full ${
                  searchCategory === "employee" ? "bg-blue-50" : ""
                }`}
              >
                <Users className="w-4 h-4 mr-2" />{" "}
                <span className="font-semibold">Employee</span>
              </button>
              <button
                onClick={() => handleCategoryChange("award")}
                className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full ${
                  searchCategory === "award" ? "bg-blue-50" : ""
                }`}
              >
                <Award className="w-4 h-4 mr-2" />{" "}
                <span className="font-semibold">Award</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Search Results */}
      {showSearchResultDropdown && debouncedTerm && (
        <div className="absolute w-full bg-white border-1 border-[#E8E8EC] rounded-md shadow-md z-10 mt-2 max-h-60 overflow-y-auto">
          {isLoading || isFetching ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#585DF9]" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">Error fetching data</div>
          ) : searchData.length > 0 ? (
            searchData.map((data: any, index: number) => (
              <div
                key={index}
                onClick={() => handleSelectItem(data)}
                className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 ${
                  index === selectedSearchResultIndex ? "bg-gray-100" : ""
                }`}
              >
                {searchCategory === "employee" && (
                  <>
                    <Avatar
                      image={data?.employeeAvatar}
                      name={data.employeeName}
                      size={40}
                    />
                    <div>
                      <p className="font-bold leading-none">
                        {data.employeeName}
                      </p>
                      <p className="text-sm text-[#73737D]">
                        {data.employeeEmail}
                      </p>
                    </div>
                  </>
                )}
                {searchCategory === "award" && (
                  <>
                    {data?.awardPhoto ? (
                      <img
                        src={data?.awardPhoto}
                        alt={data?.awardId}
                        className="w-10 h-10"
                      />
                    ) : (
                      <Trophy className="w-6 h-6" />
                    )}
                    <p className="font-bold">{data.awardName}</p>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-[#73737D]">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
