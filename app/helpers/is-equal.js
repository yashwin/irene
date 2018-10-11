import { helper as buildHelper } from '@ember/component/helper';

export function isEqualTo([leftSide, rightSide]) {
  return leftSide === rightSide;
}

export default buildHelper(isEqualTo);
