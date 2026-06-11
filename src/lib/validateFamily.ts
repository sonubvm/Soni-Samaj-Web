import { FamilyFormData, isSpouseRequired, MaritalStatus } from '@/types/family';

export type FieldErrors = Record<string, string>;

const trim = (v?: string) => (v || '').trim();

const normalizeMobile = (mobile?: string) => trim(mobile).replace(/\D/g, '').slice(-10);

export const STEPS = [
  { titleKey: 'steps.contactTitle', descKey: 'steps.contactDesc', icon: '📍' },
  { titleKey: 'steps.parentsTitle', descKey: 'steps.parentsDesc', icon: '👨‍👩‍👧' },
  { titleKey: 'steps.otherTitle', descKey: 'steps.otherDesc', icon: '🎓' },
  { titleKey: 'steps.reviewTitle', descKey: 'steps.reviewDesc', icon: '✅' },
];

const isValidMobile = (mobile?: string) => /^[6-9]\d{9}$/.test(normalizeMobile(mobile));

const isValidPincode = (pincode?: string) => /^[1-9]\d{5}$/.test(trim(pincode));

const isValidEmail = (email?: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(email));

const VALID_MARITAL_STATUSES: MaritalStatus[] = ['Married', 'Unmarried', 'Widowed', 'Divorced'];

export function validateStep(step: number, form: FamilyFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0) {
    if (!trim(form.headOfFamily.name)) {
      errors['headOfFamily.name'] = 'validation.headOfFamilyNameRequired';
    }
    if (!trim(form.headOfFamily.photo)) {
      errors['headOfFamily.photo'] = 'validation.headOfFamilyPhotoRequired';
    }
    if (!form.headOfFamily.maritalStatus) {
      errors['headOfFamily.maritalStatus'] = 'validation.maritalStatusRequired';
    } else if (!VALID_MARITAL_STATUSES.includes(form.headOfFamily.maritalStatus)) {
      errors['headOfFamily.maritalStatus'] = 'validation.maritalStatusInvalid';
    }
    if (!trim(form.headOfFamily.mobile)) {
      errors['headOfFamily.mobile'] = 'validation.mobileRequired';
    } else if (!isValidMobile(form.headOfFamily.mobile)) {
      errors['headOfFamily.mobile'] = 'validation.mobileInvalid';
    }
    if (form.headOfFamily.email && !isValidEmail(form.headOfFamily.email)) {
      errors['headOfFamily.email'] = 'validation.emailInvalid';
    }
    if (!trim(form.address.city)) errors['address.city'] = 'validation.cityRequired';
    if (!trim(form.address.district)) errors['address.district'] = 'validation.districtRequired';
    if (!trim(form.address.state)) errors['address.state'] = 'validation.stateRequired';
    if (!trim(form.address.pincode)) {
      errors['address.pincode'] = 'validation.pincodeRequired';
    } else if (!isValidPincode(form.address.pincode)) {
      errors['address.pincode'] = 'validation.pincodeInvalid';
    }
  }

  if (step === 1) {
    if (!trim(form.parents.father.name)) {
      errors['parents.father.name'] = 'validation.fatherNameRequired';
    }
    if (!trim(form.parents.mother.name)) {
      errors['parents.mother.name'] = 'validation.motherNameRequired';
    }
    if (form.parents.father.mobile && !isValidMobile(form.parents.father.mobile)) {
      errors['parents.father.mobile'] = 'validation.fatherMobileInvalid';
    }
    if (form.parents.mother.mobile && !isValidMobile(form.parents.mother.mobile)) {
      errors['parents.mother.mobile'] = 'validation.motherMobileInvalid';
    }
  }

  if (step === 2) {
    if (isSpouseRequired(form.headOfFamily.maritalStatus)) {
      if (!trim(form.spouse?.name)) {
        errors['spouse.name'] = 'validation.spouseNameRequired';
      }
      if (!trim(form.spouse?.mobile)) {
        errors['spouse.mobile'] = 'validation.spouseMobileRequired';
      } else if (!isValidMobile(form.spouse.mobile)) {
        errors['spouse.mobile'] = 'validation.spouseMobileInvalid';
      }
    } else if (form.spouse?.mobile && !isValidMobile(form.spouse.mobile)) {
      errors['spouse.mobile'] = 'validation.spouseMobileInvalid';
    }

    form.coResidents.forEach((resident, index) => {
      const hasOtherData =
        trim(resident.relation) ||
        resident.age ||
        trim(resident.occupation) ||
        trim(resident.mobile);
      if (!trim(resident.name) && hasOtherData) {
        errors[`coResidents.${index}.name`] = `validation.coResidentNameRequired|${index + 1}`;
      }
      if (trim(resident.mobile) && !isValidMobile(resident.mobile)) {
        errors[`coResidents.${index}.mobile`] = `validation.coResidentMobileInvalid|${index + 1}`;
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
          errors[`children.${index}.name`] = `validation.childNameRequired|${index + 1}`;
        }
        return;
      }

      if (child.percentage != null && (child.percentage < 0 || child.percentage > 100)) {
        errors[`children.${index}.percentage`] = `validation.childPercentageInvalid|${index + 1}`;
      }

      if (!child.isStudying) return;

      if (child.studentType === 'School' && !trim(child.school.name)) {
        errors[`children.${index}.school.name`] = `validation.childSchoolRequired|${index + 1}`;
      }
      if (child.studentType === 'College') {
        if (!trim(child.school.name)) {
          errors[`children.${index}.school.name`] = `validation.childCollegeRequired|${index + 1}`;
        }
        if (!trim(child.course)) {
          errors[`children.${index}.course`] = `validation.childCourseRequired|${index + 1}`;
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

export function translateErrorMessage(
  message: string,
  t: (key: string, vars?: Record<string, string | number>) => string
): string {
  if (message.includes('|')) {
    const [key, value] = message.split('|');
    if (key === 'validation.fieldRequired') {
      return t(key, { field: value });
    }
    return t(key, { n: value });
  }
  const translated = t(message);
  return translated !== message ? translated : message;
}

export function translateErrorsList(
  errors: FieldErrors,
  t: (key: string, vars?: Record<string, string | number>) => string
): string[] {
  return Object.values(errors).map((msg) => translateErrorMessage(msg, t));
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
    return 'validation.duplicateMobile';
  }

  const map: Record<string, string> = {
    'headOfFamily.name': 'validation.headOfFamilyNameRequired',
    'headOfFamily.mobile': 'validation.mobileRequired',
    'headOfFamily.photo': 'validation.headOfFamilyPhotoRequired',
    'headOfFamily.maritalStatus': 'validation.maritalStatusRequired',
    'spouse.name': 'validation.spouseNameRequired',
    'spouse.mobile': 'validation.spouseMobileRequired',
    'address.city': 'validation.cityRequired',
    'address.district': 'validation.districtRequired',
    'address.state': 'validation.stateRequired',
    'address.pincode': 'validation.pincodeRequired',
    'parents.father.name': 'validation.fatherNameRequired',
    'parents.mother.name': 'validation.motherNameRequired',
    name: 'validation.headOfFamilyNameRequired',
  };

  return message
    .split(', ')
    .map((part) => {
      const pathMatch = part.match(/Path `([^`]+)` is required\.?/);
      if (pathMatch) {
        return map[pathMatch[1]] || `validation.fieldRequired|${pathMatch[1]}`;
      }
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
