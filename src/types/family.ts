export type MaritalStatus = 'Married' | 'Unmarried' | 'Widowed' | 'Divorced';

export const MARITAL_STATUS_OPTIONS: MaritalStatus[] = [
  'Married',
  'Unmarried',
  'Widowed',
  'Divorced',
];

export const isSpouseSectionVisible = (status?: MaritalStatus) =>
  status === 'Married' || status === 'Widowed';

export const isSpouseRequired = (status?: MaritalStatus) => status === 'Married';

export interface Person {
  name: string;
  mobile?: string;
  email?: string;
  photo?: string;
  maritalStatus?: MaritalStatus;
}

export interface Parent {
  name: string;
  occupation?: string;
  income?: number;
  education?: string;
  mobile?: string;
  photo?: string;
}

export interface Spouse {
  name?: string;
  mobile?: string;
  photo?: string;
}

export interface CoResident {
  name: string;
  relation?: string;
  age?: number;
  occupation?: string;
  mobile?: string;
  photo?: string;
}

export type StudentType = 'School' | 'College';

export interface Child {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  photo?: string;
  studentType: StudentType;
  school: {
    name?: string;
    medium: 'Hindi' | 'English' | 'Gujarati' | 'Other';
    board?: string;
  };
  course?: string;
  currentStd?: string;
  passOutYear?: number;
  percentage?: number;
  isStudying: boolean;
}

export interface Address {
  houseNo?: string;
  street?: string;
  village?: string;
  city: string;
  district: string;
  state: string;
  pincode?: string;
}

export interface FamilyFormData {
  headOfFamily: Person;
  address: Address;
  parents: {
    father: Parent;
    mother: Parent;
  };
  spouse: Spouse;
  coResidents: CoResident[];
  children: Child[];
  totalFamilyIncome: number;
}

export interface Family extends FamilyFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export const emptyFamilyForm = (): FamilyFormData => ({
  headOfFamily: { name: '', mobile: '', email: '', photo: '', maritalStatus: undefined },
  address: {
    houseNo: '',
    street: '',
    village: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
  },
  parents: {
    father: { name: '', occupation: '', income: 0, education: '', mobile: '', photo: '' },
    mother: { name: '', occupation: '', income: 0, education: '', mobile: '', photo: '' },
  },
  spouse: { name: '', mobile: '', photo: '' },
  coResidents: [],
  children: [],
  totalFamilyIncome: 0,
});

export const emptyCoResident = (): CoResident => ({
  name: '',
  relation: '',
  age: undefined,
  occupation: '',
  mobile: '',
  photo: '',
});

export const emptyChild = (): Child => ({
  name: '',
  gender: 'Male',
  dob: '',
  photo: '',
  studentType: 'School',
  school: { name: '', medium: 'Hindi', board: '' },
  course: '',
  currentStd: '',
  passOutYear: undefined,
  percentage: undefined,
  isStudying: true,
});
