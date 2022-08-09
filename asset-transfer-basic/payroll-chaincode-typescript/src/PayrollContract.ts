/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import {PayrollData} from './payrollData';

@Info({title: 'PayrollContracts', description: 'Smart contract for payroll-datas'})
export class PayrollContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const payrollData: PayrollData[] = [
            {
                ID: 'payrollID1',
                HmrcOfficeNumber: 'some-digit-1234',
                EmployeePayeeReference: "some-refereece",
                Owner: "some-name_id",
                AccountOfficeReference: "some-reference-for-acount",
                NationalInsuranceNumber: "national-insurance-data",
                Title: "Mr",
                Surname:"Akande",
                Lastname: "David",
                InitialName: "some-values",
                DateOfBirth: new Date(),
                Address:"some-address",
                PostCode:"345-tr345",
                PayrollId:"asdafadf",
                TaxReduction:20,
                Salary: 457678

            },
            {
                ID: 'payrollID2',
                HmrcOfficeNumber: 'some-digit-123c34',
                EmployeePayeeReference: "some-refereece",
                Owner: "some-name_id2",
                AccountOfficeReference: "some-reference-for-acount2",
                NationalInsuranceNumber: "national-insurance-data2",
                Title: "Mr",
                Surname:"Oluwatosin",
                Lastname: "Akande",
                DateOfBirth: new Date(),
                Address:"some-address2",
                PostCode:"345-tr3452",
                PayrollId:"asdafadf2",
                TaxReduction:1045,
                Salary: 45767,
            },
            {
                ID: 'payrollID4',
                HmrcOfficeNumber: 'some-digit-123c33',
                EmployeePayeeReference: "some-refereece3",
                Owner: "some-name_id3",
                AccountOfficeReference: "some-reference-for-acount4",
                NationalInsuranceNumber: "national-insurance-data4",
                Title: "Mr",
                Surname:"Sammy",
                Lastname: "Akande",
                DateOfBirth: new Date(),
                Address:"some-address3",
                PostCode:"345-tr34524",
                PayrollId:"asdafadf26",
                TaxReduction:1049,
                Salary: 457348
            },
            
        ];

        for (const data of payrollData) {
            await ctx.stub.putState(data.ID, Buffer.from(JSON.stringify(payrollData)));
            console.info(`PayrollData ${data.ID} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    @Transaction()
    public async CreateAsset(ctx: Context, payrollData:PayrollData[]): Promise<void> {
        for (const data of payrollData) {
            await ctx.stub.putState(data.ID, Buffer.from(JSON.stringify(payrollData)));
            console.info(`PayrollData ${data.ID} initialized`);
        }
    }

    // ReadAsset returns the asset stored in the world state with given id.
    @Transaction(false)
    public async ReadAsset(ctx: Context, ID: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(ID); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${ID} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    @Transaction()
    public async UpdateAsset(ctx: Context, payrollData: PayrollData): Promise<void> {
        const exists = await this.AssetExists(ctx, payrollData.ID);
        if (!exists) {
            throw new Error(`The asset ${payrollData.ID} does not exist`);
        }
        // overwriting original asset with new asset
        const updatedPayrollData = payrollData
        return ctx.stub.putState(payrollData.ID, Buffer.from(JSON.stringify(updatedPayrollData)));
    }

    // DeleteAsset deletes an given asset from the world state.
    @Transaction()
    public async DeleteAsset(ctx: Context, ID: string): Promise<void> {
        const exists = await this.AssetExists(ctx, ID);
        if (!exists) {
            throw new Error(`The asset ${ID} does not exist`);
        }
        return ctx.stub.deleteState(ID);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, ID: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(ID);
        return assetJSON && assetJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllAssets(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({Key: result.value.key, Record: record});
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

}
