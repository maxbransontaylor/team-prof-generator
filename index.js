const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const generatePage = require("./src/generate-html");
const inquirer = require("inquirer");

function promptManager() {
  return inquirer
    .prompt([
      { type: "input", name: "name", message: "What is your manager's name?" },
      {
        type: "input",
        name: "id",
        message: "What is your manager's employee id?",
      },
      {
        type: "input",
        name: "email",
        message: "What is your manager's email?",
      },
      {
        type: "input",
        name: "office",
        message: "what is your manager's office number?",
      },
    ])
    .then((answers) => {
      const { name, id, email, office } = answers;
      return [new Manager(name, id, email, office)];
    });
}
function promptEmployees(employeeList) {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What role is this employee?",
        choices: ["Intern", "Engineer"],
      },
      { type: "input", name: "name", message: "What is your employee's name?" },
      {
        type: "input",
        name: "id",
        message: "What is your employee's id?",
      },
      {
        type: "input",
        name: "email",
        message: "What is your employee's email?",
      },
      {
        type: "input",
        name: "github",
        message: "What is your engineer's GitHub username?",
        when: function (answers) {
          return answers.role === "Engineer";
        },
      },
      {
        type: "input",
        name: "school",
        message: "What is your intern's current school?",
        when: function (answers) {
          return answers.role === "Intern";
        },
      },
      {
        type: "confirm",
        name: "another",
        message: "Add another employee?",
        default: false,
      },
    ])
    .then((answers) => {
      const { role, name, id, email, github, school, another } = answers;
      if (role === "Intern") {
        employeeList.push(new Intern(name, id, email, school));
      } else {
        employeeList.push(new Engineer(name, id, email, github));
      }
      return another ? promptEmployees(employeeList) : employeeList;
    });
}
promptManager()
  .then((results) => promptEmployees(results))
  .then((list) => console.log(list));
