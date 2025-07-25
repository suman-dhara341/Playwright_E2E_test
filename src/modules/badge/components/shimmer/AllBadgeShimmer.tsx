import React from "react";

interface countGet {
  count?: number;
}

const AllBadgeShimmer: React.FC<countGet> = ({ count }) => {
  return (
    <div className="animate-pulse">
      {count === 6 ? (
        ""
      ) : (
        <div className="flex items-center justify-between">
          <p className="bg-gray-200 h-10 w-36 rounded-full"></p>
          <p className="bg-gray-200 h-10 w-80 rounded-full"></p>
        </div>
      )}

      <div className="grid grid-cols-6 gap-3 mt-4">
        {Array.from({ length: count ?? 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-md"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <div className="flex justify-end">
              <p
                className={`${
                  index % 2 ? "bg-gray-100" : "bg-gray-200"
                } h-6 w-10 rounded-tr-md`}
              ></p>
            </div>

            <div className="flex items-center flex-col gap-2 p-4">
              <p
                className={`${
                  index % 2 ? "bg-gray-200" : "bg-gray-100"
                } h-28 w-28 rounded-full`}
              ></p>
              <p
                className={`${
                  index % 2 ? "bg-gray-100" : "bg-gray-200"
                } h-7 w-full rounded-full`}
              ></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBadgeShimmer;
