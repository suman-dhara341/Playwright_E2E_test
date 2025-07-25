export const IndexPageShimmer = () => {
  return (
    <div className="bg-gray-100 h-20 flex gap-2 p-2 animate-pulse">
      <p className="bg-gray-200 h-4 w-4 rounded-full"></p>
      <div className="w-full flex flex-col gap-2">
        <p className="h-6 bg-gray-300 w-full rounded-md"></p>
        <p className="h-4 bg-gray-200 w-12 rounded-md"></p>
      </div>
    </div>
  );
};
