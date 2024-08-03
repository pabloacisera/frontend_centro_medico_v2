import { CanActivateFn, Router } from '@angular/router';

export const protectedRouteGuard: CanActivateFn = (route, state) => {

  let ruta:Router = new Router()
  const token = localStorage.getItem('token')

  if(!token){
    ruta.navigate(['/logear'])
  }
  return true;
};
