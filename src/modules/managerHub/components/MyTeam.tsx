import { useGetOrgHierarchyQuery } from "../../profile/queries/profileQuery";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "../../../common/Avatar";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { Insights } from "./Insigths";
import Goals from "../components/ManagerHubGoals";
import GrowthConversation from "./GrowthConversation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const MyTeam = () => {
  const defaultOrgId = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const defaultEmpId = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<
    "Insight" | "Goals" | "Growth"
  >("Insight");

  const tourRef = useRef<any>(null);

  const {
    data: orgHierarchyData,
    isLoading: orgHierarchyDataIsLoading,
    isError: orgHierarchyDataIsError,
  } = useGetOrgHierarchyQuery({
    EMP_ID: defaultEmpId,
    ORG_ID: defaultOrgId,
    hierarchyType: "spotlight",
  });

  const filteredEmployees =
    orgHierarchyData?.data?.filter(
      (employee: any) => employee.reportsTo === defaultEmpId
    ) ?? [];

  const searchedEmployees = useMemo(() => {
    return filteredEmployees.filter((emp: any) => {
      const fullName = `${emp.firstName} ${emp.middleName ?? ""} ${
        emp.lastName ?? ""
      }`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [filteredEmployees, searchTerm]);

  useEffect(() => {
    if (filteredEmployees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(filteredEmployees[0]);
    }
  }, [filteredEmployees, selectedEmployee]);

  useEffect(() => {
    if (localStorage.getItem("managerHubMyTeamTour") !== "true") {
      const interval = setInterval(() => {
        const allUserEl = document.querySelector("#allUser");
        const myTeamNavbarEl = document.querySelector("#myTeamNavbar");

        if (allUserEl && myTeamNavbarEl) {
          clearInterval(interval);
          const tour = driver({
            showProgress: true,
            steps: [
              {
                element: "#allUser",
                popover: {
                  title: "Team Member List",
                  description: `Here you can search for employees by name. Click on a team member to see their progress across Insights, Goals, and Growth.`,
                },
              },
              {
                element: "#myTeamNavbar",
                popover: {
                  title: "Employee Development Overview",
                  description: `Get a complete overview of the selected employee:\n• Insight – See their awards, recognitions, and badges.\n• Goals – Track progress and deadlines for set goals.\n• Growth – View their agendas and discussion.`,
                  side: "bottom",
                },
              },
            ],
            onDestroyStarted: () => {
              localStorage.setItem("managerHubMyTeamTour", "true");
              tour.destroy();
            },
          });
          tour.drive();
          tourRef.current = tour;
        }
      }, 500);

      return () => {
        clearInterval(interval);
        if (tourRef.current) {
          tourRef.current.destroy();
          tourRef.current = null;
        }
      };
    }
  }, [selectedTab]);

  if (orgHierarchyDataIsLoading) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-145px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Loading />
      </div>
    );
  }

  if (orgHierarchyDataIsError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-145px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div className="flex gap-3 w-full mb-6">
      <div
        className="w-[25%] h-[calc(100vh-145px)] overflow-y-auto flex flex-col justify-start bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        id="allUser"
      >
        <div className="p-3" id="searchEmp">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-[#ccc] rounded-md focus-visible:outline-none"
          />
        </div>
        {searchedEmployees.length > 0 ? (
          searchedEmployees.map((employee: any, index: number) => (
            <div
              key={index}
              className={`flex flex-row items-center gap-3 py-[12px] px-3 border-b border-[#E8E8EC] cursor-pointer ${
                selectedEmployee === employee ? "bg-[#585DF9]" : ""
              }`}
              onClick={() => {
                setSelectedEmployee(employee);
                setSelectedTab("Insight");
              }}
            >
              <Avatar
                name={employee.firstName}
                image={employee.photo || ""}
                size={45}
                className={`${
                  selectedEmployee === employee
                    ? "text-white"
                    : "text-[#73737D]"
                }`}
              />
              <div>
                <p
                  className={`text-base font-semibold ${
                    selectedEmployee === employee
                      ? "text-white"
                      : "text-[#3F4354]"
                  }`}
                >
                  {employee.firstName} {employee.middleName} {employee.lastName}
                </p>
                <div className="flex flex-row justify-between gap-2">
                  <span
                    className={`${
                      selectedEmployee === employee
                        ? "text-white"
                        : "text-[#73737D]"
                    } rounded text-xs`}
                  >
                    {employee.designation}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-145px)]">
            <p className="text-center text-[#73737D]">
              No employees reporting to you.
            </p>
          </div>
        )}
      </div>

      <div className="w-[75%] overflow-hidden">
        <div className="flex flex-col w-full h-full">
          {/* Tabs */}
          <div
            className="flex gap-3 bg-white rounded-md overflow-hidden"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            id="myTeamNavbar"
          >
            {[
              { label: "Insight", id: "insight" },
              { label: "Goals", id: "goals" },
              { label: "Growth", id: "growth" },
            ].map((tab) => (
              <button
                id={tab.id}
                key={tab?.label}
                className={`p-3 text-sm font-semibold text-[#3F4354] ${
                  selectedTab === tab?.label
                    ? "bg-[#585DF9] text-[white] border-b-2 border-[#585DF9]"
                    : "text-[#3F4354]"
                }`}
                onClick={() =>
                  setSelectedTab(tab.label as "Insight" | "Goals" | "Growth")
                }
              >
                {tab?.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {selectedTab === "Insight" ? (
              <Insights employeeId={selectedEmployee?.employeeId} />
            ) : selectedTab === "Goals" ? (
              <Goals employeeId={selectedEmployee?.employeeId} />
            ) : (
              <GrowthConversation employeeId={selectedEmployee?.employeeId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
