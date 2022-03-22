import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoES from 'crypto-es';
import { CookieService } from 'ngx-cookie';
import { API_URL, PASSWORD_HASH } from 'src/environments/hash';
import { SafeAccount } from './adduser/adduser.component';

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
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private _loggedIn = false;
  currentlyLoggingOut = false;
  account?: Account;
  submittedLogin = false;

  gettingDeactivatedUsers = false;
  activatingUser = false;

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(loggedIn: boolean) {
    this._loggedIn = loggedIn;
    
    if(loggedIn === false) {
      this.cookieService.removeAll();
      delete this.account;
    } else {
      this.cookieService.put('metro-loggedin', 'true');
      this.cookieService.putObject('metro-account', this.account!);
    }
  }

  async activateAccount(username: string) {
    this.activatingUser = true;
    this.http.get<void>(`${API_URL}/activate/${username}`).subscribe();
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.activatingUser = false;
        resolve();
      }, 1000);
    });
    return true;
  }

  async deactivateAccount(username: string) {
    this.activatingUser = true;
    this.http.get<void>(`${API_URL}/deactivate/${username}`).subscribe();
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.activatingUser = false;
        resolve();
      }, 1000);
    });
    return true;
  }

  async getUsersAwaitingActivation(): Promise<SafeAccount[]> {
    let response = await new Promise<SafeAccount[]>(resolve => {
      let users: SafeAccount[];
      this.http.get<SafeAccount[]>(`${API_URL}/get-awaiting`).subscribe(res => {
        users = res;
      });
      setTimeout(() => {
        resolve(users);
      }, 1000);
    });
    return response;
  }

  async getActivatedUsers(): Promise<SafeAccount[]> {
    let response = await new Promise<SafeAccount[]>(resolve => {
      let users: SafeAccount[];
      this.http.get<SafeAccount[]>(`${API_URL}/get-activated`).subscribe(res => {
        users = res;
      });
      setTimeout(() => {
        resolve(users);
      }, 1000);
    });
    return response;
  }

  async getAccountInfo(username: string) {
    let response = await new Promise<Account>(resolve => {
      let account: Account;
      this.http.post<Account>(`${API_URL}/update`, { username: username }).subscribe(res => {
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
      this.http.post<Account>(`${API_URL}/login`, { username: username, password: encryptedPassword }).subscribe(res => {
        account = res;
      });
      setTimeout(() => {
        resolve(account);
      }, 2000);
    });
    if(response) {
      this.account = response;
      return true;
    }
    return false;
  }

  async changeCharacterName(username: string, charName: string) {
    let response = await new Promise<Account | { error: number }>(resolve => {
      let account: Account | { error: number };
      this.http.post<Account | { error: number }>(`${API_URL}/set-name`, { username: username, characterName: charName }).subscribe(res => {
        console.log(res);
        account = res;
      });
      setTimeout(() => {
        resolve(account);
      }, 3000);
    });
    if(response) {
      console.log(response);
      const keys = Object.keys(response);
      if(keys[0] === 'error') {
        return (<{ error: number }>response).error;
      }
      this.account = <Account>response;
      return 2;
    } else {
      return -2;
    }
  }

  async register(username: string, password: string) {
    const encryptedPassword = CryptoES.HmacSHA256(password, PASSWORD_HASH).toString();
    let ipAddress = await new Promise<string>(resolve => {
      this.http.get("https://api.ipify.org/?format=json").subscribe((res: any)=>{
        setTimeout(() => {
          resolve(res.ip);
        }, 1000);
      });
    });
    console.log(ipAddress);

    let response = await new Promise<Account>(resolve => {
      let account: Account;
      this.http.post<Account>(`${API_URL}/register`, { username: username, password: encryptedPassword, ipAddress: ipAddress }).subscribe(res => {
        account = res;
      });
      setTimeout(() => {
        resolve(account);
      }, 3000);
    });
    if(response) {
      this.account = response;
      return true;
    }
    return false;
  }
}
