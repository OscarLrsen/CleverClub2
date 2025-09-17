import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users?username=admin"
    );
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
    fetchUsers(); // uppdatera listan
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Adminpanel – Användare</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username} ({user.email}) {user.password}
            <button onClick={() => deleteUser(user._id)}>Ta bort</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
