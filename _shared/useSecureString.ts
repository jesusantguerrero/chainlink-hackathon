export const useSecureString = (
  envInstance: Record<string | number | symbol, string> | any
) => {
  const getEnv = (key: string, defaultValue = ""): string => {
    const value = envInstance[key];
    return typeof value === "string" ? value : defaultValue;
  };

  return {
    getEnv,
  };
};
