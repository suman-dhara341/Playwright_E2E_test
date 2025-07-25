const ErrorFallback = ({ height = "calc(100vh - 90px)" }) => {
  return (
    <div
      className="flex flex-col items-center justify-center bg-white p-6 text-center rounded-lg"
      style={{ height, boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <svg
        className="w-20 h-20 text-red-500 mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
        />
      </svg>
      <p className="text-3xl font-semibold !text-[#3F4354] mb-2">
        Oops! Something went wrong.
      </p>
      <p className="text-sm !text-[#3F4354] mb-6">
        We’re having some trouble loading this section. Please try refreshing
        the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center mt-3"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default ErrorFallback;
