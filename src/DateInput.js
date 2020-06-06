import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Drop, FormContext, MaskedInput } from 'grommet';
import { Calendar as CalendarIcon } from 'grommet-icons';

const formatRegexp = /([mdy]+)([^\w]*)([mdy]+)([^\w]*)([mdy]+)/i;

const valueToText = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

const DateInput = ({
  defaultValue,
  format = 'mm/dd/yyyy',
  name,
  onChange,
  value: valueArg,
  ...rest
}) => {
  const { useFormInput } = useContext(FormContext);
  const [value, setValue] = useFormInput(name, valueArg, defaultValue);
  const [textValue, setTextValue] = useState(valueToText(value));
  useEffect(() => {
    if (value) setTextValue(valueToText(value));
  }, [value]);
  const mask = useMemo(() => {
    const match = format.match(formatRegexp);
    const result = match.slice(1).map((part) => {
      if (part[0] === 'm' || part[0] === 'd' || part[0] === 'y')
        return { placeholder: part, length: part.length, regexp: /^[0-9]+$/ };
      return { fixed: part };
    });
    return result;
  }, [format]);
  const [open, setOpen] = useState();
  const ref = useRef();

  return (
    <>
      <MaskedInput
        ref={ref}
        name={name}
        icon={<CalendarIcon />}
        reverse
        mask={mask}
        {...rest}
        value={textValue}
        onChange={(event) => {
          setTextValue(event.target.value);
          // TODO: parse into ISO date
        }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <Drop
          target={ref.current}
          align={{ top: 'bottom' }}
          onEsc={() => setOpen(false)}
          onClickOutside={() => setOpen(false)}
        >
          <Calendar
            date={value}
            onSelect={(nextValue) => {
              setValue(nextValue);
              setOpen(false);
            }}
          />
        </Drop>
      )}
    </>
  );
};

export default DateInput;
