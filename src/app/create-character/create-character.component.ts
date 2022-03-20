import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent implements OnInit {

  constructor(public accountService: AccountService, private _snackBar: MatSnackBar, private cookieService: CookieService) { }

  showErrorSnackbar(msg: string, panelClass = 'failure') {
    this._snackBar.openFromComponent(CharacterErrorSnackBar, { duration: 5000, panelClass: panelClass, data: { message: msg } });
  }

  matcher = new CharacterNameErrorStateMatcher();

  nameValue!: string;
  processingCharacter = false;

  characterNameControl = new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{1}[A-Za-z]{1,} [A-Z]{1}[A-Za-z]{1,}$/)]);

  ngOnInit(): void {

  }

  async setName() {
    this.processingCharacter = true;
    const result = await this.accountService.changeCharacterName(this.accountService.account!.username, this.nameValue);
    switch (result) {
      case 2:
        this.showErrorSnackbar(`Character name successfully changed to <i>${this.nameValue}</i>!`, 'success');
        this.cookieService.putObject('metro-account', this.accountService.account!);
        break;
        
      case 1:
        this.showErrorSnackbar(`Could not find an account with username <i>${this.accountService.account!.username}</i>.`);
        break;
          
      case 0:
        this.showErrorSnackbar(`The name <i>${this.nameValue}</i> is taken.`);
        break;
      
      case -1:
        this.showErrorSnackbar(`Database update failed.`);
        break;

      case -2:
        this.showErrorSnackbar(`No response from server.`);
        break;
    }
  }

}

@Component({
  selector: 'character-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CharacterErrorSnackBar implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit(): void {
  }

}


export class CharacterNameErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}