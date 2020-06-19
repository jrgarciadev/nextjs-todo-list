/* eslint-disable import/no-extraneous-dependencies */
import css from 'styled-jsx/css';

export default css.global`
  :root {
    /* Spacing variables */
    --geist-gap: 16pt;
    --geist-gap-negative: -16pt;
    --geist-gap-half: 8pt;
    --geist-gap-half-negative: -8pt;
    --geist-gap-quarter: 4pt;
    --geist-gap-quarter-negative: -4pt;
    --geist-gap-double: 32pt;
    --geist-gap-double-negative: -32pt;
    --geist-page-margin: 16pt;
    --geist-page-width: 750pt;
    --geist-page-width-with-margin: 782pt;

    /* Breakpoints */
    --geist-breakpoint-mobile: 600px;
    --geist-breakpoint-tablet: 960px;

    /* Appearance */
    --geist-radius: 0.375rem;
    --geist-border-weight: 1px;
    --geist-marketing-radius: 0.4rem;
    --geist-default-height: 38px;

    /* Colors */
    --geist-cyan: #86e2df;
    --geist-purple: #f81ce5;
    --geist-violet: #7928ca;
    --geist-alert: #ff0080;
    --geist-marketing-gray: #fafbfc;

    /* Fonts */
    --font-sans: Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --font-mono: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
      Bitstream Vera Sans Mono, Courier New, monospace;
    --font-size-primary: 1rem;
    --font-size-small: 0.875rem;
    --font-size-extra-small: 0.675rem;
    --line-height-primary: 1.5em;
    --line-height-small: 1.571em;
  }

  body {
    font-family: Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background: #fafaf8;
  }

  /* Helper classes */
  a.geist-reset {
    text-decoration: none;
    color: inherit;
  }

  button.geist-reset {
    border: unset;
    background: unset;
    padding: unset;
    font: unset;
    text-align: unset;
  }

  hr.geist-hr-reset {
    margin: 0;
    border: none;
    border-bottom: 1px solid var(--accents-2);
    margin-top: -1px;
  }

  .geist-flex {
    display: flex;
  }

  .offset:before {
    display: block;
    content: ' ';
    height: 75px;
    margin-top: -75px;
    visibility: hidden;
  }

  .geist-visually-hidden {
    position: absolute;
    height: 1px;
    width: 1px;
    top: -1000px;
    left: -1000px;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    visibility: hidden;
  }

  .geist-ellipsis {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 100%;
  }

  .geist-text-no-margin > *:first-child {
    margin-top: 0;
  }

  .geist-text-no-margin > *:last-child {
    margin-bottom: 0;
  }

  .geist-overflow-scroll {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .geist-overflow-scroll-x {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .geist-overflow-scroll-y {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .geist-inline-center {
    display: inline-flex;
    align-items: center;
  }

  .geist-hover-dim {
    transition: opacity 0.15s ease;
  }

  .geist-hover-dim:hover {
    opacity: 0.7;
  }

  /* Shadow that has hover effect on dark theme too */
  .geist-shadow {
    box-shadow: var(--shadow-small);
  }

  .geist-shadow:hover,
  .geist-shadow:focus-within {
    box-shadow: var(--shadow-hover);
  }

  a.geist-secondary-link {
    line-height: normal;
    text-decoration-line: underline;
    text-decoration-style: dashed;
    text-decoration-color: var(--accents-3);
    text-decoration-skip-ink: none;
    transition: color 0.15s ease;
  }

  a.geist-secondary-link:hover {
    color: var(--accents-4);
  }

  /* Media Queries */
  @media screen and (min-width: 601px) {
    .geist-show-on-mobile {
      display: none;
    }
  }

  @media screen and (max-width: 600px) {
    .geist-center-on-mobile {
      text-align: center;
    }
    .geist-hide-on-mobile {
      display: none;
    }
    .geist-overflow-reset-mobile {
      overflow: initial;
      -webkit-overflow-scrolling: initial;
    }
  }

  @media screen and (min-width: 961px) {
    .geist-show-on-tablet {
      display: none;
    }
  }

  @media screen and (max-width: 960px) {
    .geist-hide-on-tablet {
      display: none;
    }
  }

  /* Light Mode */
  :root,
  .dark-theme .invert-theme {
    --geist-foreground: #000;
    --geist-background: #fff;
    --geist-selection: var(--geist-cyan);
    --accents-1: #fafaf8;
    --accents-2: #eaeaea;
    --accents-3: #999999;
    --accents-4: #3c4858;
    --accents-5: #8392a5;
    --accents-6: #444444;
    --accents-7: #333333;
    --accents-8: #111111;
    --accents-border: #e6edff;

    --geist-link-color: var(--geist-primary);

    /* Primary */
    --geist-primary: #3d72fe;

    /* Success (Blue) */
    --geist-success-light: #86e2df;
    --geist-success: #0bc4be;
    --geist-success-dark: #0bc4be;

    /* Error (Red) */
    --geist-error-light: #ff9bae;
    --geist-error: #fe4366;
    --geist-error-dark: #fc1b45;

    /* Warning (Orange) */
    --geist-warning-light: #ffeca2;
    --geist-warning: #fdca04;
    --geist-warning-dark: #cc9c00;

    /* Secondary (Gray) */
    --geist-secondary-light: var(--accents-3);
    --geist-secondary: var(--accents-5);
    --geist-secondary-dark: var(--accents-7);

    --geist-code: var(--geist-purple);

    --dropdown-box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
    --dropdown-triangle-stroke: #fff;

    --scroller-start: rgba(255, 255, 255, 1);
    --scroller-end: rgba(255, 255, 255, 0);

    --shadow-small: 0 5px 10px rgba(0, 0, 0, 0.12);
    --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.12);
    --shadow-large: 0 30px 60px rgba(0, 0, 0, 0.12);
    --shadow-hover: 0 30px 60px rgba(0, 0, 0, 0.12);

    --shadow-sticky: 0 12px 10px -10px rgba(0, 0, 0, 0.12);

    --portal-opacity: 0.25;
  }

  .geist-card-shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }

  /* debugging */
  .debug .geist-container {
    outline: 1px solid rgba(255, 0, 0, 0.3);
  }

  /* Transitions */
  .placeholder-fade-in-enter {
    opacity: 0.01;
  }
  .placeholder-fade-in-enter.placeholder-fade-in-enter-active {
    opacity: 1;
    transition: opacity 0.2s ease;
  }
  .placeholder-fade-in-leave {
    opacity: 1;
  }
  .placeholder-fade-in-leave.placeholder-fade-in-leave-active {
    opacity: 0.01;
    transition: opacity 0.2s ease;
  }
`;
