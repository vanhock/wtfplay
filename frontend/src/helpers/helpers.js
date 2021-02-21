export const debounce = (fn, timeout) => {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    const callback = () => fn(...args);
    t = setTimeout(callback, timeout);
    if (!t) callback();
  };
};

export const shallowEqualArrays = (arrA, arrB) => {
  if (arrA === arrB) {
    return true;
  }
  
  if (!arrA || !arrB) {
    return false;
  }
  
  const len = arrA.length;
  
  if (arrB.length !== len) {
    return false;
  }
  
  for (let i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  
  return true;
}
