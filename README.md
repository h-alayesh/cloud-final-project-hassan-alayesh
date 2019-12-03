# Serverless Bicket

a simple Bill Bucket application implemented using AWS Lambda and Serverless framework. 

# Functionality of the application

This appliation will allow to create/remove/update/get Bills. Each Bill can optionally have an attachment image. Each user only has access to Bills that he/she has created. 

# Functions implemented

The following functions are implemented and configured in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.
* `GetBills` - should return all Bills for a current user. 
* `CreateBill` - should create a new Bill for a current user. A shape of data send by a client application to this function can be found in the `CreateBillRequest.ts` file
* `UpdateBill` - should update a Bill created by a current user. A shape of data send by a client application to this function can be found in the `UpdateBillRequest.ts` file
* `DeleteBill` - should delete a Bill created by a current user. Expects an id of a Bill to remove.
* `GenerateUploadUrl` - returns a presigned url that can be used to upload an attachment file for a Bill. 

All functions are already connected to appriate events from API gateway

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Bicket application.

