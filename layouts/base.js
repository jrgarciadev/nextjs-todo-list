import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const BaseLayout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Next.js TODO List APP by Junior Garcia | Challenge</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
        <link
          href="https://fonts.googleapis.com/css?family=Rubik:400,500,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {children}
    </div>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BaseLayout;
