export const COLORS = {
  // Blue
  "blue-1": "#e0f7ff",
  "blue-2": "#b3e5fc",
  "blue-3": "#81d4fa",
  "blue-4": "#4fc3f7",
  "blue-5": "#29b6f6",
  "blue-6": "#03a9f4",
  "blue-7": "#039be5",
  "blue-8": "#0288d1",
  "blue-9": "#0277bd",
  "blue-10": "#01579b",

  // Green
  "green-1": "#e6f8d7",
  "green-2": "#c8e6a0",
  "green-3": "#aed581",
  "green-4": "#a2d149",
  "green-5": "#8bc34a",
  "green-6": "#7cb342",
  "green-7": "#689f38",
  "green-8": "#558b2f",
  "green-9": "#33691e",
  "green-10": "#1b5e20",

  // Red
  "red-1": "#ffe5e5",
  "red-2": "#ffb3b3",
  "red-3": "#ff8080",
  "red-4": "#ff4e4e",
  "red-5": "#ff1a1a",
  "red-6": "#e60000",
  "red-7": "#cc0000",
  "red-8": "#b30000",
  "red-9": "#800000",
  "red-10": "#4d0000",

  // Yellow
  "yellow-1": "#fff9e5",
  "yellow-2": "#fff1b3",
  "yellow-3": "#ffe680",
  "yellow-4": "#ffdc4d",
  "yellow-5": "#ffd11a",
  "yellow-6": "#e6b800",
  "yellow-7": "#cca300",
  "yellow-8": "#b38f00",
  "yellow-9": "#806600",
  "yellow-10": "#4d3d00",

  // Purple
  "purple-1": "#f3e5f5",
  "purple-2": "#e1bee7",
  "purple-3": "#ce93d8",
  "purple-4": "#ba68c8",
  "purple-5": "#ab47bc",
  "purple-6": "#9c27b0",
  "purple-7": "#8e24aa",
  "purple-8": "#7b1fa2",
  "purple-9": "#6a1b9a",
  "purple-10": "#4a148c",

  // Orange
  "orange-1": "#fff3e0",
  "orange-2": "#ffe0b2",
  "orange-3": "#ffcc80",
  "orange-4": "#ffb74d",
  "orange-5": "#ffa726",
  "orange-6": "#ff9800",
  "orange-7": "#fb8c00",
  "orange-8": "#f57c00",
  "orange-9": "#ef6c00",
  "orange-10": "#e65100",

  // Teal
  "teal-1": "#e0f2f1",
  "teal-2": "#b2dfdb",
  "teal-3": "#80cbc4",
  "teal-4": "#4db6ac",
  "teal-5": "#26a69a",
  "teal-6": "#009688",
  "teal-7": "#00897b",
  "teal-8": "#00796b",
  "teal-9": "#00695c",
  "teal-10": "#004d40",

  // Gray
  "gray-1": "#f5f5f5",
  "gray-2": "#eeeeee",
  "gray-3": "#e0e0e0",
  "gray-4": "#bdbdbd",
  "gray-5": "#9e9e9e",
  "gray-6": "#757575",
  "gray-7": "#616161",
  "gray-8": "#424242",
  "gray-9": "#212121",
  "gray-10": "#121212",
} as const;

export type ColorKey = keyof typeof COLORS;
