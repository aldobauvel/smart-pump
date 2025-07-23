import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/interfaces/User.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user._id}`, user);
  }

  updateImageProfile(userId: string, formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/profile-picture/${userId}`, formData)
  }
}
