import { useSelector } from "react-redux";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import {
  useDeleteEmployeeConversationMutation,
  useGetEmployeeConversationQuery,
} from "../queries/growthQuery";
import CreateConversations from "./CreateConversations";
import { useEffect, useRef, useState } from "react";
import { useGetProfileQuery } from "../../profile/queries/profileQuery";
import UpdateConversations from "./UpdateConversations";
import { showToast } from "../../../utilities/toast";
import EmployeeGrowthConversationDetails from "./EmployeeGrowthConversationDetails";
import ActionButton from "../../../common/ActionButton";
import { ChevronDown, ChevronRight } from "lucide-react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Growth = () => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<"Agenda" | "Discussion">("Agenda");
  const [editConversation, setEditConversation] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const createHandleClose = () => setCreateOpen(false);
  const [editOpen, setEditOpen] = useState(false);
  const editHandleOpen = () => setEditOpen(true);
  const editHandleClose = () => setEditOpen(false);
  const tourRef = useRef<any>(null);

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

  const toggleArea = (area: string) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  };

  useEffect(() => {
    if (localStorage.getItem("growthTour") === "true") return;

    const timeout = setInterval(() => {
      const growthEl = document.querySelector("#growth");

      if (growthEl) {
        clearInterval(timeout);
        const tour = driver({
          showProgress: true,
          steps: [
            {
              element: "#growth",
              popover: {
                title: "Create a Growth Conversation",
                description:
                  "You own your development by regularly engaging in structured conversations with your manager about your growth, challenges, and aspirations. Use this space to reflect, plan, and take the next step in your journey. Share updates, ask for feedback, and shape your future.",
                side: "bottom",
              },
            },
          ],
          onDestroyStarted: () => {
            localStorage.setItem("growthTour", "true");
            tour.destroy();
          },
        });
        tour.drive();
        tourRef.current = tour;
      }
    }, 500);

    return () => {
      clearInterval(timeout);
      if (tourRef.current) {
        tourRef.current.destroy();
        tourRef.current = null;
      }
    };
  }, []);

  if (employeeConversationIsLoading) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-90px)] p-3 mt-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Loading />
      </div>
    );
  }

  if (employeeConversationIsError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-90px)] p-3 mt-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="!text-2xl !text-[#4F4F51] m-0">Growth Conversation</h1>
        <div className="flex gap-3" id="growth">
          <button
            className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
            onClick={() => setCreateOpen(true)}
          >
            Create Conversation
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between"></div>
      <div
        className="h-[calc(100vh-140px)] flex bg-white rounded-md mt-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        {conversations.length > 0 ? (
          <>
            <div className="w-[30%] overflow-y-auto border-r border-[#E8E8EC]">
              <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
                <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
                  Growth Areas
                </p>
              </div>
              {Object.entries(groupedConversations).map(
                ([area, convList]: any) => (
                  <div key={area} className="pt-2 px-3">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleArea(area)}
                    >
                      <p className="font-semibold text-[#3F4354] text-base mb-1">
                        {area}
                      </p>
                      <span className="text-[#585DF9] text-sx">
                        {expandedAreas[area] ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </span>
                    </div>
                    {expandedAreas[area] && (
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
                    )}
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
                      className={`p-3 text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354] cursor-pointer ${
                        activeTab === "Discussion"
                          ? "bg-[#585DF9] text-[white]"
                          : "text-[#3F4354]"
                      }`}
                    >
                      Discussion
                    </p>
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
                      <div className="flex gap-2">
                        <p className="font-semibold text-[#3F4354]">
                          Growth Areas:
                        </p>
                        <p className="bg-[#F4F6F8] py-[2px] px-[8px] rounded">
                          {selectedConversation.conversationInfo?.growthAreas?.join(
                            ", "
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "Discussion" && (
                    <div className="px-3">
                      <EmployeeGrowthConversationDetails
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
        MANAGER_ID={profile?.data?.reportsTo}
        open={createOpen}
        handleClose={createHandleClose}
        employeeConversationRefetch={employeeConversationRefetch}
      />
      <UpdateConversations
        MANAGER_ID={profile?.data?.reportsTo}
        open={editOpen}
        handleClose={editHandleClose}
        editConversation={editConversation}
        employeeConversationRefetch={employeeConversationRefetch}
      />
    </div>
  );
};

export default Growth;
