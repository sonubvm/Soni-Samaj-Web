import { FamilyFormData, isSpouseRequired, MaritalStatus } from '@/types/family';

export type FieldErrors = Record<string, string>;

const trim = (v?: string) => (v || '').trim();

const normalizeMobile = (mobile?: string) => trim(mobile).replace(/\D/g, '').slice(-10);

export const STEPS = [
  { title: 'Contact & Address', desc: 'Head of family and full address', icon: '📍' },
  { title: 'Parents & Income', desc: 'Father, mother and family income', icon: '👨‍👩‍👧' },
  { title: 'Other Members', desc: 'Optional — co-residents and children', icon: '🎓' },
  { title: 'Review', desc: 'Confirm and submit', icon: '✅' },
];

const isValidMobile = (mobile?: string) => /^[6-9]\d{9}$/.test(normalizeMobile(mobile));

const isValidPincode = (pincode?: string) => /^[1-9]\d{5}$/.test(trim(pincode));

const isValidEmail = (email?: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(email));

const VALID_MARITAL_STATUSES: MaritalStatus[] = ['Married', 'Unmarried', 'Widowed', 'Divorced'];

export function validateStep(step: number, form: FamilyFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0) {
    if (!trim(form.headOfFamily.name)) {
      errors['headOfFamily.name'] = 'Head of family name is required';
    }
    if (!trim(form.headOfFamily.photo)) {
      errors['headOfFamily.photo'] = 'Head of family photo is required';
    }
    if (!form.headOfFamily.maritalStatus) {
      errors['headOfFamily.maritalStatus'] = 'Marital status is required';
    } else if (!VALID_MARITAL_STATUSES.includes(form.headOfFamily.maritalStatus)) {
      errors['headOfFamily.maritalStatus'] = 'Select a valid marital status';
    }
    if (!trim(form.headOfFamily.mobile)) {
      errors['headOfFamily.mobile'] = 'Mobile number is required';
    } else if (!isValidMobile(form.headOfFamily.mobile)) {
      errors['headOfFamily.mobile'] = 'Enter a valid 10-digit Indian mobile (starts with 6-9)';
    }
    if (form.headOfFamily.email && !isValidEmail(form.headOfFamily.email)) {
      errors['headOfFamily.email'] = 'Enter a valid email address';
    }
    if (!trim(form.address.city)) errors['address.city'] = 'City is required';
    if (!trim(form.address.district)) errors['address.district'] = 'District is required';
    if (!trim(form.address.state)) errors['address.state'] = 'State is required';
    if (!trim(form.address.pincode)) {
      errors['address.pincode'] = 'Pincode is required';
    } else if (!isValidPincode(form.address.pincode)) {
      errors['address.pincode'] = 'Enter a valid 6-digit Indian pincode (cannot start with 0)';
    }
  }

  if (step === 1) {
    if (!trim(form.parents.father.name)) {
      errors['parents.father.name'] = "Father's name is required";
    }
    if (!trim(form.parents.mother.name)) {
      errors['parents.mother.name'] = "Mother's name is required";
    }
    if (form.parents.father.mobile && !isValidMobile(form.parents.father.mobile)) {
      errors['parents.father.mobile'] = "Father's mobile must be 10 digits";
    }
    if (form.parents.mother.mobile && !isValidMobile(form.parents.mother.mobile)) {
      errors['parents.mother.mobile'] = "Mother's mobile must be 10 digits";
    }
  }

  if (step === 2) {
    if (isSpouseRequired(form.headOfFamily.maritalStatus)) {
      if (!trim(form.spouse?.name)) {
        errors['spouse.name'] = "Spouse name is required when marital status is Married";
      }
      if (!trim(form.spouse?.mobile)) {
        errors['spouse.mobile'] = "Spouse mobile is required when marital status is Married";
      } else if (!isValidMobile(form.spouse.mobile)) {
        errors['spouse.mobile'] = "Spouse's mobile must be 10 digits";
      }
    } else if (form.spouse?.mobile && !isValidMobile(form.spouse.mobile)) {
      errors['spouse.mobile'] = "Spouse's mobile must be 10 digits";
    }

    form.coResidents.forEach((resident, index) => {
      const hasOtherData =
        trim(resident.relation) ||
        resident.age ||
        trim(resident.occupation) ||
        trim(resident.mobile);
      if (!trim(resident.name) && hasOtherData) {
        errors[`coResidents.${index}.name`] = `Co-resident ${index + 1}: name is required`;
      }
      if (trim(resident.mobile) && !isValidMobile(resident.mobile)) {
        errors[`coResidents.${index}.mobile`] = `Co-resident ${index + 1}: invalid mobile number`;
      }
    });

    form.children.forEach((child, index) => {
      const hasOtherChildData =
        trim(child.school.name) ||
        trim(child.course) ||
        trim(child.currentStd) ||
        trim(child.dob) ||
        (child.passOutYear != null && child.passOutYear > 0) ||
        (child.percentage != null && child.percentage > 0);

      if (!trim(child.name)) {
        if (hasOtherChildData) {
          errors[`children.${index}.name`] = `Child ${index + 1}: name is required`;
        }
        return;
      }

      if (child.percentage != null && (child.percentage < 0 || child.percentage > 100)) {
        errors[`children.${index}.percentage`] = `Child ${index + 1}: percentage must be 0-100`;
      }

      if (!child.isStudying) return;

      if (child.studentType === 'School' && !trim(child.school.name)) {
        errors[`children.${index}.school.name`] = `Child ${index + 1}: school name is required`;
      }
      if (child.studentType === 'College') {
        if (!trim(child.school.name)) {
          errors[`children.${index}.school.name`] = `Child ${index + 1}: college name is required`;
        }
        if (!trim(child.course)) {
          errors[`children.${index}.course`] = `Child ${index + 1}: course/degree is required`;
        }
      }
    });
  }

  return errors;
}

export function validateAll(form: FamilyFormData): FieldErrors {
  let errors: FieldErrors = {};
  for (let step = 0; step <= 2; step += 1) {
    errors = { ...errors, ...validateStep(step, form) };
  }
  return errors;
}

export function errorsToList(errors: FieldErrors): string[] {
  return Object.values(errors);
}

export function prepareFamilyPayload(form: FamilyFormData): FamilyFormData {
  return {
    ...form,
    headOfFamily: {
      ...form.headOfFamily,
      name: trim(form.headOfFamily.name),
      mobile: normalizeMobile(form.headOfFamily.mobile),
      email: trim(form.headOfFamily.email),
      photo: trim(form.headOfFamily.photo),
      maritalStatus: form.headOfFamily.maritalStatus,
    },
    address: {
      ...form.address,
      houseNo: trim(form.address.houseNo),
      street: trim(form.address.street),
      village: trim(form.address.village),
      city: trim(form.address.city),
      district: trim(form.address.district),
      state: trim(form.address.state),
      pincode: trim(form.address.pincode),
    },
    parents: {
      father: { ...form.parents.father, name: trim(form.parents.father.name) },
      mother: { ...form.parents.mother, name: trim(form.parents.mother.name) },
    },
    spouse: isSpouseRequired(form.headOfFamily.maritalStatus) ||
      trim(form.spouse?.name) ||
      trim(form.spouse?.mobile) ||
      trim(form.spouse?.photo)
      ? {
          name: trim(form.spouse?.name),
          mobile: form.spouse?.mobile ? normalizeMobile(form.spouse.mobile) : '',
          photo: trim(form.spouse?.photo),
        }
      : { name: '', mobile: '', photo: '' },
    coResidents: form.coResidents.filter((r) => trim(r.name)),
    children: form.children.filter((c) => trim(c.name)),
  };
}

export function formatApiError(message: string): string {
  if (message.includes('already registered') || message.includes('Duplicate')) {
    return message;
  }

  const map: Record<string, string> = {
    'headOfFamily.name': 'Head of family name is required',
    'headOfFamily.mobile': 'Mobile number is required',
    'headOfFamily.photo': 'Head of family photo is required',
    'headOfFamily.maritalStatus': 'Marital status is required',
    'spouse.name': 'Spouse name is required when marital status is Married',
    'spouse.mobile': 'Spouse mobile is required when marital status is Married',
    'address.city': 'City is required',
    'address.district': 'District is required',
    'address.state': 'State is required',
    'address.pincode': 'Pincode is required',
    'parents.father.name': "Father's name is required",
    'parents.mother.name': "Mother's name is required",
    name: 'Name is required',
  };

  return message
    .split(', ')
    .map((part) => {
      const pathMatch = part.match(/Path `([^`]+)` is required\.?/);
      if (pathMatch) return map[pathMatch[1]] || `${pathMatch[1]} is required`;
      return part;
    })
    .join('\n');
}

export function getFirstErrorStep(errors: FieldErrors): number {
  if (
    errors['headOfFamily.name'] ||
    errors['headOfFamily.mobile'] ||
    errors['headOfFamily.photo'] ||
    errors['headOfFamily.email'] ||
    errors['headOfFamily.maritalStatus'] ||
    errors['address.city'] ||
    errors['address.pincode']
  ) {
    return 0;
  }
  if (
    errors['parents.father.name'] ||
    errors['parents.mother.name'] ||
    errors['parents.father.mobile'] ||
    errors['parents.mother.mobile']
  ) {
    return 1;
  }
  if (
    Object.keys(errors).some(
      (k) => k.startsWith('coResidents') || k.startsWith('children') || k.startsWith('spouse')
    )
  ) {
    return 2;
  }
  return 0;
}
