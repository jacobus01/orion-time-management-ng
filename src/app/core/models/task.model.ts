export class TaskModel {
  public Id: number;
  public TaskName: string;
  public Duration: number;

  constructor(Id: number,
              TaskName: string,
              Duration: number
      ) {
    this.Id = Id;
    this.TaskName = TaskName;
    this.Duration = Duration;
  }
}
