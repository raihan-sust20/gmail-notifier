import { faker } from '@faker-js/faker';

export const emailQueryParamDbResult1 = [
  {
    id: faker.number.int(),

    address: faker.internet.email(),

    name: faker.company.name(),

    qQuery: faker.commerce.price(),

    lastExecuted: faker.date.past(),

    dateCreated: faker.date.past(),

    dateUpdated: faker.date.past(),
  },
];
