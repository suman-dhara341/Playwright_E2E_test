import { useGetEmployeeConversationDetailsQuery } from "../../growth/queries/growthQuery";
import { useSelector } from "react-redux";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { MessageCircle, MessageSquareQuote, Pencil } from "lucide-react";
import { useState } from "react";
import CreateDiscusstion from "./GrowthDicusstionCreate";
import UpdateDiscusstion from "./GrowthDiscusstionUpdate";
import UpdateConversations from "./GrowthConversationUpdate";
import { useGetProfileQuery } from "../../profile/queries/profileQuery";
import Drawer from "../../../common/Drawer";
import GrowthConversationCommentMangerHub from "./GrowthConversationCommentManagerHub";

const GrowthConversationDetails = ({ conversationId, employeeId }: any) => {
  const EMP_ID = employeeId;
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [discussionId, setDiscussionId] = useState("");
  const [discussionData, setDiscussionData] = useState("");
  const [editDicusstionOpen, setEditDicusstionOpen] = useState(false);
  const editDicusstionHandleOpen = () => setEditDicusstionOpen(true);
  const editDicusstionHandleClose = () => setEditDicusstionOpen(false);

  const [dicusstionOpen, setDicusstionOpen] = useState(false);
  const dicusstionHandleOpen = () => setDicusstionOpen(true);
  const dicusstionHandleClose = () => setDicusstionOpen(false);

  const [editOpen, setEditOpen] = useState(false);
  const editHandleClose = () => setEditOpen(false);

  const {
    data: employeeGrowthConversitionDetailsData,
    isError: employeeGrowthConversitionDetailsIsError,
    isLoading: employeeGrowthConversitionDetailsIsLoading,
    refetch: employeeGrowthConversitionDetailsRefetch,
  } = useGetEmployeeConversationDetailsQuery({
    ORG_ID,
    EMP_ID,
    conversationId,
  });
  const discussions =
    employeeGrowthConversitionDetailsData?.data?.discussions ?? [];

  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useGetProfileQuery({ ORG_ID, EMP_ID });

  const useTimeAgo = (date: string) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(date))
      : "-";

  if (employeeGrowthConversitionDetailsIsLoading || profileIsLoading) {
    return (
      <div className="flex justify-center items-center mt-3 min-h-[50vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (employeeGrowthConversitionDetailsIsError || profileError) {
    return (
      <div className="flex justify-center items-center mt-3 min-h-[50vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full flex items-center justify-between mb-3">
        <p className="text-base font-semibold text-[#3F4354]">
          Your Discussion
        </p>
        <button
          className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex items-center"
          onClick={dicusstionHandleOpen}
        >
          Create Discussion
        </button>
      </div>

      <div className="overflow-y-auto w-full h-[50vh] pr-2">
        {discussions?.length > 0 ? (
          <div>
            {discussions.map((discussion: any) => (
              <div className="mb-3">
                <p className="text-[#878791] font-semibold text-xs mb-1">
                  {useTimeAgo(discussion.createdAt)}
                </p>
                <div
                  key={discussion.discussionId}
                  className="flex justify-between items-center gap-3 border border-[#E8E8EC] rounded-xl p-3 hover:bg-gray-50"
                >
                  <div className="w-[3%]">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <div className="w-[85%]">
                    <p className="text-[#3F4354]">{discussion.overview}</p>
                  </div>
                  <div className="flex justify-center items-start gap-3 w-[12%]">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setDiscussionId(discussion.discussionId);
                        setDiscussionData(discussion);
                        editDicusstionHandleOpen();
                      }}
                    >
                      <Pencil className="w-5 h-5" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setDiscussionId(discussion.discussionId);
                        setIsOpen(true);
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-[#73737D]">
            You don't have any discussions against your conversation.
          </div>
        )}

        {/* Modals */}
        <CreateDiscusstion
          employeeId={employeeId}
          conversationId={conversationId}
          handleClose={dicusstionHandleClose}
          open={dicusstionOpen}
        />
        <UpdateDiscusstion
          employeeId={employeeId}
          conversationId={conversationId}
          handleClose={editDicusstionHandleClose}
          open={editDicusstionOpen}
          discussionId={discussionId}
          discussionData={discussionData}
        />
        <UpdateConversations
          employeeId={employeeId}
          MANAGER_ID={profile?.data?.reportsTo}
          open={editOpen}
          handleClose={editHandleClose}
          editConversation={employeeGrowthConversitionDetailsData?.data}
          employeeConversationRefetch={employeeGrowthConversitionDetailsRefetch}
        />

        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} heading="Comments">
          <GrowthConversationCommentMangerHub
            conversationEmployeeId={employeeGrowthConversitionDetailsData?.data?.employeeId}
            conversationId={conversationId}
            discussionId={discussionId}
          />
        </Drawer>
      </div>
    </div>
  );
};

export default GrowthConversationDetails;
