const InsigthsShimmer = () => {
  return (
    <div className="p-2">
      <div className="flex items-center gap-4 justify-end mt-2 mb-4 animate-pulse">
        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
      </div>

      <div className="grid grid-cols-3 gap-3 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-md"></div>
        <div className="h-20 bg-gray-300 rounded-md"></div>
        <div className="h-20 bg-gray-200 rounded-md"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3 animate-pulse">
        <p className="bg-gray-200 h-64 w-full rounded-md"></p>
        <p className="bg-gray-300 h-64 w-full rounded-md"></p>
      </div>
    </div>
  );
};

export default InsigthsShimmer;
