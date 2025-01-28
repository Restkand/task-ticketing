"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UsersPage() {
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const addUser = async (name: string, email: string, role: string, password: string) => {
    console.log("Sending to API:", { name, email, role, password });
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role, password }),
    });
  
    console.log("API Response Status:", res.status); // Log status response
    if (res.ok) {
      const newUser = await res.json();
      console.log("API Response Body:", newUser); // Log hasil API
      setUsers((prev) => [...prev, newUser]);
    } else {
      const errorData = await res.json();
      console.error("API Error:", errorData); // Log error dari API
    }
  };
  

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setAddUserOpen(true)}>Add New User</Button>
      </div>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>ID</TableHead> */}
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.id}>
              {/* <TableCell>{user.id}</TableCell> */}
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Adding User */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setAddUserOpen(false)}
        title="Add New User"
      >
        <UserForm onSubmit={addUser} />
      </Modal>
    </div>
  );
}

function UserForm({
  onSubmit,
}: {
  onSubmit: (name: string, email: string, role: string, password: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Pastikan password ikut dikirim
    if (name.trim() && email.trim() && role && password.trim()) {
      onSubmit(name, email, role, password);
      setName("");
      setEmail("");
      setRole("User");
      setPassword(""); 
    } else {
      alert("Please fill all fields including password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border rounded"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="User">User</option>
        <option value="Admin">Admin</option>
      </select>
      <Button type="submit" className="w-full">
        Add User
      </Button>
    </form>
  );
}