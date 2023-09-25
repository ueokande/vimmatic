export type MessageKey<Schema> = keyof Schema;

export type MessageRequest<
  Schema extends { [key: string]: { Request: unknown } },
> = Schema[keyof Schema]["Request"];

export type MessageResponse<
  Schema extends { [key: string]: { Response: unknown } },
> = Schema[keyof Schema]["Response"];
