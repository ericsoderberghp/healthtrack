import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Drop, DropButton, FormContext, MaskedInput } from 'grommet';
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
  format,
  inline,
  name,
  onChange,
  size,
  value: valueArg,
  ...rest
}) => {
  const { useFormInput } = useContext(FormContext);
  const [value, setValue] = useFormInput(name, valueArg, defaultValue);

  // textValue is only used when a format is provided
  const [textValue, setTextValue] = useState(valueToText(value));
  useEffect(() => {
    if (value) setTextValue(valueToText(value));
  }, [value]);

  const mask = useMemo(() => {
    if (!format) return [];
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

  const range = Array.isArray(value);

  const calendar = (
    <Calendar
      range={range}
      date={range ? undefined : value}
      dates={range ? [value] : undefined}
      onSelect={(nextValue) => {
        const normalizedValue = range ? nextValue[0] : nextValue;
        setValue(normalizedValue);
        if (onChange) onChange({ value: normalizedValue });
        if (open) setOpen(false);
      }}
      size={size}
    />
  );

  if (inline) return calendar;

  if (!format) {
    // When no format is specified, we don't give the user a way to type
    return (
      <DropButton
        icon={<CalendarIcon />}
        dropProps={{ align: { top: 'bottom' } }}
        dropContent={calendar}
      />
    );
  }

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
        size={size}
      />
      {open && (
        <Drop
          target={ref.current}
          align={{ top: 'bottom' }}
          onEsc={() => setOpen(false)}
          onClickOutside={() => setOpen(false)}
        >
          {calendar}
        </Drop>
      )}
    </>
  );
};

export default DateInput;
