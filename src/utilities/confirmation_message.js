import { confirmAlert } from 'react-confirm-alert';
import { strings, translateString } from './';

export default class Confirmation {
  static removeEntityFromFieldArray(text, func, index, callback) {
    const { title, message } = text;
    confirmAlert({
      title: translateString(title),
      message: translateString(message),
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            func(index);
            if (typeof callback === 'function') {
              callback();
            }
          },
        },
        {
          label: translateString(strings.confirm.no),
        },
      ],
    });
  }
  static confirmAction(text, callback, params) {
    const { title, message } = text;
    confirmAlert({
      title,
      message,
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            if (typeof callback === 'function') {
              callback(params);
            }
          },
        },
        {
          label: translateString(strings.confirm.no),
        },
      ],
    });
  }
}
