const { faker } = require("@faker-js/faker");

const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: parseInt(faker.string.numeric()),
  };
};

module.exports = generateProducts;
