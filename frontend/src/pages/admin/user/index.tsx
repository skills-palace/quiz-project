import Layout from "@/layout/dashboard";
import Users from "@/dashboard/user";

const UserPage = () => {
  return (
    <div>
      <Users />
    </div>
  );
};

UserPage.Layout = Layout;

export default UserPage;
