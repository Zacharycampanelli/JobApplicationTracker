import { faker } from "@faker-js/faker";

const statuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'] as const;
const applicationSources = [
  'LINKEDIN',
  'INDEED',
  'COMPANY_SITE',
  'REFERRAL',
  'RECRUITER',
  'NETWORKING',
  'OTHER',
] as const;
const workModes = ['REMOTE', 'HYBRID', 'ONSITE'] as const;

const daysAfter = (date: Date, minDays: number, maxDays: number) => {
  const from = new Date(date);
  from.setDate(from.getDate() + minDays);

  const to = new Date(date);
  to.setDate(to.getDate() + maxDays);

  return faker.date.between({ from, to });
};

export const createFakeApplication = () => {
  const status = faker.helpers.arrayElement(statuses);
  const appliedAt = faker.date.recent({ days: 90 });
  const salaryMin = faker.number.int({ min: 50000, max: 200000 });
  const salaryMax = faker.number.int({ min: salaryMin + 10000, max: salaryMin + 250000 });
  let firstResponseAt: Date | null = null;
  let interviewAt: Date | null = null;
  let offerAt: Date | null = null;
  let rejectedAt: Date | null = null;

  if (status === 'INTERVIEW') {
    firstResponseAt = daysAfter(appliedAt, 1, 14);
    interviewAt = daysAfter(firstResponseAt, 2, 21);
  }

  if (status === 'OFFER') {
    firstResponseAt = daysAfter(appliedAt, 1, 14);
    interviewAt = daysAfter(firstResponseAt, 2, 21);
    offerAt = daysAfter(interviewAt, 3, 21);
  }

  if (status === 'REJECTED') {
    firstResponseAt = faker.datatype.boolean() ? daysAfter(appliedAt, 1, 21) : null;

    rejectedAt = daysAfter(firstResponseAt ?? appliedAt, 1, 30);
  }

  return {
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
    status,
    appliedAt,
    notes: faker.lorem.paragraph(),
    link: faker.internet.url(),
    source: faker.helpers.arrayElement(applicationSources),
    workMode: faker.helpers.arrayElement(workModes),
    salaryMin,
    salaryMax,
    firstResponseAt,
    interviewAt,
    offerAt,
    rejectedAt,
  };
};
