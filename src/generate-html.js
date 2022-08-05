//gets the third "unique" attribute for each employee type (office#,school,github)
const uniqueGetter = function (employee) {
  const role = employee.getRole();
  switch (role) {
    case "Manager":
      return `Office number: ${employee.officeNumber}`;
    case "Engineer":
      return `GitHub: <a href='https://github.com/${employee.github}' target='_blank'>${employee.github}</a>`;
    case "Intern":
      return `School: ${employee.school}`;
  }
};
//creates the employee cards
function generateCards(data) {
  //map+join to return a block of html for however many employees we have
  return data
    .map((employee) => {
      const { name, id, email } = employee;
      const role = employee.getRole();
      //get unique attribute html
      const unique = uniqueGetter(employee);
      return `
      <div class="card m-3" style="width: 15rem">
        <div class="card-header text-bg-primary">
          <h5 class="card-title">${name}</h5>
          <h6 class="card-text">${role}</h6>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">ID: ${id}</li>
          <li class="list-group-item">
            Email: <a href="mailto:${email}">${email}</a>
          </li>
          <li class="list-group-item">${unique}</li>
        </ul>
      </div>
      `;
    })
    .join("");
}

module.exports = (employeeData) => {
  const cards = generateCards(employeeData);
  //this is essentially a template function, all the processing happens in generateCards()
  return `
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Team Profile</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
      crossorigin="anonymous"
    />
  </head>
  <body>
    <header class="bg-danger d-flex justify-content-center">
      <h1 class="text-light m-3">My Team</h1>
    </header>
    <main class="m-3 d-flex flex-wrap justify-content-center">
      ${cards}
    </main>
  </body>
</html>

 `;
};
