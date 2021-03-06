import * as express from "express";
import { Version } from "./version";
export * from './errors';
export declare enum Method {
    get = 0,
    post = 1,
    put = 2,
    delete = 3,
}
export interface Request {
    data: any;
    session: any;
    user?: any;
    params?: any;
    version: Version;
}
export declare type Promise_Or_Void = Promise<void> | void;
export declare type Request_Processor = (request: Request) => Promise<Request>;
export declare type Response_Generator = (request: Request) => Promise<any>;
export declare type Filter = (request: Request) => Promise_Or_Void;
export declare type Validator = (data: any) => boolean;
export interface Endpoint_Info {
    method: Method;
    path: string;
    action: Response_Generator;
    middleware?: any[];
    filter?: Filter;
    validator?: Validator;
}
export interface Optional_Endpoint_Info {
    method?: Method;
    path?: string;
    action?: Response_Generator;
    middleware?: any[];
    filter?: Filter;
}
export declare function create_handler(endpoint: Endpoint_Info, action: any, ajv: any): (req: any, res: any) => void;
export declare function attach_handler(app: express.Application, endpoint: Endpoint_Info, handler: any): void;
export declare function create_endpoint(app: express.Application, endpoint: Endpoint_Info, preprocessor?: Request_Processor, ajv?: any): void;
export declare function create_endpoint_with_defaults(app: express.Application, endpoint_defaults: Optional_Endpoint_Info, endpoint: Optional_Endpoint_Info, preprocessor?: Request_Processor): void;
export declare function create_endpoints(app: express.Application, endpoints: Endpoint_Info[], preprocessor?: Request_Processor, ajv?: any): void;
export declare function createEndpoints(app: express.Application, endpoints: Endpoint_Info[], preprocessor?: Request_Processor, ajv?: any): void;
