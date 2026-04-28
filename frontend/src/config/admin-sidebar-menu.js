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
} from 'react-icons/bi';
import { RiAiGenerate } from 'react-icons/ri';

import { MdBuild } from 'react-icons/md';
export default [
  {
    groupId: '1',
    groupTitle: 'menu',
    groupMenu: [{ title: 'dashboard', link: '/admin', Icon: BiTachometer }],
  },
  {
    groupId: '2',
    groupTitle: 'Manage Quiz',
    groupMenu: [
      { title: 'Lesson', link: '/admin/lesson', Icon: BiAward },
      { title: 'Add Lesson', link: '/admin/lesson/create', Icon: BiPlusCircle },
      { title: 'Quiz', link: '/admin/quiz', Icon: BiCubeAlt },
      { title: 'Add Quiz', link: '/admin/quiz/create', Icon: BiPlusCircle },
      {
        title: 'Generate Quiz',
        link: '/admin/quiz/generate',
        Icon: RiAiGenerate,
      },
      { title: 'Skills', link: '/admin/skills', Icon: MdBuild },
    ],
  },
  {
    groupId: '3',
    groupTitle: 'Manage User',
    groupMenu: [{ title: 'All User', link: '/admin/user', Icon: BiUser }],
  },
  {
    groupId: '4',
    groupTitle: 'Manage App',
    groupMenu: [
      {
        title: 'File Manager',
        link: '/admin/file-manager',
        Icon: BiFolderOpen,
      },
      {
        title: 'Contact Messages',
        link: '/admin/contact-messages',
        Icon: BiFolder,
      },
    ],
  },
];
