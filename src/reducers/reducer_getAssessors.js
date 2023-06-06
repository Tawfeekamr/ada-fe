import { GET_ASSESSORS } from '../actions';

function addData(state, payload) {
  const { users } = payload.data;
  const list = [];
  let usersArray = users;
  if (!users.length) {
    usersArray = users.data;
  }
  usersArray.forEach((item, index) => {
    list[index] = {
      value: item.id,
      label: `${item.first_name} ${item.last_name}`,
    };
  });

  return {
    data: list,
  };
}

export default function(state = {}, action) {
  let newState;
  switch (action.type) {
    case GET_ASSESSORS.ROOT:
    case GET_ASSESSORS.FULFILLED:
      newState = addData(state, action.payload);
      break;
    case GET_ASSESSORS.REJECTED:
      newState = {
        error: true,
      };
      break;
    default:
      newState = state;
  }

  return newState;
}
