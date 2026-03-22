import { alpha, createTheme } from "@mui/material/styles";
import { AMBER, TEAL } from "./constants";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: TEAL,
    },
    secondary: {
      main: AMBER,
    },
    background: {
      default: "#f7f0e5",
      paper: "rgba(255, 250, 243, 0.84)",
    },
    text: {
      primary: "#1a302d",
      secondary: "#4b6661",
    },
  },
  shape: {
    borderRadius: 22,
  },
  typography: {
    fontFamily: '"Segoe UI Variable Text", "Trebuchet MS", sans-serif',
    h3: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 700,
      letterSpacing: "-0.04em",
      lineHeight: 1.05,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": {
          backgroundColor: alpha(TEAL, 0.18),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "none",
          paddingBlock: "0.9rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: alpha("#fffaf3", 0.9),
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#1a302d",
        },
      },
    },
  },
});
