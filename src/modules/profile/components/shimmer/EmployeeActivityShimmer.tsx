import { Avatar } from "@mui/material";

type Props = {
  count?: number;
};

const EmployeeActivityShimmer: React.FC<Props> = ({ count = 6 }) => {
  return (
    <div
      className="bg-white rounded-md animate-pulse py-2"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="bg-gray-200 w-20 h-7 rounded-full m-2" />
      <div className="border-t border-gray-200 p-4">
        {Array.from({ length: count }).map((_, item) => (
          <div key={item} className="flex items-center gap-2 mb-3">
            <Avatar sx={{ height: 50, width: 50 }} />
            <div className="flex flex-col gap-2">
              <div
                className={`${
                  item % 2 ? "bg-gray-200 w-56" : "bg-gray-100 w-72"
                } h-6 rounded-full`}
              />
              <div
                className={`${
                  item % 2 ? "bg-gray-100 w-20" : "bg-gray-200 w-32"
                } h-4 rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeActivityShimmer;
