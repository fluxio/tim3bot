import React from 'react';

import { SLACK_LOGIN_PATH } from '../lib/constants/paths';

const slackSrcSet = `\
https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, \
https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x`;

function LoginView() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <a href={SLACK_LOGIN_PATH}>
        <img
          alt="Sign in with Slack"
          height="40"
          width="172"
          src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
          srcSet={slackSrcSet}
        />
      </a>
    </div>
  );
}

export default LoginView;
