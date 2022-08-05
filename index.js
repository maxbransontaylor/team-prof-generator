const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const generatePage = require("./src/generate-html");
const inquirer = require("inquirer");
const fs = require("fs");
const { validate } = require("@babel/types");

function promptManager() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is your manager's name?",
        validate: function (input) {
          if (input) {
            return true;
          }
          console.log("Please enter something!");
          return false;
        },
      },
      {
        type: "input",
        name: "id",
        message: "What is your manager's employee id?",
        validate: function (input) {
          if (input) {
            return true;
          }
          console.log("Please enter something!");
          return false;
        },
      },
      {
        type: "input",
        name: "email",
        message: "What is your manager's email?",
        validate: function (input) {
          if (input.includes("@")) {
            return true;
          }
          console.log("Please enter a valid email!");
          return false;
        },
      },
      {
        type: "input",
        name: "office",
        message: "what is your manager's office number?",
        validate: function (input) {
          if (input) {
            return true;
          }
          console.log("Please enter something!");
          return false;
        },
      },
    ])
    .then((answers) => {
      const { name, id, email, office } = answers;
      //return new manager in an array to make it easier to push to later
      return [new Manager(name, id, email, office)];
    });
}
//last minute function to fulfill 'menu' requirement
function bufferFunction(managerdata) {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "finish",
        message: "Would you like to:",
        choices: ["Enter a new employee's information", "Finish building team"],
      },
    ])
    .then((answer) => {
      if (answer.finish === "Finish building team") {
        return [managerdata, false];
      } else {
        return [managerdata, true];
      }
    });
}
function promptEmployees(employeeList) {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What role is this employee?",
        choices: ["Engineer", "Intern"],
      },
      { type: "input", name: "name", message: "What is your employee's name?" },
      {
        type: "input",
        name: "id",
        message: "What is your employee's id?",
        validate: function (input) {
          if (input) {
            return true;
          }
          console.log("Please enter something!");
          return false;
        },
      },
      {
        type: "input",
        name: "email",
        message: "What is your employee's email?",
        validate: function (input) {
          if (input.includes("@")) {
            return true;
          }
          console.log("Please enter a valid email!");
          return false;
        },
      },
      {
        type: "input",
        name: "github",
        message: "What is your engineer's GitHub username?",
        //only asks for engineer
        when: function (answers) {
          return answers.role === "Engineer";
        },
        validate: function (input) {
          if (input) {
            return true;
          }
          console.log("Please enter something!");
          return false;
        },
      },
      {
        type: "input",
        name: "school",
        message: "What is your intern's current school?",
        //only asks for intern
        when: function (answers) {
          return answers.role === "Intern";
        },
        validate: function (input) {
          if (input) {
            return true;
          }
          console.log("Please enter something!");
          return false;
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
      //push new engineer or intern depending on preferences
      if (role === "Intern") {
        employeeList.push(new Intern(name, id, email, school));
      } else {
        employeeList.push(new Engineer(name, id, email, github));
      }
      //sends user back through the add employee questions or returns employee list
      return another ? promptEmployees(employeeList) : employeeList;
    });
}
//promptManager, then prompt employees, since having a manager is required
promptManager()
  .then((manager) => bufferFunction(manager))
  // confusing code to check if user wants to make a webpage with just the manager info
  .then((checkforadd) => {
    return checkforadd[1] ? promptEmployees(checkforadd[0]) : checkforadd[0];
  })
  .then((data) => generatePage(data))
  .then((html) =>
    fs.writeFile("./dist/index.html", html, (err) => {
      if (err) {
        throw err;
      }
      console.log(
        "file written! check the 'dist' folder for your 'index.html' file."
      );
    })
  );
