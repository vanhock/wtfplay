export const debounce = (fn, timeout) => {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    const callback = () => fn(...args);
    t = setTimeout(callback, timeout);
    if (!t) callback();
  };
};
