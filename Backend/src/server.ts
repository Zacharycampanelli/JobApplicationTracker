import "dotenv/config";

import { validateEnvironment } from "./config/validateEnvironment";

validateEnvironment();

const { default: app } = await import("./app");

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
