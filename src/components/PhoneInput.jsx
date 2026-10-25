import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const COUNTRY_OPTIONS = getCountries()
  .map((iso) => ({
    iso,
    name: regionNames.of(iso),
    callingCode: getCountryCallingCode(iso),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const composeValue = (country, number) => {
  if (!number) return "";
  if (!country) return number;
  return `+${country.callingCode}${number.replace(/\D/g, "")}`;
};

export default function PhoneInput({ label, value, onChange, disabled }) {
  const [country, setCountry] = useState(null);
  const [number, setNumber] = useState("");
  const lastEmitted = useRef(null);

  const emit = (v) => {
    lastEmitted.current = v;
    onChange(v);
  };

  // Only ever reacts to the `value` prop (parent/legacy data) — never fires
  // onChange itself, so an untouched legacy number round-trips unchanged.
  // Skips re-parsing a value this component just emitted itself — otherwise
  // every keystroke feeds back in as a partial number ("+3767") that fails
  // to parse and clears the country the user is mid-typing.
  useEffect(() => {
    if (value === lastEmitted.current) return;

    const trimmed = (value || "").trim();
    const parsed = trimmed.startsWith("+") ? parsePhoneNumberFromString(trimmed) : null;

    if (parsed?.country) {
      setCountry(COUNTRY_OPTIONS.find((c) => c.iso === parsed.country) || null);
      setNumber(parsed.nationalNumber);
    } else {
      setCountry(null);
      setNumber(trimmed);
    }
  }, [value]);

  const handleCountryChange = (e, newCountry) => {
    setCountry(newCountry);
    emit(composeValue(newCountry, number));
  };

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    setNumber(newNumber);
    emit(composeValue(country, newNumber));
  };

  const handleNumberPaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (!pasted.startsWith("+")) return;

    const parsed = parsePhoneNumberFromString(pasted);
    if (!parsed?.country) return;

    e.preventDefault();
    const pastedCountry = COUNTRY_OPTIONS.find((c) => c.iso === parsed.country) || null;
    setCountry(pastedCountry);
    setNumber(parsed.nationalNumber);
    emit(composeValue(pastedCountry, parsed.nationalNumber));
  };

  const composed = composeValue(country, number);
  const showInvalid = Boolean(country) && Boolean(number) && !isValidPhoneNumber(composed);

  return (
    <Box display="flex" gap={1}>
      <Autocomplete
        sx={{ width: 180 }}
        options={COUNTRY_OPTIONS}
        value={country}
        disabled={disabled}
        onChange={handleCountryChange}
        isOptionEqualToValue={(option, val) => option.iso === val.iso}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={option.iso} {...optionProps}>
              <Box display="flex" alignItems="center" gap={1}>
                <ReactCountryFlag
                  svg
                  countryCode={option.iso}
                  style={{ width: "1.2em", height: "1.2em" }}
                />
                <span>{option.name}</span>
                <span style={{ opacity: 0.6 }}>+{option.callingCode}</span>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Country"
            InputProps={{
              ...params.InputProps,
              startAdornment: country ? (
                <ReactCountryFlag
                  svg
                  countryCode={country.iso}
                  style={{ width: "1.2em", height: "1.2em", marginRight: 4 }}
                />
              ) : null,
            }}
          />
        )}
      />
      <TextField
        label={label}
        value={number}
        disabled={disabled}
        onChange={handleNumberChange}
        onPaste={handleNumberPaste}
        error={showInvalid}
        helperText={showInvalid ? `Invalid number for ${country.name}` : ""}
        fullWidth
      />
    </Box>
  );
}
