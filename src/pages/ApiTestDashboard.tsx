import { useState } from "react";
import { authApi, usersApi, groupsApi, expensesApi, splitsApi } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Users, DollarSign, Split, UserPlus } from "lucide-react";

interface TestResult {
  endpoint: string;
  status: "idle" | "loading" | "success" | "error";
  data?: any;
  error?: string;
}

export default function ApiTestDashboard() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  const runTest = async (
    key: string,
    endpoint: string,
    testFn: () => Promise<any>
  ) => {
    setResults((prev) => ({
      ...prev,
      [key]: { endpoint, status: "loading" },
    }));

    try {
      const data = await testFn();
      setResults((prev) => ({
        ...prev,
        [key]: { endpoint, status: "success", data },
      }));
      return data;
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        [key]: {
          endpoint,
          status: "error",
          error: error.response?.data?.message || error.message,
        },
      }));
      throw error;
    }
  };

  // Auth Tests
  const testRegister = () =>
    runTest("register", "POST /auth/register", () =>
      authApi.register({
        email: `test${Date.now()}@example.com`,
        password: "password123",
        name: "Test User"
      })
    );

  const testLogin = async () => {
    const response = await runTest("login", "POST /auth/login", () =>
      authApi.login({
        email: "test@example.com",
        password: "password123"
      })
    );
    if (response?.data) {
      const data = response.data;
      if (data.name) setCurrentUser(data);
      if (data.token) localStorage.setItem("authToken", data.token);
    }
  };

  const testLogout = () =>
    runTest("logout", "GET /auth/logout", async () => {
      const data = await authApi.logout();
      setCurrentUser(null);
      localStorage.removeItem("authToken");
      return data;
    });

  // User Tests
  const testGetAllUsers = () =>
    runTest("users-getAll", "GET /users", () => usersApi.getAllUsers());

  const testGetUserById = () => {
    const userId = currentUser?._id || "user_id_placeholder";
    return runTest("users-getById", `GET /users/${userId}`, () =>
      usersApi.getUserById(userId)
    );
  };

  const testUpdateUser = () => {
    const userId = currentUser?._id || "user_id_placeholder";
    return runTest("users-update", `PUT /users/${userId}`, () =>
      usersApi.updateUser(userId, { name: "Updated Name" })
    );
  };

  // Group Tests
  const testCreateGroup = () =>
    runTest("groups-create", "POST /groups", () =>
      groupsApi.createGroup("Test Group", "A test trip group")
    );

  const testGetAllGroups = () =>
    runTest("groups-getAll", "GET /groups", () => groupsApi.getUserGroups());

  const testAddUserToGroup = () => {
    const groupId = "group_id_placeholder";
    const userId = "user_id_placeholder";
    return runTest("groups-addUser", `PUT /groups/${groupId}/users`, () =>
      groupsApi.addUserToGroup(groupId, userId)
    );
  };

  const testRemoveUserFromGroup = () => {
    const groupId = "group_id_placeholder";
    const userId = "user_id_placeholder";
    return runTest("groups-removeUser", `DELETE /groups/${groupId}/users`, () =>
      groupsApi.removeUserFromGroup(groupId, userId)
    );
  };

  // Expense Tests
  const testCreateExpense = () =>
    runTest("expenses-create", "POST /expenses", () =>
      expensesApi.createExpense({
        description: "Test Dinner",
        amount: 400000,
        paid_by: [currentUser?._id || "user1"],
        paid_for: [currentUser?._id || "user1", "user2", "user3"],
      })
    );

  const testUpdateExpense = () => {
    const expenseId = "expense_id_placeholder";
    return runTest("expenses-update", `PUT /expenses/${expenseId}`, () =>
      expensesApi.updateExpense(expenseId, {
        description: "Updated Dinner",
        amount: 500000,
      })
    );
  };

  const testDeleteExpense = () => {
    const expenseId = "expense_id_placeholder";
    return runTest("expenses-delete", `DELETE /expenses/${expenseId}`, () =>
      expensesApi.deleteExpense(expenseId)
    );
  };

  // Split Tests
  const testCreateSplit = () =>
    runTest("splits-create", "POST /splits", () =>
      splitsApi.createSplit({
        group_id: "group_id_placeholder",
        user_id: "user_id_placeholder",
        pay_to: [
          { user_id: "user1", amount: 100000 },
          { user_id: "user2", amount: 150000 },
        ],
        get_pay_by: [
          { user_id: "user3", amount: 100000 },
          { user_id: "user4", amount: 150000 },
        ],
      })
    );

  const testUpdateSplit = () => {
    const splitId = "split_id_placeholder";
    return runTest("splits-update", `PUT /splits/${splitId}`, () =>
      splitsApi.updateSplit(splitId, {
        pay_to: [{ user_id: "user1", amount: 200000 }],
      })
    );
  };

  const testDeleteSplit = () => {
    const splitId = "split_id_placeholder";
    return runTest("splits-delete", `DELETE /splits/${splitId}`, () =>
      splitsApi.deleteSplit(splitId)
    );
  };

  const ResultIndicator = ({ status }: { status: TestResult["status"] }) => {
    const colors = {
      idle: "bg-gray-400",
      loading: "bg-yellow-400 animate-pulse",
      success: "bg-green-500",
      error: "bg-red-500",
    };
    return <div className={`w-3 h-3 rounded-full ${colors[status]}`} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">TripSplit API Test Dashboard</h1>
          <p className="text-muted-foreground">
            Test all backend endpoints | Backend: {import.meta.env.VITE_API_URL || "http://localhost:8000/api"}
          </p>
          {currentUser && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">
                Logged in as: {currentUser.name} ({currentUser.email})
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Auth API */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                <CardTitle>Auth APIs</CardTitle>
              </div>
              <CardDescription>Authentication endpoints</CardDescription>
            </CardHeader>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button onClick={testRegister} size="sm" className="flex-1">
                  POST /auth/register
                </Button>
                {results.register && <ResultIndicator status={results.register.status} />}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testLogin} size="sm" className="flex-1">
                  POST /auth/login
                </Button>
                {results.login && <ResultIndicator status={results.login.status} />}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testLogout} size="sm" variant="outline" className="flex-1">
                  GET /auth/logout
                </Button>
                {results.logout && <ResultIndicator status={results.logout.status} />}
              </div>

              <div className="pt-2 space-y-1">
                <p className="text-xs text-muted-foreground">OAuth URLs:</p>
                <a
                  href={authApi.getGoogleAuthUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-primary hover:underline"
                >
                  GET /auth/google
                </a>
                <a
                  href={authApi.getFacebookAuthUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-primary hover:underline"
                >
                  GET /auth/facebook
                </a>
              </div>
            </div>
          </Card>

          {/* User API */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <CardTitle>User APIs</CardTitle>
              </div>
              <CardDescription>User management endpoints</CardDescription>
            </CardHeader>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button onClick={testGetAllUsers} size="sm" className="flex-1">
                  GET /users
                </Button>
                {results["users-getAll"] && (
                  <ResultIndicator status={results["users-getAll"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testGetUserById} size="sm" className="flex-1">
                  GET /users/:id
                </Button>
                {results["users-getById"] && (
                  <ResultIndicator status={results["users-getById"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testUpdateUser} size="sm" className="flex-1">
                  PUT /users/:id
                </Button>
                {results["users-update"] && (
                  <ResultIndicator status={results["users-update"].status} />
                )}
              </div>
            </div>
          </Card>

          {/* Group API */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <CardTitle>Group APIs</CardTitle>
              </div>
              <CardDescription>Group management endpoints</CardDescription>
            </CardHeader>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button onClick={testGetAllGroups} size="sm" className="flex-1">
                  GET /groups
                </Button>
                {results["groups-getAll"] && (
                  <ResultIndicator status={results["groups-getAll"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testCreateGroup} size="sm" className="flex-1">
                  POST /groups
                </Button>
                {results["groups-create"] && (
                  <ResultIndicator status={results["groups-create"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testAddUserToGroup} size="sm" className="flex-1">
                  PUT /groups/:id/users
                </Button>
                {results["groups-addUser"] && (
                  <ResultIndicator status={results["groups-addUser"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testRemoveUserFromGroup} size="sm" className="flex-1">
                  DELETE /groups/:id/users
                </Button>
                {results["groups-removeUser"] && (
                  <ResultIndicator status={results["groups-removeUser"].status} />
                )}
              </div>
            </div>
          </Card>

          {/* Expense API */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                <CardTitle>Expense APIs</CardTitle>
              </div>
              <CardDescription>Expense tracking endpoints</CardDescription>
            </CardHeader>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button onClick={testCreateExpense} size="sm" className="flex-1">
                  POST /expenses
                </Button>
                {results["expenses-create"] && (
                  <ResultIndicator status={results["expenses-create"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testUpdateExpense} size="sm" className="flex-1">
                  PUT /expenses/:id
                </Button>
                {results["expenses-update"] && (
                  <ResultIndicator status={results["expenses-update"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testDeleteExpense} size="sm" variant="destructive" className="flex-1">
                  DELETE /expenses/:id
                </Button>
                {results["expenses-delete"] && (
                  <ResultIndicator status={results["expenses-delete"].status} />
                )}
              </div>
            </div>
          </Card>

          {/* Split API */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <Split className="w-6 h-6 text-primary" />
                <CardTitle>Split APIs</CardTitle>
              </div>
              <CardDescription>Bill splitting endpoints</CardDescription>
            </CardHeader>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button onClick={testCreateSplit} size="sm" className="flex-1">
                  POST /splits
                </Button>
                {results["splits-create"] && (
                  <ResultIndicator status={results["splits-create"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testUpdateSplit} size="sm" className="flex-1">
                  PUT /splits/:id
                </Button>
                {results["splits-update"] && (
                  <ResultIndicator status={results["splits-update"].status} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={testDeleteSplit} size="sm" variant="destructive" className="flex-1">
                  DELETE /splits/:id
                </Button>
                {results["splits-delete"] && (
                  <ResultIndicator status={results["splits-delete"].status} />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Response Viewer */}
        <Card className="mt-6 p-6">
          <h3 className="text-xl font-semibold mb-4">Test Results</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(results).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tests run yet. Click any endpoint button to test.
              </p>
            ) : (
              Object.entries(results).map(([key, result]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border ${
                    result.status === "success"
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : result.status === "error"
                      ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                      : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-medium">
                      {result.endpoint}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        result.status === "success"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : result.status === "error"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  {result.data && (
                    <pre className="text-xs bg-black/5 dark:bg-white/5 p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                  {result.error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Error: {result.error}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
