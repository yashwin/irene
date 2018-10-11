import { helper as buildHelper } from '@ember/component/helper';

// This function receives the params `params, hash`
const pageNumber = params => params[0] + 1;

const PageNumberHelper = buildHelper(pageNumber);

export { pageNumber };

export default PageNumberHelper;
