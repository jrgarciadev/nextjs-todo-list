/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { debounce } from 'lodash';
import NProgress from 'nprogress';
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

function App({ Component, pageProps }) {
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
          <ThemeProvider theme={materialUITheme}>
            <Component {...pageProps} />
          </ThemeProvider>
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

export default App;
