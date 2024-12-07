type InputType = string | string[] | Record<string, boolean> | undefined | null;

export const classNameParserCore = (
  firstString?: string,
  input?: InputType
): string => {
  const appendArray = (arr: string[]) => arr.filter(Boolean).join(" ");
  const appendObject = (obj: Record<string, boolean>) =>
    Object.keys(obj)
      .filter((key) => obj[key])
      .join(" ");

  // Check the type of input and handle falsy values
  const result = [
    firstString || "",
    Array.isArray(input)
      ? appendArray(input)
      : typeof input === "object" && input !== null
      ? appendObject(input)
      : typeof input === "string"
      ? input.trim()
      : null, // In case of undefined, null, or other falsy values
  ]
    .filter(Boolean) // Filter out any empty, falsy, or invalid values
    .join(" ");

  return result;
};
