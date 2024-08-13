import React from 'react';
import type {
  Errors,
  UseFormProps,
  UseFormReturns,
  ValidityState,
} from './types';

export const useForm = ({ fields = [] }: UseFormProps): UseFormReturns => {
  const [errors, setErrors] = React.useState<Errors>({});

  const setError = React.useCallback(
    (name, error) => {
      if (fields.includes(name)) {
        setErrors(errors => ({
          ...errors,
          [name]: error,
        }));
      }
    },
    [fields]
  ) satisfies UseFormReturns['setError'];

  const clearErrors = React.useCallback(
    name => {
      setErrors(errors => {
        const names = name
          ? typeof name === 'string'
            ? [name]
            : name
          : fields;

        names.forEach(name => delete errors[name]);
        return { ...errors };
      });
    },
    [fields]
  ) satisfies UseFormReturns['clearErrors'];

  const validate = React.useCallback(
    e => {
      const name = `${e.target.name}`;

      if (fields?.includes(name)) {
        setErrors(errors => {
          validateFormField(e.target, errors);
          return { ...errors };
        });
      }

      return e;
    },
    [fields]
  ) satisfies UseFormReturns['validate'];

  const handleSubmit = React.useCallback(
    callback => e => {
      const form = e.currentTarget;
      const inputs = Array.from(form.elements).filter(
        element =>
          fields.includes(`${element.getAttribute('name')}`) &&
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.nodeName)
      ) as ({
        files?: FileList | null;
        checked?: boolean;
      } & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement))[];

      e?.preventDefault();

      if (form.checkValidity()) {
        const values = inputs.reduce(
          (acc, { type, name, files, checked, value }) => ({
            ...acc,
            [name]:
              files || (['checkbox', 'radio'].includes(type) ? checked : value),
          }),
          {}
        );

        clearErrors(undefined);
        callback(values, e);
      } else {
        setErrors(errors => {
          inputs.forEach(input => validateFormField(input, errors));
          return { ...errors };
        });
      }
    },
    [clearErrors, fields]
  ) satisfies UseFormReturns['handleSubmit'];

  return { errors, setError, clearErrors, validate, handleSubmit };
};

// auxiliary
function validateFormField(
  input: {
    files?: FileList | null;
    checked?: boolean;
  } & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement),
  errors: Errors
) {
  const name = input.name;

  if (input.checkValidity()) delete errors[name];
  else
    for (const state in input.validity)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((input.validity as any)[state]) {
        errors[name] = state as ValidityState;
        break;
      }
}
