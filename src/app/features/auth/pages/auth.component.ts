import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { User } from '../../../shared/interfaces/User.interface';
import { delay, map } from 'rxjs';
import { Router } from '@angular/router';
import { UserPersistenceService } from '../../../core/services/user-persistence.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  standalone: false,  
})
export class AuthComponent {
  isProgressBarVisible = false;
  
  constructor(
    private authService: AuthService, private fb: FormBuilder, 
    private _snackBar: MatSnackBar, private router: Router,
    private userPersistence: UserPersistenceService
  ){}

  loginForm: FormGroup = this.fb.group({
    email: ['henderson.briggs@geeknet.net', [Validators.required]],
    password: ['23derd*334', [Validators.required]],
  })

  login() {
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    this.isProgressBarVisible = true;
    this.authService.getUsers()
    .pipe(
      delay(1000),
      map(users => users.filter(user => {
        if(user.email === email && user.password === password && user.isActive) return user
         return
      })),      
    )
    .subscribe({
      next: res => {                
        if (res.length === 0) this.openSnackBar('The username or password you entered is incorrect', 'Close');
        else this.redirectTo(res[0])
      },
      complete: () => this.isProgressBarVisible = false
    })    
  }

  redirectTo (user: User) {
    this.userPersistence.saveUser(user);    
    this.router.navigateByUrl('/account');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}
