// Read more about faker here http://marak.github.io/faker.js/
const faker = require("faker");
const dayjs = require("dayjs");

const recent_date = dayjs();
const soon_date = (date) => {
  return date.add(1, "minute");
};

let categories_count = 7;
let questions_count;

let database = {
  categories: [],
  questions: [],
  subquestions: [],
};

let get_recent_soon_date = recent_date;
for (let i = 1; i <= categories_count; i++) {
  const end_time = soon_date(get_recent_soon_date);
  get_recent_soon_date = end_time;

  database.categories.push({
    id: i,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(4),
    start_time: recent_date,
    end_time: end_time,
    createdAt: recent_date,
  });
}

for (let i = 1; i <= categories_count; i++) {
  if (i === 1) {
    questions_count = 4;
  } else {
    questions_count = 40;
  }

  let recent = recent_date;
  for (let j = 1; j <= questions_count; j++) {
    let answer = [];
    let question = faker.lorem.paragraph();
    let instruction_time = soon_date(recent);
    let start_time = soon_date(instruction_time);
    let end_time = soon_date(start_time);

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
        createdAt: recent_date,
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
    createdAt: recent_date,
  });
}

console.log(JSON.stringify(database));
