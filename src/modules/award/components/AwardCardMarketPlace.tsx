import { useNavigate } from "react-router-dom";
import { ClockAlert, Flame, Trophy } from "lucide-react";

const AwardCardMarketPlace = ({ award, type }: any) => {
  const navigate = useNavigate();
  const isFromLastMonth = (timestamp: number): boolean => {
    const createdDate = new Date(timestamp);
    const now = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setDate(now.getDate() - 14);
    return createdDate >= lastMonthDate && createdDate <= now;
  };
  const recent = isFromLastMonth(award.createdAt);
  const truncateText = (text: string, length: number): string => {
    if (text?.length <= length) {
      return text;
    }
    return `${text?.slice(0, length)}...`;
  };
  const handleAwardClick = (awardId: any) => {
    navigate(`/awards-vault/${awardId}`);
  };

  return (
    <div
      className="flex flex-col w-full bg-white gap-1 cursor-pointer !rounded-[8px]"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      onClick={() => handleAwardClick(`${award.awardId}`)}
    >
      <div className="w-full ">
        <div
          className={`flex flex-row ${
            !recent ? "justify-start" : "justify-between"
          } items-center border-b-1 border-b-[#E8E8EC] py-2 px-3`}
        >
          <div className="flex items-center gap-1">
            {recent ? (
              <div className="text-[#FE7304] text-[13px] flex flex-row items-end font-semibold gap-1">
                <Flame />
                <p>New</p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex gap-2 justify-end w-full">
            {award?.totalWinners ? (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-[#fec006]" />
                <span className="text-[#878791] text-xs flex flex-row gap-1">
                  {award?.totalWinners} Winners
                </span>
              </div>
            ) : null}
            {type === "My Awards" && award?.totalPendingRequest > 0 ? (
              <div className="flex items-center gap-1">
                <ClockAlert className="w-4 h-4 text-[#73737D]" />
                <span className="text-[#73737D] text-xs flex flex-row gap-1">
                  {award?.totalPendingRequest} Request
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="w-full flex flex-row items-start gap-3 p-3">
          <div className="w-[25%] flex justify-center">
            {award?.awardPhoto ? (
              <img
                src={award?.awardPhoto}
                alt={award?.awardId}
                className="w-full"
              />
            ) : (
              <Trophy className="w-10 h-10" />
            )}
          </div>
          <div className="w-[75%]">
            <p className="text-sm font-semibold text-[#3F4354]">
              {award?.awardName}
            </p>
            <p className="text-xs text-[#73737D] font-medium">
              {truncateText(award?.description, 40)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardCardMarketPlace;
