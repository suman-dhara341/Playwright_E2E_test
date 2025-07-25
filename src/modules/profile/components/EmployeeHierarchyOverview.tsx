import { useEffect, useState } from "react";
import { useGetOrgHierarchyQuery } from "../queries/profileQuery";
import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { EmployeeHierarchy } from "../interfaces";
import Avatars from "../../../common/Avatar";
import EmployeeName from "../../../common/EmployeeName";
import { useGetOrganizationDetailsQuery } from "../../global/queries/globalQuery";
import EmployeeHierarchyOverviewShimmer from "./shimmer/EmployeeHierarchyOverviewShimmer";

const EmployeeHierarchyOverview = () => {
  const navigate = useNavigate();
  const paramsData = useParams();
  const empId: string = paramsData.id || "";
  const ORGANIZATIONID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const defaultOrgId = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const defaultEmpId =
    empId || useSelector((state: any) => state.auth.userData["custom:empId"]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(defaultEmpId);
  const {
    data: orgHierarchyData,
    error: orgHierarchyDataError,
    isLoading: orgHierarchyDataIsLoading,
    refetch,
  } = useGetOrgHierarchyQuery(
    {
      EMP_ID: selectedEmpId,
      ORG_ID: defaultOrgId,
      hierarchyType: "spotlight",
    },
  );

  const {
    data: organizationDetails,
    isError: organizationDetailsIsError,
    isLoading: organizationDetailsIsLoading,
  } = useGetOrganizationDetailsQuery(ORGANIZATIONID);

  const handleTabClick = () => {
    navigate("/hierarchy");
  };

  useEffect(() => {
    if (selectedEmpId) {
      refetch?.();
    }
  }, [selectedEmpId]);

  const useTimeAgo = (date: string) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(date))
      : "-";

  const calculateTenure = (joiningDate: string) => {
    if (!joiningDate) return "-";

    const joinDate = new Date(joiningDate);
    const currentDate = new Date();

    let yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
    let monthsDiff = currentDate.getMonth() - joinDate.getMonth();

    if (currentDate.getDate() < joinDate.getDate()) {
      monthsDiff -= 1;
    }

    if (monthsDiff < 0) {
      yearsDiff -= 1;
      monthsDiff += 12;
    }

    if (yearsDiff < 0 || (yearsDiff === 0 && monthsDiff <= 0)) {
      return "< 1m";
    }

    const yearPart = yearsDiff > 0 ? `${yearsDiff}y` : "";
    const monthPart = monthsDiff > 0 ? `${monthsDiff}m` : "";

    return [yearPart, monthPart].filter(Boolean).join(" ");
  };
  if (orgHierarchyDataIsLoading || organizationDetailsIsLoading) {
    return <EmployeeHierarchyOverviewShimmer />;
  }

  if (orgHierarchyDataError || organizationDetailsIsError) {
    return (
      <div
        className="flex justify-center items-center min-h-[30vh] p-3 mb-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  const buildHierarchy = (
    employees: EmployeeHierarchy[]
  ): (EmployeeHierarchy & { children: EmployeeHierarchy[] })[] => {
    const map = new Map<
      string,
      EmployeeHierarchy & { children: EmployeeHierarchy[] }
    >();

    // Initialize map with children array
    for (const emp of employees) {
      map.set(emp.employeeId, { ...emp, children: [] });
    }

    const tree: (EmployeeHierarchy & { children: EmployeeHierarchy[] })[] = [];

    // Link children to their parents
    for (const emp of employees) {
      const current = map.get(emp.employeeId)!;

      if (emp.reportsTo && map.has(emp.reportsTo)) {
        map.get(emp.reportsTo)!.children.push(current);
      } else {
        tree.push(current); // Top-level nodes
      }
    }

    return tree;
  };

  const fullHierarchyTree = buildHierarchy(orgHierarchyData?.data || []);

  const findPathToSelected = (
    node: EmployeeHierarchy,
    targetId: string,
    path: EmployeeHierarchy[] = []
  ): EmployeeHierarchy[] | null => {
    if (node.employeeId === targetId) {
      return [...path, node];
    }

    for (const child of node.children || []) {
      const result = findPathToSelected(child, targetId, [...path, node]);
      if (result) {
        return result;
      }
    }
    return null;
  };

  const findEmployeePath = (
    node: EmployeeHierarchy,
    targetId: string,
    path: EmployeeHierarchy[] = []
  ): EmployeeHierarchy[] | null => {
    if (node.employeeId === targetId) return [...path, node];

    for (const child of node.children || []) {
      const result = findEmployeePath(child, targetId, [...path, node]);
      if (result) return result;
    }

    return null;
  };

  const companyWrappedTree = [
    {
      active: true,
      children: fullHierarchyTree,
      department: "",
      designation: "Organization",
      directReportee: 0,
      employeeId: "Root",
      firstName:
        organizationDetails?.data?.organizationName?.slice(0, 20) +
        (organizationDetails?.data?.organizationName?.length > 20 ? "..." : ""),
      gender: "",
      grade: "",
      joiningDate: "",
      lastName: "",
      middleName: "",
      photo: "",
      primaryEmail: "",
      primaryPhone: "",
      nodeType: "organization",
    },
  ];

  function findEmployeeLevel(
    node: any,
    targetId: string,
    level: number = 0
  ): number | null {
    if (node.employeeId === targetId) {
      return level;
    }

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const result = findEmployeeLevel(child, targetId, level + 1);
        if (result !== null) {
          return result;
        }
      }
    }

    return null;
  }
  const level = findEmployeeLevel(companyWrappedTree[0], selectedEmpId);
  const filterHierarchyData =
    level !== null && level > 2 ? fullHierarchyTree : companyWrappedTree;


  const renderTree = (
    node: EmployeeHierarchy,
    isChild = false,
    isLastChild = false,
    isRoot = true
  ) => {
    const hasDirectReportees =
      (node.directReportee !== undefined && node.directReportee > 0) ||
      node.nodeType === "organization";
    const isSelected = selectedEmpId === node.employeeId;

    return (
      <div
        key={node.employeeId}
        className={`relative pt-1 ${isChild ? "ml-5" : ""} before:absolute ${
          isRoot ? "before:w-0" : "before:w-8"
        } before:h-[2px] before:bg-gray-300 
        ${!isRoot ? "before:top-[35px] before:-left-[50px]" : ""}`}
      >
        {isChild && (
          <div
            className={`absolute left-[-50px] top-[-35px] w-[2px] bg-gray-300 ${
              isLastChild ? "h-[70px]" : "h-full"
            }`}
          />
        )}
        <div
          className={`flex justify-between items-center gap-4 rounded-md p-1 px-3 cursor-pointer transition-all
          ${
            isSelected
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
          onClick={() => {
            if (!hasDirectReportees) return;
            setSelectedEmpId(node.employeeId);
          }}
        >
          <div className="flex align-items-center gap-2">
            <Avatars name={node.firstName || ""} image={node.photo} size={50} />
            <div className="flex flex-col justify-center">
              {node.employeeId ? (
                <div className="flex gap-1 align-items-center">
                  {node.designation === "Organization" ? (
                    <p className="text-base text-[#585DF9] font-semibold">
                      {node.firstName} {node.middleName} {node.lastName}
                    </p>
                  ) : (
                    <EmployeeName
                      firstName={node.firstName}
                      middleName={node.middleName}
                      lastName={node.lastName}
                      empId={node.employeeId}
                      textVarient="text-base"
                      textColor="text-[#585DF9]"
                      fontWeight="font-semibold"
                    />
                  )}
                  {node.directReportee ? (
                    <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                  ) : null}
                  {node.directReportee ? (
                    <div className="flex gap-1 items-center text-xs">
                      <span className="text-[#73737D] rounded text-xs">
                        Reports:
                      </span>
                      <span className="ml-1 text-[#3F4354]">
                        {node?.directReportee}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  <p className="text-[#585DF9] font-semibold text-base">
                    {node?.firstName}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-1">
                {node.designation && (
                  <p className="text-xs text-[#3F4354] font-semibold">
                    {node.designation}
                  </p>
                )}
                {node.grade && node.department && (
                  <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                )}
                {node.department && (
                  <div className="flex gap-1 items-center text-xs">
                    <span className="text-[#73737D] rounded text-xs">
                      Dept:
                    </span>
                    <span className="ml-1 text-[#3F4354] font-semibold">
                      {node.department}
                    </span>
                  </div>
                )}
              </div>
              {(node.grade || node.department) && (
                <div className="flex items-center gap-1">
                  {node.grade && (
                    <div className="flex gap-1 items-center text-xs">
                      <span className="text-[#73737D] rounded text-xs">
                        Grade:
                      </span>
                      <span className="ml-1 text-[#3F4354] font-semibold">
                        {node.grade}
                      </span>
                    </div>
                  )}
                  {node.grade && node.department && (
                    <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                  )}
                  {node.department && (
                    <div className="flex gap-1 items-center text-xs">
                      <span className="text-[#73737D] rounded text-xs">
                        Tenure:
                      </span>
                      <span className="ml-1 text-[#3F4354] font-semibold">
                        {calculateTenure(node?.joiningDate)}
                      </span>
                      <span>{`(${useTimeAgo(node?.joiningDate)})`}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="absolute left-[-27px] top-[25px] z-[1] flex items-center justify-center w-5 h-5 bg-[#351EC3] rounded-xl text-white">
            {hasDirectReportees ? (
              isSelected ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="pl-3">
          {node.children &&
          Array.isArray(node.children) &&
          node.children.length > 0
            ? node.children.map((child, index) =>
                renderTree(
                  child,
                  true,
                  index === node.children.length - 1,
                  false
                )
              )
            : null}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-[30vh] bg-white rounded-md border-1 border-gray-200"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
        <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
          Hierarchy
        </p>
        <p
          onClick={handleTabClick}
          className="text-xs font-[400] !text-[#585DF9] cursor-pointer"
        >
          View all
        </p>
      </div>
      <div className="pl-12 pr-3 py-3">
        {filterHierarchyData.map((node) => renderTree(node))}
      </div>
    </div>
  );
};

export default EmployeeHierarchyOverview;
