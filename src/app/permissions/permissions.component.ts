import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AccountService } from '../account.service';

type PermissionsChecked = {
  [id: number]: {
    [permission: string]: boolean;
  }
}

type RankEdited = {
  [permission: string]: boolean;
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
    return false;
  }

  async savePermissions(rankId: number) {
    if(!this.havePermissionsChanged(rankId)) {
      return;
    }
    const res = await this.accountService.savePermissions(rankId, this.newPermissions[rankId]);
    this.openSnackBar(res.success, rankId, res.error);
    if(res.success) {
      for(const prop in this.initialPermissions[rankId]) {
        this.initialPermissions[rankId][prop] = this.newPermissions[rankId][prop];
        this.permissionsChanged[rankId] = false;
      }
    }
  }

  newPermissions: PermissionsChecked = {};
  initialPermissions: PermissionsChecked = {};

  permissionsChanged: RankEdited = {};

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