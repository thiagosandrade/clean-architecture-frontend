export function formatPriority(value: unknown): string {

  const priority = value as number;

  switch (priority) {
    case 0:
      return 'Normal';

    case 1:
      return 'Low';

    case 2:
      return 'Medium';

    case 3:
      return 'High';

    case 4:
      return 'Top';

    default:
      return '';
  }
}