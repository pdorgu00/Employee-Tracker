//finish update function
// fix add employye func
// text



// dependencies
let mysql = require("mysql");
let inquirer = require("inquirer");
const cTable = require('console.table');

var express = require('express');
var app = express();



// establish connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "jobs_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    run();
});
// main prompt
const run = () => {
    inquirer
        .prompt({
            name: 'current',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 
                       'View All Employees By Department', 
                       'View All Employees By Roles', 
                       'View All Departments', 
                       'View All Roles', 
                       'Add Employee', 
                       
                      , ]
        })
        .then(view => {
            switch (view.current) {
              case 'View All Employees':
                AllEmployees();
                break;
            case 'View All Employees By Roles':
                EmployeesByRole();
                break;
            case 'View All Roles':
                AllRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'View All Employees By Department' :
                EmployeesByDepartment();
                break;    
            case 'View All Departments':
                AllDepartments();
                break;    
            case 'Add Department':
                addDepartment();
                break;
          
           
            }

// queries
const AllEmployees = () => {
    
    let query = 'SELECT e.id AS ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Role, d.name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e ';
    query += 'INNER JOIN role r ON e.role_id = r.id ';
    query += 'LEFT JOIN employee m ON e.manager_id = m.id ';
    query += 'ORDER BY e.id';
    query += 'INNER JOIN department d ON r.department_id = d.id ';
    connection.query(
        query,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            run();
        })
};
const EmployeesByDepartment = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        inquirer.prompt({
            name: 'employeeByDepartment',
            type: 'list',
            message: 'Choose a department',
            choices: res
        })
            .then(choice => {
                let query = 'SELECT e.id AS ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Role, d.name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e ';
                query += 'INNER JOIN department d ON r.department_id = d.id ';
                query += 'LEFT JOIN employee m ON e.manager_id = m.id ';
                query += 'INNER JOIN role r ON e.role_id = r.id ';
                query += 'WHERE ? ORDER BY e.id';
              
                connection.query(query,
                    {
                        name: choice.employeeByDepartment
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        run();
                    })
            })
    })
}
const EmployeesByRole = () => {
    connection.query('SELECT title FROM role', (err, res) => {
        let arr = [];
        res.forEach(i => arr.push(i.title));
        if (err) throw err;
        inquirer.prompt({
            name: 'employeebyrole',
            type: 'list',
            message: 'Whats role of employee you would you like to view?',
            choices: arr
        })
            .then(choice => {
                let query = 'SELECT e.id AS ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Role, d.name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e ';
                query += 'WHERE ? ORDER BY e.id';
                query += 'LEFT JOIN employee m ON e.manager_id = m.id ';
                query += 'INNER JOIN department d ON r.department_id = d.id ';

                query += 'INNER JOIN role r ON e.role_id = r.id ';
                
                
                connection.query(query,
                    {
                        title: choice.employeebyrole
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        run();
                    })
            })
    })
}

const AllRoles = () => {
    connection.query('SELECT title AS Role, salary AS Salary FROM role',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            run();
        })
}






const AllDepartments = () => {
    connection.query('SELECT name AS Department FROM department',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            run();
        })
}


const addEmployee = () => {
  let employeeroles = [];
  let managers = [''];
  connection.query('SELECT title FROM role',
      (err, res) => {
          if (err) throw err;
          res.forEach(i => employeeroles.push(i.title));
      });
  connection.query('SELECT first_name, last_name FROM employee',
      (err, res) => {
          if (err) throw err;
          res.forEach(i => {
              let manager = i.first_name
              managers.push(manager)
          })
      });

    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the employee's first name?"
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the emplyee's last name?"
        },
        {
            name: 'role',
            type: 'list',
            message: "What is the employee's role?",
            choices: employeeroles
        },
        {
            name: 'manager',
            type: 'list',
            message: "Who is this employee's manager?",
            choices: managers
        }])
        .then(entry => {
            connection.query('SELECT id FROM role WHERE ?',
                {
                    title: entry.employeerole
                },
                (err, res) => {
                    if (err) throw err;
                    let employeeroleId = res[0].id;
                    let mgrs = entry.managers;
                    let managerId;
                    connection.query('SELECT id FROM employee WHERE ? AND ?',
                        [{
                            first_name: mgrs[0]
                        },
                        {
                            last_name: mgrs[1]
                        }],
                        (err, res) => {
                            if (err) throw err;
                            switch (entry.manager) { 
                              case'No Manager':
                                managerId = null;
                                break;
                            default:
                                managerId = res[0].id;
                                break;
                            }
                            connection.query('INSERT INTO employee SET ?',
                                {
                                    first_name: entry.firstName,
                                    last_name: entry.lastName,
                                    role_id: employeeroleId,
                                    manager_id: managerId
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.table(res);
                                  
                                    run();
                                }
                            )
                        }
                    )
                })
        })

            }
            const addDepartment = () => {
              inquirer.prompt({
                  name: 'adddepartments',
                  type: 'input',
                  message: 'Name of the new department?'
              })
                  .then(entry => {
                      connection.query('INSERT INTO department SET ?',
                          {
                              name: entry.adddepartments
                          },
                          (err, res) => {
                              if (err) throw err;
                              run();
                          })
                  })
          }


          })}

