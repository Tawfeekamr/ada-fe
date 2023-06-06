import React from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <ul>
      <li>
        <Link to="/users/new">Invite User</Link>
      </li>
      <li>
        <Link to="/users">Users</Link>
      </li>
      <li>
        <Link to="/entities/new">Create Entity</Link>
      </li>
      <li>
        <Link to="/entities">Entities</Link>
      </li>
      <li>
        <Link to="/assessment/1">Assessment Details</Link>
      </li>
      <li>
        <Link to="/assessment">Create Assessment</Link>
      </li>
      <li>
        <Link to="/campaign/new">New Campaign</Link>
      </li>
      <li>
        <Link to="/campaign/1">Campaign Details</Link>
      </li>
    </ul>
  );
};
export default Main;
