import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import { User } from '../../../shared/interfaces/User.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPersistenceService } from '../../../core/services/user-persistence.service';
import { delay, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: false,  
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  errorMessage = 'You must enter a valid value';
  titlePage = 'Account';
  isBalanceDataShow = true;  
  userData! : User;
  hasSubscription = true;
  isProgressBarVisible = false;
  personalDetailsForm: FormGroup = this.fb.group({
    firstName: ['', [ Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)] ],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)] ],
    age: ['', [ Validators.required, Validators.min(18), Validators.max(120), Validators.pattern(/^\d+$/)] ],
    phone: ['', [ Validators.required, ] ],
    address: ['', [ Validators.required, ]],
    email: ['', [ Validators.required, Validators.email ]],
  })  
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private _snackBar: MatSnackBar,
    private userPersitence: UserPersistenceService,    
  ){}

  ngOnInit(): void {    
    this.userPersitence.getUser();    
    this.userPersitence.user$
    .pipe(
      takeUntil(this.userPersitence.destroyObs$)
    )
    .subscribe({
      next: res => {        
        this.userData = {...JSON.parse(res)}        
        this.buildPersonalData({...this.userData});
      }
    })
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.isProgressBarVisible = true;
    const formData = new FormData();
    formData.append('image', file);
    this.accountService.updateImageProfile(this.userData._id, formData)
    .pipe(
      delay(1000),
    )   
    .subscribe({
      next: res => {        
        this.userData.picture = `uploads/${res.filename}`;
        const user = {...this.userData }
        this.userPersitence.updatePersistenceUser(user);          
        this.openSnackBar('Image edited successfully', 'Close');
      },
      complete: () => {
        this.isProgressBarVisible = false;
      },
      error: err => {          
        this.openSnackBar('Something went wrong, try again', 'Close');
        this.isProgressBarVisible = false;
      }
    });
  }

  buildPersonalData(userData: User) {
    this.personalDetailsForm.controls['firstName'].setValue(userData.name.first);
    this.personalDetailsForm.controls['lastName'].setValue(userData.name.last);
    this.personalDetailsForm.controls['age'].setValue(userData.age);
    this.personalDetailsForm.controls['phone'].setValue(userData.phone);
    this.personalDetailsForm.controls['address'].setValue(userData.address);
    this.personalDetailsForm.controls['email'].setValue(userData.email);
  }

  editPersonalDetails() {
    if (this.personalDetailsForm.invalid) {
      this.personalDetailsForm.markAllAsTouched();
      return this.openSnackBar('You must enter a valid value', 'Close');
    } 
    this.isProgressBarVisible = true;
    const { balance, company, email, eyeColor, guid, isActive, password, picture, _id}  = this.userData
    const editedUser: User = {
      'address': this.personalDetailsForm.controls['address'].value,
      'age': this.personalDetailsForm.controls['age'].value,
      'balance': balance,
      'company': company,
      'email': email,
      'eyeColor': eyeColor,
      'guid': guid,
      'isActive': isActive,
      'name': {
        'first': this.personalDetailsForm.controls['firstName'].value,
        'last': this.personalDetailsForm.controls['lastName'].value,
      },
      'password': password,
      'phone': this.personalDetailsForm.controls['phone'].value,
      'picture': picture,
      '_id': _id
    }

    this.accountService.updateUser(editedUser)
    .pipe(
      delay(2000)
    )
    .subscribe({
      next: res => {
        this.openSnackBar('User edited successfully', 'Close');
        this.userPersitence.updatePersistenceUser(editedUser)
      },
      complete: () => {
        this.isProgressBarVisible = false;
      },
      error: (err) => {
        this.openSnackBar('Something went wrong, try again', 'Close');
        this.isProgressBarVisible = false;
      }
    })      
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'left',
      verticalPosition: 'top',
    });
  }

  menuEvt(ev:any){    
    this.isBalanceDataShow = ev === 'balance' ? true : false
  }

}
