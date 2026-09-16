const requiredEnvironmentVariables = [
  "DATABASE_URL",
  "JWT_SECRET",
  "FRONTEND_URL",
  "BREVO_API_KEY",
  "EMAIL_FROM_ADDRESS",
] as const;

export const validateEnvironment = (environment: NodeJS.ProcessEnv = process.env) => {
  const missingVariables = requiredEnvironmentVariables.filter((name) => !environment[name]?.trim());

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }
};
