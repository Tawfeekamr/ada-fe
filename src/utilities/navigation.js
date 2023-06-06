import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { strings, translateString } from './';

export default class Navigation {
  static back = ctx => {
    ctx.props.history.goBack();
  };
  static cancelAndGoBack = ctx => {
    confirmAlert({
      title: translateString(strings.navigation.cancel),
      message: translateString(strings.navigation.confirmMessage),
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            Navigation.back(ctx);
          },
        },
        {
          label: translateString(strings.confirm.no),
        },
      ],
    });
  };
}
