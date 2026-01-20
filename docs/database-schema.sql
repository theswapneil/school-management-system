// MongoDB Schema Documentation
// School Management System Database Collections

// ============================================================================
// USERS Collection
// ============================================================================
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "firstName", "lastName", "role"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { 
          bsonType: "string",
          description: "User email (unique, lowercase)"
        },
        password: { 
          bsonType: "string",
          description: "Hashed password (bcrypt)"
        },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        role: { 
          enum: ["admin", "teacher", "student", "parent"],
          description: "User role"
        },
        phone: { bsonType: "string" },
        address: { bsonType: "string" },
        isActive: { 
          bsonType: "bool",
          description: "Account status"
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true });

// ============================================================================
// CLASSES Collection
// ============================================================================
db.createCollection("classes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "grade"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { 
          bsonType: "string",
          description: "Class name"
        },
        section: { bsonType: "string" },
        grade: { 
          bsonType: "string",
          description: "Grade/Standard"
        },
        classTeacherId: { 
          bsonType: "objectId",
          description: "Reference to User (Teacher)"
        },
        academicYear: { bsonType: "string" },
        capacity: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.classes.createIndex({ classTeacherId: 1 });

// ============================================================================
// STUDENTS Collection
// ============================================================================
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "registrationNumber", "classId"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { 
          bsonType: "objectId",
          description: "Reference to User (Student)"
        },
        registrationNumber: { 
          bsonType: "string",
          description: "Unique registration number"
        },
        classId: { 
          bsonType: "objectId",
          description: "Reference to Class"
        },
        parentId: { 
          bsonType: "objectId",
          description: "Reference to User (Parent)"
        },
        dateOfBirth: { bsonType: "date" },
        enrollmentDate: { bsonType: "date" },
        status: { 
          enum: ["active", "inactive", "graduated"],
          description: "Student status"
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.students.createIndex({ registrationNumber: 1 }, { unique: true });
db.students.createIndex({ userId: 1 }, { unique: true });
db.students.createIndex({ classId: 1 });
db.students.createIndex({ parentId: 1 });
db.students.createIndex({ status: 1 });

// ============================================================================
// ATTENDANCE Collection
// ============================================================================
db.createCollection("attendances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["studentId", "attendanceDate", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        studentId: { 
          bsonType: "objectId",
          description: "Reference to Student"
        },
        attendanceDate: { 
          bsonType: "date",
          description: "Date of attendance"
        },
        status: { 
          enum: ["present", "absent", "late", "excused"],
          description: "Attendance status"
        },
        remarks: { bsonType: "string" },
        recordedBy: { 
          bsonType: "objectId",
          description: "Reference to User (Teacher)"
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.attendances.createIndex({ studentId: 1, attendanceDate: 1 }, { unique: true });
db.attendances.createIndex({ attendanceDate: 1 });
db.attendances.createIndex({ status: 1 });

// ============================================================================
// FEE_TRANSACTIONS Collection
// ============================================================================
db.createCollection("feetransactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["studentId", "academicYear", "feeType", "amount"],
      properties: {
        _id: { bsonType: "objectId" },
        studentId: { 
          bsonType: "objectId",
          description: "Reference to Student"
        },
        academicYear: { 
          bsonType: "string",
          description: "Academic year (e.g., 2025-2026)"
        },
        feeType: { 
          bsonType: "string",
          description: "Type of fee"
        },
        amount: { 
          bsonType: "double",
          description: "Fee amount"
        },
        status: { 
          enum: ["pending", "partial", "paid"],
          description: "Payment status"
        },
        dueDate: { bsonType: "date" },
        paidDate: { bsonType: "date" },
        remarks: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.feetransactions.createIndex({ studentId: 1 });
db.feetransactions.createIndex({ academicYear: 1 });
db.feetransactions.createIndex({ status: 1 });

// ============================================================================
// Sample Data (Optional - for testing)
// ============================================================================

// Create sample users
db.users.insertMany([
  {
    email: "admin@school.com",
    password: "$2a$10$K9nL4pW3J5bVzC2R6sQ1JO9X8mK5L3pV2qR1T0sN8vX5wY6aZ7bC", // hashed: password
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    phone: "1234567890",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "teacher@school.com",
    password: "$2a$10$K9nL4pW3J5bVzC2R6sQ1JO9X8mK5L3pV2qR1T0sN8vX5wY6aZ7bC",
    firstName: "John",
    lastName: "Teacher",
    role: "teacher",
    phone: "1234567891",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "parent@school.com",
    password: "$2a$10$K9nL4pW3J5bVzC2R6sQ1JO9X8mK5L3pV2qR1T0sN8vX5wY6aZ7bC",
    firstName: "Jane",
    lastName: "Parent",
    role: "parent",
    phone: "1234567892",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ============================================================================
// MongoDB Connection String Format
// ============================================================================
// Development: mongodb://localhost:27017/school_management
// With Authentication: mongodb://username:password@host:port/school_management
// MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/school_management?retryWrites=true&w=majority

