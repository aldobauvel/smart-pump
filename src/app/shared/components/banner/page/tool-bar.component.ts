import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserPersistenceService } from '../../../../core/services/user-persistence.service';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-tool-bar',
  standalone: false,
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})

export class ToolBarComponent implements OnInit {
  @Input() title: string = '';
  @Input() color: string = 'primary';
  @Input() isProfileBanner = true;
  @Output() menuEmmit = new EventEmitter<any>()
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  elem: any;
  isFullScreen = true;
  
  constructor(public dialog: MatDialog, @Inject(DOCUMENT) private document: any){}

  ngOnInit(){
    this.elem = document.documentElement;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogFromMenuExampleDialog, {restoreFocus: false, disableClose: true});
  }

  menuOpt(action: string) {    
    this.menuEmmit.emit(action)
  }

  handleFullScreen(isFullScreen: boolean) {
    if (isFullScreen) return this.openFullscreen()
    return this.closeFullscreen();
  }

  openFullscreen() {    
    if (this.elem.requestFullscreen) return this.elem.requestFullscreen();
    if (this.elem.mozRequestFullScreen) return this.elem.mozRequestFullScreen(); /* Firefox */
    if (this.elem.webkitRequestFullscreen) return this.elem.webkitRequestFullscreen(); /* Chrome, Safari and Opera */
    if (this.elem.msRequestFullscreen) return this.elem.msRequestFullscreen(); /* IE/Edge */    
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) return this.document.exitFullscreen();
    if (this.document.mozCancelFullScreen) return this.document.mozCancelFullScreen(); /* Firefox */
    if (this.document.webkitExitFullscreen) return this.document.webkitExitFullscreen(); /* Chrome, Safari and Opera */
    if (this.document.msExitFullscreen) return this.document.msExitFullscreen();   /* IE/Edge */    
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
