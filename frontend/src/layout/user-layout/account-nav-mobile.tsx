import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";

type Option = {
  name: string;
  slug: string;
  icon?: string;
  //icon?: JSX.Element;
};

const AccountNavMobile = ({ options }: { options: Option[] }) => {
  const router = useRouter();
  const { pathname } = router;
  const currentSelectedItem = pathname
    ? options.find((o) => o.slug === pathname)!
    : options[0];
  const [selectedItem, setSelectedItem] = useState<Option>(currentSelectedItem);
  useEffect(() => {
    setSelectedItem(currentSelectedItem);
  }, [currentSelectedItem]);

  return <div>gdgdfg</div>;
};

export default AccountNavMobile;
