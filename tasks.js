class Tasks {
    constructor () {
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.addEventHandlers();

        this.displayTasks();
    }

    addEventHandlers () {
        $('.submitTask').on('click', this.handleAdd);
        $('.addTask').on('keypress', (e) => {
            if (e.keyCode === 13 && $('#inputTask').val() !== "") {
                this.handleAdd();
            }
        });
    }

    displayTasks () {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        
        if (tasks !== null) {
            for (let i = 0; i < tasks.length; i++) {
                const {date, progress, task} = tasks[i];
    
                $('.tasks')
                .append($('<tr>').addClass('new-task-row').css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 'fast')
                    .append($("<th>").text(progress).addClass('col-xs-4 col-md-4'))
                    .append($("<th>").text(task).addClass('col-xs-4 col-md-4'))
                    .append($("<th>").text(date).addClass('col-xs-4 col-md-4'))
                    .append($("<th>").addClass('col-xs-4 col-md-4')
                        .append(
                            $('<div>')
                                .addClass('glyphicon glyphicon-trash delete-task-btn')
                                .on('click', (e) => {
                                    this.handleDelete(e);
                                })
                    ))
                );
            }
        }
    }

    handleAdd () {
        const task = $('#inputTask').val();
        $('#inputTask').val('');
        let date = new Date();

        date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();

        $('.tasks')
            .append($('<tr>').addClass('new-task-row').css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 'fast')
                .append($("<th>").text('In-Progress').addClass('col-xs-4 col-md-4'))
                .append($("<th>").text(task).addClass('col-xs-4 col-md-4'))
                .append($("<th>").text(date).addClass('col-xs-4 col-md-4'))
                .append($("<th>").addClass('delete col-xs-4 col-md-4')
                    .append(
                        $('<div>')
                            .addClass('glyphicon glyphicon-trash delete-task-btn')
                            .on('click', (e) => {
                                this.handleDelete(e);
                            })
                ))
        );
        
        let allTasks = [];

        const newTask = {
            progress: 'In-progress',
            task: task,
            date: date,
        }

        if (localStorage.tasks === undefined) {
            allTasks.push(newTask);

            localStorage.setItem('tasks', JSON.stringify(allTasks))
        } else {
            allTasks = JSON.parse(localStorage.getItem('tasks'));
            allTasks.push(newTask);

            localStorage.setItem('tasks', JSON.stringify(allTasks));
        }
    }

    handleDelete (e) {
        const task = $(e.target).parent().prev().prev().text();
        let allTasks = JSON.parse(localStorage.getItem('tasks'));

        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].task == task) {
                // if (allTasks.length === 1) {
                //     localStorage.removeItem('tasks');
                // } else {
                    allTasks.splice(i, 1);
                    localStorage.setItem('tasks', JSON.stringify(allTasks));
                    $(e.target).parent().parent().remove();
                // }
            }
        }
    }
}
