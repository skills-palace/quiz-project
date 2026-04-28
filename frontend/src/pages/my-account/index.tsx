import Layout from "@/layout/site";
import UserLayout from "@/layout/user-layout";
import UserForm from "@/page-sections/my-account/user-form";

const AccountPage = ({}) => {
  return (
    <UserLayout>
      <div className="flex flex-col w-full">
        <UserForm />
      </div>
    </UserLayout>
  );
};

AccountPage.Layout = Layout;

export default AccountPage;
