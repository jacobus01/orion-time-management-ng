export class AccessGroupModel {
  public id: number;
  public accessGroupName: string;

  constructor(Id: number,
    AccessGroupName: string,
              Rate: number
      ) {
    this.id = Id;
    this.accessGroupName = AccessGroupName;
  }
}
