export const parseUTCDate = (dateString: string | null | undefined): Date => {
  if (!dateString) return new Date();
  let cleanStr = dateString.trim();
  // If the string lacks any timezone specifier (like Z, +00, -05), append Z to treat it as UTC
  if (
    !cleanStr.endsWith("Z") &&
    !cleanStr.includes("+") &&
    !cleanStr.includes("-") &&
    !cleanStr.toLowerCase().endsWith("z")
  ) {
    cleanStr = cleanStr + "Z";
  }
  return new Date(cleanStr);
};

export const formatFullDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  const date = parseUTCDate(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
