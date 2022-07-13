import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AccountService } from '../account.service';

type PermissionsChecked = {
  [id: number]: {
    [permission: string]: boolean;
  }
}

type RankEdited = {
  [rankId: number]: boolean;
}

type PowersEdited = {
  [rankId: number]: {
    modifyPower: boolean;
    neededPower: boolean;
  }
}

type ModifyPowers = {
  [rankId: number]: {
    neededModifyPower: number;
    modifyPower: number;
  }
}

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  constructor(public accountService: AccountService, private _snackBar: MatSnackBar) { }

  openSnackBar(success: boolean, rankId: number, error?: string) {
    this._snackBar.openFromComponent(SavedSnackbar, { duration: 4000, panelClass: success ? 'success' : 'failure', data: { rankId: rankId, error: error } });
  }

  permissions = [
    'add_to_swat',
    'add_to_trt',
    'edit_rank_data',
    'make_sniper',
    'make_upr'
  ];

  onKeyDown(rankId: number, e: KeyboardEvent, power: 'neededModifyPower' | 'modifyPower') {
    if(e.code !== 'Enter' && e.code !== 'Escape' && !e.code.includes('Digit')) {
      e.preventDefault();
    }
    const el = (<HTMLInputElement>e.target);
    if(e.code === 'Escape') {
      el.value = this.initialPowers[rankId][power].toString();
      el.readOnly = true;
      return;
    }
    if(e.code === 'Enter') {
      el.readOnly = true;
      if(Number(el.value) !== this.initialPowers[rankId][power]) {
        this.permissionsChanged[rankId] = true;
        this.newPowers[rankId][power] = Number(el.value);
      }
    }
  }

  havePermissionsChanged(rankId: number): boolean {
    const permSet1 = this.newPermissions[rankId];
    const permSet2 = this.initialPermissions[rankId];
    const set1 = Object.entries(permSet1);
    const set2 = Object.entries(permSet2);
    for(const entry in set1) {
      if(set1[entry][1] !== set2[entry][1]) {
        return true;
      }
    }

    const permSet3 = this.newPowers[rankId];
    const permSet4 = this.initialPowers[rankId];
    const set3 = Object.entries(permSet3);
    const set4 = Object.entries(permSet4);
    for(const entry in set3) {
      if(set3[entry][1] !== set4[entry][1]) {
        return true;
      }
    }
    return false;
  }

  async savePermissions(rankId: number) {
    if(!this.havePermissionsChanged(rankId)) {
      return;
    }
    const res = await this.accountService.savePermissions(rankId, this.newPermissions[rankId], this.newPowers[rankId]);
    this.openSnackBar(res.success, rankId, res.error);
    if(res.success) {
      for(const prop in this.initialPermissions[rankId]) {
        this.initialPermissions[rankId][prop] = this.newPermissions[rankId][prop];
      }
      let power: 'modifyPower' | 'neededModifyPower';
      for(power in this.initialPowers[rankId]) {
        this.initialPowers[rankId][power] = this.newPowers[rankId][power];
      }
      this.permissionsChanged[rankId] = false;
    }
  }

  newPermissions: PermissionsChecked = {};
  initialPermissions: PermissionsChecked = {};

  initialPowers: ModifyPowers = {};
  newPowers: ModifyPowers = {};

  permissionsChanged: RankEdited = {};
  powersChanged: PowersEdited = {};

  permissionEnabled(rankId: number, permission: string, newValue: boolean) {
    this.newPermissions[rankId][permission] = newValue;
    const res = this.havePermissionsChanged(rankId);
    this.permissionsChanged[rankId] = res;
  }

  ngOnInit(): void {
    for (const rank of this.accountService.ranks) {
      this.permissionsChanged[rank.id] = false;
      this.newPermissions[rank.id] = {};
      this.initialPermissions[rank.id] = {};
      
      this.initialPowers[rank.id] = {
        modifyPower: rank.modify_power,
        neededModifyPower: rank.needed_modify_power
      };

      this.newPowers[rank.id] = {
        modifyPower: rank.modify_power,
        neededModifyPower: rank.needed_modify_power
      };

      this.powersChanged[rank.id] = {
        neededPower: false,
        modifyPower: false
      }

      for (const perm of this.permissions) {
        this.initialPermissions[rank.id][perm] = rank.permissions.includes(perm);
        this.newPermissions[rank.id][perm] = rank.permissions.includes(perm);
      }
    }
  }
}



@Component({
  selector: 'app-saved-snackbar',
  templateUrl: './saved.snackbar.html',
  styleUrls: ['./permissions.component.scss']
})
export class SavedSnackbar implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit(): void {
  }

}