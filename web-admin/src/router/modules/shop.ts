import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/goods',
    name: 'shop',
    meta: {
      title: '文具商城管理',
      icon: 'shop',
    },
    children: [
      {
        path: 'goods',
        name: 'ShopGoods',
        component: () => import('@/pages/shop/goods/index.vue'),
        meta: { title: '商品管理' },
      },
      {
        path: 'categories',
        name: 'ShopCategories',
        component: () => import('@/pages/shop/categories/index.vue'),
        meta: { title: '分类管理' },
      },
      {
        path: 'orders',
        name: 'ShopOrders',
        component: () => import('@/pages/shop/orders/index.vue'),
        meta: { title: '订单管理' },
      },
    ],
  },
];
