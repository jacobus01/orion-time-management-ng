export class EmployeeModel {
  public Id: number;
  public UserName: string;
  public Password: string;
  public ChangePasswordOnNextLogin: boolean;
  public Email: string;
  public EmployeeNumber: string;
  public FirstName: string;
  public LastName: string;
  public AppointmentDate: string;
  public IsActive: boolean;
  public RoleId: number;
  public AccessGroupId: number;
  public LockoutEnabled: boolean;


  constructor(Id: number,
              UserName: string,
              Password: string ,
              ChangePasswordOnNextLogin: boolean,
              Email: string,
              EmployeeNumber: string,
              FirstName: string,
              LastName: string,
              AppointmentDate: string,
              IsActive: boolean,
              RoleId: number,
              AccessGroupId: number,
              LockoutEnabled: boolean
      ) {
    this.Id = Id;
    this.UserName = UserName;
    this.Password = Password;
    this.ChangePasswordOnNextLogin = ChangePasswordOnNextLogin;
    this.Email = Email;
    this.EmployeeNumber = EmployeeNumber;
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.AppointmentDate = AppointmentDate;
    this.IsActive = IsActive;
    this.RoleId = RoleId;
    this.AccessGroupId = AccessGroupId;
    this.LockoutEnabled = LockoutEnabled;
  }
}
