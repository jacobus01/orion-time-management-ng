export class RoleModel {
  public id: number;
  public roleName: string;
  public rate: number;

  constructor(Id: number,
              RoleName: string,
              Rate: number
      ) {
    this.id = Id;
    this.roleName = RoleName;
    this.rate = Rate;
  }
}
