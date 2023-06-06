import createStoreWithMiddleware from '../store';

export const translateString = strings => {
  const { language } = createStoreWithMiddleware.getState();
  return strings[language];
};

export const getLanguage = () => {
  const { language } = createStoreWithMiddleware.getState();
  return language;
};
