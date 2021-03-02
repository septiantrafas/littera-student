// Read more about faker here http://marak.github.io/faker.js/
const faker = require("faker");

const categories_count = 7;
const questions_count = 200;

let database = {
  categories: [],
  questions: [],
};

for (let i = 1; i <= categories_count; i++) {
  database.categories.push({
    id: i,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(4),
    start_time: faker.date.recent(),
    end_time: faker.date.soon(),
    createdAt: faker.date.recent(),
  });
}

for (let i = 1; i <= questions_count; i++) {
  database.questions.push({
    id: i,
    categoryId: faker.random.number({ max: 7 }),
    question: faker.lorem.paragraph(),
    answer: [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
    ],
    createdAt: faker.date.recent(),
  });
}

console.log(JSON.stringify(database));
