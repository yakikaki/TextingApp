import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Services } from '../utils/constants';
import { Group, GroupMessage } from '../utils/typeorm';
import { GroupMessageController } from './controllers/group-messages.controller';
import { GroupRecipientsController } from './controllers/group-recipients.controller';
import { GroupController } from './controllers/group.controller';
import { GroupMessageService } from './services/group-messages.service';
import { GroupRecipientService } from './services/group-recipient.service';
import { GroupService } from './services/group.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Group, GroupMessage])],
  controllers: [
    GroupController,
    GroupMessageController,
    GroupRecipientsController,
  ],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessageService,
    },
    {
      provide: Services.GROUP_RECIPIENTS,
      useClass: GroupRecipientService,
    },
  ],
  exports: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
  ],
})
export class GroupModule {}
