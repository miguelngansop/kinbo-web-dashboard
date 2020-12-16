
export interface Permission {
  permDescription: string;
  permId: string;
}

export interface Role {
  permissions: Permission[];
  roleDescription: string;
  roleId: string;
  roleName: string;

  permissionIds: string[],
}
