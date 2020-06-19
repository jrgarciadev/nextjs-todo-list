/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from 'react';
import Router from 'next/router';
import { Alert, AlertTitle } from '@material-ui/lab';
import MainLayout from '../layouts/main';
import { AuthContext } from '../contexts/auth';
import { redirectIfAuthenticated } from '../lib/session';
import { FirebaseContext } from '../contexts/firebase';

export const withAuthWrapper = (Component) => (props) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { activateAuth } = useContext(AuthContext);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    redirectIfAuthenticated();
  }, []);

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  }

  const saveAuthAndRedirect = (data) => {
    try {
      const { user } = data;
      let { idToken = null } = data;
      if (!idToken) idToken = user.uid;
      activateAuth(user, idToken);
      setLoading(false);
      Router.push('/');
    } catch (error) {
      console.log({ error });
    }
  };

  const onGoogleSignIn = async () => {
    setLoading(true);
    firebase
      .doAuthWithGoogle()
      .then((resp) => {
        saveAuthAndRedirect(resp);
      })
      .catch((error) => {
        const { message } = error;
        setLoading(false);
        setErrorMessage(message);
      });
  };

  const onGithubSignIn = async () => {
    setLoading(true);
    await firebase
      .doAuthWithGithub()
      .then((resp) => saveAuthAndRedirect(resp))
      .catch((error) => {
        setLoading(false);
        const { message } = error;
        setErrorMessage(message);
      });
  };

  return (
    <MainLayout>
      <div className="container">
        <div className="main">
          {errorMessage && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}
          <Component
            {...props}
            loading={loading}
            onGoogleSignIn={onGoogleSignIn}
            onGithubSignIn={onGithubSignIn}
          />
        </div>
      </div>
      <style jsx>
        {`
          .container {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </MainLayout>
  );
};
