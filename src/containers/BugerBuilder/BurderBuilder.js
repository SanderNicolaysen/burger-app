import React, { Component } from "react";

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4, 
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        isPurchasable: false,
        isPurchasing: false,
        loading: false,
        error: false
    }

    componentDidMount = async () => {
        try {
            const ingredients = await axios.get('/ingredients.json');
            this.setState({ingredients: ingredients.data});
        } catch (error) {
            this.setState({error: true});
        }
    }

    updatePurchaseable = (ingredients) => {
        const purchasable = Object.values(ingredients).some(quantity => quantity > 0);
        this.setState({isPurchasable: purchasable});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const newCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = newCount;

        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + INGREDIENT_PRICES[type];
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseable(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) 
            return;

        const newCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = newCount;

        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - INGREDIENT_PRICES[type];
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseable(updatedIngredients);
    }

    orderHandler = () => {
        this.setState({isPurchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({isPurchasing: false});
    }

    purchaseContinueHandler = async () => {
        this.setState({loading: true});

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: "Sander Nicolaysen",
                address: {
                    street: "test",
                    zipCode: "1234",
                    country: "Norway"
                },
                email: "test@gmail.com"
            },
            deliveryMethod: 'fast'
        };

        try {
            const response = await axios.post('/orders.json', order);
            console.log(response);
            this.setState({loading: false, isPurchasing: false});
        } catch (error) {
            this.setState({loading: false, isPurchasing: false});
        }
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if (this.state.ingredients) {
            burger = (
                <>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={(type) => this.addIngredientHandler(type)}
                        ingredientRemoved={(type) => this.removeIngredientHandler(type)}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        isPurchasable={this.state.isPurchasable}
                        ordered={this.orderHandler}/>
                </>
            );

            orderSummary = (
                <OrderSummary 
                    ingredients={this.state.ingredients}
                    price={this.state.totalPrice} 
                    purchaseContinued={this.purchaseContinueHandler} 
                    purchaseCanceled={this.purchaseCancelHandler}/>
            );
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <>
                <Modal show={this.state.isPurchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);