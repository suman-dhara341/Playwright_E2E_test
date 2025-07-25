import React from "react";
import { Outlet } from "react-router-dom";

const Badge: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Badge;
