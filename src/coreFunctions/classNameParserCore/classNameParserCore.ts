type InputType =
  | string
  | string[]
  | Record<string, boolean | undefined>
  | undefined
  | null;

export const classNameParserCore = (...args: InputType[]): string => {
  const appendArray = (arr: string[]): string => arr.filter(Boolean).join(" ");

  const appendObject = (obj: Record<string, boolean | undefined>): string =>
    Object.keys(obj)
      .filter((key) => obj[key]) // Include keys with truthy values
      .join(" ");

  const processInput = (input: InputType): string => {
    if (Array.isArray(input)) {
      return appendArray(input);
    } else if (typeof input === "object" && input !== null) {
      return appendObject(input);
    } else if (typeof input === "string") {
      return input.trim();
    }
    return ""; // For undefined, null, or other falsy values
  };

  // Process all arguments and join the results with a space
  return args
    .map(processInput)
    .filter(Boolean) // Remove falsy or empty values
    .join(" ");
};
