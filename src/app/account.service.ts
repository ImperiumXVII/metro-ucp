import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoES from 'crypto-es';
import { CookieService } from 'ngx-cookie';
import { PASSWORD_HASH } from 'src/environments/hash';
import { environment } from 'src/environments/environment';
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

export interface Rank {
  id: number;
  name: string;
  needed_modify_power: number;
  modify_power: number;
  permissions: string[];
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

  ranks: Rank[] = [];
  rankName: string = '';

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

  async savePermissions(rankId: number, permissions: { [permission: string]: boolean; }) {
    const result = await new Promise<{ success: boolean; error: string }>(resolve => {
      this.http.post<{ success: boolean; error: string }>(`${environment.API_URL}/permissions/save`, { rankId: rankId, permissions: permissions }).subscribe((result) => {
        resolve(result);
      });
    });
    return {
      success: result.success,
      error: result.error
    }
  }

  async activateAccount(username: string) {
    this.activatingUser = true;
    await new Promise<void>(resolve => {
      this.http.get<void>(`${environment.API_URL}/activate/${username}`).subscribe(() => {
        this.activatingUser = false;
        resolve();
      });
    });
    return true;
  }

  async getRanks(): Promise<Rank[]> {
    const ranks = await new Promise<Rank[]>(resolve => {
      this.http.get<Rank[]>(`${environment.API_URL}/getranks`).subscribe((rank) => resolve(rank));
    });
    return ranks;
  }

  async deactivateAccount(username: string) {
    this.activatingUser = true;
    await new Promise<void>(resolve => {
      this.http.get<void>(`${environment.API_URL}/deactivate/${username}`).subscribe(() => {
        this.activatingUser = false;
        resolve();
      });
    });
    return true;
  }

  async getUsersAwaitingActivation(): Promise<SafeAccount[]> {
    let response = await new Promise<SafeAccount[]>(resolve => {
      this.http.get<SafeAccount[]>(`${environment.API_URL}/get-awaiting`).subscribe(res => {
        resolve(res);
      });
    });
    return response;
  }

  async getActivatedUsers(): Promise<SafeAccount[]> {
    let response = await new Promise<SafeAccount[]>(resolve => {
      this.http.get<SafeAccount[]>(`${environment.API_URL}/get-activated`).subscribe(res => {
        resolve(res);
      });
    });
    return response;
  }

  async getAccountInfo(username: string) {
    let response = await new Promise<Account>(resolve => {
      this.http.post<Account>(`${environment.API_URL}/update`, { username: username }).subscribe(res => {
        resolve(res);
      });
    });
    if(response) {
      this.account = response;
    }
  }

  async login(username: string, password: string) {
    const encryptedPassword = CryptoES.HmacSHA256(password, PASSWORD_HASH).toString();
    let response = await new Promise<Account>(resolve => {
      this.http.post<Account>(`${environment.API_URL}/login`, { username: username, password: encryptedPassword }).subscribe(res => {
        resolve(res);
      });
    });
    if(response) {
      this.account = response;
      return true;
    }
    return false;
  }

  async changeCharacterName(username: string, charName: string) {
    let response = await new Promise<Account | { error: number }>(resolve => {
      this.http.post<Account | { error: number }>(`${environment.API_URL}/set-name`, { username: username, characterName: charName }).subscribe(res => {
        resolve(res);
      });
    });
    if(response) {
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
      this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) =>{
        resolve(res.ip);
      }, () => {
        resolve('0.0.0.0');
      });
    });

    let response = await new Promise<Account>(resolve => {
      this.http.post<Account>(`${environment.API_URL}/register`, { username: username, password: encryptedPassword, ipAddress: ipAddress }).subscribe(res => {
        resolve(res);
      });
    });
    if(response) {
      this.account = response;
      return true;
    }
    return false;
  }
}
