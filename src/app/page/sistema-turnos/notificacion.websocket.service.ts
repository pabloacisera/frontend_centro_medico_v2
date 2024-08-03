

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<string>();

  getNotification() {
    return this.notificationSubject.asObservable();
  }

  notify(message: string) {
    this.notificationSubject.next(message);
  }
}
