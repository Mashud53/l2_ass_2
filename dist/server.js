

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/config/env.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connectionString: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET
};
var env_default = config;

// src/db/index.ts
import { Pool } from "pg";
var pool = new Pool({
  connectionString: env_default.connectionString
});
var initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT ,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS issues(
        id SERIAL PRIMARY KEY,
        title TEXT,
        description TEXT,
        type VARCHAR(20),
        status VARCHAR(20),
        reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()

        )
        `
    );
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};

// src/app.ts
import express from "express";

// src/modules/users/user.route.ts
import { Router } from "express";

// src/modules/users/user.service.ts
import bcrypt from "bcryptjs";
var createUserIntoDB = async (payLoad) => {
  const { name, email, password, role } = payLoad;
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);
  const result = await pool.query(
    `
    INSERT INTO users (name,email,password,role) 
    VALUES($1,$2,$3, COALESCE($4, 'contributor'))
    
    RETURNING name,email,role
    `,
    [name, email, hashPassword, role]
  );
  return result;
};
var getAlluserFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users
      `);
  delete result.rows[0].password;
  return result;
};
var getSingleuserFromDB = async (id) => {
  const result = await pool.query(`
      SELECT * FROM users WHERE id=$1
      `, [id]);
  delete result.rows[0].password;
  return result;
};
var updateUserFromDB = async (payLoad, id) => {
  const { name, password, role } = payLoad;
  const result = await pool.query(`
      UPDATE users
      SET 
      name=COALESCE($1,name),password=COALESCE($2,password),role=COALESCE($3,role)
      WHERE id=$4 RETURNING name,email,role 
      `, [name, password, role, id]);
  return result;
};
var deleteUserFromDB = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id=$1
      `,
    [id]
  );
  return result;
};
var userService = {
  createUserIntoDB,
  getAlluserFromDB,
  getSingleuserFromDB,
  updateUserFromDB,
  deleteUserFromDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var sendResponse_default = sendResponse;

// src/modules/users/user.controller.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllUser = async (req, res) => {
  try {
    const result = await userService.getAlluserFromDB();
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Users retrived successfully!",
      data: result.rows
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleuserFromDB(id);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found!",
        data: {}
      });
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Users retrived successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserFromDB(req.body, id);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: {}
      });
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Users updated successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id);
    if (result.rowCount === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: {}
      });
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully!",
      data: {}
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
};

// src/modules/users/user.route.ts
var router = Router();
router.post("/", userController.createUser);
router.get("/", userController.getAllUser);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
var userRoute = router;

// src/modules/issues/issues.route.ts
import { Router as Router2 } from "express";

// src/modules/issues/issues.service.ts
var createIssueIntoDB = async (payLoad) => {
  const { title, description, type, status, reporter_id } = payLoad;
  const user = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `, [reporter_id]);
  if (user.rows.length === 0) {
    throw new Error("user not exists");
  }
  const result = pool.query(`
            INSERT INTO issues(title, description, type, status, reporter_id
            ) 
            VALUES($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *
            `, [title, description, type, status, reporter_id]);
  return result;
};
var getAllissuesFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM issues;
      `);
  return result;
};
var getSinlgeissueFromDB = async (id) => {
  const result = await pool.query(`
    SELECT * FROM issues
    WHERE id=$1
    `, [id]);
  return result;
};
var updateIssuesIntoDB = async (payLoad, id) => {
  const { title, description, type, status } = payLoad;
  const result = await pool.query(`
        UPDATE issues
        SET 
        title=COALESCE($1,title),description=COALESCE($2,description), type= COALESCE($3,type), status= COALESCE($4,status)
        WHERE id=$5
        RETURNING *

        `, [title, description, type, status, id]);
  return result;
};
var deleteIssueFromDb = async (id) => {
  const result = await pool.query(`
        DELETE FROM issues
        WHERE id=$1
        `, [id]);
  return result;
};
var IssueService = {
  createIssueIntoDB,
  getAllissuesFromDB,
  getSinlgeissueFromDB,
  updateIssuesIntoDB,
  deleteIssueFromDb
};

// src/modules/issues/issues.controller.ts
var createIssue = async (req, res) => {
  try {
    const result = await IssueService.createIssueIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const result = await IssueService.getAllissuesFromDB();
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue retrive successfully!",
      data: result.rows
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await IssueService.getSinlgeissueFromDB(id);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: {}
      });
    }
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue retrive successfully!",
      data: result.rows
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var updateIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await IssueService.updateIssuesIntoDB(req.body, id);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue update successfully!",
      data: result.rows
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await IssueService.deleteIssueFromDb(id);
    if (result.rowCount === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: {}
      });
    }
    res.status(201).json({
      seccess: true,
      message: "Issue deleted successfully!",
      data: result.rows
    });
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue deleted successfully!",
      data: result.rows
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var issuController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized access!!"
        });
        return;
      }
      const decoded = jwt.verify(token, env_default.secret);
      const userData = await pool.query(`
                SELECT * FROM users WHERE email=$1
                `, [decoded.email]);
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "user not found"
        });
        return;
      }
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          messsage: "Forbidden!!"
        });
        return;
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
  };
};
var auth_default = auth;

// src/modules/issues/issues.route.ts
var router2 = Router2();
router2.post("/", auth_default("maintainer", "contributor"), issuController.createIssue);
router2.get("/", issuController.getAllIssues);
router2.get("/:id", issuController.getSingleIssue);
router2.put("/:id", auth_default("maintainer", "contributor"), issuController.updateIssue);
router2.delete("/:id", auth_default("maintainer"), issuController.deleteIssue);
var issueRoute = router2;

// src/modules/auth/auth.rout.ts
import { Router as Router3 } from "express";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
import jwt2 from "jsonwebtoken";
var signInUserIntoDB = async (payLoad) => {
  const { name, email, password, role } = payLoad;
  const hashPassword = await bcrypt2.hash(password, 10);
  console.log(hashPassword);
  const result = await pool.query(
    `
        INSERT INTO users (name,email,password,role) 
        VALUES($1,$2,$3, COALESCE($4, 'contributor'))
        
        RETURNING name,email,role
        `,
    [name, email, hashPassword, role]
  );
  return result;
};
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]);
  if (userData.rows.length === 0) {
    throw new Error("Ivalid Crendential!");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt2.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Crendential");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwt2.sign(
    jwtPayload,
    env_default.secret,
    { expiresIn: "1d" }
  );
  return { accessToken };
};
var authService = {
  signInUserIntoDB,
  loginUserIntoDB
};

// src/modules/auth/auth.controller.ts
var signInUser = async (req, res) => {
  try {
    const result = await authService.signInUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User Login successfully!",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var authController = {
  signInUser,
  loginUser
};

// src/modules/auth/auth.rout.ts
var router3 = Router3();
router3.post("/signin", authController.signInUser);
router3.post("/login", authController.loginUser);
var authRoute = router3;

// src/middleware/logger.ts
var logger = (req, res, next) => {
  next();
};
var logger_default = logger;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger_default);
app.get("/", (req, res) => {
  res.status(200).json({
    "message": "WELCOME TO DEV PULSE",
    "author": "DEV PULSE"
  });
});
app.use("/api/users", userRoute);
app.use("/api/issues", issueRoute);
app.use("/api/auth", authRoute);
var app_default = app;

// src/server.ts
var port = env_default.port;
var main = () => {
  initDB();
  app_default.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
main();
//# sourceMappingURL=server.js.map