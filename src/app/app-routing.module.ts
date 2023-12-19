import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main/dashboard',
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES, },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: '**', redirectTo: '/error/error-404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
