/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');


const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../../../test-application/javascript/AppUtil.js');
const { Certificate } = require('crypto');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */

 async function initiateContract() {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();


        try {
           
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);
            await contract.submitTransaction('InitLedger');
            return contract;

        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

const getAllBlockchainData = () => {
    try {
        const contract = initiateContract();
        let result = await contract.evaluateTransaction('GetAllAssets');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    } catch (error) {
        
    }
   
}

const submitDataToBlockchain = async (payrollData) => {
    try {

        // const payrollData = [
        //     {
        //         ID: 'payrollID12',
        //         HmrcOfficeNumber: 'some-digit-12345',
        //         EmployeePayeeReference: "some-refereece",
        //         Owner: "some-name_id",
        //         AccountOfficeReference: "some-reference-for-acount",
        //         NationalInsuranceNumber: "national-insurance-data",
        //         Title: "Mr",
        //         Surname:"Akande",
        //         Lastname: "David",
        //         InitialName: "some-values",
        //         DateOfBirth: new Date().toString(),
        //         Address:"some-address",
        //         PostCode:"345-tr345",
        //         PayrollId:"asdafadf",
        //         TaxReduction:20,
        //         Salary: 457678

        //     },
        //     {
        //         ID: 'payrollID16',
        //         HmrcOfficeNumber: 'some-digit-123c34',
        //         EmployeePayeeReference: "some-refereece",
        //         Owner: "some-name_id2",
        //         AccountOfficeReference: "some-reference-for-acount2",
        //         NationalInsuranceNumber: "national-insurance-data2",
        //         Title: "Mr",
        //         Surname:"Oluwatosin",
        //         Lastname: "Akande",
        //         DateOfBirth: new Date().toString(),
        //         Address:"some-address2",
        //         PostCode:"345-tr3452",
        //         PayrollId:"asdafadf2",
        //         TaxReduction:1045,
        //         Salary: 45767,
        //     },
        //     {
        //         ID: 'payrollID17',
        //         HmrcOfficeNumber: 'some-digit-123c333',
        //         EmployeePayeeReference: "some-refereece33",
        //         Owner: "some-name_id33",
        //         AccountOfficeReference: "some-reference-for-acount42",
        //         NationalInsuranceNumber: "national-insurance-data42",
        //         Title: "Mr",
        //         Surname:"Sammyed",
        //         Lastname: "Akandeda",
        //         DateOfBirth: new Date().toString(),
        //         Address:"some-address32",
        //         PostCode:"345-tr345243",
        //         PayrollId:"asdafadf26e",
        //         TaxReduction:1043,
        //         Salary: 457348
        //     },
        // ];

        const contract = initiateContract();
        await contract.submitTransaction('CreateAsset', JSON.stringify(payrollData));
        console.log('*** Result: committed');
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
       
}

const updateDataBlockchain = async(payrollData) => {
    const contract = initiateContract();
    const updatAsset =  {
        ID: 'payrollID2',
        HmrcOfficeNumber: 'some-digit-123c333',
        EmployeePayeeReference: "some-refereece33",
        Owner: "some-name_id33",
        AccountOfficeReference: "some-reference-for-acount42",
        NationalInsuranceNumber: "national-insurance-data42",
        Title: "Mr",
        Surname:"New Owner",
        Lastname: "Oluwatosin",
        DateOfBirth: new Date().toString(),
        Address:"some-address32",
        PostCode:"345-tr345243",
        PayrollId:"asdafadf26e",
        TaxReduction:1043,
        Salary: 457348
    };
    await contract.submitTransaction('UpdateAsset', JSON.stringify(updatAsset));
    console.log('*** Result: committed');
}

const readSingleData = () => {
    const contract = initiateContract();
    result = await contract.evaluateTransaction('ReadAsset', 'payrollID2');
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
}

initiateContract();


