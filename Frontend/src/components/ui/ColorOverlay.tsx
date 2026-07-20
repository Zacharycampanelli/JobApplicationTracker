import React from "react";

interface ColorOverlayProps {
    imgSrc: string;
    children: React.ReactNode;
    className?: string;
}

const ColorOverlay = ({ imgSrc, children, className="" }: ColorOverlayProps) => {
  return (
    <div className={`relative overflow-clip ${className}`}>
      {/* Overlay */}
      <img src={imgSrc} className="absolute inset-0 size-full origin-top scale-[1.3] object-cover"/>
      <div className="absolute inset-0 bg-primary/30" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ColorOverlay;
