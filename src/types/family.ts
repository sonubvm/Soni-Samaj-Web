export interface Person {
  name: string;
  mobile?: string;
  email?: string;
}

export interface Parent {
  name: string;
  occupation?: string;
  income?: number;
  education?: string;
  mobile?: string;
}

export interface CoResident {
  name: string;
  relation?: string;
  age?: number;
  occupation?: string;
  mobile?: string;
}

export type StudentType = 'School' | 'College';

export interface Child {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
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
  headOfFamily: { name: '', mobile: '', email: '' },
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
    father: { name: '', occupation: '', income: 0, education: '', mobile: '' },
    mother: { name: '', occupation: '', income: 0, education: '', mobile: '' },
  },
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
});

export const emptyChild = (): Child => ({
  name: '',
  gender: 'Male',
  dob: '',
  studentType: 'School',
  school: { name: '', medium: 'Hindi', board: '' },
  course: '',
  currentStd: '',
  passOutYear: undefined,
  percentage: undefined,
  isStudying: true,
});
