import React from "react";
import { useSelector } from "react-redux";

const TeacherHome = () => {
  const auth = useSelector((state:any) => state.auth);
  const user = auth ? auth.user : null;
  const status = auth ? auth.status : null;

  return (
    <div className="myaccount-content">
      <h5>Dashboard</h5>
      <div className="welcome">
        <p>
          Hello,{" "}
          {user ? <h6 className="d-inline">{user.name}</h6> : "Guest"}
        </p>
      </div>
      <p className="mb-0 mt-2">
        From your account dashboard, you can easily check view your recent
        activities, manage your account, and edit your password and account
        details.
      </p>
    </div>
  );
};

export default TeacherHome;
