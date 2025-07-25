import { Avatar } from "@mui/material";
const AllFeedShimmer = () => {
  return (
    <div className="bg- border shadow-md rounded-xl animate-pulse  px-3 py-3 mb-2">
      <div className="flex gap-3">
        <Avatar sx={{ width: 50, height: 50 }} />
        <div className="w-full flex flex-col gap-2">
          <p className="h-8 bg-gray-300 w-full rounded-md"></p>
          <p className="h-4 bg-gray-200 w-12 rounded-md"></p>
        </div>
      </div>
      <p className="h-28 mt-3 bg-gray-300 w-full rounded-md"></p>
      <p className="h-44 my-3 bg-gray-300 w-full rounded-md"></p>
      <div className="border-top">
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-gray-200 "></p>
            <p className="h-5 bg-gray-300 w-10 rounded-md"></p>
          </div>
          <div className="flex items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-gray-200"></p>
            <p className="h-5 bg-gray-300 w-16 rounded-md"></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar />
          <p className="h-12 my-3 bg-gray-200 w-full rounded-full"></p>
        </div>
      </div>
    </div>
  );
};

export default AllFeedShimmer;
