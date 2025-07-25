import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type FontWeight =
  | "font-thin"
  | "font-extralight"
  | "font-light"
  | "font-normal"
  | "font-medium"
  | "font-semibold"
  | "font-bold"
  | "font-extrabold"
  | "font-black";

interface EmployeeNameProps {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  empId?: string;
  isClickable?: boolean;
  textVarient?: string;
  textColor?: string;
  fontWeight?: FontWeight;
}

const EmployeeName = ({
  firstName,
  middleName,
  lastName,
  empId,
  isClickable = true,
  textVarient = "text-base",
  textColor = "text-[#73737D]",
  fontWeight = "font-normal",
}: EmployeeNameProps) => {
  const navigate = useNavigate();
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );

  const redirect = (e: any) => {
    if (isClickable) {
      e.stopPropagation();
      if (EMP_ID === empId) {
        navigate(`/profile`);
      } else {
        navigate(`/profile/${empId}`);
      }
    }
  };

  return (
    <p
      id="employee_name"
      className={`${textVarient} ${textColor} ${fontWeight} ${
        isClickable ? "cursor-pointer hover:underline" : "cursor-default"
      }`}
      onClick={redirect}
    >
      {firstName} {middleName} {lastName}
    </p>
  );
};

export default EmployeeName;
