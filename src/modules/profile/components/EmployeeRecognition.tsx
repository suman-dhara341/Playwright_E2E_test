import { useCallback, useEffect, useState } from "react";
import SortButton from "../../../common/SortButton";
import RecognitionReciveBy from "./RecognitionReciveBy";
import RecognitionGivenBy from "./RecognitionGivenBy";
import { SendHorizontal } from "lucide-react";
import RecognitionDrawerComponent from "../../feeds/components/RecognitionDrawerComponent";

const EmployeeRecognition = () => {
  const [recognitionType, setRecognitionType] = useState<string>("received-by");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const handleReciveSelection = (option: string) => {
    setRecognitionType(option);
  };
  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (confettiVisible) {
      const timer = setTimeout(() => {
        setConfettiVisible(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [confettiVisible]);

  return (
    <div
      className="my-3 min-h-[calc(100vh-360px)] bg-white rounded-md border-1 border-[#E8E8EC]"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between border-b-1 px-3 py-2 border-[#E8E8EC]">
        <p className="!text-base !text-[#3F4354] font-semibold m-0">
          Recognitions
        </p>
        <div className="flex gap-2">
          <SortButton
            options={[
              { value: "received-by", label: "Received" },
              { value: "given-by", label: "Given" },
            ]}
            defaultOption="Type"
            onSelect={handleReciveSelection}
          />
          <button
            className="flex items-center gap-1 bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md"
            onClick={handleDrawerOpen}
          >
            <p>Give Recognition</p> <SendHorizontal className="w-4 h-4" />
          </button>
          {drawerOpen && (
            <RecognitionDrawerComponent
              handleDrawerClose={handleDrawerClose}
              setConfettiVisible={setConfettiVisible}
            />
          )}
        </div>
      </div>
      <div>
        {recognitionType === "received-by" ? (
          <RecognitionReciveBy recognitionType={recognitionType} />
        ) : (
          <RecognitionGivenBy recognitionType={recognitionType} />
        )}
      </div>
    </div>
  );
};

export default EmployeeRecognition;
