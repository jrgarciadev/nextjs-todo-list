/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { debounce } from 'lodash';
import NProgress from 'nprogress';
import { SnackbarProvider } from 'notistack';
import materialUITheme from '../styles/materialui/theme';
import globalTheme from '../styles/global';
import { FirebaseContext } from '../contexts/firebase';
import { Firebase, auth, analytics } from '../lib/firebase';
import AuthContext from '../contexts/auth';
import nprogressStyles from '../styles/nprogress';
import RouterEvents from '../lib/router-events';

NProgress.configure({ parent: '#app-container' });

const start = debounce(NProgress.start, 200);
RouterEvents.on('routeChangeStart', start);
RouterEvents.on('routeChangeComplete', (url) => {
  console.log(`Changed to URL: ${url}`);
  start.cancel();
  NProgress.done();
});
RouterEvents.on('routeChangeError', () => {
  start.cancel();
  NProgress.done();
});

const styles = {
  snack: {
    padding: '10px',
  },
  success: {
    backgroundColor: 'var(--geist-success)',
  },
  error: {
    backgroundColor: 'var(--geist-error)',
  },
  info: {
    backgroundColor: 'var(--geist-primary)',
  },
  warning: {
    backgroundColor: 'var(--geist-warning)',
  },
};

function App({ Component, classes, pageProps }) {
  const firebase = new Firebase();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    async function verifyAuthUser() {
      auth.onAuthStateChanged(async (authUser) => {
        if (authUser && analytics) {
          analytics.setUserId(authUser.uid);
        }
      });
    }
    verifyAuthUser();
  }, []);

  return (
    <>
      <AuthContext.Provider>
        <FirebaseContext.Provider value={firebase}>
          <SnackbarProvider
            preventDuplicate
            elevation={0}
            classes={{
              root: classes.snack,
              variantSuccess: classes.success,
              variantError: classes.error,
              variantWarning: classes.warning,
              variantInfo: classes.info,
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            maxSnack={3}
          >
            <ThemeProvider theme={materialUITheme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </SnackbarProvider>
          <style jsx global>
            {nprogressStyles}
          </style>
          <style jsx global>
            {globalTheme}
          </style>
        </FirebaseContext.Provider>
      </AuthContext.Provider>
      <CssBaseline />
    </>
  );
}

export default withStyles(styles)(App);
