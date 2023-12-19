import { ApplicationModule } from '@angular/core';
import { Routes } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [    {
        path: 'auth',
        loadChildren: () => import('./../../auth/auth.module').then(m => m.AuthModule)
    }
    
];
