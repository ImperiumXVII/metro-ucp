import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private accountService: AccountService, private _snackBar: MatSnackBar, private cookieService: CookieService) { }

  openSnackBar(success: boolean) {
    this._snackBar.openFromComponent(LoginSnackbarComponent, { duration: 3000, panelClass: success ? 'success' : 'failure', data: { success: success ? `Login successful!` : `Login failed - incorrect username or password.` } });
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    })
  }

  usernameValue = '';
  passwordValue = '';
  processingLogin = false;

  ngOnInit(): void {

  }

  async processLogin() {
    this.processingLogin = true;
    const login = await this.accountService.login(this.usernameValue, this.passwordValue);
    await this.openSnackBar(login);
    if(login) {
      this.accountService.loggedIn = true;
      this.cookieService.set('metro-logged-in', 'true');
      this.cookieService.set('metro-name', this.accountService.account!.username);
      return;
    }
    this.processingLogin = false;
  }

}

@Component({
  selector: 'app-login-snackbar',
  templateUrl: './login.snackbar.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginSnackbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit(): void {
  }

}
