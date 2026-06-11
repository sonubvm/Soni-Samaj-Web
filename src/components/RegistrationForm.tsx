'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Plus,
  Trash2,
  MapPin,
  Users,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetFamilyState, submitFamily } from '@/store/slices/familySlice';
import {
  emptyChild,
  emptyCoResident,
  emptyFamilyForm,
  FamilyFormData,
  MARITAL_STATUS_OPTIONS,
  MaritalStatus,
  isSpouseSectionVisible,
  isSpouseRequired,
  StudentType,
} from '@/types/family';
import {
  FieldErrors,
  getFirstErrorStep,
  STEPS,
  translateErrorMessage,
  translateErrorsList,
  validateAll,
  validateStep,
} from '@/lib/validateFamily';
import PhotoUpload from '@/components/PhotoUpload';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function RegistrationForm() {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.family);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FamilyFormData>(emptyFamilyForm());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [mobileStatus, setMobileStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    const digits = (form.headOfFamily.mobile || '').replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setMobileStatus('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setMobileStatus('checking');
      try {
        const res = await api.get<{ success: boolean; data: { exists: boolean } }>(
          `/api/families/check-mobile/${digits}`
        );
        setMobileStatus(res.data.data.exists ? 'taken' : 'available');
      } catch {
        setMobileStatus('idle');
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [form.headOfFamily.mobile]);

  const updateForm = (patch: Partial<FamilyFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setFieldErrors({});
  };

  const goNext = () => {
    const errors = validateStep(step, form);
    if (step === 0 && mobileStatus === 'taken') {
      errors['headOfFamily.mobile'] = 'form.mobileTaken';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStep((s) => s + 1);
  };

  const skipToReview = () => {
    setFieldErrors({});
    setStep(3);
  };

  const handleSubmit = async () => {
    const errors = validateAll(form);
    if (mobileStatus === 'taken') {
      errors['headOfFamily.mobile'] = 'form.mobileTaken';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStep(getFirstErrorStep(errors));
      return;
    }
    setFieldErrors({});
    await dispatch(submitFamily(form));
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto card text-center py-12 animate-fade-up">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('form.successTitle')}</h2>
        <p className="text-gray-600 mb-6">{t('form.successDesc')}</p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              dispatch(resetFamilyState());
              setForm(emptyFamilyForm());
              setFieldErrors({});
              setStep(0);
            }}
          >
            {t('form.registerAnother')}
          </button>
          <Link href="/" className="btn-primary">
            {t('form.goHome')}
          </Link>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const isDuplicateError = error?.includes('validation.duplicateMobile') || error?.includes('already registered');

  return (
    <div className="max-w-4xl mx-auto px-1 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <div className="flex gap-1.5 sm:gap-2 mb-4">
          {STEPS.map((s, i) => (
            <button
              key={s.titleKey}
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-gradient-to-r from-saffron-500 to-gold-500' : 'bg-gray-200'}`}
              aria-label={`${t('form.stepOf', { current: i + 1, total: STEPS.length })}: ${t(s.titleKey)}`}
            />
          ))}
        </div>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-saffron-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
            {current.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-saffron-600 font-medium">
              {t('form.stepOf', { current: step + 1, total: STEPS.length })}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t(current.titleKey)}</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">{t(current.descKey)}</p>
          </div>
        </div>
      </div>

      <div className="card shadow-xl border-saffron-100 p-4 sm:p-6">
        {(error || Object.keys(fieldErrors).length > 0) && (
          <div
            className={`mb-5 p-4 rounded-xl text-sm ${
              isDuplicateError
                ? 'bg-amber-50 border border-amber-300 text-amber-900'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            <p className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {isDuplicateError ? t('form.duplicateBlocked') : t('form.fixErrors')}
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              {error
                ? error.split('\n').map((msg) => (
                    <li key={msg}>{translateErrorMessage(msg, t)}</li>
                  ))
                : translateErrorsList(fieldErrors, t).map((msg) => <li key={msg}>{msg}</li>)}
            </ul>
          </div>
        )}

        {step === 0 && (
          <StepContactAddress
            form={form}
            updateForm={updateForm}
            errors={fieldErrors}
            mobileStatus={mobileStatus}
          />
        )}
        {step === 1 && <StepParentsIncome form={form} updateForm={updateForm} errors={fieldErrors} />}
        {step === 2 && (
          <StepOtherMembers form={form} updateForm={updateForm} errors={fieldErrors} onSkip={skipToReview} />
        )}
        {step === 3 && <StepReview form={form} />}

        <p className="text-xs text-gray-400 mt-6">{t('form.requiredNote')}</p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto min-h-[44px]"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="w-4 h-4" /> {t('form.back')}
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn-primary w-full sm:w-auto min-h-[44px]" onClick={goNext}>
              {t('form.continue')} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary w-full sm:w-auto min-h-[44px]"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? t('form.submitting') : t('form.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepContactAddress({
  form,
  updateForm,
  errors,
  mobileStatus,
}: {
  form: FamilyFormData;
  updateForm: (p: Partial<FamilyFormData>) => void;
  errors: FieldErrors;
  mobileStatus: 'idle' | 'checking' | 'available' | 'taken';
}) {
  const { t } = useLanguage();
  const mobileError =
    errors['headOfFamily.mobile'] ||
    (mobileStatus === 'taken' ? 'form.mobileTaken' : undefined);

  const handleMaritalStatusChange = (status: MaritalStatus) => {
    const patch: Partial<FamilyFormData> = {
      headOfFamily: { ...form.headOfFamily, maritalStatus: status },
    };
    if (!isSpouseSectionVisible(status)) {
      patch.spouse = { name: '', mobile: '', photo: '' };
    }
    updateForm(patch);
  };

  return (
    <div className="space-y-6">
      <div className="section-box">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-saffron-500" /> {t('form.headOfFamily')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('form.fullName')} value={form.headOfFamily.name} error={errors['headOfFamily.name']} onChange={(v) => updateForm({ headOfFamily: { ...form.headOfFamily, name: v } })} />
          <div>
            <Field
              label={t('form.mobile')}
              value={form.headOfFamily.mobile || ''}
              error={mobileError}
              hint={t('form.mobileHint')}
              inputMode="numeric"
              maxLength={10}
              onChange={(v) => updateForm({ headOfFamily: { ...form.headOfFamily, mobile: v.replace(/\D/g, '').slice(0, 10) } })}
            />
            {mobileStatus === 'checking' && (
              <p className="text-xs text-gray-500 mt-1">{t('form.checkingMobile')}</p>
            )}
            {mobileStatus === 'available' && !mobileError && (
              <p className="text-xs text-green-600 mt-1">{t('form.mobileAvailable')}</p>
            )}
          </div>
          <div>
            <label className="label">{t('form.maritalStatus')}</label>
            <select
              className={`input min-h-[44px] ${errors['headOfFamily.maritalStatus'] ? 'border-red-400 ring-1 ring-red-200' : ''}`}
              value={form.headOfFamily.maritalStatus || ''}
              onChange={(e) => handleMaritalStatusChange(e.target.value as MaritalStatus)}
            >
              <option value="">{t('form.selectStatus')}</option>
              {MARITAL_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {t(`maritalStatus.${status}`)}
                </option>
              ))}
            </select>
            {errors['headOfFamily.maritalStatus'] && (
              <p className="text-xs text-red-600 mt-1">{translateErrorMessage(errors['headOfFamily.maritalStatus'], t)}</p>
            )}
          </div>
          <Field label={t('form.email')} value={form.headOfFamily.email || ''} type="email" error={errors['headOfFamily.email']} onChange={(v) => updateForm({ headOfFamily: { ...form.headOfFamily, email: v } })} />
          <div className="md:col-span-2">
            <PhotoUpload
              label={t('form.photo')}
              required
              value={form.headOfFamily.photo}
              error={errors['headOfFamily.photo']}
              onChange={(photo) => updateForm({ headOfFamily: { ...form.headOfFamily, photo } })}
            />
          </div>
        </div>
      </div>
      <div className="section-box">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-saffron-500" /> {t('form.address')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('form.houseNo')} value={form.address.houseNo || ''} onChange={(v) => updateForm({ address: { ...form.address, houseNo: v } })} />
          <Field label={t('form.street')} value={form.address.street || ''} onChange={(v) => updateForm({ address: { ...form.address, street: v } })} />
          <Field label={t('form.village')} value={form.address.village || ''} onChange={(v) => updateForm({ address: { ...form.address, village: v } })} />
          <Field label={t('form.city')} value={form.address.city} error={errors['address.city']} onChange={(v) => updateForm({ address: { ...form.address, city: v } })} />
          <Field label={t('form.district')} value={form.address.district} error={errors['address.district']} onChange={(v) => updateForm({ address: { ...form.address, district: v } })} />
          <Field label={t('form.state')} value={form.address.state} error={errors['address.state']} onChange={(v) => updateForm({ address: { ...form.address, state: v } })} />
          <Field label={t('form.pincode')} value={form.address.pincode || ''} error={errors['address.pincode']} hint={t('form.pincodeHint')} inputMode="numeric" maxLength={6} onChange={(v) => updateForm({ address: { ...form.address, pincode: v.replace(/\D/g, '').slice(0, 6) } })} />
        </div>
      </div>
    </div>
  );
}

function StepParentsIncome({
  form,
  updateForm,
  errors,
}: {
  form: FamilyFormData;
  updateForm: (p: Partial<FamilyFormData>) => void;
  errors: FieldErrors;
}) {
  const { t } = useLanguage();
  const roles = [
    { key: 'father' as const, label: t('form.father'), photoLabel: t('form.fatherPhoto') },
    { key: 'mother' as const, label: t('form.mother'), photoLabel: t('form.motherPhoto') },
  ];

  return (
    <div className="space-y-6">
      {roles.map(({ key, label, photoLabel }) => (
        <div key={key} className="section-box">
          <h3 className="font-semibold text-saffron-700">{label}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t('form.name')} value={form.parents[key].name} error={errors[`parents.${key}.name`]} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], name: v } } })} />
            <Field label={t('form.mobile').replace(' *', '')} value={form.parents[key].mobile || ''} error={errors[`parents.${key}.mobile`]} inputMode="numeric" maxLength={10} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], mobile: v.replace(/\D/g, '').slice(0, 10) } } })} />
            <Field label={t('form.occupation')} value={form.parents[key].occupation || ''} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], occupation: v } } })} />
            <Field label={t('form.education')} value={form.parents[key].education || ''} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], education: v } } })} />
            <Field label={t('form.monthlyIncome')} type="number" min={0} value={String(form.parents[key].income || 0)} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], income: Number(v) || 0 } } })} />
            <div className="md:col-span-2">
              <PhotoUpload
                label={photoLabel}
                value={form.parents[key].photo}
                onChange={(photo) =>
                  updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], photo } } })
                }
              />
            </div>
          </div>
        </div>
      ))}
      <Field label={t('form.totalFamilyIncome')} type="number" min={0} value={String(form.totalFamilyIncome)} onChange={(v) => updateForm({ totalFamilyIncome: Number(v) || 0 })} />
    </div>
  );
}

function StepOtherMembers({
  form,
  updateForm,
  errors,
  onSkip,
}: {
  form: FamilyFormData;
  updateForm: (p: Partial<FamilyFormData>) => void;
  errors: FieldErrors;
  onSkip: () => void;
}) {
  const addResident = () => updateForm({ coResidents: [...form.coResidents, emptyCoResident()] });
  const removeResident = (i: number) => updateForm({ coResidents: form.coResidents.filter((_, idx) => idx !== i) });
  const updateResident = (i: number, field: string, value: string | number) => {
    const updated = [...form.coResidents];
    updated[i] = { ...updated[i], [field]: value };
    updateForm({ coResidents: updated });
  };

  const addChild = () => updateForm({ children: [...form.children, emptyChild()] });
  const removeChild = (i: number) => updateForm({ children: form.children.filter((_, idx) => idx !== i) });
  const updateChild = (i: number, field: string, value: string | number | boolean) => {
    const updated = [...form.children];
    if (field.startsWith('school.')) {
      const sf = field.split('.')[1];
      updated[i] = { ...updated[i], school: { ...updated[i].school, [sf]: value } };
    } else {
      updated[i] = { ...updated[i], [field]: value };
    }
    updateForm({ children: updated });
  };

  const setStudentType = (i: number, type: StudentType) => {
    const updated = [...form.children];
    updated[i] = { ...updated[i], studentType: type, course: type === 'School' ? '' : updated[i].course };
    updateForm({ children: updated });
  };

  const { t } = useLanguage();
  const showSpouse = isSpouseSectionVisible(form.headOfFamily.maritalStatus);
  const spouseRequired = isSpouseRequired(form.headOfFamily.maritalStatus);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-500">{t('form.optionalStep')}</p>
        <button type="button" className="btn-secondary text-sm min-h-[44px] w-full sm:w-auto" onClick={onSkip}>
          {t('form.skipToReview')}
        </button>
      </div>

      {showSpouse && (
        <div className="section-box">
          <h3 className="font-semibold text-gray-800 mb-1">
            {spouseRequired ? t('form.spouseRequired') : t('form.spouseOptional')}
          </h3>
          {form.headOfFamily.maritalStatus === 'Widowed' && (
            <p className="text-xs text-gray-500 mb-4">{t('form.spouseWidowedHint')}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label={spouseRequired ? t('form.name') : t('form.name').replace(' *', '')}
              value={form.spouse.name || ''}
              error={errors['spouse.name']}
              onChange={(v) => updateForm({ spouse: { ...form.spouse, name: v } })}
            />
            <Field
              label={spouseRequired ? t('form.mobile') : t('form.mobile').replace(' *', '')}
              value={form.spouse.mobile || ''}
              error={errors['spouse.mobile']}
              inputMode="numeric"
              maxLength={10}
              onChange={(v) =>
                updateForm({ spouse: { ...form.spouse, mobile: v.replace(/\D/g, '').slice(0, 10) } })
              }
            />
            <div className="md:col-span-2">
              <PhotoUpload
                label={t('form.spousePhoto')}
                value={form.spouse.photo}
                onChange={(photo) => updateForm({ spouse: { ...form.spouse, photo } })}
              />
            </div>
          </div>
        </div>
      )}

      <div className="section-box">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="font-semibold text-gray-800">{t('form.coResidents')}</h3>
          <button type="button" className="btn-secondary text-sm py-2 min-h-[44px] w-full sm:w-auto" onClick={addResident}>
            <Plus className="w-4 h-4" /> {t('form.addMember')}
          </button>
        </div>
        {form.coResidents.length === 0 ? (
          <p className="text-sm text-gray-400">{t('form.noCoResidents')}</p>
        ) : (
          form.coResidents.map((r, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 mb-3 space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm font-medium text-gray-600">{t('form.member', { n: i + 1 })}</span>
                <button
                  type="button"
                  onClick={() => removeResident(i)}
                  className="text-red-500 hover:text-red-700 p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Remove member ${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={t('form.name')} value={r.name} error={errors[`coResidents.${i}.name`]} onChange={(v) => updateResident(i, 'name', v)} />
                <Field label={t('form.relation')} value={r.relation || ''} onChange={(v) => updateResident(i, 'relation', v)} />
                <Field label={t('form.age')} type="number" min={0} value={String(r.age || '')} onChange={(v) => updateResident(i, 'age', Number(v) || 0)} />
                <Field label={t('form.occupation')} value={r.occupation || ''} onChange={(v) => updateResident(i, 'occupation', v)} />
                <Field label={t('form.mobile').replace(' *', '')} value={r.mobile || ''} error={errors[`coResidents.${i}.mobile`]} inputMode="numeric" maxLength={10} onChange={(v) => updateResident(i, 'mobile', v.replace(/\D/g, '').slice(0, 10))} />
                <div className="md:col-span-2">
                  <PhotoUpload
                    label={t('form.photo')}
                    value={r.photo}
                    onChange={(photo) => updateResident(i, 'photo', photo)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="section-box">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-saffron-500" /> {t('form.childrenStudents')}
          </h3>
          <button type="button" className="btn-secondary text-sm py-2 min-h-[44px] w-full sm:w-auto" onClick={addChild}>
            <Plus className="w-4 h-4" /> {t('form.addChild')}
          </button>
        </div>
        {form.children.length === 0 ? (
          <p className="text-sm text-gray-400">{t('form.noChildren')}</p>
        ) : (
          form.children.map((c, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-saffron-100 mb-3 space-y-4">
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm font-medium text-gray-600">{t('form.student', { n: i + 1 })}</span>
                <button
                  type="button"
                  onClick={() => removeChild(i)}
                  className="text-red-500 hover:text-red-700 p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Remove student ${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={t('form.name')} value={c.name} error={errors[`children.${i}.name`]} onChange={(v) => updateChild(i, 'name', v)} />
                <div>
                  <label className="label">{t('form.gender')}</label>
                  <select className="input" value={c.gender} onChange={(e) => updateChild(i, 'gender', e.target.value)}>
                    <option value="Male">{t('gender.Male')}</option>
                    <option value="Female">{t('gender.Female')}</option>
                    <option value="Other">{t('gender.Other')}</option>
                  </select>
                </div>
                <Field label={t('form.dob')} type="date" value={c.dob || ''} onChange={(v) => updateChild(i, 'dob', v)} />
                <div className="md:col-span-2">
                  <PhotoUpload
                    label={t('form.photo')}
                    value={c.photo}
                    onChange={(photo) => updateChild(i, 'photo', photo)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:col-span-2 p-3 rounded-xl bg-saffron-50/80 border border-saffron-100">
                  <input
                    type="checkbox"
                    id={`studying-${i}`}
                    checked={c.isStudying}
                    onChange={(e) => updateChild(i, 'isStudying', e.target.checked)}
                    className="rounded border-gray-300 text-saffron-500"
                  />
                  <label htmlFor={`studying-${i}`} className="text-sm text-gray-700">
                    {t('form.currentlyStudying')}
                  </label>
                </div>
              </div>

              <div>
                <label className="label">{t('form.educationCategory')}</label>
                <div className="flex flex-col xs:flex-row gap-2">
                  {(['School', 'College'] as StudentType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setStudentType(i, type)}
                      className={`flex-1 py-3 sm:py-2.5 rounded-xl text-sm font-medium border transition min-h-[44px] ${
                        c.studentType === type
                          ? 'bg-saffron-500 text-white border-saffron-500 shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-saffron-300'
                      }`}
                    >
                      {type === 'School' ? t('form.school') : t('form.college')}
                    </button>
                  ))}
                </div>
                {!c.isStudying && (
                  <p className="text-xs text-gray-500 mt-2">{t('form.notStudyingHint')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field
                  label={
                    c.studentType === 'College'
                      ? c.isStudying
                        ? t('form.collegeNameRequired')
                        : t('form.collegeName')
                      : c.isStudying
                        ? t('form.schoolNameRequired')
                        : t('form.schoolName')
                  }
                  value={c.school.name || ''}
                  error={errors[`children.${i}.school.name`]}
                  onChange={(v) => updateChild(i, 'school.name', v)}
                />
                {c.studentType === 'College' ? (
                  <Field
                    label={c.isStudying ? t('form.courseRequired') : t('form.course')}
                    value={c.course || ''}
                    error={errors[`children.${i}.course`]}
                    placeholder={t('form.coursePlaceholder')}
                    onChange={(v) => updateChild(i, 'course', v)}
                  />
                ) : (
                  <>
                    <div>
                      <label className="label">{t('form.medium')}</label>
                      <select className="input" value={c.school.medium} onChange={(e) => updateChild(i, 'school.medium', e.target.value)}>
                        <option value="Hindi">{t('medium.Hindi')}</option>
                        <option value="English">{t('medium.English')}</option>
                        <option value="Gujarati">{t('medium.Gujarati')}</option>
                        <option value="Other">{t('medium.Other')}</option>
                      </select>
                    </div>
                    <Field label={t('form.board')} value={c.school.board || ''} onChange={(v) => updateChild(i, 'school.board', v)} />
                  </>
                )}
                <Field
                  label={c.studentType === 'College' ? t('form.yearSemester') : t('form.classStandard')}
                  value={c.currentStd || ''}
                  onChange={(v) => updateChild(i, 'currentStd', v)}
                />
                <Field label={t('form.passOutYear')} type="number" min={1950} max={2100} value={String(c.passOutYear || '')} onChange={(v) => updateChild(i, 'passOutYear', Number(v) || 0)} />
                <Field label={t('form.percentage')} type="number" min={0} max={100} value={String(c.percentage ?? '')} error={errors[`children.${i}.percentage`]} onChange={(v) => updateChild(i, 'percentage', v === '' ? 0 : Number(v))} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StepReview({ form }: { form: FamilyFormData }) {
  const { t } = useLanguage();
  const maritalLabel = form.headOfFamily.maritalStatus
    ? t(`maritalStatus.${form.headOfFamily.maritalStatus}`)
    : t('form.notSpecified');

  return (
    <div className="space-y-4 text-sm">
      <ReviewBlock
        title={t('form.reviewHead')}
        photo={form.headOfFamily.photo}
        lines={[
          `${form.headOfFamily.name} — ${form.headOfFamily.mobile}`,
          t('form.maritalStatusLabel', { status: maritalLabel }),
        ]}
      />
      <ReviewBlock
        title={t('form.reviewAddress')}
        lines={[
          [form.address.houseNo, form.address.street, form.address.village].filter(Boolean).join(', ') || '—',
          `${form.address.city}, ${form.address.district}, ${form.address.state} — ${form.address.pincode}`,
        ]}
      />
      <ReviewBlock
        title={t('form.reviewParents')}
        lines={[
          t('form.fatherLine', {
            name: form.parents.father.name,
            occupation: form.parents.father.occupation || t('form.na'),
          }),
          t('form.motherLine', {
            name: form.parents.mother.name,
            occupation: form.parents.mother.occupation || t('form.na'),
          }),
          t('form.totalIncomeLine', { amount: form.totalFamilyIncome }),
        ]}
        photos={[
          form.parents.father.photo ? { label: t('form.father'), url: form.parents.father.photo } : null,
          form.parents.mother.photo ? { label: t('form.mother'), url: form.parents.mother.photo } : null,
        ].filter(Boolean) as { label: string; url: string }[]}
      />
      {isSpouseSectionVisible(form.headOfFamily.maritalStatus) &&
        (form.spouse.name || form.spouse.mobile || form.spouse.photo) && (
        <ReviewBlock
          title={
            form.headOfFamily.maritalStatus === 'Widowed'
              ? t('form.reviewSpouseDeceased')
              : t('form.reviewSpouse')
          }
          photo={form.spouse.photo}
          lines={[
            form.spouse.name
              ? `${form.spouse.name}${form.spouse.mobile ? ` — ${form.spouse.mobile}` : ''}`
              : form.spouse.mobile || t('form.detailsProvided'),
          ]}
        />
      )}
      {form.coResidents.length > 0 && (
        <ReviewBlock
          title={t('form.reviewCoResidents')}
          lines={form.coResidents.map((r) => `${r.name} (${r.relation || t('form.na')})`)}
        />
      )}
      {form.children.length > 0 && (
        <ReviewBlock
          title={t('form.reviewChildren')}
          lines={form.children.map((c) => {
            if (!c.isStudying) {
              return t('form.childNotStudying', {
                name: c.name,
                type: c.studentType === 'College' ? t('form.college') : t('form.school'),
              });
            }
            if (c.studentType === 'College') {
              return t('form.childCollege', {
                name: c.name,
                school: c.school.name || t('form.na'),
                course: c.course || t('form.na'),
              });
            }
            return t('form.childSchool', {
              name: c.name,
              school: c.school.name || t('form.na'),
              std: c.currentStd || t('form.na'),
            });
          })}
        />
      )}
    </div>
  );
}

function ReviewBlock({
  title,
  lines,
  photo,
  photos,
}: {
  title: string;
  lines: string[];
  photo?: string;
  photos?: { label: string; url: string }[];
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <h3 className="font-medium text-saffron-700 mb-2">{title}</h3>
      {(photo || photos?.length) && (
        <div className="flex flex-wrap gap-3 mb-3">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={title} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
          )}
          {photos?.map(({ label, url }) => (
            <div key={label} className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={label} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
      <ul className="space-y-1 text-gray-700">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  inputMode,
  maxLength,
  min,
  max,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  hint?: string;
  inputMode?: 'numeric' | 'email' | 'text';
  maxLength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  const { t } = useLanguage();
  const errorText = error ? translateErrorMessage(error, t) : undefined;

  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        max={max}
        placeholder={placeholder}
        className={`input min-h-[44px] ${error ? 'border-red-400 ring-1 ring-red-200' : 'focus:ring-saffron-400'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {errorText && <p className="text-xs text-red-600 mt-1">{errorText}</p>}
    </div>
  );
}

