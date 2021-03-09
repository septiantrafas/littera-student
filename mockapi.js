// Read more about faker here http://marak.github.io/faker.js/
const faker = require("faker");
const dayjs = require("dayjs");

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
    let question = faker.lorem.paragraph();
    let instruction_time = faker.date.soon();
    let start_time = faker.date.recent();
    let end_time = faker.date.soon();

    const questions = () => {
      let subquestion_case = {
        instruction_time: instruction_time,
        start_time: start_time,
        end_time: end_time,
        answer: answer,
      };

      if (i !== 1) {
        subquestion_case = {
          instruction_time: null,
          start_time: null,
          end_time: null,
          answer: [
            faker.lorem.sentence(),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
          ],
        };
      }

      return {
        id: j,
        categoryId: i,
        question: question,
        ...subquestion_case,
        createdAt: faker.date.recent(),
      };
    };

    database.questions.push(questions());
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
