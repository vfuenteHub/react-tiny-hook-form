export enum ValidityStatesEnum {
  BAD_INPUT = 'badInput',
  CUSTOM_ERROR = 'customError',
  PATTERN_MISMATCH = 'patternMismatch',
  RANGE_OVERFLOW = 'rangeOverflow',
  RANGE_UNDERFLOW = 'rangeUnderflow',
  STEP_MISMATCH = 'stepMismatch',
  TOO_LONG = 'tooLong',
  TOO_SHORT = 'tooShort',
  TYPE_MISMATCH = 'typeMismatch',
  VALID = 'valid',
  VALUE_MISSING = 'valueMissing',
}

export type ValidityState = `${ValidityStatesEnum}`;

export type Errors = Partial<{ [name: string]: ValidityState }>;

export type UseFormProps = {
  fields: string[];
};

export type UseFormReturns = {
  errors: Errors;
  setError(name: string, error: ValidityState): void;
  clearErrors(name?: string | string[]): void;
  validate(
    e: React.ChangeEvent<
      {
        files?: FileList | null;
        checked?: boolean;
      } & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    >
  ): React.ChangeEvent<
    {
      files?: FileList | null;
      checked?: boolean;
    } & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
  >;
  handleSubmit: (
    callback: (
      values: Partial<{
        [name: string]: unknown;
      }>,
      e: React.FormEvent<HTMLFormElement>
    ) => void,
    e?: React.FormEvent<HTMLFormElement>
  ) => (e: React.FormEvent<HTMLFormElement>) => void;
};
