const { faker } = require("@faker-js/faker");

const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    stock: parseInt(faker.string.numeric()),
    description: faker.commerce.productDescription(),
  };
};

const generateUsers = () => {
  const numberOfProducts = parseInt(faker.string.numeric());
  let products = [];
  for (let i = 0; i < numberOfProducts; i++) {
    products.push(generateProducts());
  }

  return {
    id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    sex: faker.person.sex(),
    birthDate: faker.date.birthdate(),
    phone: faker.phone.number(),
    image: faker.image.avatar(),
    email: faker.internet.email(),
    products,
  };
};

module.exports = generateUsers;
