import { IsEnum } from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class UpdateStatusDto {
  @IsEnum(Status)
  status: Status;
}
