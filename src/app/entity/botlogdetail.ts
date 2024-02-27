export class BotLogDetails {
    requestId!: string;
    userName!: string;
    userId!: string
    question!: string;
    response!: string;
    requestDate!: string;
    intent!: string;
    client!: number;
    serviceLogId!: number; 
  relativeTime: string | undefined;
  logs: any;
}
