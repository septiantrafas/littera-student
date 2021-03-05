// Read more about faker here http://marak.github.io/faker.js/
const faker = require("faker");

let categories_count = 7;
let questions_count;

let database = {
  categories: [],
  questions: [],
  subquestions: [],
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

for (let i = 1; i <= categories_count; i++) {
  if (i === 1) {
    questions_count = 4;
  } else {
    questions_count = 40;
  }
  for (let j = 1; j <= questions_count; j++) {
    let answer = [];

    if (i !== 1) {
      answer = [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      ];
    }

    database.questions.push({
      id: j,
      categoryId: i,
      question: faker.lorem.paragraph(),
      answer: answer,
      createdAt: faker.date.recent(),
    });
  }
}

for (let i = 1; i <= 64; i++) {
  database.subquestions.push({
    id: i,
    questionId: (i % 4) + 1,
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
