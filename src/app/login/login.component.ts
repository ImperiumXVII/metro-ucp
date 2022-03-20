import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private accountService: AccountService, private _snackBar: MatSnackBar, private router: Router) { }

  loginUsernameControl = new FormControl('', [Validators.required]);
  loginPasswordControl = new FormControl('', [Validators.required]);

  matcher = new LoginErrorStateMatcher();

  openSnackBar(success: boolean, message: string) {
    this._snackBar.openFromComponent(LoginSnackbarComponent, { duration: 3000, panelClass: success ? 'success' : 'failure', data: { success: message } });
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
    this.loginPasswordControl.markAsTouched();
    this.loginUsernameControl.markAsTouched();
    if(this.matcher.isErrorState(this.loginUsernameControl, null) || this.matcher.isErrorState(this.loginPasswordControl, null)) {
      return;
    }

    this.processingLogin = true;
    const login = await this.accountService.login(this.usernameValue, this.passwordValue);
    await this.openSnackBar(login, login ? `Successfully logged in as ${this.usernameValue}!` : `Login failed - incorrect username or password.`);
    if(login) {
      this.accountService.loggedIn = true;
      this.router.navigateByUrl('/');
      return;
    }
    this.processingLogin = false;
  }

  async processRegister() {
    this.loginPasswordControl.markAsTouched();
    this.loginUsernameControl.markAsTouched();
    if(this.matcher.isErrorState(this.loginUsernameControl, null) || this.matcher.isErrorState(this.loginPasswordControl, null)) {
      return;
    }

    this.processingLogin = true;
    const login = await this.accountService.register(this.usernameValue, this.passwordValue);
    await this.openSnackBar(login, login ? `Successfully registered with the username ${this.usernameValue}!` : `Registration failed - an account with this username already exists.`);
    if(login) {
      this.accountService.loggedIn = true;
      this.router.navigateByUrl('/');
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

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}