import { useState, useEffect, useRef } from "react";
import { useGetOrgHierarchyQuery } from "../../profile/queries/profileQuery";
import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import EmployeeName from "../../../common/EmployeeName";
import SelectedEmployeeProfile from "./SelectedEmployeeProfile";
import { NavLink, useParams } from "react-router-dom";
import Tree from "react-d3-tree";
import "../../profile/css/profile.css";
import Logo from "/images/logo.png";
import { Fullscreen, ZoomIn, ZoomOut, Plus, Minus } from "lucide-react";
import Avatar from "../../../common/Avatar";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import { useGetOrganizationDetailsQuery } from "../../global/queries/globalQuery";
import { Tooltip } from "@mui/material";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import IndexShimmer from "./shimmer/IndexShimmer";

const Hierarchy = () => {
  const paramsData = useParams();
  const empId: string | undefined = paramsData.id;
  const ORGANIZATIONID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const defaultOrgId: string = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const defaultEmpId: string = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);

  const [selectedEmpId, setSelectedEmpId] = useState<string>(defaultEmpId);
  const [zoom, setZoom] = useState<number>(1);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<any>(null);
  const tourRef = useRef<any>(null);

  const {
    data: orgHierarchyData,
    error: orgHierarchyDataError,
    isLoading: orgHierarchyDataIsLoading,
    refetch,
  } = useGetOrgHierarchyQuery({
    EMP_ID: selectedEmpId,
    ORG_ID: defaultOrgId,
    hierarchyType: "upToRoot",
  });

  const {
    data: organizationDetails,
    isError: organizationDetailsIsError,
    isLoading: organizationDetailsIsLoading,
  } = useGetOrganizationDetailsQuery(ORGANIZATIONID);

  useEffect(() => {
    refetch();
  }, [selectedEmpId, refetch]);

  useEffect(() => {
    if (localStorage.getItem("hierarchyTour") === "true") return;
    const timeout = setTimeout(() => {
      const organizationEl = document.querySelector("#organization");

      if (organizationEl) {
        const tour = driver({
          showProgress: true,
          steps: [
            {
              element: "#organization",
              popover: {
                title: "Organizational Hierarchy",
                description: `View the reporting structure and team relationships within the organization. Understand who reports to whom. <br/><a href="https://www.wazopulse.com/goals/#user-guide" target="_blank"><span style="color:#585DF9; text-decoration:underline;">Learn more...</span></a>`,
                side: "bottom",
              },
            },
          ],
          onDestroyStarted: () => {
            localStorage.setItem("hierarchyTour", "true");
            tour.destroy();
          },
        });
        tour.drive();
        tourRef.current = tour;
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (tourRef.current) {
        tourRef.current.destroy();
        tourRef.current = null;
      }
    };
  }, [organizationDetails, orgHierarchyData]);

  if (orgHierarchyDataIsLoading || organizationDetailsIsLoading) {
    return <IndexShimmer />;
  }

  if (orgHierarchyDataError || organizationDetailsIsError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-90px)] p-3 bg-white rounded-md shadow-sm">
        <Error />
      </div>
    );
  }

  const buildTree = (employees: any[], managerId: string | null): any[] => {
    return employees
      .filter((emp) => emp.reportsTo === managerId)
      .map((emp) => {
        const fullName = `${emp.firstName} ${emp.lastName}`;
        const displayName =
          fullName.length > 15 ? fullName.slice(0, 15) + "..." : fullName;

        return {
          name: displayName,
          attributes: {
            designation: emp.designation,
            joiningDate: emp.joiningDate,
            active: emp.active ? "Present" : "Inactive",
          },
          children: buildTree(employees, emp.employeeId),
          empData: emp,
        };
      });
  };

  const rootNodes = (orgHierarchyData?.data ?? []).filter(
    (emp: any) => emp.reportsTo === "Root"
  );

  const treeData = rootNodes.map((root: any) => {
    const fullName = `${root.firstName} ${root.lastName}`;
    const displayName =
      fullName.length > 15 ? fullName.slice(0, 15) + "..." : fullName;

    return {
      name: displayName,
      attributes: {
        designation: root.designation,
        joiningDate: root.joiningDate,
        active: root.active ? "Present" : "Inactive",
      },
      children: buildTree(orgHierarchyData?.data ?? [], root.employeeId),
      empData: root,
    };
  });

  const companyWrappedTree = [
    {
      name:
        organizationDetails?.data?.organizationName.slice(0, 15) +
        (organizationDetails?.data?.organizationName.length > 15 ? "..." : ""),
      attributes: {
        active: "",
        designation: "Frontend Engineers",
        joiningDate: "",
      },
      children: treeData,
      empData: {
        employeeId: "Root",
        firstName:
          organizationDetails?.data?.organizationName.slice(0, 15) +
          (organizationDetails?.data?.organizationName.length > 15
            ? "..."
            : ""),
        middleName: "",
        lastName: "",
        gender: "",
        joiningDate: "",
        primaryEmail: "",
        primaryPhone: "",
        department: "",
        designation: "Organization",
        grade: "",
        photo: Logo,
        directReportee: "",
        active: true,
      },
    },
  ];

  const renderNodeWithAvatar = ({ nodeDatum, toggleNode }: any) => {
    const hasDirectReportees = nodeDatum.empData?.directReportee > 0;
    const isSelected = nodeDatum.empData.employeeId === selectedEmpId;

    return (
      <g>
        <foreignObject x="-90" y="-90" width="180" height="220">
          <div
            className={`relative flex flex-col items-center justify-center rounded-md p-3 border border-[#E8E8EC] cursor-pointer transition-all ${
              isSelected ? "bg-[#EEF1FF]" : "bg-white"
            }`}
            onClick={() => {
              setSelectedEmpId(nodeDatum.empData.employeeId);
              if (hasDirectReportees) toggleNode();
            }}
          >
            {hasDirectReportees && (
              <div className="absolute bottom-[-10px] z-[1] flex items-center justify-center w-5 h-5 bg-[#351EC3] rounded-xl text-white">
                {isSelected ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className="rounded-full">
                <Avatar
                  image={nodeDatum?.empData?.photo}
                  name={nodeDatum?.name}
                  size={50}
                />
              </div>
              {nodeDatum.empData?.employeeId ? (
                <EmployeeName
                  firstName={nodeDatum.name}
                  empId={nodeDatum.empData?.employeeId}
                  textColor={"!text-[#585DF9]"}
                  fontWeight={"font-semibold"}
                  textVarient={"!text-base"}
                />
              ) : (
                <p className="text-[#585DF9] font-semibold text-base">
                  {nodeDatum.empData?.firstName}
                </p>
              )}
            </div>

            {nodeDatum.empData.grade && (
              <div className="flex gap-1 items-center text-xs">
                <span className="ml-1 text-[#3F4354] font-semibold">
                  {nodeDatum.empData.designation}
                </span>
              </div>
            )}
            {nodeDatum.attributes.joiningDate ? (
              <p className="text-xs text-[#73737D]">
                {nodeDatum.attributes.joiningDate} -{" "}
                {nodeDatum.attributes.active}
              </p>
            ) : null}
          </div>
        </foreignObject>
      </g>
    );
  };

  const selectedEmployee = orgHierarchyData?.data?.find(
    (emp: any) => emp.employeeId === selectedEmpId
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="!text-2xl !text-[#4F4F51] m-0">Hierarchy</h1>
        <Tooltip title={"Learn more about Hierarchy"} arrow>
          <NavLink to={"https://www.wazopulse.com/hierarchy"} target="_blank">
            <p className="text-[#585DF9] text-xs mt-2">Info</p>
          </NavLink>
        </Tooltip>
      </div>
      <div className="flex gap-3 justify-start items-start">
        <div
          ref={treeContainerRef}
          className="tree-view p-1 bg-white rounded-md w-[75%] shadow-sm"
          id="organization"
        >
          <ErrorBoundary fallback={<ErrorFallback />}>
            <div className="h-[calc(100vh-150px)] overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-2 p-2">
                  <button
                    className="p-2 bg-gray-200 text-[#3F4354] !rounded-full hover:bg-gray-300 transition"
                    onClick={() => setZoom((prev) => prev + 0.1)}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 bg-gray-200 text-[#3F4354] !rounded-full hover:bg-gray-300 transition"
                    onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.1))}
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 bg-gray-200 text-[#3F4354] !rounded-full hover:bg-gray-300 transition"
                    onClick={() => {
                      if (treeContainerRef.current && treeRef.current) {
                        const containerWidth =
                          treeContainerRef.current.clientWidth;
                        const containerHeight =
                          treeContainerRef.current.clientHeight;
                        const totalNodes = orgHierarchyData?.data?.length || 1;
                        const treeDepth = Math.ceil(Math.log2(totalNodes)) || 1;
                        const treeWidth = totalNodes * 250;
                        const optimalZoom = Math.min(
                          containerWidth / treeWidth,
                          containerHeight / (treeDepth * 250),
                          0.4
                        );
                        const centerX = containerWidth / 2;
                        const centerY = containerHeight / 6;

                        setZoom(optimalZoom);

                        treeRef.current?.setState({
                          translate: { x: centerX, y: centerY },
                        });

                        treeRef.current.centerNode?.();
                      }
                    }}
                  >
                    <Fullscreen className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {companyWrappedTree.length > 0 ? (
                <Tree
                  ref={treeRef}
                  data={companyWrappedTree}
                  orientation="vertical"
                  renderCustomNodeElement={renderNodeWithAvatar}
                  pathFunc="step"
                  zoomable
                  collapsible
                  nodeSize={{ x: 250, y: 220 }}
                  translate={{ x: 400, y: 150 }}
                  zoom={zoom}
                  pathClassFunc={() => "custom-tree-line"}
                />
              ) : (
                <p className="text-center text-[#73737D]">
                  No hierarchy data found
                </p>
              )}
            </div>
          </ErrorBoundary>
        </div>

        {selectedEmployee && (
          <div
            id="profile"
            className="bg-white w-[25%] text-center rounded-md shadow-sm"
          >
            <ErrorBoundary fallback={<ErrorFallback />}>
              <SelectedEmployeeProfile selectedEmployee={selectedEmployee} />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hierarchy;
