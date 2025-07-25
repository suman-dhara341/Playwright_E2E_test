import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-90px)] flex flex-col items-center justify-center text-center px-6 py-10 bg-white rounded-2xl w-full" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}>
      <p className="text-8xl font-extrabold">
        404
      </p>
      <p className="text-2xl font-semibold text-[#3F4354] mb-3">
        Sorry, this URL does not exist or is no longer available.
      </p>
      <button
        onClick={() => (window.location.href = "/feed")}
        className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
      >
        Go to Feed
      </button>
    </div>
  );
};

export default NotFoundPage;
