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

    var calculateTotal = function(type){

        var sum = 0;

        data.allItems[type].forEach(function(current){

            sum += current.value;
        });

        // Add sum to data structure
        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function(){

            // Calc total inc + exp
            calculateTotal('exp');
            calculateTotal('inc');

            // Calc budget inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            // Check income > 0 to get percentage - can't divide inc by 0
            if(data.totals.inc > 0){

                // Calc percentage of income spent
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else {

                // -1 equates to non-existence
                data.percentage = -1;
            }

        },

        getBudget: function () {

            return {

                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer:  '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
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

        displayBudget: function(obj){

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if(obj.percentage > 0 ) {

                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {

                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

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
        budgetCtrl.calculateBudget();

        // 2. Return budget
        var budget = budgetCtrl.getBudget();

        // 3. Display budget to UI
        UICtrl.displayBudget(budget);
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

            UICtrl.displayBudget({

                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    }

})(budgetController, UIController);


// Starts and initialises application
controller.init();