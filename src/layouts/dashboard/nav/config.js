// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Add Products',
    path: '/dashboard/add-products',
    icon: icon('ic_plus'),
  },
  // {
  //   title: 'user',
  //   path: '/dashboard/user-profile',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'products',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'expired products',
    path: '/dashboard/products/expired-products',
    icon: icon('ic_expired'),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'register',
    path: '/register',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
