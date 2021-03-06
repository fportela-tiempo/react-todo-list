import {dispatch, register} from '../dispatcher/AppDispatcher';
import TodoConstants from '../constants/TodoConstants';
import { EventEmitter } from 'events';
import _ from 'lodash';

const CHANGE_EVENT = 'list_updated';

const _updateTodo = (item, list ) => {
    list.map((todo) => {
        if(todo._id == item._id){
            todo.done = item.done;
        }
        return todo;
    });
}

const _deleteItem = (_id, list) =>{
    _.remove(list, (item) =>{
        return item._id == _id;
    });
}

class TodoStore extends EventEmitter{
    constructor(){
        super();
        this._list = [];
    }

    addChangeListener(callback){
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback){
        this.removeChangeListener(CHANGE_EVENT, callback);
    }

    getList(){
        return this._list;
    }

    handleActions(action){
        let emitChange = () => {
            console.info('Emit change event from Store...');
            this.emit(CHANGE_EVENT)
        }
        switch(action.actionType){
            case TodoConstants.GET_ITEMS:
                this._list = action.todos;
                emitChange();
                break;
            case TodoConstants.NEW_ITEM:
                this._list.push(action.todo);
                emitChange();
                break;
            case TodoConstants.TOGGLE_ITEM:
                _updateTodo(action.todo, this._list);
                emitChange();
                break;
            case TodoConstants.DELETE_ITEM:
                _deleteItem(action._id, this._list);
                emitChange();
                break;
        }
    }
}

const todoStore = new TodoStore;
register(todoStore.handleActions.bind(todoStore));

export default todoStore;
