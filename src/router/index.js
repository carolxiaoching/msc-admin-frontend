import { createRouter, createWebHashHistory } from 'vue-router';
import { getToken, clearToken } from '@/scripts/methods';

const routes = [
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/SigninView.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../views/LayoutView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'overview',
        component: () => import('../views/OverView.vue'),
      },
      {
        path: 'members',
        name: 'members',
        component: () => import('../views/MembersView.vue'),
      },
      {
        path: 'member/:id',
        name: 'memberEdit',
        component: () => import('../views/MemberEditView.vue'),
      },
      {
        path: 'recipes',
        name: 'recipes',
        component: () => import('../views/RecipesView.vue'),
      },
      {
        path: 'recipe/:id',
        name: 'recipeEdit',
        component: () => import('../views/RecipeEditView.vue'),
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../views/CategoriesView.vue'),
      },
      {
        path: 'tags',
        name: 'tags',
        component: () => import('../views/TagsView.vue'),
      },
      {
        path: 'images',
        name: 'images',
        component: () => import('../views/ImagesView.vue'),
      },
    ],
  },
  {
    path: '/:pathMath(.*)*',
    component: () => import('../views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: 'active',
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  // 若無 token 且為需要登入的頁面，則轉址到登入頁面
  const token = getToken();
  if (token === '' && to.meta.requiresAuth) {
    clearToken();
    return { name: 'signin' };
  }
});

export default router;
