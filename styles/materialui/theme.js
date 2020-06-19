import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiButton: {
      text: {
        borderRadius: '0.375rem',
        color: 'white',
        height: 44,
      },
      textSizeLarge: {
        height: 44,
        padding: '0 30px 0 30px',
      },
      contained: {
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.12)',
      },
      hover: {
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  palette: {
    primary: {
      light: '#6E94FF',
      main: '#3d72fe',
      dark: '#2E5AD4',
      contrastText: '#fff',
    },
    secondary: {
      light: '#46adfa',
      main: '#419ee5',
      dark: '#388bc9',
      contrastText: '#fff',
    },
    error: {
      light: '#FC1B45',
      main: '#FE4366',
      dark: '#FF728D',
      contrastText: '#fff',
    },
    success: {
      light: '#00AA44',
      main: '#02D155',
      dark: '#4BE087',
      contrastText: '#fff',
    },
    info: {
      light: '#0891BA',
      main: '#02A9DB',
      dark: '#61CDED',
      contrastText: '#fff',
    },
    warning: {
      light: '#FDCA04',
      main: '#FFE271',
      dark: '#FFECA2',
    },

    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'Rubik',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default theme;
