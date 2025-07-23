import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserPersistenceService } from '../../../../core/services/user-persistence.service';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  standalone: false,
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent {
  @Input() title: string = '';
  @Input() color: string = 'primary';
  @Input() isProfileBanner = true;
  @Output() menuEmmit = new EventEmitter<any>()
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(public dialog: MatDialog){}  

  openDialog() {
    const dialogRef = this.dialog.open(DialogFromMenuExampleDialog, {restoreFocus: false, disableClose: true});
  }

  menuOpt(action: string) {    
    this.menuEmmit.emit(action)
  }

}

@Component({
  selector: 'dialog-from-menu-dialog',
  templateUrl: 'dialog-from-menu-example-dialog.html',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
})
export class DialogFromMenuExampleDialog {

  constructor(private userPersistence: UserPersistenceService, private router: Router, public dialogRef: MatDialogRef<DialogFromMenuExampleDialog>,){}

  logout() {
    this.userPersistence.removeUser();
    this.dialogRef.close();
    this.router.navigateByUrl('');
  }
}
