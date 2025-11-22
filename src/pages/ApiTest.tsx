import { useState } from "react";
import { authApi, usersApi } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function ApiTest() {
  const [status, setStatus] = useState<string>("Not tested");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing connection...");

    try {
      // Try to fetch users or check API health
      const result = await usersApi.getAllUsers();
      setStatus("Connected successfully!");
      setResponse(result);
    } catch (error: any) {
      setStatus(`Connection failed: ${error.message}`);
      setResponse(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setStatus("Testing registration...");

    try {
      const result = await authApi.register({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });
      setStatus("Registration successful!");
      setResponse(result.data);

      // Store token if provided
      if (result.data.token) {
        localStorage.setItem("authToken", result.data.token);
      }
    } catch (error: any) {
      setStatus(`Registration failed: ${error.message}`);
      setResponse(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setStatus("Testing login...");

    try {
      const result = await authApi.login({
        email: "test@example.com",
        password: "password123"
      });
      setStatus("Login successful!");
      setResponse(result.data);

      // Store token if provided
      if (result.data.token) {
        localStorage.setItem("authToken", result.data.token);
      }
    } catch (error: any) {
      setStatus(`Login failed: ${error.message}`);
      setResponse(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <p className="mb-4">
          Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_API_URL || "http://localhost:8000"}</code>
        </p>
        <p className="mb-4">
          Status: <span className={loading ? "text-yellow-600" : "text-blue-600"}>{status}</span>
        </p>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Endpoints</h2>
        <div className="flex gap-4 flex-wrap">
          <Button onClick={testConnection} disabled={loading}>
            Test Connection
          </Button>
          <Button onClick={testRegister} disabled={loading}>
            Test Register
          </Button>
          <Button onClick={testLogin} disabled={loading}>
            Test Login
          </Button>
        </div>
      </Card>

      {response && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Response</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
