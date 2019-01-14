const error = error => {
  return {
    status: 'error',
    data: error,
  };
};

const success = data => {
  return {
    status: 'success',
    data: data,
  };
};

export { error, success };
