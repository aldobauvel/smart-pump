import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path:'account',
        loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule)
    },    
    {
        path:'**',
        redirectTo:''
    },
];
