import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (this.isLoggedIn()) {
        return true;
      }

      this.router.navigate(['/auth/signin']);
      return false;
  }

  public isLoggedIn(): boolean {
    let status = false; 
    var date = new Date();
    date.setMinutes(date.getMinutes()+20);
    if (localStorage.getItem('isLoggedIn') == "true") {
      if(localStorage.getItem('time')!=undefined) {
        
      }
        status = true;
    } else {
        status = false;
    }
    return status;
  }
  
}
