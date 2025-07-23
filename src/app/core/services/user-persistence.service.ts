import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/User.interface';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPersistenceService {

  userSubject = new BehaviorSubject<string>('')
  user$ = this.userSubject.asObservable();
  destroy$: Subject<boolean> = new Subject();
  destroyObs$ = this.destroy$.asObservable();

  saveUser(user: User) {
    const myObjectString = JSON.stringify(user);
    this.userSubject.next(myObjectString);
    localStorage.setItem('userData', myObjectString);
  }

  updatePersistenceUser(user: User) {
    const myObjectString = JSON.stringify(user);
    this.userSubject.next(myObjectString);
    localStorage.setItem('userData', myObjectString);
  }

  getUser() {
    const user = localStorage.getItem('userData');
    this.userSubject.next(user  || '{}');
  }

  removeUser () {
    this.destroy$.next(false);
    localStorage.removeItem('userData');
  }
}
