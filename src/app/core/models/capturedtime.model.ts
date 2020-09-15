export class CapturedTimeModel {
  public Id: number;
  public UserId: number;
  public TaskId: number;
  public TaskName: string;
  public Rate: number;
  public StartTime: string;
  public EndTime: string;
  public Duration: number;
  public Color: number;

  constructor(Id: number,
    UserId: number,
    TaskId: number,
    Rate: number,
    StartTime: string,
    EndTime: string,
    Color: number
      ) {
    this.Id = Id;
    this.UserId = UserId;
    this.TaskId = TaskId;
    this.Rate = Rate;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
    this.Color = Color;
    this.getDuration();
  }

  getDuration()
  {
    let duration = 0;
    const d1 = new Date ( this.StartTime );
    const d2 = new Date ( this.EndTime );
    const hours = d2.getHours() - d1.getHours();
    const minutes = d2.getMinutes() - d1.getMinutes();

    duration = hours;
    this.Duration = duration;
  }
}
