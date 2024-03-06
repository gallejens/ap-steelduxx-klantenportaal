const REQUIREMENTS: Record<
  string,
  { labelKey: string } & (
    | { checker: (password: string) => boolean }
    | { regex: RegExp }
  )
> = {
  length: {
    labelKey: 'passwordRequirements:length',
    checker: (password: string) => password.length >= 12,
  },
  number: {
    labelKey: 'passwordRequirements:number',
    regex: /[0-9]/,
  },
  lowercase: {
    labelKey: 'passwordRequirements:lowercase',
    regex: /[a-z]/,
  },
  uppercasee: {
    labelKey: 'passwordRequirements:uppercase',
    regex: /[A-Z]/,
  },
  symbol: {
    labelKey: 'passwordRequirements:symbol',
    regex: /[$&+,:;=?@#|'<>.^*()%!-]/,
  },
};

export const checkPasswordRequirements = (password: string) => {
  const individual: { labelKey: string; fulfilled: boolean }[] = [];

  for (const requirement of Object.values(REQUIREMENTS)) {
    let fulfilled = false;

    if ('checker' in requirement) {
      fulfilled = requirement.checker(password);
    } else {
      fulfilled = requirement.regex.test(password);
    }

    individual.push({
      labelKey: requirement.labelKey,
      fulfilled,
    });
  }

  return {
    valid: individual.every(r => r.fulfilled),
    individual,
  };
};
