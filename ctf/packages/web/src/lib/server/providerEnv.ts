export const getRequiredServerEnv = (name: string): string => {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`${name} is not configured`);
  }

  return value.trim();
};
