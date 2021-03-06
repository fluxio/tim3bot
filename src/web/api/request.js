import 'whatwg-fetch';

function handleResponse(response) {
  const payloadType = response.headers.get('content-type') || '';
  let body = null;

  // The mime-type may, for example, include a charset
  if (payloadType.search(/application\/json/i) !== -1) {
    body = response.json();
  } else if (payloadType.search(/multipart\/form-data/i) !== -1) {
    body = response.formData();
  } else {
    body = response.text();
  }

  return {
    body,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}

function handleError(response) {
  const { status, statusText, headers, body } = response;

  if (status < 200 || status >= 400) {
    const error = new Error(statusText || body);

    error.status = status;
    error.statusText = statusText;
    error.headers = headers;
    error.body = body;

    throw error;
  }

  return response;
}

function parseBody({ body }) {
  return body;
}

function request(url, { headers, body, ...others } = {}) {
  const bodyObj = body ? { body: JSON.stringify(body) } : null;

  return window.fetch(url, {
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    ...bodyObj,
    ...others,
  })
    .then(handleResponse)
    .then(handleError)
    .then(parseBody);
}

export default request;
