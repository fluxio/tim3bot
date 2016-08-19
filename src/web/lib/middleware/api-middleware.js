import {
  CALL_API,
  API_REQUEST,
  API_SUCCESS,
  API_FAILURE,
} from '../constants/actions';

function apiMiddleware() {
  return dispatch => action => {
    const {
      type,
      payload,
    } = action;
    const { method, key, request } = payload || {};

    let result = null;

    if (type !== CALL_API) {
      result = dispatch(action);
    } else {
      dispatch({
        type: API_REQUEST,
        payload: {
          method,
          key,
        },
      });

      result = request()
        .then(res => dispatch({
          type: API_SUCCESS,
          payload: {
            method,
            key,
            body: res,
          },
        }), err => dispatch({
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
