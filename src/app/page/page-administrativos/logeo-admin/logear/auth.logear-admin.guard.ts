import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardAdmin: CanActivateFn = () => {
  const router = inject(Router);
  const userData = localStorage.getItem('userData');
  if (userData) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
