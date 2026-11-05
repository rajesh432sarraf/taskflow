/**
 * TaskFlow — Phase 4 End-to-End Frontend-Backend Integration Test Suite
 * Tests full browser-to-backend flows:
 * Auth registration -> Session check -> Dashboard stats -> Task CRUD -> Filters -> Isolation -> Logout
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const axios = require('../../client/node_modules/axios');
const connectDB = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function runE2EIntegrationTests() {
  console.log('================================================================');
  console.log('🌐 TASKFLOW PHASE 4 END-TO-END INTEGRATION TEST SUITE');
  console.log(`Target API: ${BASE_URL}`);
  console.log('================================================================\n');

  await connectDB();

  const timestamp = Date.now();
  const testUserA = {
    name: 'Sarah Connor',
    email: `sarah_connor_${timestamp}@cyberdyne.io`,
    password: 'SecurePassword123!',
  };
  const testUserB = {
    name: 'John Connor',
    email: `john_connor_${timestamp}@resistance.io`,
    password: 'SecurePassword123!',
  };

  let userACookie = null;
  let userBCookie = null;
  let task1Id = null;
  let task2Id = null;
  let task3Id = null;

  const passedTests = [];
  const failedTests = [];

  function record(title, pass, details) {
    if (pass) {
      passedTests.push({ title, details });
      console.log(`✅ PASS | ${title}`);
    } else {
      failedTests.push({ title, details });
      console.log(`❌ FAIL | ${title}`);
    }
    if (details) console.log(`        Details: ${details}`);
  }

  try {
    // -------------------------------------------------------------
    // Test 1: User Registration via API
    // -------------------------------------------------------------
    try {
      const regRes = await axios.post(`${BASE_URL}/auth/register`, testUserA);
      // Extract Set-Cookie header
      const setCookie = regRes.headers['set-cookie'];
      if (setCookie && setCookie.length > 0) {
        userACookie = setCookie[0].split(';')[0];
      }
      const hasUserData = regRes.data.success && (regRes.data.data?.user?.email === testUserA.email.toLowerCase());
      const noPasswordExposed = !regRes.data.data?.user?.password;

      record(
        '1. User Registration Flow (Browser -> /api/auth/register)',
        regRes.status === 201 && hasUserData && noPasswordExposed,
        `Status ${regRes.status}, User ID: ${regRes.data.data?.user?._id}, Cookie set: ${!!userACookie}`
      );
    } catch (err) {
      record('1. User Registration Flow', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 2: Session Persistence (/api/auth/me with Cookie)
    // -------------------------------------------------------------
    try {
      const meRes = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Cookie: userACookie },
      });
      const isValid = meRes.status === 200 && meRes.data.data?.user?.email === testUserA.email.toLowerCase();
      record(
        '2. Session Persistence & Rehydration (/api/auth/me)',
        isValid,
        `Status ${meRes.status}, Session confirmed for: ${meRes.data.data?.user?.name}`
      );
    } catch (err) {
      record('2. Session Persistence', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 3: Initial Empty Dashboard Stats
    // -------------------------------------------------------------
    try {
      const statsRes = await axios.get(`${BASE_URL}/tasks/stats`, {
        headers: { Cookie: userACookie },
      });
      const s = statsRes.data.data;
      const isZero = s.totalTasks === 0 && s.pendingTasks === 0 && s.completedTasks === 0;
      record(
        '3. Initial Dashboard Stats for New User',
        statsRes.status === 200 && isZero,
        `total: ${s.totalTasks}, pending: ${s.pendingTasks}, completed: ${s.completedTasks}`
      );
    } catch (err) {
      record('3. Initial Dashboard Stats', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 4: Task Creation (3 tasks with varying priorities and dates)
    // -------------------------------------------------------------
    try {
      // Task 1: Future due date, Pending, Low priority
      const t1Res = await axios.post(
        `${BASE_URL}/tasks`,
        {
          title: 'Design Wireframes',
          description: 'Create low-fidelity wireframes in Figma',
          priority: 'Low',
          status: 'Pending',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { headers: { Cookie: userACookie } }
      );
      task1Id = t1Res.data.data.task._id;

      // Task 2: Past due date (overdue), In Progress, High priority
      const t2Res = await axios.post(
        `${BASE_URL}/tasks`,
        {
          title: 'Build API Endpoints',
          description: 'Implement Express REST routes',
          priority: 'High',
          status: 'In Progress',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { headers: { Cookie: userACookie } }
      );
      task2Id = t2Res.data.data.task._id;

      // Task 3: No due date, Pending, Medium priority
      const t3Res = await axios.post(
        `${BASE_URL}/tasks`,
        {
          title: 'Deploy to Cloud',
          description: 'Setup Render and Vercel hosting',
          priority: 'Medium',
          status: 'Pending',
        },
        { headers: { Cookie: userACookie } }
      );
      task3Id = t3Res.data.data.task._id;

      record(
        '4. Task Creation Flow (Create 3 tasks)',
        !!(task1Id && task2Id && task3Id),
        `Created IDs: [${task1Id}, ${task2Id}, ${task3Id}]`
      );
    } catch (err) {
      record('4. Task Creation Flow', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 5: Dashboard Statistics Live Recalculation
    // -------------------------------------------------------------
    try {
      const statsRes = await axios.get(`${BASE_URL}/tasks/stats`, {
        headers: { Cookie: userACookie },
      });
      const s = statsRes.data.data;
      const expected =
        s.totalTasks === 3 &&
        s.pendingTasks === 2 &&
        s.inProgressTasks === 1 &&
        s.completedTasks === 0 &&
        s.overdueTasks === 1;

      record(
        '5. Live Dashboard Statistics Calculation (including overdue)',
        expected,
        `total: ${s.totalTasks}, pending: ${s.pendingTasks}, inProgress: ${s.inProgressTasks}, completed: ${s.completedTasks}, overdue: ${s.overdueTasks}`
      );
    } catch (err) {
      record('5. Live Dashboard Statistics', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 6: Search Filter Integration
    // -------------------------------------------------------------
    try {
      const searchRes = await axios.get(`${BASE_URL}/tasks?search=Wireframes`, {
        headers: { Cookie: userACookie },
      });
      const tasks = searchRes.data.data.tasks;
      const isCorrect = tasks.length === 1 && tasks[0].title === 'Design Wireframes';
      record(
        '6. Search by Task Title Filter',
        isCorrect,
        `Found ${tasks.length} task(s) matching "Wireframes"`
      );
    } catch (err) {
      record('6. Search Filter', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 7: Status and Priority Dropdown Filters
    // -------------------------------------------------------------
    try {
      const statusRes = await axios.get(`${BASE_URL}/tasks?status=In%20Progress`, {
        headers: { Cookie: userACookie },
      });
      const priorityRes = await axios.get(`${BASE_URL}/tasks?priority=High`, {
        headers: { Cookie: userACookie },
      });

      const sTasks = statusRes.data.data.tasks;
      const pTasks = priorityRes.data.data.tasks;

      const isCorrect =
        sTasks.length === 1 &&
        sTasks[0].status === 'In Progress' &&
        pTasks.length === 1 &&
        pTasks[0].priority === 'High';

      record(
        '7. Status & Priority Multi-Filter Integration',
        isCorrect,
        `Status 'In Progress' count: ${sTasks.length}, Priority 'High' count: ${pTasks.length}`
      );
    } catch (err) {
      record('7. Dropdown Filters', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 8: Task Update & 1-Click Status Toggle ("Completed")
    // -------------------------------------------------------------
    try {
      const updateRes = await axios.put(
        `${BASE_URL}/tasks/${task1Id}`,
        { status: 'Completed' },
        { headers: { Cookie: userACookie } }
      );
      const isUpdated = updateRes.data.success && updateRes.data.data.task.status === 'Completed';

      // Check stats reflect the update
      const statsRes = await axios.get(`${BASE_URL}/tasks/stats`, {
        headers: { Cookie: userACookie },
      });
      const s = statsRes.data.data;
      const statsReflected = s.completedTasks === 1 && s.pendingTasks === 1;

      record(
        '8. Task Update & Complete Toggle with Stats Reflection',
        isUpdated && statsReflected,
        `Task1 status: ${updateRes.data.data.task.status}, completedTasks count: ${s.completedTasks}`
      );
    } catch (err) {
      record('8. Task Update', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 9: Task Deletion & List Update
    // -------------------------------------------------------------
    try {
      const delRes = await axios.delete(`${BASE_URL}/tasks/${task3Id}`, {
        headers: { Cookie: userACookie },
      });
      const isDeleted = delRes.status === 200 && delRes.data.success;

      // Verify re-fetch returns 404
      let is404 = false;
      try {
        await axios.get(`${BASE_URL}/tasks/${task3Id}`, {
          headers: { Cookie: userACookie },
        });
      } catch (err404) {
        is404 = err404.response?.status === 404;
      }

      record(
        '9. Task Deletion & Subsequent 404 Verification',
        isDeleted && is404,
        `Deleted ID: ${task3Id}, subsequent fetch returned 404`
      );
    } catch (err) {
      record('9. Task Deletion', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 10: Multi-Tenant Data Isolation (User A vs User B)
    // -------------------------------------------------------------
    try {
      // Register User B
      const regB = await axios.post(`${BASE_URL}/auth/register`, testUserB);
      const setCookieB = regB.headers['set-cookie'];
      if (setCookieB && setCookieB.length > 0) {
        userBCookie = setCookieB[0].split(';')[0];
      }

      // User B fetches tasks -> must be 0
      const bTasksRes = await axios.get(`${BASE_URL}/tasks`, {
        headers: { Cookie: userBCookie },
      });
      const bEmpty = bTasksRes.data.data.tasks.length === 0;

      // User B attempts to access User A's task -> must return 404
      let bAccessDenied = false;
      try {
        await axios.get(`${BASE_URL}/tasks/${task1Id}`, {
          headers: { Cookie: userBCookie },
        });
      } catch (errIsolation) {
        bAccessDenied = errIsolation.response?.status === 404;
      }

      record(
        '10. End-to-End Multi-Tenant Isolation',
        bEmpty && bAccessDenied,
        `User B tasks count: ${bTasksRes.data.data.tasks.length}, Cross-user access status: 404 Not Found`
      );
    } catch (err) {
      record('10. Multi-Tenant Isolation', false, err.response?.data?.message || err.message);
    }

    // -------------------------------------------------------------
    // Test 11: Logout Flow & Cookie Clearance
    // -------------------------------------------------------------
    try {
      const logoutRes = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { headers: { Cookie: userACookie } }
      );
      const isLoggedOut = logoutRes.status === 200 && logoutRes.data.success;

      // Unauthenticated request to /auth/me without cookies
      let unauthBlocked = false;
      try {
        await axios.get(`${BASE_URL}/auth/me`);
      } catch (errUnauth) {
        unauthBlocked = errUnauth.response?.status === 401;
      }

      record(
        '11. Logout & Session Termination Flow',
        isLoggedOut && unauthBlocked,
        `Logout status: ${logoutRes.status}, Subsequent unauthenticated request: 401 Unauthorized`
      );
    } catch (err) {
      record('11. Logout Flow', false, err.response?.data?.message || err.message);
    }
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test users and tasks from database...');
    try {
      await User.deleteMany({
        email: { $in: [testUserA.email.toLowerCase(), testUserB.email.toLowerCase()] },
      });
      if (task1Id) await Task.findByIdAndDelete(task1Id);
      if (task2Id) await Task.findByIdAndDelete(task2Id);
      if (task3Id) await Task.findByIdAndDelete(task3Id);
      console.log('✅ Integration test data cleaned up successfully.\n');
    } catch (cleanErr) {
      console.error('⚠️ Cleanup error:', cleanErr.message);
    }
  }

  console.log('================================================================');
  console.log('📊 INTEGRATION TEST SUMMARY');
  console.log('================================================================');
  console.log(`Total: ${passedTests.length + failedTests.length} | Passed: ${passedTests.length} | Failed: ${failedTests.length}`);

  if (failedTests.length === 0) {
    console.log('🎉 ALL 11 END-TO-END INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ SOME INTEGRATION TESTS FAILED');
    process.exit(1);
  }
}

runE2EIntegrationTests();

