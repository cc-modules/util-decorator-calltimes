const map = new WeakMap();
export default function calltimes(n = 1) {
  return function calltimesDecorator(target, name, descriptor) {
    const method = descriptor.value;
    descriptor.value = function() {
      const key = objstr(this, method);
      let data = map.get(key);
      if (!data){
        data = {remain: n, lastReturn: undefined};
        map.set(key, data);
        data.remain--;
        return data.lastReturn = method.apply(this, arguments);
      } else {
        if (data.remain <= 0) {
          return data.lastReturn;
        } else {
          data.remain--;
          return data.lastReturn = method.apply(this, arguments);
        }
      }
    };
    return descriptor;
  };
};

const objstrList = [];
function objstr(obj, str) {
  let ret = objstrList.find(it => it[0] == obj && it[1] === str);
  if (!ret) {
    ret = [obj, str];
    objstrList.push(ret);
  }
  return ret;
}