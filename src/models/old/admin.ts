import { _IRole, _IPermission, _IAccountRole, _IRolePermission } from '../_db';
import { observable, runInAction } from 'mobx';
import { select } from '@/kit/req';
import { GET, POST_FORM } from '@/kit/req';

export interface IRole extends _IRole {}

export interface IPermission extends _IPermission {}

export interface IAccountRole extends _IAccountRole {}

export interface IRolePermission extends _IRolePermission {}

export class Role implements IRole {
  @observable id: number = 0;
  @observable name: string = '';
  @observable createAt: number = 0;

  async update(name: string) {
    const resp = await POST_FORM('/admin/role/update', { ...this, name });
    const ret = resp.data;
    if (ret.state === 'ok') {
      this.name = name;
      return;
    }
    throw 'error';
  }

  async delete() {
    const resp = await POST_FORM('/admin/role/delete', { id: this.id });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return;
    }
    throw ret.msg || 'error';
  }

  static from(i: IRole) {
    const instance = new Role();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<Role[]> {
    const roles = await select<IRole>(
      '/select/manager',
      `
        select * from role_m
      `
    );
    return observable(roles.map(Role.from));
  }
}

export class Permission implements IPermission {
  @observable id: number = 0;
  @observable actionKey: string = '';
  @observable controller: string = '';
  @observable remark?: string | undefined;

  async update(remark: string) {
    const resp = await POST_FORM('/admin/permission/update', {
      ...this,
      remark
    });
    const ret = resp.data;
    if (ret.state === 'ok') {
      this.remark = remark;
      return;
    }
    throw ret.msg || 'error';
  }

  async delete() {
    const resp = await POST_FORM('/admin/permission/delete', { id: this.id });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return;
    }
    throw ret.msg || 'error';
  }

  static from(i: IPermission) {
    const instance = new Permission();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<Permission[]> {
    const permissions = await select<IPermission>(
      '/select/manager',
      `
        select * from permission_m
      `
    );
    return observable(permissions.map(Permission.from));
  }
}

export class AccountRole implements IAccountRole {
  @observable accountId: number = 0;
  @observable roleId: number = 0;

  static from(i: IAccountRole) {
    const instance = new AccountRole();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<AccountRole[]> {
    const accountRoles = await select<IAccountRole>(
      '/select/manager',
      `
        select * from account_role_m
      `
    );
    return observable(accountRoles.map(AccountRole.from));
  }

  static async addRole(accountId: number, roleId: number) {
    const resp = await GET('/admin/account/addRole', { accountId, roleId });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return AccountRole.from({ accountId, roleId });
    }
    throw ret.msg || 'error';
  }

  static async deleteRole(accountId: number, roleId: number) {
    const resp = await GET('/admin/account/deleteRole', { accountId, roleId });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return;
    }
    throw ret.msg || 'error';
  }
}

export class RolePermission implements IRolePermission {
  @observable roleId: number = 0;
  @observable permissionId: number = 0;

  static from(i: IRolePermission) {
    const instance = new RolePermission();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<RolePermission[]> {
    const rolePermissions = await select<IRolePermission>(
      '/select/manager',
      `
        select * from role_permission_m
      `
    );
    return observable(rolePermissions.map(RolePermission.from));
  }

  static async addPermission(permissionId: number, roleId: number) {
    const resp = await GET('/admin/role/addPermission', {
      permissionId,
      roleId
    });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return RolePermission.from({ permissionId, roleId });
    }
    throw ret.msg || 'error';
  }

  static async deletePermission(permissionId: number, roleId: number) {
    const resp = await GET('/admin/role/deletePermission', {
      permissionId,
      roleId
    });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return;
    }
    throw ret.msg || 'error';
  }
}
