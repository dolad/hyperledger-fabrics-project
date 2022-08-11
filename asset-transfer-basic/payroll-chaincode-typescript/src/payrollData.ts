/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class PayrollData {
    
    @Property()
    public ID: string;

    @Property()
    public HmrcOfficeNumber: string;

    @Property()
    public EmployeePayeeReference: string;

    @Property()
    public Owner: string;

    @Property()
    public AccountOfficeReference: string;

    @Property()
    public NationalInsuranceNumber: string;

    @Property()
    public Title: string;

    @Property()
    public Surname: string;

    @Property()
    public Lastname: string;

    @Property()
    public InitialName?: string;
    @Property()
    public DateOfBirth: string;
    
    @Property()
    public Address: string;

    @Property()
    public PostCode: string;

    @Property()
    public PayrollId: string;

    @Property()
    public TaxReduction: number;

    @Property()
    public Salary: number;


}
