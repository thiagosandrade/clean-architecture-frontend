import { formatDate } from '@angular/common';


function isValidDate(value: unknown): value is string | number | Date {

  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    !(value instanceof Date)
  ) {
    return false;
  }

  return !isNaN(new Date(value).getTime());

}


export function formatDateOnly(value: unknown): string {

  if (!isValidDate(value)) {
    return '';
  }

  return formatDate(
    value,
    'mediumDate',
    'en-US'
  );

}


export function formatDateTime(value: unknown): string {

  if (!isValidDate(value)) {
    return '';
  }

  return formatDate(
    value,
    'medium',
    'en-US'
  );

}