import React from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heading:string;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children,heading }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          isOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[40%] bg-white shadow-lg transform transition-transform z-[1111] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-[18px] border-b border-[#E8E8EC]">
          <p className="font-semibold text-xl text-[#585DF9]">
            {heading}
          </p>
          <button onClick={onClose} className="text-[#73737D] hover:text-black">
            ✕
          </button>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
