//get Monday date to update the progress list
const today = new Date();
console.log(today);
const currentDayName = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
const daysUntilMonday = (currentDayName === 0 ? 6 : currentDayName - 1); // Calculate days to Monday
let mondayDate = new Date();
mondayDate.setDate(today.getDate() - daysUntilMonday);
console.log("Monday of the current week:", mondayDate);

 //use format YYYY-MM-DD
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
const day = String(today.getDate()).padStart(2, '0');
const formatToday = `${year}-${month}-${day}`;
console.log(formatToday);

//compare date algorithm, will be useful soon
let newDay = new Date("2023-09-9");
let oldDay = new Date("2023-09-10");
console.log(newDay);
console.log(oldDay);
const time1 = newDay.getTime();
const time2 = oldDay.getTime();
if (time1 > time2) console.log("OhYEAHHHH!!!");

let lastUpdate = JSON.parse(localStorage.getItem("Last Update")) || "";
const addHabits = document.querySelector(".add-habit"); //add habit section
const habitsList = document.querySelector(".habits"); //prefer to the checklist in html
const habits = JSON.parse(localStorage.getItem("habits")) || []; //array that store all our habits
const currentProgress = document.querySelector(".currentWeek");

//Add a habit
function addHabit(e){
    e.preventDefault(); //prevent the submit button to refresh the page
    const text = this.querySelector("[name=habit]").value;
    const reps = Number(this.querySelector("[name=reps]").value);
    const habit = {
        name: text,
        actualReps: 0, //keep track of actual reps daily
        targetReps: reps, //how many times we suppose to do the habit daily
        daysCompleted: [],
        completed: false,
    };
    habits.push(habit);
    listHabits(habits);
    addCurrentProgress(habits);
    localStorage.setItem("habits", JSON.stringify(habits));
    this.reset();
    console.log(habits);
}

//reset actualReps to 0 each day
function resetActualRepsIfNeeded(habitsList) {
    if(lastUpdate !== formatToday) {
        habitsList.forEach((habit) =>  {
            habit.actualReps = 0;
            habit.completed = false;
        });
        localStorage.setItem("habits", JSON.stringify(habits));
        lastUpdate = formatToday;
        localStorage.setItem("Last Update", JSON.stringify(lastUpdate));
    }
}

//list habit
function listHabits(habit=[]) {
    habitsList.innerHTML = habits.map((habit, i) => {
        return `
        <li>
        <button class="delete" data-index=${i} id="delete${i}">Delete</button>
        <input type="checkbox" data-index=${i} id="habit${i}" ${habit.completed ? "checked" : ""}/>
        <label>${habit.name}</label> 
        <label>${habit.actualReps}/${habit.targetReps}</label>
        <button class="onecheck" data-index=${i}>Check</button>
        </li> 
        `;
    }).join("");
}
function completeInclude(habit, date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const formatDate = `${year}-${month}-${day}`;

    if(habit.daysCompleted.includes(formatDate)) return true;
    else return false;
}

//Update the current week progress
function addCurrentProgress(habits=[]) {
    if(habits.length > 0) {
        currentProgress.innerHTML = 
        `
        <ul class="progressColName">
        <li>Habits</li>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>
        <li>Sun</li>
        </ul> `
        currentProgress.innerHTML += habits.map((habit, i) => {
            let mon = new Date(mondayDate);
            const weekDay = [];
            weekDay.push(completeInclude(habit, mon)? "green" : "red");
            for(let i = 1; i < 7; ++i) {
                mon.setDate(mon.getDate() + 1);
                weekDay.push(completeInclude(habit, mon)? "green" : "red");
            }
            return `
            <ul class="habitProgress">
            <li>${habit.name}</li>
            <li class=${weekDay[0]}></li>
            <li class=${weekDay[1]}></li>
            <li class=${weekDay[2]}></li>
            <li class=${weekDay[3]}></li>
            <li class=${weekDay[4]}></li>
            <li class=${weekDay[5]}></li>
            <li class=${weekDay[6]}></li>
        </ul>
            `
        }).join(""); 
    }
    else currentProgress.innerHTML = "<p>Such emptiness...</p>";
  
}


//checkCompleted: this function will check if the habit is completed for the current day and mark completed when done
function checkCompleted(e) {
    if(!e.target.matches(".onecheck")) return;
    const element = e.target;
    const index = element.dataset.index;
    habits[index].actualReps+=1;
    if(habits[index].actualReps === habits[index].targetReps) {
        habits[index].completed = true;
        if(!habits[index].daysCompleted.includes(formatToday)) habits[index].daysCompleted.push(formatToday);
    }
    else if(habits[index].actualReps > habits[index].targetReps) {
        habits[index].actualReps = 0;
        habits[index].completed = false;
        const indexToRemove = habits[index].daysCompleted.indexOf(formatToday);
        if (indexToRemove !== -1) habits[index].daysCompleted.splice(indexToRemove, 1);
    }
    console.log(index);
    listHabits(habits, habitsList);
    addCurrentProgress(habits);
    localStorage.setItem("habits", JSON.stringify(habits));
}

//Delete Habit
function deleteHabit(e) {
    if(!e.target.matches(".delete")) return;
    const el = e.target;
    const index = el.dataset.index;

    habits.splice(index, 1);

    listHabits(habits, habitsList);
    addCurrentProgress(habits);
    localStorage.setItem("habits", JSON.stringify(habits));
}

addHabits.addEventListener("submit", addHabit);
habitsList.addEventListener("click", checkCompleted);
habitsList.addEventListener("click", deleteHabit);
resetActualRepsIfNeeded(habits);
listHabits(habits);
addCurrentProgress(habits);