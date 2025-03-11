/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "ALLOWED_EXTERNAL_EMAILS": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DB_CONNECTION_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Frontend": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
    "GOOGLE_CLIENT_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GOOGLE_CLIENT_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "IdentityPool": {
      "id": string
      "type": "sst.aws.CognitoIdentityPool"
    }
    "Main": {
      "bastion": string
      "type": "sst.aws.Vpc"
    }
    "Postgres": {
      "database": string
      "host": string
      "password": string
      "port": number
      "type": "sst.aws.Postgres"
      "username": string
    }
    "PreAuthHandler": {
      "name": string
      "type": "sst.aws.Function"
    }
    "Users": {
      "id": string
      "type": "sst.aws.CognitoUserPool"
    }
    "Web": {
      "id": string
      "secret": string
      "type": "sst.aws.CognitoUserPoolClient"
    }
    "zero-replication-bucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}