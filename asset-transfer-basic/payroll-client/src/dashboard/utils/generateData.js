import { faker } from '@faker-js/faker';

export const createData = (name, calories, fat, carbs, protein) => {
    return {
      name,
      calories,
      fat,
      carbs,
      protein,
    };
  }

   
  
export const headCells = [
    {
      id: 'ID',
      numeric: false,
      disablePadding: true,
      label: 'ID',
    },
    {
      id: 'HmrcOfficeNumber',
      numeric: false,
      disablePadding: false,
      label: 'HmrcNo',
    },

     {
        id: 'EmployeePayeeReference',
        numeric: false,
        disablePadding: false,
        label: 'EmployeeRef',
      },
      {
        id: 'Owner',
        numeric: false,
        disablePadding: false,
        label: 'Owner',
      },
      {
        id: 'AccountOfficeReference',
        numeric: false,
        disablePadding: false,
        label: 'AccountRef',
      },
      {
        id: 'NationalInsuranceNumber',
        numeric: false,
        disablePadding: false,
        label: 'NIN',
      },
      {
        id: 'Title',
        numeric: false,
        disablePadding: false,
        label: 'Title',
      },
      {
        id: 'Surname',
        numeric: false,
        disablePadding: false,
        label: 'Surname',
      },

      {
        id: 'Lastname',
        numeric: false,
        disablePadding: false,
        label: 'Lastname',
      },

      {
        id: 'DateOfBirth',
        numeric: false,
        disablePadding: false,
        label: 'DateOfBirth',
      },

      {
        id: 'Address',
        numeric: false,
        disablePadding: false,
        label: 'Address',
      },

      {
        id: 'PostCode',
        numeric: false,
        disablePadding: false,
        label: 'PostCode',
      },

      {
        id: 'PayrollId',
        numeric: false,
        disablePadding: false,
        label: 'PayrollId',
      },

      {
        id: 'TaxReduction',
        numeric: true,
        disablePadding: false,
        label: 'TaxReduction',
      },

      {
        id: 'Salary',
        numeric: true,
        disablePadding: false,
        label: 'Salary',
      },
  ];

const generateUuid = () => Math.random().toString(36).slice(-6);

//   generate Fakers
export const createFakeData = (num = 10) => {

   
    const employeeReference =  'Em_' + generateUuid();
    const accountReference =   'Acc_' + generateUuid();
    let arrRes = []
    for (let index = 0; index < num; index++) {
        const firstname = faker.name.firstName();
        const lastname = faker.name.lastName();
        arrRes.push({
                ID: faker.datatype.uuid(),
                HmrcOfficeNumber:"hrmc_" + generateUuid(),
                EmployeePayeeReference: employeeReference,
                Owner: firstname + " " + lastname,
                AccountOfficeReference: accountReference,
                NationalInsuranceNumber:  faker.datatype.string(9),
                Title: faker.name.prefix(),
                Surname: firstname,
                Lastname: lastname,
                DateOfBirth:new Date(faker.date.birthdate({ min: 1980, max: 2010, mode: 'year' })).toString(),
                Address:faker.address.streetAddress(false),
                PostCode: faker.address.zipCode(),
                PayrollId: "payrolId_"  + generateUuid(),
                TaxReduction: faker.datatype.float({max: 2000}),
                Salary: faker.datatype.float({min: 5000, max:100000})
        
        })
    }
    return arrRes
}