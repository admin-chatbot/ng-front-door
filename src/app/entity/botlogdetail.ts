export class BotLogDetails {
    requestId!: number;
    userName!: string;
    userId!: string
    question!: string;
    response!: string;
     requestDate!: string;
    isIntentFound: any;
    client!: string;
    serviceLogId!: string; 
  relativeTime: string | undefined;
  logs: any;
}
