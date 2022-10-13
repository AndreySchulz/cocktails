let throttleWait = false;
export const throttle = (callback, time) => {
  if (throttleWait) return;
  throttleWait = true;

  setTimeout(() => {
    callback();
    throttleWait = false;
  }, time);
};
