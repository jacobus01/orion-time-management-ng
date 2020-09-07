export class RoleModel {
  public Id: number;
  public RoleName: string;
  public Rate: number;

  constructor(Id: number,
              RoleName: string,
              Rate: number
      ) {
    this.Id = Id;
    this.RoleName = RoleName;
    this.Rate = Rate;
  }
}
