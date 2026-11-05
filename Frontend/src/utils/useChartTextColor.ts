import { useEffect, useState } from "react";

export const useChartTextColor = () => {
  const [textColor, setTextColor] = useState("#566166");

  useEffect(() => {
    const root = document.documentElement;

    const updateColor = () => {
      const color = getComputedStyle(root)
        .getPropertyValue("--color-on-surface-secondary")
        .trim();

      setTextColor(color || "#566166");
    };

    updateColor();

    const observer = new MutationObserver(updateColor);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    return () => observer.disconnect();
  }, []);

  return textColor;
};
