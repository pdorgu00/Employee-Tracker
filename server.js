//finish update function
// fix add employye func
// text



// dependencies
let mysql = require("mysql");
let inquirer = require("inquirer");
const cTable = require('console.table');
// establish connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employeetracker_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    start();
});
// main prompt
const start = () => {
    inquirer
        .prompt({
            name: 'main',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Roles', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Roles', 'Quit']
        })
        .then(choice => {
            if (choice.main === 'View All Employees') {
                viewAllEmployees();
            } else if (choice.main === 'View All Employees By Department') {
                viewEmployeesByDepartment();
            } else if (choice.main === 'View All Employees By Roles') {
                viewEmployeesByRole();
            } else if (choice.main === 'View All Departments') {
                viewAllDepartments();
            } else if (choice.main === 'View All Roles') {
                viewAllRoles();
            } else if (choice.main === 'Add Employee') {
                addEmployee();
            } else if (choice.main === 'Add Department') {
                addDepartment();
            } else if (choice.main === 'Add Role') {
                addRole();
            } else if (choice.main === 'Update Employee Roles') {
                updateRole();
            } else if (choice.main === 'Quit') {
                connection.end();
            }
        })
}
// queries
const viewAllEmployees = () => {
    console.log('\n');
    let query = 'SELECT e.id AS ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Role, d.name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e ';
    query += 'LEFT JOIN employee m ON e.manager_id = m.id ';
    query += 'INNER JOIN role r ON e.role_id = r.id ';
    query += 'INNER JOIN department d ON r.department_id = d.id ';
    query += 'ORDER BY e.id';
    connection.query(
        query,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        })
};
const viewEmployeesByDepartment = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        inquirer.prompt({
            name: 'eByD',
            type: 'list',
            message: 'Which department would you like to view?',
            choices: res
        })
            .then(choice => {
                let query = 'SELECT e.id AS ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Role, d.name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e ';
                query += 'LEFT JOIN employee m ON e.manager_id = m.id ';
                query += 'INNER JOIN role r ON e.role_id = r.id ';
                query += 'INNER JOIN department d ON r.department_id = d.id ';
                query += 'WHERE ? ORDER BY e.id';
                connection.query(query,
                    {
                        name: choice.eByD
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
            })
    })
}
const viewEmployeesByRole = () => {
    connection.query('SELECT title FROM role', (err, res) => {
        let arr = [];
        res.forEach(i => arr.push(i.title));
        if (err) throw err;
        inquirer.prompt({
            name: 'eByR',
            type: 'list',
            message: 'Which role would you like to view?',
            choices: arr
        })
            .then(choice => {
                let query = 'SELECT e.id AS ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Role, d.name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e ';
                query += 'LEFT JOIN employee m ON e.manager_id = m.id ';
                query += 'INNER JOIN role r ON e.role_id = r.id ';
                query += 'INNER JOIN department d ON r.department_id = d.id ';
                query += 'WHERE ? ORDER BY e.id';
                connection.query(query,
                    {
                        title: choice.eByR
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        start();
                    })
            })
    })
}
const viewAllDepartments = () => {
    connection.query('SELECT name AS Department FROM department',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        })
}
const viewAllRoles = () => {
    connection.query('SELECT title AS Role, salary AS Salary FROM role',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        })
}
const addEmployee = () => {
    let roles = [];
    let mgrs = ['No Manager'];
    connection.query('SELECT title FROM role',
        (err, res) => {
            if (err) throw err;
            res.forEach(i => roles.push(i.title));
        });
    connection.query('SELECT first_name, last_name FROM employee',
        (err, res) => {
            if (err) throw err;
            res.forEach(i => {
                let mgr = i.first_name.concat(' ', i.last_name)
                mgrs.push(mgr)
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
            choices: roles
        },
        {
            name: 'mgr',
            type: 'list',
            message: "Who is this employee's manager?",
            choices: mgrs
        }])
        .then(ans => {
            connection.query('SELECT id FROM role WHERE ?',
                {
                    title: ans.role
                },
                (err, res) => {
                    if (err) throw err;
                    let roleId = res[0].id;
                    let mgr = ans.mgr.split(' ');
                    let mgrId;
                    connection.query('SELECT id FROM employee WHERE ? AND ?',
                        [{
                            first_name: mgr[0]
                        },
                        {
                            last_name: mgr[1]
                        }],
                        (err, res) => {
                            if (err) throw err;
                            if (ans.mgr == 'No Manager') {
                                mgrId = null;
                            } else {
                                mgrId = res[0].id;
                            }
                            connection.query('INSERT INTO employee SET ?',
                                {
                                    first_name: ans.firstName.trim(),
                                    last_name: ans.lastName.trim(),
                                    role_id: roleId,
                                    manager_id: mgrId
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    start();
                                }
                            )
                        }
                    )
                })
        })
}
const addDepartment = () => {
    inquirer.prompt({
        name: 'nDep',
        type: 'input',
        message: 'What is the name of the new department?'
    })
        .then(ans => {
            connection.query('INSERT INTO department SET ?',
                {
                    name: ans.nDep
                },
                (err, res) => {
                    if (err) throw err;
                    start();
                })
        })
}
const addRole = () => {
    connection.query('SELECT * FROM department',
        (err, res) => {
            if (err) throw err;
            let current = [];
            res.forEach(i => current.push(i))
            inquirer.prompt([
                {
                    name: 'nTitle',
                    type: 'input',
                    message: 'What is the title of this new role?'
                },
                {
                    name: 'nSal',
                    type: 'number',
                    message: "What is this new role's salary?"
                },
                {
                    name: 'dep',
                    type: 'list',
                    message: 'Which department does this new role belong to?',
                    choices: current
                }
            ])
                .then(ans => {
                    let depId;
                    current.forEach(i => {
                        if (ans.dep === i.name) {
                            depId = i.id
                        }
                    });
                    connection.query('INSERT INTO role SET ?',
                        {
                            title: ans.nTitle,
                            salary: ans.nSal,
                            department_id: depId
                        },
                        (err, res) => {
                            if (err) throw err;
                            start();
                        })
                })
        })
}
const updateRole = () => {
    let employees = [];
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        res.forEach(i => {
            let list = i.first_name.concat(' ', i.last_name)
            employees.push(list);
        })
        roleP(employees);
    })
    const roleP = employees => {
        inquirer.prompt(
            {
                name: 'uRole',
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: employees
            })
            .then(ans => {
                let picked = ans.uRole.split(' ');
                let titleArr = [];
                connection.query('SELECT * FROM role',
                    (err, res) => {
                        if (err) throw err;
                        res.forEach(x => {
                            let titles = x.title;
                            titleArr.push(titles);
                        })
                        roleU(picked, titleArr, res);
                    })
            })
    }
    const roleU = (picked, titleArr, roles) => {
        inquirer.prompt({
            name: 'nRole',
            type: 'list',
            message: "What is this employee's new role?",
            choices: titleArr
        })
            .then(ans => {
                let roleId;
                roles.forEach(c => {
                    if (ans.nRole === c.title) {
                        roleId = c.id;
                    }
                })
                connection.query('UPDATE employee SET ? WHERE ? AND ?',
                    [{
                        role_id: roleId
                    },
                    {
                        first_name: picked[0]
                    },
                    {
                        last_name: picked[1]
                    }],
                    (err, res) => {
                        if (err) throw err;
                        start();
                    })
            })
    }
}