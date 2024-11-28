import { useCallback, useId } from 'react';
import { useForm, ValidityStatesEnum } from 'react-tiny-hook-form';

const INPUT_NAME = 'input';
const INPUT_PATTERN = '^[a-zA-Z\u00C0-\u024F]+$';
const INPUT_ERROR = ValidityStatesEnum.CUSTOM_ERROR;

function App() {
  const id = useId();
  const hintId = useId();

  const { errors, handleSubmit, validate, setError, clearErrors } = useForm({
    fields: [INPUT_NAME],
  });

  const onSetError = useCallback(() => {
    setError(INPUT_NAME, INPUT_ERROR);
  }, [errors, setError]);

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(console.debug)}
      onReset={() => clearErrors()}
    >
      <fieldset>
        <legend>Form</legend>

        <div>
          <label htmlFor={id}>
            {INPUT_NAME} <b>*</b>
          </label>

          <input
            name={INPUT_NAME}
            pattern={INPUT_PATTERN}
            id={id}
            required
            aria-describedby={hintId}
            onChange={validate}
          />

          <div id={hintId}>
            {errors[INPUT_NAME] && <p>{errors[INPUT_NAME]}</p>}
          </div>
        </div>
      </fieldset>

      <button type="submit">Submit</button>

      <button type="button" onClick={onSetError}>
        Set "{INPUT_ERROR}" error at "{INPUT_NAME}" field
      </button>

      <button type="button" onClick={() => clearErrors()}>
        Clear errors
      </button>

      <button type="reset">Reset</button>
    </form>
  );
}

export default App;
