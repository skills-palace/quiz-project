import {
  BiTachometer,
  BiUser,
  BiCreditCardFront,
  BiImage,
  BiRestaurant,
  BiPurchaseTag,
  BiFingerprint,
  BiCart,
  BiStore,
  BiImages,
  BiShekel,
  BiFolder,
  BiFolderOpen,
  BiAward,
  BiCubeAlt,
  BiPlusCircle,
  BiSpa,
} from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { FaPeopleCarry } from "react-icons/fa";
import { GoPeople } from "react-icons/go";

export default [
  {
    groupId: "1",
    groupTitle: "menu",
    groupMenu: [{ title: "dashboard", link: "/teacher", Icon: BiTachometer }],
  },
  {
    groupId: "2",
    groupTitle: "Manage Quiz",
    groupMenu: [
      { title: "Lesson", link: "/teacher/lesson", Icon: BiAward },
      {
        title: "Add Lesson",
        link: "/teacher/lesson/create",
        Icon: BiPlusCircle,
      },
      { title: "Quiz", link: "/teacher/quiz", Icon: BiCubeAlt },
      { title: "Add Quiz", link: "/teacher/quiz/create", Icon: BiPlusCircle },
    ],
  },
  {
    groupId: "3",
    groupTitle: "Manage Students",
    groupMenu: [
      {
        title: "your Students",
        link: "/teacher/students",
        Icon: PiStudentBold,
      },
      {
        title: "new student",
        link: "/teacher/students/create-new",
        Icon: GoPeople,
      },
      {
        title: "Groups",
        link: "/teacher/learnGroup",
        Icon: GoPeople,
      },
    ],
  },
];
