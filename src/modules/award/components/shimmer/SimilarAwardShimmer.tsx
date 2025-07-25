import React from "react";

interface Props {
  length?: number;
  grid: number;
}

const SimilarAwardShimmer: React.FC<Props> = ({ length = 6, grid }) => {
  return (
    <div
      className="flex flex-col p-3 bg-white rounded-md gap-3 overflow-y-auto animate-pulse"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <p className="bg-gray-200 h-7 w-32 rounded-full"></p>

      <div className={`grid grid-cols-1 md:grid-cols-${grid} gap-6`}>
        {Array.from({ length }).map((_, index) => (
          <div key={index} className="flex justify-center">
            <div className="relative w-full h-32 bg-gray-200 border border-[#F4F6F8] shadow-lg clip-path-award"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarAwardShimmer;
