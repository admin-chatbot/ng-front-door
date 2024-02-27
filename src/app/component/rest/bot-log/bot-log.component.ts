import { Component, OnInit } from '@angular/core';
import { BotLogService } from './bot-log.service';
import { BotLogDetails } from 'src/app/entity/botlogdetail';
import { SelectedLogDetails } from 'src/app/entity/selectedLog';

@Component({
  selector: 'app-chat',
  templateUrl: './bot-log.component.html',
  styleUrls: ['./bot-log.component.css']
})
export class ChatComponent implements OnInit {
  userId: any;
  botLog: BotLogDetails[] = [];
  name: any;
  selectedLogs: SelectedLogDetails[] = [];
responseDetails: any;

  constructor(private botLogService: BotLogService) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.fetchBotLogRequests();
   
  }

  fetchBotLogRequests() {
    this.botLogService.fetchBotLogRequests(this.userId)
      .subscribe(response => {
        //alert(JSON.stringify(response));
        this.botLog = response.data;

        // Add relative time property to each log entry
        // this.botLog.forEach(log => {
        //   log.relativeTime = this.calculateRelativeTime(log.requestDate);
        // });
      });
  }

  fetchResponse(log: BotLogDetails) {
    this.botLogService.fetchResponse(log.requestId)
      .subscribe(response => {
        alert(JSON.stringify(response));
        this.selectedLogs = response.data;

      });
  }
  
//   fetchResponse(log: BotLogDetails) {
//     // Call the API to get the response based on the request ID
//     this.botLogService.fetchResponse(log.requestId)
//      .subscribe(response => {
//       console.log('Response from fetchResponse API:', response);
//       if (response && response.data) {
//         // Add the selected log to the list
//         this.selectedLog = response.data;
//       } else {
//         console.error('Invalid response format from fetchResponse API:', response);
//       }
//     },
//     error => {
//       console.error('Error in fetchResponse API:', error);
//     }
//   );
// }
  calculateRelativeTime(requestDate: string): string {
    const today = new Date();
    const logDate = new Date(requestDate);

    // Check if the log date is today
    if (logDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // Check if the log date is yesterday
    const yesterday = new Date(requestDate);
    yesterday.setDate(today.getDate() - 1);
    if (logDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Check if the log date is within the previous week
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    if (logDate > lastWeek) {
      return 'Within the previous week';
    }

    // If none of the above conditions match, return the full date
    return logDate.toLocaleDateString();
  }

}
