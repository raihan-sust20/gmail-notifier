import * as R from 'ramda';

export const handleGoogleApiError = R.curry((error: any) => {
  const errorMessage = R.path(['response', 'data', 'error'], error);
  const errorrDescription = R.path(['response', 'data', 'error_description'], error);

  const errorCode = R.path(['response', 'status'], error);
  const errorType = R.path(['response', 'statusText'], error);

  return  {
    error: {
      code: errorCode,
      type: errorType,
      message: errorMessage,
      description: errorrDescription, 
    }
  }
});