type JSXElementArray = JSX.Element[];

export const merge = (current: JSXElementArray, next: JSXElementArray) =>
  next.concat(current)
    .filter((element, index, array) =>
      array.findIndex($element => $element.key === element.key) === index);

export const diff = (current: JSXElementArray, next: JSXElementArray) => {
  const added = next.filter(item => !current.find(({ key }) => item.key === key));
  const removed = current.filter(item => !next.find(({ key }) => item.key === key));

  return {
    added: added.map(item => item.key),
    removed: removed.map(item => item.key),
  };
};

export const shallowEqualsArray = (a: any[], b: any[]) => {
  const { length } = a;

  if (a.length !== b.length) {
    return false;
  }

  // tslint:disable-next-line no-increment-decrement
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

