import { Component, OnInit } from '@angular/core';
import { ClientDetailService } from './client-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/http/message.service'; 
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})

export class ClientComponent implements OnInit {

 
constructor(private router: Router, private route: ActivatedRoute, 
        private messageService: MessageService,
        private clientDetailService:ClientDetailService,
        private notifier:NotifierService) {
          this.fetchTotalApplications();
      }
      
      fetchTotalApplications() {
        this.clientDetailService.fetchTotalApplications()
          .subscribe(res=>{        
            if (res.errorCode != undefined && res.errorCode != 200) { 
              this.notifier.notify('error',res.errorCode)                 
            } else {
              this.clientDetailService = res;
            }
          });
      }
      ngOnInit(): void {
      }
      

    }

    

    
  

