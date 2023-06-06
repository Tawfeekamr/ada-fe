export default class FormValidation {
  static validateObject(func, object) {
    func(object, true, true);
  }

  static loopOnData(item, fieldName, func, idx) {
    if (typeof item === 'object') {
      if (item.length > 0) {
        item.forEach((field, i) => {
          FormValidation.loopOnData(field, `${fieldName}[${i}]`, func, i);
        });
      } else {
        Object.keys(item).forEach(key => {
          FormValidation.loopOnData(item[key], `${fieldName}${key}`, func, idx);
        });
      }
    } else {
      FormValidation.validateObject(func, fieldName);
    }
  }
}
