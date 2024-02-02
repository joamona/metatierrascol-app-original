import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  //message service in this case must be public, in order to be available from the template.
  //angular only binds public component properties with the templates
  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}