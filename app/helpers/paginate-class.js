import { helper as buildHelper } from '@ember/component/helper';

// This function receives the params `params, hash`
const paginateClass = function(params) {

  const [offset, page] = params;
  if (offset === page) {
    return "is-primary";
  } else {
    return "is-default";
  }
};

const PaginateClassHelper = buildHelper(paginateClass);

export { paginateClass };

export default PaginateClassHelper;
