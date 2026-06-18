import React, { type SVGProps } from "react";

type PipelineDistributionProps = {
  data: {
    title: string;
    value: number;
    icon?: SVGProps<SVGSVGElement>;
    suffix?: string;
  };
};
const PipelineDistribution = () => {
  return <div>PipelineDistribution</div>;
};

export default PipelineDistribution;
