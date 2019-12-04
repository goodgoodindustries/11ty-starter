import add from './utilities/add';
import subtract from './utilities/subtract';

console.log(add(1, 2));
console.log(add(3, 4));
console.log(subtract(2, 1));

const obj = {
  c: add(1, 5),
};

Object.assign({}, obj, {
  a: add(1, 2),
  b: subtract(2, 1),
})
