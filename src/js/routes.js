import LoginComponent from './component/auth/login';
import Card from './component/card';
import BoardComponent from './component/board/board';
import BoardsComponent from './component/boards';

const routes = [
  {
    path: '*',
    name: '404',
    component: { template: '<div>404</div>'},
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
    meta: {
      public: true,  // Allow access to even if not logged in
      onlyWhenLoggedOut: true
    }
  },
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'boards'
    },
  },
  {
    path: '/boards',
    name: 'boards',
    component: BoardsComponent,
  },
  {
    path: '/boards/:boardIndex',
    name: 'board',
    component: BoardComponent,
    props(route) {
      return {
        boardIndex: parseInt(route.params.boardIndex),
      };
    },
    children: [
      {
        name: 'card',
        path: 'column/:columnIndex/card/:cardIndex',
        component: Card,
        props(route) {
          return {
            boardIndex: parseInt(route.params.boardIndex),
            columnIndex: parseInt(route.params.columnIndex),
            cardIndex: parseInt(route.params.cardIndex),
          };
        },
      },
    ],
  },
];

export default routes;
