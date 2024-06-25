"use client";

import { useEffect, useState } from 'react';

const API_URL = 'https://port-0-express-crud-example-1lx88fkf8.sel5.cloudtype.app/api/users';

async function fetchData() {
  const res = await fetch(API_URL, { next: { revalidate: 10 } });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const result = await res.json();
  console.log('Fetched Data:', result);
  return result;
}

async function createUser(user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    throw new Error('Failed to create user');
  }
  const result = await res.json();
  console.log('Created User:', result);
  return result;
}

async function updateUser(id, user) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    throw new Error('Failed to update user');
  }
  const result = await res.json();
  console.log('Updated User:', result);
  return result;
}

async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete user');
  }
  const result = await res.json();
  console.log('Deleted User:', result);
  return result;
}

export default function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchData()
      .then((fetchedData) => {
        setData(fetchedData || []);
      })
      .catch((err) => {
        setError(err.message || 'Error fetching data');
      });
  }, []);

  const handleCreateUser = async () => {
    try {
      const createdUser = await createUser(newUser);
      setData((prevData) => [...prevData, createdUser]);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      setError(error.message || 'Error creating user');
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      const updatedUser = await updateUser(id, editingUser);
      setData((prevData) =>
        prevData.map((user) => (user.id === id ? updatedUser : user))
      );
      setEditingUser(null);
    } catch (error) {
      setError(error.message || 'Error updating user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setData((prevData) => prevData.filter((user) => user.id !== id));
    } catch (error) {
      setError(error.message || 'Error deleting user');
    }
  };

  if (error) return <div className="text-red-500 text-center mt-10">Failed to load: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Next.js ISR Example</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="이름"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="이메일"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white p-2 rounded"
        >
          등록
        </button>
      </div>
      <ul className="space-y-4">
        {data.map((user) => (
          <li key={user.id} className="p-4 border rounded shadow-sm hover:shadow-md">
            {editingUser && editingUser.id === user.id ? (
              <div>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="border p-2 mr-2"
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="border p-2 mr-2"
                />
                <button
                  onClick={() => handleUpdateUser(user.id)}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-500 text-white p-2 rounded ml-2"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold">{user.name}</div>
                  <div className="text-gray-600">{user.email}</div>
                </div>
                <div>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}