import { useState } from "react";
import AwardComponent from "./../components/AwardComponent";
import BadgeComponent from "./../components/BadgeComponent";
import RecognitionComponent from "./../components/RecognitionComponent";

export const Analytics = () => {
  const [selectedSort, setSelectedSort] = useState<string>("award");

  const handleSortSelection = (option: string) => {
    setSelectedSort(option);
  };

  const renderComponent = () => {
    switch (selectedSort) {
      case "award":
        return (
          <AwardComponent selectedSort={selectedSort} handleSortSelection={handleSortSelection} />
        );
      case "badge":
        return (
          <BadgeComponent selectedSort={selectedSort} handleSortSelection={handleSortSelection} />
        );
      case "recognition":
        return (
          <RecognitionComponent selectedSort={selectedSort} handleSortSelection={handleSortSelection} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-3 w-full h-[calc(100vh-145px)]">
      <div
        className="w-full flex items-start justify-start bg-white rounded-md p-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        {renderComponent()}
      </div>
    </div>
  );
};
