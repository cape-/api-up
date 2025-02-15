import { RequestHandler } from 'express';

export type HTTPMethod = 
  | "all" | "checkout" | "copy" | "delete" | "get" | "head" | "lock" | "merge"
  | "mkactivity" | "mkcol" | "move" | "m-search" | "notify" | "options" | "patch"
  | "post" | "purge" | "put" | "report" | "search" | "subscribe" | "trace"
  | "unlock" | "unsubscribe";

export interface EndpointParseResult {
  method: HTTPMethod;
  route: string;
}

export type EndpointValue = 
  | RequestHandler 
  | RequestHandler[] 
  | string 
  | Record<string, EndpointValue>;

export interface APIEndpoints {
  [key: string]: EndpointValue;
}

export interface RouterConfig {
  caseSensitive?: boolean;
  mergeParams?: boolean;
  strict?: boolean;
}