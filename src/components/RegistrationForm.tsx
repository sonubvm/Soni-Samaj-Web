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
  StudentType,
} from '@/types/family';
import {
  errorsToList,
  FieldErrors,
  getFirstErrorStep,
  STEPS,
  validateAll,
  validateStep,
} from '@/lib/validateFamily';

export default function RegistrationForm() {
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
      errors['headOfFamily.mobile'] =
        'This mobile number is already registered. Please use a different number or contact admin.';
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
      errors['headOfFamily.mobile'] =
        'This mobile number is already registered. Please use a different number or contact admin.';
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful</h2>
        <p className="text-gray-600 mb-6">Your family details have been saved successfully.</p>

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
            Register Another
          </button>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const isDuplicateError = error?.includes('already registered');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex-1 h-2 rounded-full transition-all ${i <= step ? 'bg-gradient-to-r from-saffron-500 to-gold-500' : 'bg-gray-200'}`}
              aria-label={`Step ${i + 1}: ${s.title}`}
            />
          ))}
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-saffron-100 flex items-center justify-center text-2xl shrink-0">
            {current.icon}
          </div>
          <div>
            <p className="text-sm text-saffron-600 font-medium">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-2xl font-bold text-gray-800">{current.title}</h2>
            <p className="text-gray-500 text-sm mt-1">{current.desc}</p>
          </div>
        </div>
      </div>

      <div className="card shadow-xl border-saffron-100">
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
              {isDuplicateError ? 'Duplicate registration blocked' : 'Please fix the following:'}
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              {error
                ? error.split('\n').map((msg) => <li key={msg}>{msg}</li>)
                : errorsToList(fieldErrors).map((msg) => <li key={msg}>{msg}</li>)}
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

        <p className="text-xs text-gray-400 mt-6">Fields marked * are required</p>

        <div className="flex justify-between mt-4 pt-6 border-t border-gray-100">
          <button type="button" className="btn-secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn-primary" onClick={goNext}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" className="btn-primary" disabled={loading} onClick={handleSubmit}>
              {loading ? 'Submitting...' : 'Submit Registration'}
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
  const mobileError =
    errors['headOfFamily.mobile'] ||
    (mobileStatus === 'taken'
      ? 'This mobile number is already registered. Please use a different number or contact admin.'
      : undefined);

  return (
    <div className="space-y-6">
      <div className="section-box">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-saffron-500" /> Head of Family
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full Name *" value={form.headOfFamily.name} error={errors['headOfFamily.name']} onChange={(v) => updateForm({ headOfFamily: { ...form.headOfFamily, name: v } })} />
          <div>
            <Field
              label="Mobile *"
              value={form.headOfFamily.mobile || ''}
              error={mobileError}
              hint="10-digit number; checked live against existing registrations"
              inputMode="numeric"
              maxLength={10}
              onChange={(v) => updateForm({ headOfFamily: { ...form.headOfFamily, mobile: v.replace(/\D/g, '').slice(0, 10) } })}
            />
            {mobileStatus === 'checking' && (
              <p className="text-xs text-gray-500 mt-1">Checking availability…</p>
            )}
            {mobileStatus === 'available' && !mobileError && (
              <p className="text-xs text-green-600 mt-1">Mobile number is available</p>
            )}
          </div>
          <Field label="Email" value={form.headOfFamily.email || ''} type="email" error={errors['headOfFamily.email']} onChange={(v) => updateForm({ headOfFamily: { ...form.headOfFamily, email: v } })} />
        </div>
      </div>
      <div className="section-box">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-saffron-500" /> Address
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="House No." value={form.address.houseNo || ''} onChange={(v) => updateForm({ address: { ...form.address, houseNo: v } })} />
          <Field label="Street" value={form.address.street || ''} onChange={(v) => updateForm({ address: { ...form.address, street: v } })} />
          <Field label="Village" value={form.address.village || ''} onChange={(v) => updateForm({ address: { ...form.address, village: v } })} />
          <Field label="City *" value={form.address.city} error={errors['address.city']} onChange={(v) => updateForm({ address: { ...form.address, city: v } })} />
          <Field label="District *" value={form.address.district} error={errors['address.district']} onChange={(v) => updateForm({ address: { ...form.address, district: v } })} />
          <Field label="State *" value={form.address.state} error={errors['address.state']} onChange={(v) => updateForm({ address: { ...form.address, state: v } })} />
          <Field label="Pincode *" value={form.address.pincode || ''} error={errors['address.pincode']} hint="6-digit Indian pincode" inputMode="numeric" maxLength={6} onChange={(v) => updateForm({ address: { ...form.address, pincode: v.replace(/\D/g, '').slice(0, 6) } })} />
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
  const roles = [
    { key: 'father' as const, label: 'Father' },
    { key: 'mother' as const, label: 'Mother' },
  ];

  return (
    <div className="space-y-6">
      {roles.map(({ key, label }) => (
        <div key={key} className="section-box">
          <h3 className="font-semibold text-saffron-700">{label}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name *" value={form.parents[key].name} error={errors[`parents.${key}.name`]} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], name: v } } })} />
            <Field label="Mobile" value={form.parents[key].mobile || ''} error={errors[`parents.${key}.mobile`]} inputMode="numeric" maxLength={10} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], mobile: v.replace(/\D/g, '').slice(0, 10) } } })} />
            <Field label="Occupation" value={form.parents[key].occupation || ''} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], occupation: v } } })} />
            <Field label="Education" value={form.parents[key].education || ''} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], education: v } } })} />
            <Field label="Monthly Income (INR)" type="number" min={0} value={String(form.parents[key].income || 0)} onChange={(v) => updateForm({ parents: { ...form.parents, [key]: { ...form.parents[key], income: Number(v) || 0 } } })} />
          </div>
        </div>
      ))}
      <Field label="Total Family Income (INR/month)" type="number" min={0} value={String(form.totalFamilyIncome)} onChange={(v) => updateForm({ totalFamilyIncome: Number(v) || 0 })} />
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-gray-500">This step is optional. Skip if not applicable.</p>
        <button type="button" className="btn-secondary text-sm" onClick={onSkip}>
          Skip to Review
        </button>
      </div>

      <div className="section-box">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Co-Residents</h3>
          <button type="button" className="btn-secondary text-sm py-1.5" onClick={addResident}>
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
        {form.coResidents.length === 0 ? (
          <p className="text-sm text-gray-400">No co-residents added.</p>
        ) : (
          form.coResidents.map((r, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 mb-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Member {i + 1}</span>
                <button type="button" onClick={() => removeResident(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Name *" value={r.name} error={errors[`coResidents.${i}.name`]} onChange={(v) => updateResident(i, 'name', v)} />
                <Field label="Relation" value={r.relation || ''} onChange={(v) => updateResident(i, 'relation', v)} />
                <Field label="Age" type="number" min={0} value={String(r.age || '')} onChange={(v) => updateResident(i, 'age', Number(v) || 0)} />
                <Field label="Occupation" value={r.occupation || ''} onChange={(v) => updateResident(i, 'occupation', v)} />
                <Field label="Mobile" value={r.mobile || ''} error={errors[`coResidents.${i}.mobile`]} inputMode="numeric" maxLength={10} onChange={(v) => updateResident(i, 'mobile', v.replace(/\D/g, '').slice(0, 10))} />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="section-box">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-saffron-500" /> Children / Students
          </h3>
          <button type="button" className="btn-secondary text-sm py-1.5" onClick={addChild}>
            <Plus className="w-4 h-4" /> Add Child
          </button>
        </div>
        {form.children.length === 0 ? (
          <p className="text-sm text-gray-400">No children added.</p>
        ) : (
          form.children.map((c, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-saffron-100 mb-3 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Student {i + 1}</span>
                <button type="button" onClick={() => removeChild(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Name *" value={c.name} error={errors[`children.${i}.name`]} onChange={(v) => updateChild(i, 'name', v)} />
                <div>
                  <label className="label">Gender</label>
                  <select className="input" value={c.gender} onChange={(e) => updateChild(i, 'gender', e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Field label="Date of Birth" type="date" value={c.dob || ''} onChange={(v) => updateChild(i, 'dob', v)} />
                <div className="flex items-center gap-2 md:col-span-2 p-3 rounded-xl bg-saffron-50/80 border border-saffron-100">
                  <input
                    type="checkbox"
                    id={`studying-${i}`}
                    checked={c.isStudying}
                    onChange={(e) => updateChild(i, 'isStudying', e.target.checked)}
                    className="rounded border-gray-300 text-saffron-500"
                  />
                  <label htmlFor={`studying-${i}`} className="text-sm text-gray-700">
                    Currently going to school / college
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Education category</label>
                <div className="flex gap-2">
                  {(['School', 'College'] as StudentType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setStudentType(i, type)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                        c.studentType === type
                          ? 'bg-saffron-500 text-white border-saffron-500 shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-saffron-300'
                      }`}
                    >
                      {type === 'School' ? 'School' : 'College'}
                    </button>
                  ))}
                </div>
                {!c.isStudying && (
                  <p className="text-xs text-gray-500 mt-2">
                    School / college details are optional when not currently studying. Name and basic details are still required.
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Field
                  label={
                    c.studentType === 'College'
                      ? c.isStudying
                        ? 'College Name *'
                        : 'College Name'
                      : c.isStudying
                        ? 'School Name *'
                        : 'School Name'
                  }
                  value={c.school.name || ''}
                  error={errors[`children.${i}.school.name`]}
                  onChange={(v) => updateChild(i, 'school.name', v)}
                />
                {c.studentType === 'College' ? (
                  <Field
                    label={c.isStudying ? 'Course / Degree *' : 'Course / Degree'}
                    value={c.course || ''}
                    error={errors[`children.${i}.course`]}
                    placeholder="e.g. B.Com, B.Tech"
                    onChange={(v) => updateChild(i, 'course', v)}
                  />
                ) : (
                  <>
                    <div>
                      <label className="label">Medium</label>
                      <select className="input" value={c.school.medium} onChange={(e) => updateChild(i, 'school.medium', e.target.value)}>
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <Field label="Board" value={c.school.board || ''} onChange={(v) => updateChild(i, 'school.board', v)} />
                  </>
                )}
                <Field
                  label={c.studentType === 'College' ? 'Year / Semester' : 'Class / Standard'}
                  value={c.currentStd || ''}
                  onChange={(v) => updateChild(i, 'currentStd', v)}
                />
                <Field label="Pass Out Year" type="number" min={1950} max={2100} value={String(c.passOutYear || '')} onChange={(v) => updateChild(i, 'passOutYear', Number(v) || 0)} />
                <Field label="Percentage (%)" type="number" min={0} max={100} value={String(c.percentage ?? '')} error={errors[`children.${i}.percentage`]} onChange={(v) => updateChild(i, 'percentage', v === '' ? 0 : Number(v))} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StepReview({ form }: { form: FamilyFormData }) {
  return (
    <div className="space-y-4 text-sm">
      <ReviewBlock title="Head of Family" lines={[`${form.headOfFamily.name} — ${form.headOfFamily.mobile}`]} />
      <ReviewBlock
        title="Address"
        lines={[
          [form.address.houseNo, form.address.street, form.address.village].filter(Boolean).join(', ') || '—',
          `${form.address.city}, ${form.address.district}, ${form.address.state} — ${form.address.pincode}`,
        ]}
      />
      <ReviewBlock
        title="Parents & Income"
        lines={[
          `Father: ${form.parents.father.name} (${form.parents.father.occupation || 'N/A'})`,
          `Mother: ${form.parents.mother.name} (${form.parents.mother.occupation || 'N/A'})`,
          `Total income: INR ${form.totalFamilyIncome}/month`,
        ]}
      />
      {form.coResidents.length > 0 && (
        <ReviewBlock title="Co-Residents" lines={form.coResidents.map((r) => `${r.name} (${r.relation || 'N/A'})`)} />
      )}
      {form.children.length > 0 && (
        <ReviewBlock
          title="Children"
          lines={form.children.map((c) => {
            if (!c.isStudying) {
              return `${c.name} — Not currently studying (${c.studentType})`;
            }
            if (c.studentType === 'College') {
              return `${c.name} — College: ${c.school.name || 'N/A'}, ${c.course || 'N/A'}`;
            }
            return `${c.name} — School: ${c.school.name || 'N/A'}, Class ${c.currentStd || 'N/A'}`;
          })}
        />
      )}
    </div>
  );
}

function ReviewBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <h3 className="font-medium text-saffron-700 mb-2">{title}</h3>
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
        className={`input ${error ? 'border-red-400 ring-1 ring-red-200' : 'focus:ring-saffron-400'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

