import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import EmployeeRecognitionOverview from "./EmployeeRecognitionOverview";
import EmployeeHierarchyOverview from "./EmployeeHierarchyOverview";
import EmployeeBadgesOverview from "./EmployeeBadgesOverview";
import EmployeeAwardsOverview from "./EmployeeAwardsOverview";
import EmployeePulseOverview from "./EmployeePulseOverview";
import EmployeeJourneyOverview from "./EmployeeJourneyOverview";
import EmployeeInsightOverview from "./EmployeeInsightOverview";
import { useParams } from "react-router-dom";
import "../css/profile.css";

const EmployeeProfileOverview = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
      <div>
        <ErrorBoundary fallback={<ErrorFallback height="30vh"/>}>
          <EmployeeAwardsOverview />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorFallback height="30vh"/>}>
          <EmployeeRecognitionOverview />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorFallback height="30vh"/>}>
          <EmployeeHierarchyOverview />
        </ErrorBoundary>
      </div>

      <div>
        <ErrorBoundary fallback={<ErrorFallback height="30vh"/>}>
          <EmployeeBadgesOverview />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorFallback height="30vh"/>}>
          <EmployeeJourneyOverview />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorFallback height="30vh"/>}>
          <EmployeeInsightOverview />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorFallback height="30vh"/>}>
          {empId ? undefined : <EmployeePulseOverview />}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default EmployeeProfileOverview;
