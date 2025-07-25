import { ThreeDots } from "react-loader-spinner";
const ThreeDotsLoading = ({color}:any) => {
  return (
    <ThreeDots
      visible={true}
      height="19"
      width="25"
      color={color}
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default ThreeDotsLoading;
