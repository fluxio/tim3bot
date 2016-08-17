import React from 'react';

import { SLACK_LOGIN_PATH } from '../lib/constants/paths';

function LoginView() {
  return (
    <div>
      <a href={SLACK_LOGIN_PATH}>Login with Slack</a>
    </div>
  );
}

export default LoginView;
