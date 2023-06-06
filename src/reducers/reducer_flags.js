function addFlags(state, flags) {
  return {
    ...flags,
  };
}
// if multiple calls, increment isLoading on each pending and decrement it on each fulfilled or rejected. Then isLoading will be false (or 0) only when all calls are done.
export default function(state = {}, action) {
  let newState;
  const { type } = action;
  if (type.endsWith('PENDING')) {
    newState = addFlags(state, {
      isLoading: (state.isLoading || 0) + 1,
      isError: false,
      isLoaded: false,
    });
  } else if (type.endsWith('FULFILLED')) {
    newState = addFlags(state, {
      isLoading: state.isLoading - 1,
      isError: false,
      isLoaded: true,
    });
  } else if (type.endsWith('REJECTED')) {
    newState = addFlags(state, {
      isLoading: state.isLoading - 1,
      isError: true,
      isLoaded: false,
      error: action.payload,
    });
  } else {
    newState = state;
  }
  return newState;
}
