/* zadání */
const maleNames = ["Jan", "Petr", "Tomáš", "Martin", "Jakub", "Lukáš", "Václav", "Michal", "Ondřej", "David"];
const femaleNames = ["Václava", "Petra", "Tereza", "Lucie", "Anna", "Eliška", "Veronika", "Kateřina", "Barbora", "Karolína"];

const maleSurnames = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera", "Veselý", "Horák", "Němec", "Marek"];
const femaleSurnames = ["Nováková", "Svobodová", "Dvořáková", "Černá", "Procházková", "Kučerová", "Veselá", "Horáková", "Němcová", "Marková"];

const workloads = [10, 20, 30, 40];

/* funkce random číslo */
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* funkce výběr pohlaví */
function getRandomItem(array) {
  return array[getRandomInteger(0, array.length - 1)];
}

/* funkce zaokrouhlení na jedno desetinné místo*/
function roundToOneDecimal(number) {
  return Math.round(number * 10) / 10;
}

/* funkce spočítání věku podle data narození*/
function getAge(birthdate) {
  const now = new Date();
  const birth = new Date(birthdate);
  const ageInMilliseconds = now - birth;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
}

function generateBirthdate(minAge, maxAge) {
  const now = new Date();

  const oldestDate = new Date(now);
  oldestDate.setFullYear(now.getFullYear() - maxAge);

  const youngestDate = new Date(now);
  youngestDate.setFullYear(now.getFullYear() - minAge);

  const randomTime = oldestDate.getTime() + Math.random() * (youngestDate.getTime() - oldestDate.getTime());

  return new Date(randomTime).toISOString();
}

/* funkce medián*/
function calculateMedian(values) {
  const sortedValues = [...values].sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 1) {
    return sortedValues[middleIndex];
  }

  return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
}

/* funkce statistiky*/
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);

  return dtoOut;
}

/* funkce zaměstnanci*/
export function generateEmployeeData(dtoIn) {
  const employees = [];

  for (let i = 0; i < dtoIn.count; i++) {
    const gender = getRandomItem(["male", "female"]);
    const workload = getRandomItem(workloads);
    const birthdate = generateBirthdate(dtoIn.age.min, dtoIn.age.max);

    let name;
    let surname;

    if (gender === "male") {
      name = getRandomItem(maleNames);
      surname = getRandomItem(maleSurnames);
    } else {
      name = getRandomItem(femaleNames);
      surname = getRandomItem(femaleSurnames);
    }

    employees.push({
      gender,
      birthdate,
      name,
      surname,
      workload,
    });
  }

  return employees;
}

/* funkce statistiky zaměstnanců*/
export function getEmployeeStatistics(employees) {
  const ages = employees.map((employee) => getAge(employee.birthdate));
  const workloadsOnly = employees.map((employee) => employee.workload);
  const women = employees.filter((employee) => employee.gender === "female");

  const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;

  const womenWorkloads = women.map((woman) => woman.workload);
  const averageWomenWorkload =
    womenWorkloads.length === 0
      ? 0
      : womenWorkloads.reduce((sum, workload) => sum + workload, 0) / womenWorkloads.length;

  return {
    total: employees.length,
    workload10: employees.filter((employee) => employee.workload === 10).length,
    workload20: employees.filter((employee) => employee.workload === 20).length,
    workload30: employees.filter((employee) => employee.workload === 30).length,
    workload40: employees.filter((employee) => employee.workload === 40).length,
    averageAge: roundToOneDecimal(averageAge),
    minAge: Math.floor(Math.min(...ages)),
    maxAge: Math.floor(Math.max(...ages)),
    medianAge: Math.floor(calculateMedian(ages)),
    medianWorkload: Math.round(calculateMedian(workloadsOnly)),
    averageWomenWorkload: roundToOneDecimal(averageWomenWorkload),
    sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload),
  };
}