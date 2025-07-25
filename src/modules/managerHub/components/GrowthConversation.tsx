import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import {
  useDeleteEmployeeConversationMutation,
  useGetEmployeeConversationQuery,
} from "../../growth/queries/growthQuery";
import CreateConversations from "./GrowthConversationCreate";
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "../../profile/queries/profileQuery";
import UpdateConversations from "./GrowthConversationUpdate";
import { showToast } from "../../../utilities/toast";
import EmployeeGrowthConversationDetails from "./GrowthConversationDetails";
import ActionButton from "../../../common/ActionButton";
import { Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";

const GrowthConversation = ({ employeeId }: any) => {
  const EMP_ID = employeeId
    ? employeeId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Agenda" | "Discussion">("Agenda");
  const [editConversation, setEditConversation] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const createHandleClose = () => setCreateOpen(false);
  const [editOpen, setEditOpen] = useState(false);
  const editHandleOpen = () => setEditOpen(true);
  const editHandleClose = () => setEditOpen(false);

  const {
    data: employeeConversationData,
    isError: employeeConversationIsError,
    isLoading: employeeConversationIsLoading,
    refetch: employeeConversationRefetch,
  } = useGetEmployeeConversationQuery({ EMP_ID, ORG_ID });

  const [triggerDeleteConversition] = useDeleteEmployeeConversationMutation();

  const { data: profile } = useGetProfileQuery({ ORG_ID, EMP_ID });

  const handleDelete = async ({ conversationId, event }: any) => {
    event.stopPropagation();
    try {
      await triggerDeleteConversition({
        ORG_ID,
        EMP_ID,
        conversationId,
      }).unwrap();
      showToast("successfully conversation deleted ", "success");
      employeeConversationRefetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete conversation", "error");
    }
  };

  const handleReciveSelection = (option: string, growth: any) => {
    if (option === "Edit Conversation") {
      setEditConversation(growth);
      editHandleOpen();
    } else if (option === "Delete Conversation") {
      handleDelete({
        conversationId: growth?.conversationId,
        event: new Event("click"),
      });
    } else {
      console.log("WAZO");
    }
  };

  const conversations = employeeConversationData?.data || [];
  const groupedConversations = conversations.reduce(
    (acc: any, conversation: any) => {
      const growthAreas = conversation.conversationInfo?.growthAreas || [
        "Others",
      ];
      growthAreas.forEach((area: string) => {
        if (!acc[area]) acc[area] = [];
        acc[area].push(conversation);
      });
      return acc;
    },
    {}
  );

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);
  if (employeeConversationIsLoading) {
    return (
      <div
        className="h-[calc(100vh-215px)] flex bg-white rounded-md mt-3 animate-pulse"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="w-[30%] border-r border-[#E8E8EC] overflow-y-auto">
          <div className="p-3 border-b border-[#E8E8EC]">
            <div className="h-5 w-32 bg-gray-200 rounded" />
          </div>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="px-3 py-2">
              <div className="h-4 w-24 bg-gray-200 mb-2 rounded" />
              <ul className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-6 w-full bg-gray-200 rounded-md"
                  ></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="w-[70%] overflow-y-auto">
          <div className="flex gap-3 mb-3 border-b border-[#E8E8EC] p-2">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-28 bg-gray-200 rounded"></div>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 p-2">
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-8 w-40 bg-gray-200 rounded"></div>
          </div>

          <div className="space-y-3 p-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-4 w-full bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (employeeConversationIsError) {
    return (
      <div
        className="flex justify-center items-center mt-3 h-[calc(100vh-215px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between"></div>
      <div
        className="h-[calc(100vh-215px)] flex bg-white rounded-md mt-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        {conversations.length > 0 ? (
          <>
            <div
              id="growthAreas"
              className="w-[30%] overflow-y-auto border-r border-[#E8E8EC]"
            >
              <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
                <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
                  Growth Areas
                </p>
              </div>
              {Object.entries(groupedConversations).map(
                ([area, convList]: any) => (
                  <div key={area} className="pt-2 px-3">
                    <p className="font-semibold text-[#3F4354] text-base mb-1">
                      {area}
                    </p>
                    <ul className="space-y-2 p-0 m-0">
                      {convList.map((conv: any) => (
                        <li
                          key={conv.conversationId}
                          onClick={() => setSelectedConversation(conv)}
                          className={`cursor-pointer p-2 rounded-md hover:bg-[#585DF9] hover:text-white ${
                            selectedConversation?.conversationId ===
                            conv.conversationId
                              ? "bg-[#585DF9] font-semibold text-white"
                              : ""
                          }`}
                        >
                          {conv.conversationTitle}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            <div className="w-[70%] overflow-y-auto">
              {selectedConversation ? (
                <>
                  <div className="flex gap-3 mb-3 border-b-1 border-[#E8E8EC] bg-white">
                    <p
                      onClick={() => setActiveTab("Agenda")}
                      id="agenda"
                      className={`p-3 text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354] cursor-pointer ${
                        activeTab === "Agenda"
                          ? "bg-[#585DF9] text-[white]"
                          : "text-[#3F4354]"
                      }`}
                    >
                      Agenda
                    </p>
                    <p
                      onClick={() => setActiveTab("Discussion")}
                      id="discussion"
                      className={`p-3 text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354] cursor-pointer ${
                        activeTab === "Discussion"
                          ? "bg-[#585DF9] text-[white]"
                          : "text-[#3F4354]"
                      }`}
                    >
                      Discussion
                    </p>
                    <div className="w-full flex gap-2 justify-end items-center px-2">
                      <button
                        id="createConversation"
                        className="h-[35px] px-2 bg-gradient-to-b from-[#7E92F8] to-[#6972F0] !rounded-md"
                        onClick={() => setCreateOpen(true)}
                      >
                        <p className="text-sm text-white ">
                          Create Conversation
                        </p>
                      </button>

                      <Tooltip title={"Learn more about Growth"} arrow>
                        <NavLink
                          to={"https://www.wazopulse.com/growth"}
                          target="_blank"
                        >
                          <p className="text-[#585DF9] text-xs mt-2">Info</p>
                        </NavLink>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2 px-3">
                    <p className="text-2xl font-semibold text-[#3F4354]">
                      {selectedConversation.conversationTitle}
                    </p>
                    <ActionButton
                      options={[
                        {
                          value: "Edit Conversation",
                          label: "Edit Conversation",
                        },
                        {
                          value: "Delete Conversation",
                          label: "Delete Conversation",
                        },
                      ]}
                      defaultOption="Type"
                      onSelect={(option) =>
                        handleReciveSelection(option, selectedConversation)
                      }
                    />
                  </div>
                  {activeTab === "Agenda" && (
                    <div className="px-3">
                      <p className="mb-2 font-semibold text-[#3F4354]">
                        Description:
                      </p>
                      <div
                        className="text-sm mt-2 award_criteria"
                        dangerouslySetInnerHTML={{
                          __html:
                            selectedConversation.conversationInfo
                              ?.description || "",
                        }}
                      />
                    </div>
                  )}

                  {activeTab === "Discussion" && (
                    <div className="px-3">
                      <EmployeeGrowthConversationDetails
                        employeeId={employeeId}
                        conversationId={selectedConversation?.conversationId}
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[#73737D]">
                  Select a conversation to view details.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
            <p className="text-[#73737D] font-semibold mb-3">
              You don't have any conversation
            </p>
            <div className="w-full flex gap-3 justify-center items-center px-2">
              <button
                className="h-[35px] px-2 bg-gradient-to-b from-[#7E92F8] to-[#6972F0] !rounded-md"
                onClick={() => setCreateOpen(true)}
              >
                <p className="text-sm text-white ">Create Conversation</p>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <CreateConversations
        employeeId={employeeId}
        MANAGER_ID={profile?.data?.reportsTo}
        open={createOpen}
        handleClose={createHandleClose}
        employeeConversationRefetch={employeeConversationRefetch}
      />
      <UpdateConversations
        employeeId={employeeId}
        MANAGER_ID={profile?.data?.reportsTo}
        open={editOpen}
        handleClose={editHandleClose}
        editConversation={editConversation}
        employeeConversationRefetch={employeeConversationRefetch}
      />
    </div>
  );
};

export default GrowthConversation;
