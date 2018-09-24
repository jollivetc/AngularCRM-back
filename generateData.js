var faker = require('faker/locale/fr');

var database = { consumers : [] };

for (var i=1; i<=200; i++) {
  database.consumers.push({
    id: i,
    civility: faker.random.arrayElement(["Mr", "Mme"]),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime()
  });
}

console.log(JSON.stringify(database));
