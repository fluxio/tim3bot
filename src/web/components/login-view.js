import React from 'react';

import { SLACK_LOGIN_PATH } from '../lib/constants/paths';

import splash from '../../../assets/splash.png';

const slackSrcSet = `\
https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, \
https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x`;

function LoginView() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ width: '100%', textAlign: 'center' }}>
        <img src={splash} alt="Welcome to tim3bot" style={{ maxWidth: 1000, width: '100%' }} />
      </div>
      <a href={SLACK_LOGIN_PATH} style={{ marginTop: '-6rem' }}>
        <img
          alt="Sign in with Slack"
          src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
          srcSet={slackSrcSet}
          style={{
            height: 40,
            width: 172,
          }}
        />
      </a>
    </div>
  );
}

export default LoginView;
