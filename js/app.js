// Keeps track of incomes and expenses of the budget itself and the percentages
var budgetController = (function(){

   // Expense function constructor
   var Expense = function(id, description, value){

       this.id = id;
       this.description = description;
       this.value = value;
    };
    // Income function constructor
    var Income = function(id, description, value){

        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Data structure of incomes and expenses
    var data = {

        allItems: {

            exp: [],
            inc: []
        },
        totals: {

            exp: 0,
            inc: 0
        }
    };

    return {

        addItem: function(type, desc, val){

            var newItem, ID;

            // Create new ID
            if(data.allItems[type].length > 0) {

                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID = 0;
            }

            // Create new item based on 'exp' or 'inc'
            if(type === 'exp') {

                newItem = new Expense(ID, desc, val);

            } else if(type === 'inc'){

                newItem = new Income(ID, desc, val);
            }

            // Push new item to data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

            testing: function(){

            console.log(data);
            }
    };

})();


var UIController = (function(){

    // Data structure for holding data type strings
    var DOMstrings = {

        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer:  '.expenses__list'
    };

    return {

        getInput: function(){

            return {
                    type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                    description: document.querySelector(DOMstrings.inputDesc).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
           };
        },

        addListItem: function(obj, type){

            var html, element;

            if(type === 'inc'){

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(type === 'exp'){

                element = DOMstrings.expensesContainer;

                html= '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML. replace('%description%', obj.description);
            newHTML = newHTML. replace('%value%', obj.value);

            //Insert into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        clearFields: function(){

            var fields, fieldsArr;

            // NOTICE: this returns a List, not an array
            fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){

                current.value = "";
            });

            // Return focus
            fieldsArr[0].focus();
        },

        // Expose DOMstrings globally so controller module can use them

        getDOMstrings: function(){

            return DOMstrings;
        }
    }

})();

var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

        // Retrieve DOMstrings inside this module
        var DOM  = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Listen for return key press only
        document.addEventListener('keypress', function(event){

            if(event.keyCode === 13 || event.which === 13){

                ctrlAddItem();
            }
        });
    };

    var updateBudget = function(){

        // 1. Calculate the budget

        // 2. Return budget

        // 3. Display the budget on the UI
    };

    var ctrlAddItem = function(){

        var input, newItem;

        // 1. Get field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear input fields UI
            UICtrl.clearFields();

            // 5. Calc and update budget

            updateBudget();
        }
    };

    return {

        init: function () {

            console.log('Application running...');
            setupEventListeners();
        }
    }

})(budgetController, UIController);


// Starts and initialises application
controller.init();