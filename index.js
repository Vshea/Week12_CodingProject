class Category {
    constructor(name) {
        this.name = name;
        this.chores = []; //initializes chores as an array
    }

    addChore(name,details) {
        this.chores.push(new Chore(name, details));
    }
}

class Chore {
    constructor(name, details) {
        this.name = name;
        this.details = details;
    }
}

class ChoreService {
    static url = 'https://65a83fbb94c2c5762da885a9.mockapi.io/Categories'; //API

    static getAllCategories() {
        return $.get(this.url);
    }

    static getCategory(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCategory(Category) {
        return $.post(this.url, Category);
    }

    static updateCategory(Category) {
        return $.ajax({
            url: this.url + `/${Category._id}`,
            dataType: 'json',
            data: JSON.stringify(Category),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteCategory(id) {
        return $.ajax({
            url:this.url + `/${id}`,
            type: 'DELETE'
            });
        }
}

class DOMManager {
    static Categories;

    static getAllCategories() {
        ChoreService.getAllCategories().then(Categories => this.render(Categories));
    }

    static createCategory(name) {
        ChoreService.createCategory(new Category(name))
        .then(() => {
            return ChoreService.getAllCategories();
        })
        .then((Categories) => this.render(Categories));
    }

    static deleteCategory(id) {
        ChoreService.deleteCategory(id) 
            .then(() => {
                return ChoreService.getAllCategories();
            })
            .then((Categories) => this.render(Categories));
    }

    static addChore(id) {
        for (let Category of this.Categories) {
            if (Category._id == id) {
                Category.Chores.push(new Chore($(`#${Category._id}-Chore-name`).val(), $(`#${Category._id}-Chore-details`).val()));
                ChoreService.updateCategory(Category) 
                .then(() => {
                    return ChoreService.getAllCategories();
                })
                .then((Categories) => this.render(Categories));
            }
        }
    }

    static deleteChore(CategoryId, ChoreId) {
        for (let Category of this.Categories) {
            if (Category._id == CategoryId) {
                for (let Chore of Category.Chores) {
                    if (Chore._id == ChoreId) {
                        Category.Chores.splice(Category.Chores.indexOf(Chore), 1);
                        ChoreService.updateCategory(Category)
                        .then(() => {
                            return ChoreService.getAllCategories();
                        })
                        .then((Categories) => this.render(Categories));
                    }
                }
            }
        }
    }

    static render(Categories) {
        this.Categories = Categories;
        $('#app').empty();
        for (let Category of Categories) {
            $('#app').prepend(
                `<div id="${Category._id}" class="card">
                    <div class="card-header">
                        <h2>${Category.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteCategory('${Category._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${Category._id}-Chore-name" class ="form-control" placeholder="Chore Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${Category._id}-Chore-details" class ="form-control" placeholder="Chore details">
                                </div>
                            </div>
                            <button id="${Category._id}-new-Chore" onclick="DOMManager.addChore('${Category._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let Chore of Category.Chores) {
                $(`#${Category._id}`).find('.card-body').append(
                `<p>
                 <span id="name=${Chore._id}"><strong>Name: </strong> ${Chore.name}</span>
                 <span id="details=${Chore._id}"><strong>details: </strong> ${Chore.details}</span>
                 <button class="btn btn-danger" onclick="DOMManager.deleteChore('${Category._id}', '${Chore._id}')">Delete Chore</button>`
            );}
        }
    }


}

$('#create-new-Category').click(() => {
    DOMManager.createCategory($('#new-Category-name').val());
    $('#new-Category-name').val('');
});
DOMManager.getAllCategories();
