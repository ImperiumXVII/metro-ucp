import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoES from 'crypto-es';
import { PASSWORD_HASH } from 'src/environments/hash';

export interface Account {
  id: number;
	username: string;
	password: string;
	admin_level: number;
	rank: number;
	character_name: any;
	ip_address: string;
	platoon_a_cmd: boolean;
	platoon_d_cmd: boolean;
	awaiting_approval: boolean;
	d_platoon: boolean;
	a_platoon: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {}

  private _loggedIn = false;
  account?: Account;

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(loggedIn: boolean) {
    this._loggedIn = loggedIn;
  }

  async getAccountInfo(username: string) {
    let response = await new Promise<Account>(resolve => {
      let account: Account;
      this.http.post<Account>(`http://localhost:3000/update`, { username: username }).subscribe(res => {
        account = res;
      });
      setTimeout(() => {
        resolve(account);
      }, 1000);
    });
    if(response) {
      this.account = response;
    }
  }

  async login(username: string, password: string) {
    const encryptedPassword = CryptoES.HmacSHA256(password, PASSWORD_HASH).toString();
    let response = await new Promise<Account>(resolve => {
      let account: Account;
      this.http.post<Account>(`http://localhost:3000/login`, { username: username, password: encryptedPassword }).subscribe(res => {
        account = res;
      });
      setTimeout(() => {
        resolve(account);
      }, 1000);
    });
    if(response) {
      this.account = response;
      return true;
    }
    return false;
  }
}
