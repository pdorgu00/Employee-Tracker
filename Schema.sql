
DROP DATABASE IF EXISTS jobs_db;
CREATE DATABASE jobs_db;
USE jobs_db;

CREATE employee (
id INT PRIMARY KEY
  first_name varchar(30),
  last_name varchar(30),
  role_id INTEGER,
  manager_id INTEGER, auto_increment not null
  

);

CREATE role(
id INT PRIMARY KEY
  title varchar (30),
  salary decimal(10,2) NULL,
  department_id integer, auto_increment not null
  
);

CREATE department (
    id INT PRIMARY KEY
  name varchar (30), auto_increment not null
  
  
);

SELECT * FROM employee;
SELECT * FROM role;
=======
DROP DATABASE IF EXISTS jobs_db;
CREATE DATABASE jobs_db;
USE jobs_db;

CREATE employee (
id INT PRIMARY KEY
  first_name varchar(30),
  last_name varchar(30),
  role_id INTEGER,
  manager_id INTEGER, auto_increment not null
  

);

CREATE role(
id INT PRIMARY KEY
  title varchar (30),
  salary decimal(10,2) NULL,
  department_id integer, auto_increment not null
  
);

CREATE department (
    id INT PRIMARY KEY
  name varchar (30), auto_increment not null
  
  
);

SELECT * FROM employee;
SELECT * FROM role;
>>>>>>> 8c46e2015369fd598ebc4c059a1bbbf9ea67f80c
=======
DROP DATABASE IF EXISTS jobs_db;
CREATE DATABASE jobs_db;
USE jobs_db;

CREATE employee (
id INT PRIMARY KEY
  first_name varchar(30),
  last_name varchar(30),
  role_id INTEGER,
  manager_id INTEGER, auto_increment not null
  

);

CREATE role(
id INT PRIMARY KEY
  title varchar (30),
  salary decimal(10,2) NULL,
  department_id integer, auto_increment not null
  
);

CREATE department (
    id INT PRIMARY KEY
  name varchar (30), auto_increment not null
  
  
);

SELECT * FROM employee;
SELECT * FROM role;

SELECT * FROM department;