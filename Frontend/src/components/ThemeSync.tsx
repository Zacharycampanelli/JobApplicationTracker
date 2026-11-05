import { useEffect } from "react";

import { useAuthContext } from "../context/AuthContext";

const ThemeSync = () => {
    const { user } = useAuthContext();

    const themePreference = user?.preferences?.themePreference ?? "system";

    useEffect(() => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            const isDark = 
                themePreference === "dark" ||
                (themePreference === "system" && systemTheme.matches);

            document.documentElement.dataset.theme = isDark ? "dark" : "light";
        };

        applyTheme();

        if (themePreference === "system") {
            systemTheme.addEventListener("change", applyTheme);
        }

        return () => {
            systemTheme.removeEventListener("change", applyTheme);
        };
    }, [themePreference]);
    
    return null;
};

export default ThemeSync