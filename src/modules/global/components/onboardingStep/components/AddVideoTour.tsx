import PRODUCT_VIDEO from "/videos/Wazo_product_video.mp4";

const AddVideoTour = ({ nextStep }: any) => {
  const handleSkipClick = () => {
    nextStep();
  };

  return (
    <div className="">
      <p className="mb-3 font-semibold text-xl text-[#585DF9]">Video Tour</p>

      <div className="w-full bg-gray-200 flex items-center justify-center rounded overflow-hidden">
        <video
          autoPlay
          // muted
          playsInline
          controls
          className="w-full h-full object-cover rounded"
        >
          <source src={PRODUCT_VIDEO} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-6 flex justify-between items-center gap-3">
        <div className="flex gap-3 justify-end w-full">
          <button
            type="button"
            onClick={handleSkipClick}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            Skip
          </button>
          <button
            onClick={nextStep}
            className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoTour;
