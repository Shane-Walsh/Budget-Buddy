// Keeps track of incomes and expenses of the budget itself and the percentages
var budgetController = (function(){

   // Expense function constructor
   var Expense = function(id, description, value){

       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
    };

   Expense.prototype.calcPercentage = function(totalIncome){

       if(totalIncome > 0){

           this.percentage = Math.round((this.value / totalIncome) * 100);
       } else {

            this.percentage = -1;
       }
   };

    Expense.prototype.getPercentage = function(){

        return this.percentage;
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

        deleteItem: function(type, id){

            var ids, index;

            ids = data.allItems[type].map(function(current) {

                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){

                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentage: function(){

          data.allItems.exp.forEach(function(cur){

             cur.calcPercentage(data.totals.inc);
          });
        },

        getPercentage: function(){

            var allPercentages = data.allItems.exp.map(function(cur){

                return cur.getPercentage();
            });

            return allPercentages; // .map makes copy and returns array
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){

        var numSplit, int, dec;

        num = Math.abs(num);    // gets absolute - removes + or -
        num = num.toFixed(2);   // always puts 2 decimal places on number

        numSplit = num.split('.');

        int = numSplit[0];

        if(int.length > 3){

            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback){

        for (var i = 0; i < list.length; i++){

            callback(list[i], i);
        }
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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(type === 'exp'){

                element = DOMstrings.expensesContainer;

                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML. replace('%description%', obj.description);
            newHTML = newHTML. replace('%value%', formatNumber(obj.value, type));

            //Insert into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        deleteListItem: function(selectorID){

            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
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

            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if(obj.percentage > 0 ) {

                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {

                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages){

           // Returns a Node List
          var fields = document.querySelectorAll(DOMstrings.expPercentageLabel);

          nodeListForEach(fields, function(current, index) {

              if (percentages[index] > 0) {

                  current.textContent = percentages[index] + '%';
              } else {

                  current.textContent = '---';
              }
          });
        },

        displayMonth: function(){

          var now, month, months, year;

          months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

          now = new Date();
          month = now.getMonth();
          year = now.getFullYear();

          document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function(){

          var fields = document.querySelectorAll(

              DOMstrings.inputType + ',' +
              DOMstrings.inputDesc + ',' +
              DOMstrings.inputValue
          );

          nodeListForEach(fields, function(cur){

              cur.classList.toggle('red-focus');
          });

          document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        // Expose DOMstrings globally so controller module can use them
        getDOMstrings: function(){

            return DOMstrings;
        }
    }
})();

var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

        // Make DOMstrings available inside this module
        var DOM  = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Listen for Return key press only, Return key code = 13
        document.addEventListener('keypress', function(event){

            if(event.keyCode === 13 || event.which === 13){

                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function(){

        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){

        budgetCtrl.calculatePercentage();

        var percentages = budgetCtrl.getPercentage();

        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){

        var input, newItem;

        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);

            UICtrl.clearFields();

            updateBudget();

            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event){

        var itemID, splitID, type, ID;

          itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

          if(itemID){

              splitID = itemID.split('-');
              type = splitID[0];
              ID = parseInt(splitID[1]);  // Convert to Int - otherwise comparing different data types

              // Delete item from data structure
              budgetCtrl.deleteItem(type, ID);

              // Delete item from UI
              UICtrl.deleteListItem(itemID);

              updateBudget();

              updatePercentages();
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

            UICtrl.displayMonth();
        }
    }

})(budgetController, UIController);

// initialise app
controller.init();