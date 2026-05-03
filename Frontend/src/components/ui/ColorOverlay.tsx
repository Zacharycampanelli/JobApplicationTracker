import React from "react";

interface ColorOverlayProps {
    imgSrc: string;
    children: React.ReactNode;
    className?: string;
}

const ColorOverlay = ({ imgSrc, children, className="" }: ColorOverlayProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Overlay */}
      <img src={imgSrc} className="absolute inset-0 object-cover w-full h-full" />
      <div className="absolute inset-0 bg-primary/50" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ColorOverlay;
