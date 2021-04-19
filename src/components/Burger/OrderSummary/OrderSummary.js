import React from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}><span style={{textTransform: "capitalize"}}>{igKey}</span> : {props.ingredients[igKey]}</li>
            )
        });
    
    return (
        <Aux>
            <h3>Your order: </h3>
            <p>Delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
            <p>Continue to checkout?</p>
            <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
            <Button btnType="Danger" clicked={props.purchaseCanceled}>CANCEL</Button>
        </Aux>
    );
} 

export default orderSummary;