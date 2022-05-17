export const replaceField = (data, options) => {
  if ([null, undefined].includes(data)) {
  } else if (data instanceof Array) {
    for (let d of data) {
      replaceField(d, options);
    }
  } else if (typeof data === 'object') {
    for (let key in data) {
      let v = data[key];
      v = data[key] = replaceField(v, options);

      let newKey = key;
      let newField = options[key];
      if (newField) {
        if (typeof newField === 'function') return newField(v);
        newKey = newField;
        let newV = data[key];
        delete data[key];
        data[newKey] = newV;
      }
    }
  }
  return data;
};
