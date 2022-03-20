import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public accountService: AccountService, private _snackBar: MatSnackBar) { }

  showErrorSnackbar() {
    this._snackBar.openFromComponent(ErrorSnackbarComponent, { duration: 3000, panelClass: 'failure' });
  }

  ngOnInit(): void {

  }

}

@Component({
  selector: 'error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./home.component.scss']
})
export class ErrorSnackbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit(): void {
  }

}
