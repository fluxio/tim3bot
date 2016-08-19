import {
  CALL_API,
  API_REQUEST,
  API_SUCCESS,
  API_FAILURE,
} from '../constants/actions';

function apiMiddleware() {
  return next => action => {
    const {
      type,
      payload,
    } = action;
    const { method, key, request } = payload || {};

    let result = null;

    if (type !== CALL_API) {
      // Base case: don't add any special behaviour to the action.
      result = next(action);
    } else {
      // If the action calls the API (i.e., type === CALL_API):
      //   1) Dispatch an <endpoint>_REQUEST action.
      //      Reducers can use this to, e.g., invalidate their state (or just ignore it)
      //   2) Execute the API request.
      //      Note that 'request' must be a function that returns a promise.
      //   3) When the request returns, issue either <endpoint>_SUCCESS or <endpoint>_FAILURE
      //      method, depending on whether the promise was resolved or rejected.
      //      In the SUCCESS case, nest the response under the specified key so that it can
      //      be handled properly by the `entities` reducer.
      const endpoint = `${method}_${key}`;

      next({
        type: API_REQUEST,
        payload: {
          method,
          key,
        },
      });

      result = request()
        .then(res => next({
          type: API_SUCCESS,
          payload: {
            method,
            key,
            body: res,
          },
        }), err => next({
          type: API_FAILURE,
          payload: {
            method,
            key,
            error: err,
          },
        }));
    }

    return result;
  };
}

export default apiMiddleware;
