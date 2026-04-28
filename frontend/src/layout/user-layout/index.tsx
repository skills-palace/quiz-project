import AccountNav from "./account-nav";
import AccountNavMobile from "./account-nav-mobile";

const accountMenu = [
  {
    slug: "1",
    name: "account-settings",
    icon: "",
  },
  {
    slug: "1",
    name: "text-orders",
    icon: "",
  },
  {
    slug: "1",
    name: "text-wishlist",
    icon: "",
  },
  {
    slug: "1",
    name: "text-address",
    icon: "",
  },
  {
    slug: "1",
    name: "text-notifications",
    icon: "",
  },
  {
    slug: "1",
    name: "text-account-details-notice",
    icon: "",
  },
  {
    slug: "1",
    name: "text-account-details-help",
    icon: "",
  },
  {
    slug: "1",
    name: "text-change-password",
    icon: "",
  },
];

const AccountLayout: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({
  children,
}) => {
  return (
    <div className="container mx-auto">
      <div className="pt-10 2xl:pt-12 pb-12 lg:pb-14 xl:pb-16 2xl:pb-20">
        <div className="flex flex-col w-full lg:flex-row md:space-x-4">
          {/* <div className="lg:hidden">
              <AccountNavMobile options={accountMenu} />
            </div> */}
          <div className="hidden lg:block shrink-0">
            <AccountNav options={accountMenu} />
          </div>
          <div className="w-full p-4 mt-4 border rounded-md lg:mt-0 border-border-base sm:p-5 md:py-8 bg-white shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
