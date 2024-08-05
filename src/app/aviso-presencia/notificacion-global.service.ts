import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<string>();

  getNotification(): Observable<string> {
    return this.notificationSubject.asObservable();
  }

  notify(message: string) {
    this.notificationSubject.next(message);
  }
}

