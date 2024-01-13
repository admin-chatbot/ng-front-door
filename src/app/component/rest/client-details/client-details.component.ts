import { Component, OnInit } from '@angular/core';
import { ClientDetailService, ClientDetail } from './client-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientComponent implements OnInit {
  clientDetail: ClientDetail={} as ClientDetail;
  // Declare clientDetailService as public
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public clientDetailService: ClientDetailService, // Change here
    private notifier: NotifierService
  ) {}

  fetchTotalApplications() {
    this.clientDetailService.fetchTotalApplications().subscribe(
      (res) => {
        if (res.errorCode != undefined && res.errorCode != 200) {
          this.notifier.notify('error', res.errorCode);
        } else {
          this.clientDetailService.applications = res;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchClientDetails() {
    this.clientDetailService.fetchClientDetails().subscribe(
      (res) => {
        if (res.errorCode != undefined && res.errorCode != 200) {
          this.notifier.notify('error', res.errorCode);
        } else {
          this.clientDetail = res.data;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchTotalApplications();
    this.fetchClientDetails();
  }
}
