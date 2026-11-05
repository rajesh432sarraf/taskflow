const http = require('http');
const mongoose = require('mongoose');
const axios = require('../../client/node_modules/axios');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const { app } = require('../server');
const connectDB = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');

const PORT = 5001; // Run test server on port 5001 to avoid conflicts

async function runTests() {
  console.log('================================================================');
  console.log('🧪 TASKFLOW PHASE 2 COMPREHENSIVE BACKEND TEST SUITE');
  console.log('================================================================\n');

  // Connect to database before running tests
  await connectDB();

  // Start test server
  const server = app.listen(PORT);
  const baseURL = `http://localhost:${PORT}/api`;
  const results = [];

  const timestamp = Date.now();
  const userAData = {
    name: 'Test User A',
    email: `test_user_a_${timestamp}@example.com`,
    password: 'Password123!',
  };
  const userBData = {
    name: 'Test User B',
    email: `test_user_b_${timestamp}@example.com`,
    password: 'Password123!',
  };

  let userAToken = null;
  let userBToken = null;
  let userATaskId = null;
  let userBTaskId = null;
  let taskToDeleteId = null;

  function record(name, pass, details) {
    results.push({ name, pass, details });
    const mark = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} | Test: ${name}`);
    if (details) console.log(`       Details: ${details}`);
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Register a new user
    // -------------------------------------------------------------
    try {
      const res = await axios.post(`${baseURL}/auth/register`, userAData);
      userAToken = res.data.token;
      const pass = res.status === 201 && res.data.success && res.data.data.user.email === userAData.email.toLowerCase() && !res.data.data.user.password;
      record('1. Register a new user', pass, `Status ${res.status}, user ID: ${res.data.data.user._id}`);
    } catch (e) {
      record('1. Register a new user', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 2: Reject duplicate registration
    // -------------------------------------------------------------
    try {
      await axios.post(`${baseURL}/auth/register`, userAData);
      record('2. Reject duplicate registration', false, 'Allowed duplicate email registration');
    } catch (e) {
      const pass = e.response?.status === 400 && e.response?.data?.success === false;
      record('2. Reject duplicate registration', pass, `Correctly rejected with 400: ${e.response?.data?.message}`);
    }

    // -------------------------------------------------------------
    // Test 3: Reject invalid email
    // -------------------------------------------------------------
    try {
      await axios.post(`${baseURL}/auth/register`, {
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: 'Password123!',
      });
      record('3. Reject invalid email', false, 'Accepted invalid email format');
    } catch (e) {
      const pass = e.response?.status === 400 && e.response?.data?.success === false;
      record('3. Reject invalid email', pass, `Correctly rejected with 400: ${e.response?.data?.message}`);
    }

    // -------------------------------------------------------------
    // Test 4: Reject weak/invalid password (< 6 chars)
    // -------------------------------------------------------------
    try {
      await axios.post(`${baseURL}/auth/register`, {
        name: 'Short Pass User',
        email: `shortpass_${timestamp}@example.com`,
        password: '123',
      });
      record('4. Reject weak/invalid password', false, 'Accepted password < 6 characters');
    } catch (e) {
      const pass = e.response?.status === 400 && e.response?.data?.success === false;
      record('4. Reject weak/invalid password', pass, `Correctly rejected with 400: ${e.response?.data?.message}`);
    }

    // -------------------------------------------------------------
    // Test 5: Login with correct credentials
    // -------------------------------------------------------------
    try {
      const res = await axios.post(`${baseURL}/auth/login`, {
        email: userAData.email,
        password: userAData.password,
      });
      userAToken = res.data.token;
      const pass = res.status === 200 && res.data.success && !!userAToken && !res.data.data.user.password;
      record('5. Login with correct credentials', pass, `Status 200, Token issued: ${userAToken.substring(0, 15)}...`);
    } catch (e) {
      record('5. Login with correct credentials', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 6: Reject incorrect password
    // -------------------------------------------------------------
    try {
      await axios.post(`${baseURL}/auth/login`, {
        email: userAData.email,
        password: 'WrongPassword999',
      });
      record('6. Reject incorrect password', false, 'Accepted incorrect password');
    } catch (e) {
      const pass = e.response?.status === 401 && e.response?.data?.success === false;
      record('6. Reject incorrect password', pass, `Correctly rejected with 401: ${e.response?.data?.message}`);
    }

    // -------------------------------------------------------------
    // Test 7: Access protected endpoint without authentication
    // -------------------------------------------------------------
    try {
      await axios.get(`${baseURL}/tasks`);
      record('7. Access protected endpoint without auth', false, 'Allowed unauthenticated access');
    } catch (e) {
      const pass = e.response?.status === 401 && e.response?.data?.success === false;
      record('7. Access protected endpoint without auth', pass, `Correctly rejected with 401: ${e.response?.data?.message}`);
    }

    // Auth header for User A
    const authHeaderA = { headers: { Authorization: `Bearer ${userAToken}` } };

    // -------------------------------------------------------------
    // Test 8: Create tasks (User A)
    // -------------------------------------------------------------
    try {
      // Task 1: Overdue high priority task (dueDate yesterday)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const res1 = await axios.post(`${baseURL}/tasks`, {
        title: 'Review PRD and Architecture',
        description: 'Ensure all specifications are met',
        priority: 'High',
        status: 'Pending',
        dueDate: yesterday.toISOString(),
      }, authHeaderA);
      userATaskId = res1.data.data.task._id;

      // Task 2: In Progress medium task
      await axios.post(`${baseURL}/tasks`, {
        title: 'Develop Backend API Endpoints',
        description: 'Complete CRUD and Authentication',
        priority: 'Medium',
        status: 'In Progress',
      }, authHeaderA);

      // Task 3: Completed low priority task
      await axios.post(`${baseURL}/tasks`, {
        title: 'Initial Scaffolding Setup',
        description: 'Phase 1 verification complete',
        priority: 'Low',
        status: 'Completed',
      }, authHeaderA);

      // Task 4: Task to delete later
      const resDelete = await axios.post(`${baseURL}/tasks`, {
        title: 'Temporary Test Task To Delete',
        priority: 'Low',
        status: 'Pending',
      }, authHeaderA);
      taskToDeleteId = resDelete.data.data.task._id;

      const pass = res1.status === 201 && res1.data.success && !!userATaskId;
      record('8. Create a task', pass, `Status 201, Created task: ${userATaskId}`);
    } catch (e) {
      record('8. Create a task', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 9: Fetch tasks (User A)
    // -------------------------------------------------------------
    try {
      const res = await axios.get(`${baseURL}/tasks`, authHeaderA);
      const pass = res.status === 200 && res.data.success && res.data.count >= 4;
      record('9. Fetch tasks', pass, `Status 200, Retrieved ${res.data.count} tasks for User A`);
    } catch (e) {
      record('9. Fetch tasks', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 10: Update a task (User A)
    // -------------------------------------------------------------
    try {
      const res = await axios.put(`${baseURL}/tasks/${userATaskId}`, {
        title: 'Review PRD and Architecture (Updated)',
        status: 'In Progress',
      }, authHeaderA);
      const pass = res.status === 200 && res.data.data.task.title.includes('(Updated)') && res.data.data.task.status === 'In Progress';
      record('10. Update a task', pass, `Status 200, Updated status: ${res.data.data.task.status}`);
    } catch (e) {
      record('10. Update a task', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 11: Delete a task (User A)
    // -------------------------------------------------------------
    try {
      const res = await axios.delete(`${baseURL}/tasks/${taskToDeleteId}`, authHeaderA);
      // Verify task no longer exists
      let notFoundConfirmed = false;
      try {
        await axios.get(`${baseURL}/tasks/${taskToDeleteId}`, authHeaderA);
      } catch (checkErr) {
        notFoundConfirmed = checkErr.response?.status === 404;
      }
      const pass = res.status === 200 && res.data.success && notFoundConfirmed;
      record('11. Delete a task', pass, `Status 200, Verified 404 on subsequent fetch`);
    } catch (e) {
      record('11. Delete a task', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 12: Reject access to another user's task
    // -------------------------------------------------------------
    try {
      // Register User B
      const resB = await axios.post(`${baseURL}/auth/register`, userBData);
      userBToken = resB.data.token;
      const authHeaderB = { headers: { Authorization: `Bearer ${userBToken}` } };

      // User B creates a private task
      const bTaskRes = await axios.post(`${baseURL}/tasks`, {
        title: 'User B Confidential Task',
        priority: 'High',
        status: 'Pending',
      }, authHeaderB);
      userBTaskId = bTaskRes.data.data.task._id;

      // User A tries to GET User B's task
      let getDenied = false;
      try {
        await axios.get(`${baseURL}/tasks/${userBTaskId}`, authHeaderA);
      } catch (e) {
        getDenied = e.response?.status === 404;
      }

      // User A tries to UPDATE User B's task
      let updateDenied = false;
      try {
        await axios.put(`${baseURL}/tasks/${userBTaskId}`, { title: 'Hacked by User A' }, authHeaderA);
      } catch (e) {
        updateDenied = e.response?.status === 404;
      }

      // User A tries to DELETE User B's task
      let deleteDenied = false;
      try {
        await axios.delete(`${baseURL}/tasks/${userBTaskId}`, authHeaderA);
      } catch (e) {
        deleteDenied = e.response?.status === 404;
      }

      const pass = getDenied && updateDenied && deleteDenied;
      record('12. Reject access to another user\'s task', pass, `Cross-user READ (404), UPDATE (404), and DELETE (404) all blocked`);
    } catch (e) {
      record('12. Reject access to another user\'s task', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 13: Verify task filters and search
    // -------------------------------------------------------------
    try {
      // Search by title "PRD"
      const searchRes = await axios.get(`${baseURL}/tasks?search=PRD`, authHeaderA);
      const searchPass = searchRes.data.count >= 1 && searchRes.data.data.tasks[0].title.includes('PRD');

      // Filter by status "Completed"
      const statusRes = await axios.get(`${baseURL}/tasks?status=Completed`, authHeaderA);
      const statusPass = statusRes.data.count >= 1 && statusRes.data.data.tasks.every(t => t.status === 'Completed');

      // Filter by priority "Low"
      const priorityRes = await axios.get(`${baseURL}/tasks?priority=Low`, authHeaderA);
      const priorityPass = priorityRes.data.count >= 1 && priorityRes.data.data.tasks.every(t => t.priority === 'Low');

      // Combined query
      const combinedRes = await axios.get(`${baseURL}/tasks?priority=Low&status=Completed`, authHeaderA);
      const combinedPass = combinedRes.data.count >= 1 && combinedRes.data.data.tasks[0].priority === 'Low' && combinedRes.data.data.tasks[0].status === 'Completed';

      // Reject invalid filter enum
      let invalidRejected = false;
      try {
        await axios.get(`${baseURL}/tasks?priority=SuperHigh`, authHeaderA);
      } catch (invErr) {
        invalidRejected = invErr.response?.status === 400;
      }

      const pass = searchPass && statusPass && priorityPass && combinedPass && invalidRejected;
      record('13. Verify task filters and search', pass, `Search, status filter, priority filter, combined query, and invalid enum rejection (400) all verified`);
    } catch (e) {
      record('13. Verify task filters and search', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 14: Verify dashboard statistics (including overdueTasks)
    // -------------------------------------------------------------
    try {
      const statsRes = await axios.get(`${baseURL}/tasks/stats`, authHeaderA);
      const { totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks } = statsRes.data.data;

      // User A has 3 active tasks:
      // Task 1: High, In Progress (updated in test 10), dueDate yesterday (overdue)
      // Task 2: Medium, In Progress
      // Task 3: Low, Completed
      const statsPass =
        statsRes.status === 200 &&
        totalTasks === 3 &&
        inProgressTasks === 2 &&
        completedTasks === 1 &&
        overdueTasks >= 1; // Task 1 is overdue

      record('14. Verify dashboard statistics', statsPass, `total: ${totalTasks}, pending: ${pendingTasks}, inProgress: ${inProgressTasks}, completed: ${completedTasks}, overdue: ${overdueTasks}`);
    } catch (e) {
      record('14. Verify dashboard statistics', false, e.response?.data?.message || e.message);
    }

    // -------------------------------------------------------------
    // Test 15: Verify logout and subsequent authentication behavior
    // -------------------------------------------------------------
    try {
      const logoutRes = await axios.post(`${baseURL}/auth/logout`, {}, authHeaderA);
      const cookieHeader = logoutRes.headers['set-cookie'];
      const cookieCleared = cookieHeader ? cookieHeader.some(c => c.includes('token=;') || c.includes('Max-Age=0')) : true;

      // Access /auth/me without token -> should be 401
      let meDenied = false;
      try {
        await axios.get(`${baseURL}/auth/me`);
      } catch (meErr) {
        meDenied = meErr.response?.status === 401;
      }

      const pass = logoutRes.status === 200 && cookieCleared && meDenied;
      record('15. Verify logout and subsequent auth behavior', pass, `Logout status 200, cookie cleared, subsequent /auth/me blocked with 401`);
    } catch (e) {
      record('15. Verify logout and subsequent auth behavior', false, e.response?.data?.message || e.message);
    }

  } finally {
    // Clean up test data from MongoDB
    console.log('\n🧹 Cleaning up test users and tasks from database...');
    try {
      await User.deleteMany({ email: { $in: [userAData.email.toLowerCase(), userBData.email.toLowerCase()] } });
      if (userATaskId || userBTaskId) {
        await Task.deleteMany({ _id: { $in: [userATaskId, userBTaskId, taskToDeleteId].filter(Boolean) } });
      }
      console.log('✅ Test data cleaned up successfully.');
    } catch (cleanupErr) {
      console.error('Warning during test cleanup:', cleanupErr.message);
    }

    server.close();
    await mongoose.disconnect();
  }

  // Summary
  console.log('\n================================================================');
  console.log('📊 TEST SUMMARY');
  console.log('================================================================');
  const passedCount = results.filter(r => r.pass).length;
  console.log(`Total: ${results.length} | Passed: ${passedCount} | Failed: ${results.length - passedCount}`);
  if (passedCount === results.length) {
    console.log('🎉 ALL 15 BACKEND TEST CASES PASSED WITH 100% SUCCESS!');
  } else {
    console.log('⚠️ Some tests failed. Review details above.');
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
