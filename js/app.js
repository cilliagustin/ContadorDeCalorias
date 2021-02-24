//Controlador de almacenamiento
            /*IIFE - funcion ejecutada inmediatamente*/
const StorageCtrl = (function(){
    //Metodos publicos
    return {
        storeItem: function(item){
            let items;
            // revisar si hay items en almacenamiento local
            if(localStorage.getItem('items') === null){
                items = [];
                //Agregar el item nuevo
                items.push(item);
                //Establecer Almacenaiento Local
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //obtener elementos ya existentes en A.L
                items = JSON.parse(localStorage.getItem('items'));
                //empujar nuevo item
                items.push(item);

                //Reestablecer A.L
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage : function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            //Reestablecer A.L
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            //Reestablecer A.L
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


//Controlador de elementos
            /*IIFE - funcion ejecutada inmediatamente*/
const ItemCtrl = (function(){ 
    //Constructor de elemento
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Estructora de Data
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

            /*Metodos Publicos*/
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            //Crear ID
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id +1;
            } else {
                ID = 0;
            }

            //Pasar calorias a numero
            calories = parseInt(calories);

            //Crear nuevo item
            newItem = new Item(ID, name, calories);

            //Agregar al Array de Items
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            //loopear items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //Pasar calorias de string a numero
            calories =parseInt(calories);

            let found= null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item
                }
            });

            return found;
        },
        deleteItem: function(id){
            //Obtener id
            ids = data.items.map(function(item){
                return item.id;
            });

            //obtener index
            const index = ids.indexOf(id);

            //remover item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = []
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            //Sumar calorias
            data.items.forEach(function(item){
                total += item.calories;
            });

            //Establecer total de calorias
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();



//Controlador de UI
const UICtrl = (function(){ 
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    
            /*Metodos Publicos*/
    return {
        populateItemList: function(items){
            let html = '';

                /*cada vez que loopea crea un nuevo Li*/
            items.forEach(function(item){
                html +=  `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calorias</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });
            //Insertar Li creado en Ul
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //Mostrar Ul
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Crear LI
            const li = document.createElement('li');
            //Agregar clase
            li.className = 'collection-item';
            //Agregar ID
            li.id = `item-${item.id}`;
            //Agregar HTML
            li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calorias</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //Insertar al Ul
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //convertir Node List a Array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calorias</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove()
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //convertir Node List a Array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
            /*metodo publico para obtener selectores*/
        getSelectors: function(){
            return UISelectors;
        }
    }
})();



//Controlador de App
const App = (function(ItemCtrl, StorageCtrl, UICtrl){ 
    //Cargar Event Listeners
    const loadEventListeners = function(){
        // Selectores de UI
        const UISelectors = UICtrl.getSelectors();

        //Agregar Item
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Desactivar enter para accionar submit
        document.addEventListener('keypress', function(e){
            if(e.key === 'Enter'){
                e.preventDefault();
                return false;
            }
        });

        //Editar item con icono
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Actualizar Item evento
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Botón atras
        document.querySelector(UISelectors.backBtn).addEventListener('click', function(e){
            UICtrl.clearEditState();

            e.preventDefault();
        });
    
        //Borrar Item evento
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Limpiar Items evento
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    

    //funcion Agregar Item
    const itemAddSubmit = function(e){
        //Obtener info del Input del controlador de UI
        const input = UICtrl.getItemInput();

        //Solo funcione cuando ambos cambos estan completos
        if(input.name !== '' && input.calories !== ''){
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //AGregar Item al UI
            UICtrl.addListItem(newItem);

            //Obtener total de calorias
            const totalCalories = ItemCtrl.getTotalCalories();
            //Agregar total de calorias a UI
            UICtrl.showTotalCalories(totalCalories);

            //Almacenar en Almacenamiento Local
            StorageCtrl.storeItem(newItem);

            //Limpiar Formulario
            UICtrl.clearInput();
        }
        
        e.preventDefault();
    };
    //funcion editar Item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //obtener id del item
            const listId = e.target.parentNode.parentNode.id;

            //dividir en Array
            const listIdArr = listId.split('-');

            //obtener el ID
            const id = parseInt(listIdArr[1]);

            //Obtener Item
            const itemToEdit = ItemCtrl.getItemById(id);

            //Estabecer item actual
            ItemCtrl.setCurrentItem(itemToEdit);

            //Agregar Item al formulario
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    };

    //Funcion Actualizar Item
    const itemUpdateSubmit= function(e){
        //obtener resultado del formulario
        const input = UICtrl.getItemInput();

        //Actualizar Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //actualizar UI
        UICtrl.updateListItem(updatedItem);

        //Obtener total de calorias
        const totalCalories = ItemCtrl.getTotalCalories();
        //Agregar total de calorias a UI
        UICtrl.showTotalCalories(totalCalories);

        //Actualizar L.A
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Funcion Borrar Item
    const itemDeleteSubmit = function(e){
        //obtener item actual
        const currentItem = ItemCtrl.getCurrentItem();

        //eliminar de estructura
        ItemCtrl.deleteItem(currentItem.id);

        //Eliminar del UI
        UICtrl.deleteListItem(currentItem.id);

        //Obtener total de calorias
        const totalCalories = ItemCtrl.getTotalCalories();
        //Agregar total de calorias a UI
        UICtrl.showTotalCalories(totalCalories);

        //Borrar de A.L
        StorageCtrl.deleteItemFromStorage(currentItem.id);


        UICtrl.clearEditState();
        e.preventDefault();
    }

    //Funcion limpiar todos los items
    const clearAllItemsClick = function(){
        //Borrar todos los items de la data
        ItemCtrl.clearAllItems();

        //Obtener total de calorias
        const totalCalories = ItemCtrl.getTotalCalories();
        //Agregar total de calorias a UI
        UICtrl.showTotalCalories(totalCalories);

        //Borrar del UI
        UICtrl.removeItems();

        //Borrar del A.L
        StorageCtrl.clearItemsFromStorage();

        //esconder UL
        UICtrl.hideList();
    }
            /*Metodos Publicos*/
    return {
        init: function(){
            //Establecer botones iniciales
            UICtrl.clearEditState();
            /*Buscar items de estructora de data*/
            const items = ItemCtrl.getItems();

            //Controlar si hay items
            if(items.length === 0){
                UICtrl.hideList();
            } else {
                /*Colocar Items en lista */
                UICtrl.populateItemList(items);
            }

            //Obtener total de calorias
            const totalCalories = ItemCtrl.getTotalCalories();
            //Agregar total de calorias a UI
            UICtrl.showTotalCalories(totalCalories);
            //Cargar Event Listeners
            loadEventListeners();
        }
    }
    
})(ItemCtrl, StorageCtrl, UICtrl);

//Inicializar App
App.init();