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
  errorMessage = 'You must enter a valid value';
  
  constructor(
    private authService: AuthService, private fb: FormBuilder, 
    private _snackBar: MatSnackBar, private router: Router,
    private userPersistence: UserPersistenceService
  ){}

  loginForm: FormGroup = this.fb.group({
    //email: ['henderson.briggs@geeknet.net', [Validators.required, Validators.email]],
    email: ['', [Validators.required, Validators.email]],
    //password: ['23derd*334', [Validators.required]],
    password: ['', [Validators.required]],
  })

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return this.openSnackBar('The username or password you entered is incorrect', 'Close');
    }      
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    this.isProgressBarVisible = true;
    this.authService.getUsers()
    .pipe(
      delay(2000),
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
      horizontalPosition: 'left',
      verticalPosition: 'top',
    });
  }

}
