
var budgetController = (function(){

   // do something


})();


var UIController = (function(){

    // Data structure for holding data type strings
    var DOMstrings = {

        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',

    }

    return {

        getInput: function(){

            return {
                    type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                    description: document.querySelector(DOMstrings.inputDesc).value,
                    value: document.querySelector(DOMstrings.inputValue).value
           };
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

    var ctrlAddItem = function(){

        // 1. Get field input data

        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add item to budget controller

        // 3. Add item to UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    return {

        init: function () {

            console.log('Application starting...');
            setupEventListeners();
        }
    }

})(budgetController, UIController);


// Starts and initialises application
controller.init();