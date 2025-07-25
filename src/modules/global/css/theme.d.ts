import { ThemeOptions } from "@mui/material";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    rounded: true; // Add the "rounded" variant
    "outline-shadow": true; // Add the "outline-shadow" variant
  }
}
