import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      fill="#4C56AF"
      d="M0 8V0h8v8H0Zm0 10v-8h8v8H0ZM10 8V0h8v8h-8Zm0 10v-8h8v8h-8Z"
    />
  </svg>
);
export default SvgComponent;
