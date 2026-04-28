import Layout from "@/layout/dashboard";
import ContactMessages from "@/dashboard/contact-messages";

const ContactMessagesPage = () => {
  return (
    <div>
      <ContactMessages />
    </div>
  );
};

ContactMessagesPage.Layout = Layout;

export default ContactMessagesPage;
