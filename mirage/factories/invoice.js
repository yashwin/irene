import { Factory, faker } from 'ember-cli-mirage';
import ENUMS from 'irene/enums';

export default Factory.extend({
  amount: faker.commerce.price,
  paidOn: faker.date.past,
  pricingName: faker.name.firstName,
  couponCode: faker.name.firstName,
  couponDiscount: faker.commerce.price,

  source(){
    return faker.random.arrayElement(ENUMS.PAYMENT_SOURCE.VALUES);
  },
  paymentDuration(){
    return faker.random.arrayElement(ENUMS.PAYMENT_DURATION.VALUES);
  }
});
