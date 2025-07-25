export interface ManagerHubTotalAward {
    period: string;
    employeePhoto: string;
    employee_id: string;
    employee_name: string;
    total_awards: string;
}
export interface ManagerHubTotalAwardApiResponse {
    data: ManagerHubTotalAward[];
    message: string;
    status: number;
}
export interface EmployeeBadgeSummary {
    period: string;
    employeePhoto: string;
    employee_id: string;
    employee_name: string;
    total_badges: string;
}

export interface ManagerHubTotalBadgeApiResponse {
    data: EmployeeBadgeSummary[];
    message: string;
    status: number;
}
export interface EmployeeRecognitionSummary {
    period: string;
    employeePhoto: string;
    employee_id: string;
    employee_name: string;
    total_recognitions: string;
}
export interface ManagerHubTotalRecognitionApiResponse {
    data: EmployeeRecognitionSummary[];
    message: string;
    status: number;
}
export interface EmployeeAggregateReport {
    month: string;
    total_badges: string;
    total_recognitions: string;
    total_awards: string;
}
export interface EmployeeAggregateReportApiResponse {
    data: EmployeeAggregateReport[];
    message: string;
    status: number;
}
export interface EmployeeSearch {
    active_status: string;
    phone: string;
    org_id: string;
    employee_id: string;
    last_name: string;
    photo: string;
    primary_email: string;
    middle_name: string;
    first_name: string;
}
export interface EmployeeSearchApiResponse {
    data: EmployeeSearch[];
    message: string;
    status: number;
}