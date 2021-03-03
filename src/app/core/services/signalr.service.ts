import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment} from "../../../environments/environment";
declare var $: any;

@Injectable({
    providedIn: 'root'
  })
export class SignalrService {

    private connection: any;
    private proxyOperatorHub: any;
    private proxyExceptionHub: any;
    private proxyEngineHub: any;
    messageReceivedRulesEvent = new EventEmitter<{ taskName: string, taskStatus: number }>();
    metricReceivedEvent = new EventEmitter<{ metric: string }>();
    exceptionReceivedEvent = new EventEmitter<{ exception: string }>();
    engineInfoReceivedEvent = new EventEmitter<string>();
    engineInfoReceivedEventParamz = new EventEmitter<{message: string, paramz: object[]}>();
    connectionEstablished = new EventEmitter<Boolean>();
    private connectionIsEstablished = false;

    constructor() { }
    // public initializeSignalRConnection(): void {
    //     const signalRServerEndPoint =  environment.signalrEndpoint;
    //     this.connection = $.hubConnection(signalRServerEndPoint);
    //     this.proxyOperatorHub = this.connection.createHubProxy('OperatorHub');
    //     this.proxyExceptionHub = this.connection.createHubProxy('ExceptionHub');
    //     this.proxyEngineHub = this.connection.createHubProxy('EngineHub');
    //     this.connection.start().then(() => {
    //         this.connectionIsEstablished = true;
    //         console.log('Hub connection started');
    //         this.connectionEstablished.emit(true);
    //     })
    //         .catch(err => {
    //             console.log('Error while establishing connection, retrying...');
    //             //setTimeout(this.initializeSignalRConnection(), 5000);
    //         });
    //     this.proxyOperatorHub.on('ReceiveRule', (serverMessage, rule) => this.onMessageReceivedRule(serverMessage, rule));
    //     this.proxyOperatorHub.on('ReceiveMetric', (metric) => this.onMetricReceived(metric));
    //     this.proxyExceptionHub.on('ReceiveException', (exception) => this.onExceptionReceived(exception));
    //     this.proxyEngineHub.on('ReceiveInfo', (message) => this.onEngineReceivedInfo(message));
    //     this.proxyEngineHub.on('ReceiveInfo', (message, paramz) => this.onEngineReceivedInfoParams(message,paramz));

    }
    //private broadcastMessage(): void {
    //  this.proxy.invoke('Send', 'text message')
    //    .catch((error: any) => {
    //      console.log('broadcastMessage error -> ' + error);
    //    });
    //}

//     private onMessageReceivedRule(serverMessage: string, rule : string) {
//         console.log('New message received from Server: ' + serverMessage);
//         this.messageReceivedRulesEvent.emit({ taskName: serverMessage, taskStatus: 2 });
//     }

//     private onMetricReceived(metric: string) {
//         console.log('New metric received from Server: ' + metric);
//         this.metricReceivedEvent.emit({ metric });
//     }

//     private onExceptionReceived(exception: string) {
//         console.log('New exception received from Server: ' + exception);
//         this.exceptionReceivedEvent.emit({ exception });
//     }

//     private onEngineReceivedInfo(info: string) {
//         console.log('New exception received from Server: ' + info);
//         this.engineInfoReceivedEvent.emit(info );
//     }

//     private onEngineReceivedInfoParams(message: string,paramz: object[]) {
//         console.log('New exception received from Server: ' + message);
//         this.engineInfoReceivedEventParamz.emit({message,paramz});
//     }
// }






//import { EventEmitter, Injectable } from '@angular/core';
//import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
//import { ChatMessage } from '../Models/chatmessage.model';

//@Injectable()
//export class SignalRService {
//  messageReceived = new EventEmitter<ChatMessage>();
//  connectionEstablished = new EventEmitter<Boolean>();

//  private connectionIsEstablished = false;
//  private _hubConnection: HubConnection;

//  constructor() {
//    this.createConnection();
//    this.registerOnServerEvents();
//    this.startConnection();
//  }

//  sendChatMessage(message: ChatMessage) {
//    this._hubConnection.invoke('SendMessage', message);
//  }

//  private createConnection() {
//    this._hubConnection = new HubConnectionBuilder()
//      .withUrl(window.location.href + 'chathub')
//      .build();
//  }

//  private startConnection(): void {
//    this._hubConnection
//      .start()
//      .then(() => {
//        this.connectionIsEstablished = true;
//        console.log('Hub connection started');
//        this.connectionEstablished.emit(true);
//      })
//      .catch(err => {
//        console.log('Error while establishing connection, retrying...');
//        setTimeout(this.startConnection(), 5000);
//      });
//  }

//  private registerOnServerEvents(): void {
//    this._hubConnection.on('ReceiveMessage', (data: any) => {
//      this.messageReceived.emit(data);
//    });
//  }
//}
