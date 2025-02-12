/*
  1. Se om du kan hitta två stycken code smells i följande funktion och rätta till dem.
  Funktionen tar emot en lista med längshoppslängder och syftet med funktionen är att summera
  dessa hopplängder.
*/

function getLength(jumpings: number[]): number {
  let totalNumber = 0;

  totalNumber = jumpings.reduce(
    (jumpDistanceSoFar, currentJump) => jumpDistanceSoFar + currentJump
  );

  return totalNumber;
}

// Min förbättrade version

function sumJumpDistances(jumpings: number[]): number {
  return jumpings.reduce((sum, currentJump) => sum + currentJump, 0);
}

/*
  2. I detta exempel har vi fokuserat på if-statements. Se om du kan göra exemplet bättre!
*/

class Student {
  constructor(
    public name: string,
    public handedInOnTime: boolean,
    public passed: boolean
  ) {}
}

function getStudentStatus(student: Student): string {
  student.passed =
    student.name == "Sebastian"
      ? student.handedInOnTime
        ? true
        : false
      : false;

  if (student.passed) {
    return "VG";
  } else {
    return "IG";
  }
}

// Min förbättrade version

class Student {
  constructor(public name: string, public handedInOnTime: boolean) {}

  hasPassed(): boolean {
    return this.name === "Sebastian" && this.handedInOnTime;
  }

  getStatus(): string {
    return this.hasPassed() ? "VG" : "IG";
  }
}

/*
  3. Variabelnamn är viktiga. Kika igenom följande kod och gör om och rätt.
  Det finns flera code smells att identifiera här. Vissa är lurigare än andra.
*/

class Temp {
  constructor(public q: string, public where: Date, public v: number) {}
}

function averageWeeklyTemperature(heights: Temp[]) {
  let r = 0;

  for (let who = 0; who < heights.length; who++) {
    if (heights[who].q === "Stockholm") {
      if (heights[who].where.getTime() > Date.now() - 604800000) {
        r += heights[who].v;
      }
    }
  }

  return r / 7;
}

// Min förbättrade version

class TemperatureRecord {
  constructor(
    public location: string,
    public date: Date,
    public temperature: number
  ) {}
}

function averageWeeklyTemperature(records: TemperatureRecord[], city: string): number {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const filtered = records.filter(record =>
    record.location === city && record.date.getTime() > oneWeekAgo
  );

  return filtered.reduce((sum, record, _, arr) => sum + record.temperature / arr.length, 0);
}

/*
  4. Följande funktion kommer att presentera ett objekt i dom:en. 
  Se om du kan göra det bättre. Inte bara presentationen räknas, även strukturer.
*/

function showProduct(
  name: string,
  price: number,
  amount: number,
  description: string,
  image: string,
  parent: HTMLElement
) {
  let container = document.createElement("div");
  let title = document.createElement("h4");
  let pris = document.createElement("strong");
  let imageTag = document.createElement("img");

  title.innerHTML = name;
  pris.innerHTML = price.toString();
  imageTag.src = image;

  container.appendChild(title);
  container.appendChild(imageTag);
  container.appendChild(pris);
  parent.appendChild(container);
}

// Min förbättrade version

interface Product {
  name: string;
  price: number;
  amount: number;
  description: string;
  image: string;
}

function showProduct(product: Product, parent: HTMLElement) {
  const container = document.createElement("div");
  container.classList.add("product");

  container.innerHTML = `
    <h4>${product.name}</h4>
    <img src="${product.image}" alt="${product.name}">
    <strong>${product.price} kr</strong>
    <p>${product.description}</p>
    <p>In stock: ${product.amount}</p>
  `;

  parent.appendChild(container);
}

/*
  5. Följande funktion kommer presentera studenter. Men det finns ett antal saker som 
  går att göra betydligt bättre. Gör om så många som du kan hitta!
*/

function presentStudents(students: Student[]) {
  for (const student of students) {
    if (student.handedInOnTime) {
      let container = document.createElement("div");
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;

      container.appendChild(checkbox);
      let listOfStudents = document.querySelector("ul#passedstudents");
      listOfStudents?.appendChild(container);
    } else {
      let container = document.createElement("div");
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = false;

      container.appendChild(checkbox);
      let listOfStudents = document.querySelector("ul#failedstudents");
      listOfStudents?.appendChild(container);
    }
  }
}

// Min förbättrade version

function presentStudents(students: Student[]) {
  const passedList = document.querySelector("ul#passedstudents");
  const failedList = document.querySelector("ul#failedstudents");

  students.forEach(student => {
    const container = document.createElement("li"); // Ändrat till li för bättre semantik
    container.textContent = student.name; // Lägg till studentens namn

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = student.handedInOnTime;

    container.appendChild(checkbox);
    (student.handedInOnTime ? passedList : failedList)?.appendChild(container);
  });
}

/*
  6. Skriv en funktion som skall slå ihop följande texter på ett bra sätt:
  Lorem, ipsum, dolor, sit, amet
  Exemplet under löser problemet, men inte speciellt bra. Hur kan man göra istället?
*/

function concatenateStrings() {
  let result = "";
  result += "Lorem";
  result += "ipsum";
  result += "dolor";
  result += "sit";
  result += "amet";

  return result;
}

// Min förbättrade version

function concatenateStrings(): string {
  return ["Lorem", "ipsum", "dolor", "sit", "amet"].join(" ");
}

/*
  7. Denna funktion skall kontrollera att en användare är över 20 år och göra någonting.
  Det finns dock problem med denna typ av funktion. Vad händer när kraven ändras och
  fler och fler parametrar behöver läggas till? T.ex. avatar eller adress. Hitta en bättre
  lösning som är hållbar och skalar bättre.
*/

interface User {
  name: string;
  birthday: Date;
  email: string;
  password: string;
  avatar?: string;
  address?: string;
}

const getAge = (birthday: Date): number => {
  const today = new Date();
  const age = today.getFullYear() - birthday.getFullYear();
  return today < new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate()) ? age - 1 : age;
};

const createUser = (user: User): string =>
  getAge(user.birthday) < 20 ? "Du är under 20 år" : `Användaren ${user.name} har skapats!`;
