import React from 'react';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { IoLogoGoogle, IoLogoGithub } from 'react-icons/io';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withAuthWrapper } from '../hoc/withAuthWrapper';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  orText: {
    width: '100%',
    textAlign: 'center',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: '15px 10px',
    margin: '10px 0',
    width: '420px',
  },
  googleButton: {
    background: '#de5246',
    '&:hover': {
      backgroundColor: '#ef675d',
    },
  },
  githubButton: {
    background: '#24292e',
    '&:hover': {
      backgroundColor: '#555',
    },
  },
}));

const SignIn = ({ onGithubSignIn, onGoogleSignIn, loading }) => {
  const classes = useStyles();

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      {loading ? <h1>logging in..</h1> : <h1>Login to create tasks</h1>}
      {loading ? (
        <div className={classes.loaderContainer}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <img width="90%" src="/onboarding.svg" alt="team" />
          <Button
            variant="contained"
            color="primary"
            className={[classes.button, classes.githubButton]}
            onClick={onGithubSignIn}
            disabled={loading}
          >
            <div className={classes.iconContainer}>
              <IoLogoGithub fill="#fff" width="24" height="24" />
              &nbsp;
              <span>Continue with Github</span>
            </div>
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={[classes.button, classes.googleButton]}
            onClick={onGoogleSignIn}
            disabled={loading}
          >
            <div className={classes.iconContainer}>
              <IoLogoGoogle fill="#fff" width="24" height="24" />
              &nbsp;
              <span>Continue with Google</span>
            </div>
          </Button>
        </>
      )}
    </Container>
  );
};

SignIn.propTypes = {
  onGithubSignIn: PropTypes.func.isRequired,
  onGoogleSignIn: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withAuthWrapper(SignIn);
