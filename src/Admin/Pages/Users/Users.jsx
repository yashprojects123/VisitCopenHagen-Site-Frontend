import React, { use, useEffect, useState } from 'react';
import './Users.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
 

const Users = () => {
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null); // <-- Add this line

  useEffect(() => {
    // Simulate fetching users from an API
    const fetchUsers = async () => { 
     let usersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
     const userData = await usersResponse.data.user_data;
    
      if (userData!== null) {
        let newUsers = userData.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
        }));  
        setUsers(newUsers);
      }
      else{
        setUsersError("Error fetching users: "+userData.message);
      }
    }

    fetchUsers();
  }, []);
  
  useEffect(() => {
    console.log("Users fetched: ", users); 
  }, [users]);


  // Handlers for user actions
  const handleView = (user) => {
alert(`Viewing user: ${user.name}`);
    // In a real application, you would navigate to a user profile page
  };
 
  const handleUpdate = (user) => {
alert(`Updating user: ${user.name}`);
    // In a real application, you would open a modal or navigate to an edit form
  };
 
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
setUsers(users.filter(user => user.id !== userId));
    }
  };
 
  return (
        <>
    <div className="user-management-container">
      <h2 className="title">Manage Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>


{ users.map(user => (
  <tr key={user.id}>
    <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
    <td>{user.email}</td>
    <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
   
<td>
  <div className="actions">
    <button
      className="dots-btn"
      onClick={() => {
        const menu = document.getElementById(`actions-menu-${user.id}`);
        if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
      }}
      style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
      aria-label="More actions"
    >
      &#x22EE;
    </button>
    <div
      id={`actions-menu-${user.id}`}
      className="actions-menu"
      style={{
        display: "none",
        position: "absolute",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        zIndex: 10,
        minWidth: "100px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Link
        to={`/users/${user.id}`}
        className="actions-menu-link"
        style={{ display: "block", padding: "8px", textDecoration: "none", color: "#333" }}
        onClick={() => (document.getElementById(`actions-menu-${user.id}`).style.display = "none")}
      >
        View
      </Link>
      <Link
        to={`/users/${user.id}/edit`}
        className="actions-menu-link"
        style={{ display: "block", padding: "8px", textDecoration: "none", color: "#333" }}
        onClick={() => (document.getElementById(`actions-menu-${user.id}`).style.display = "none")}
      >
        Edit
      </Link>
      <button
        className="actions-menu-link"
        style={{ display: "block", padding: "8px", width: "100%", border: "none", background: "none", textAlign: "left", color: "#c00", cursor: "pointer" }}
        onClick={() => {
          handleDelete(user.id);
          document.getElementById(`actions-menu-${user.id}`).style.display = "none";
        }}
      >
        Delete
      </button>
    </div>
  </div>
</td>
  </tr>
))} 

{usersError && (
  <tr>
    <td colSpan="6" className="error-message">{usersError}</td>
  </tr>
)}

        </tbody>
      </table>
    </div>
    </>
  );
};
 
export default Users;