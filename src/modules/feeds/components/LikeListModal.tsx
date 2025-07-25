import EmployeeName from "../../../common/EmployeeName";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { useTimeAgo } from "../../../utilities/hooks/useTimeAgo";
import { X } from "lucide-react";
import Avatar from "../../../common/Avatar";
import { Modal } from "@mui/material";

const LikeListModal = ({
  feedData,
  feedLikes,
  isLoading,
  feedLikeListError,
  onClose,
}: any) => {
  return (
    <Modal
      open
      className="flex items-center justify-center border-0"
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      onClose={onClose}
    >
      <div
        className="bg-white rounded-md shadow-lg w-[40%] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <div className="flex w-full justify-between border-b-1 border-[#E8E8EC]">
            <div className="w-full flex p-3 items-center justify-center">
              <EmployeeName
                firstName={feedData?.feedReceivedBy?.firstName}
                middleName={feedData?.feedReceivedBy?.middleName}
                lastName={feedData?.feedReceivedBy?.lastName}
                empId={feedData?.feedReceivedBy?.employeeId}
                textColor={"!text-[#585DF9]"}
                fontWeight={"font-semibold"}
                textVarient={"!text-xl"}
              />
              <p className="text-xl leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
                's Feed
              </p>
            </div>
            <div
              id="like_list_modal_close"
              onClick={onClose}
              className="flex items-center px-3 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="h-[60vh] flex justify-center items-center overflow-y-auto mb-3">
            <ThreeDotsLoading color="#585DF9" />
          </div>
        )}

        {feedLikeListError && (
          <div className="h-[60vh] overflow-y-auto mb-3">
            <p>There is something wrong</p>
          </div>
        )}
        {feedLikes?.length && (
          <div className="h-[60vh] overflow-y-auto mb-3">
            <ul className="p-3">
              {feedLikes?.map((likedata: any) => (
                <li
                  key={likedata?.employee?.employeeId}
                  className="flex items-center gap-3 py-1 "
                >
                  <div>
                    <Avatar
                      image={likedata.employee.photo}
                      size={45}
                      name={likedata.employee.firstName}
                    />
                  </div>
                  <div className="">
                    <div className="rounded-md mb-0">
                      <EmployeeName
                        firstName={likedata.employee.firstName}
                        middleName={likedata.employee.middleName}
                        lastName={likedata.employee.lastName}
                        empId={likedata.employee.employeeId}
                        textColor={"!text-[#585DF9]"}
                        fontWeight={"font-semibold"}
                        textVarient={"!text-base"}
                      />
                    </div>

                    <p className="text-[#878791] font-normal text-sm">
                      {useTimeAgo(likedata.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LikeListModal;
