USE employeetracker_db;

INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES 
        ('Pat', 'dorgu', 1, null);
        ('Johh','john',2,null);
        ('jane','johnson',null);

INSERT INTO role (title, salary, department_id)
    VALUES
        ('student', 50000.00, 1);
        ('teacher',70000.00,2);
        ('Manager',100000,3);

INSERT INTO department (name)
    VALUES
        ('math'),
        ('bio'),
        ('History'),
