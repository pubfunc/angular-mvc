import { FormControl as NgFormControl } from '@angular/forms';
import { IState } from '../state';

export class FormControl extends NgFormControl {

    constructor(
        state: IState
    ){
        super(state.get());
    }

}