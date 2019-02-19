const error = errorInput => {
  return {
    status: 'error',
    data: errorInput,
  };
};

const success = data => {
  return {
    status: 'success',
    data,
  };
};

export { error, success };
