import React from "react";
interface countGet {
  count?: number;
}

const AllAwardShimmer: React.FC<countGet> = ({ count }) => {
  return (
    <div className="animate-pulse">
      {count === 4 ? (
        ""
      ) : (
        <div className="flex items-center justify-between w-full ">
          <p className="h-10 w-28 bg-gray-200 rounded-full"></p>
          <div className="flex items-center gap-4">
            <p className="h-10 w-40 bg-gray-200 rounded-full"></p>
            <p className="h-10 w-28 bg-gray-200 rounded-full"></p>
            <p className="h-10 w-28 bg-gray-200 rounded-full"></p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6 mt-4">
        {Array.from({ length: count ?? 4 })?.map((_, item) => (
          <div
            className="bg-white rounded-md text-right"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            key={item}
          >
            <p
              className={`${
                item % 2 ? "bg-gray-200" : "bg-gray-100"
              }  h-5 w-20 rounded-full m-2 inline-block`}
            ></p>
            <div className="flex items-center gap-2 border-t border-gray-200 p-3">
              <p
                className={`${
                  item % 2 ? "bg-gray-100" : "bg-gray-200"
                } h-14 w-14 rounded-xl`}
              ></p>
              <div className="flex gap-2 flex-col w-full">
                <p
                  className={`${
                    item % 2 ? "bg-gray-200" : "bg-gray-100"
                  } h-6 w-20 rounded-full`}
                ></p>
                <p
                  className={`${
                    item % 2 ? "bg-gray-200" : "bg-gray-100"
                  } h-7 w-full rounded-full`}
                ></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAwardShimmer;
