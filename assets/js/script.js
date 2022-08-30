var tasks = [];

var loadTasks = function () {
    tasks = JSON.parse(localStorage.getItem("tasks"));

    if (!tasks) {
        tasks = [{
            time: "",
            task: ""
        }]
    }
  
    //* Fills Nul Array Indices
    for (var i = 0; i < tasks.length; i++) {
        if (!tasks[i]) {
            tasks[i] = {
                time: "",
                task: ""
            }
        }
    }

    tasks.forEach(function (task) {
        addTask(task.time, task.task);
    })
}

var addTask = function (taskTime, taskText) {
    var taskItem = $("<p>").addClass("m-2 task-item").text(taskText)

    $("#hr-" + taskTime).find(".time-block").append(taskItem)
}

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//* Edit Task Item On Click
$(".time-slot").on("click", ".time-block", function () {
    console.log($(this))
    var text = $(this).text().trim();
    var textInput = $("<textarea>")
        .addClass("col-10 form-control")
        .val(text);

    $(this).replaceWith(textInput);
    textInput.trigger("focus")
});

//* Save Button Function
$(".save-btn").on("click", function () {
    var textArea = $(this).closest(".time-slot").find(".form-control")

    //* Update Task Text  
    var text = textArea.val().trim();

    var taskP = $("<div>")
        .addClass("col-10 time-block")
        .html("<p class='m-2 task-item'>" + text + "</p>");

    textArea.replaceWith(taskP);

    //* Update Task Array
    var index = $(this).closest(".time-slot").index();

    var taskTime = $(this)
        .closest(".time-slot")
        .attr("id")
        .replace("hr-", "");

    var taskObj = {
        time: taskTime,
        task: text
    }

    tasks[index] = taskObj;
    saveTasks();
    auditTime();
})

var auditTime = function () {
    var currentHr = moment().hour();

    for (i = 9; i < 18; i++) {
        var timeSlotEl = $("#hr-" + i).find(".time-block");
        timeSlotEl.removeClass("past present future");

        if (currentHr < i) {
            timeSlotEl.addClass("future");
        }
        else if (currentHr > i) {
            timeSlotEl.addClass("past");
        }
        else {
            timeSlotEl.addClass("present");
        }
    }
}

//* Clear Scheduler
$(".reset-btn").on("click", function () {
    localStorage.clear();
    $(".task-item").remove();
});

//* Display Current Time and Update Time-Block
$("#currentDay").text("It is currently " + moment().format("h:mm A on dddd, MMMM D" + "."))
setInterval(function () {
    $("#currentDay").text("It is currently " + moment().format("h:mm A on dddd, MMMM D" + "."))
    auditTime();
}, 60000)

loadTasks();
auditTime(); 
