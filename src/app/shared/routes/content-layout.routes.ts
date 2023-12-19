import { Routes } from '@angular/router';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [    
    {
        path: 'main', loadChildren: () => import('../../rest/rest.module').then(m => m.RestModule)
    },
];