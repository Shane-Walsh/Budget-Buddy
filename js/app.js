
var budgetController = (function(){

   // do something

})();


var UIController = (function(){

    // do something

})();

var controller = (function(budgetCtrl, UICtrl){


    var ctrlAddItem = function(){

        // 1. Get field input data

        // 2. Add item to budget controller

        // 3. Add item to UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
        console.log('Add item function callled!');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);


    // Listen for return key press only
    document.addEventListener('keypress', function(event){

        if(event.keyCode === 13 || event.which === 13){

           ctrlAddItem();
        }

    });

})(budgetController, UIController);