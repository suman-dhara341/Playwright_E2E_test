import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#edf3f8",
      light: "#ffffff",
      dark: "#f7f7f7",
      contrastText: "#343434",
    },
    secondary: {
      main: "#0d6efd",
      light: "#ffffffddd",
      dark: "#000000",
      contrastText: "#666666",
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: '"Montserrat", sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: "0.9rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: "0.8rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: "0.85rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body2: {
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: "0.8rem",
      fontWeight: 600,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: "0.7rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.5,
      color: 'rgba(0,0,0,0.6)',
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 700,
      textTransform: "capitalize",
      lineHeight: 1.4,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "gray",
          },
          "&:hover fieldset": {
            borderColor: "blue",
          },
          "&.Mui-focused fieldset": {
            borderColor: "green",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "gray",
          "&.Mui-focused": {
            color: "gray",
          },
        },
      },
    },
  },
});

export default theme;
