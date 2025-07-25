import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export interface employeeName {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  empId?: string;
  isClickable?: boolean;
}
const EmployeeNameNotification = ({
  firstName,
  middleName,
  lastName,
  empId,
  isClickable=true,
}: employeeName) => {
  const nevigate = useNavigate();
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const redirect = () => {
    if(isClickable){
        if (EMP_ID == empId) {
            nevigate(`/profile`);
          } else {
            nevigate(`/profile/${empId}`);
          }
    }
  };
  return (
    <span className="text-[#3F4354] text-sm" onClick={redirect} style={{cursor:isClickable? 'pointer' :'none',fontWeight:'600'}}>
      {firstName} {middleName} {lastName}{" "}
    </span>
  );
};

export default EmployeeNameNotification;
