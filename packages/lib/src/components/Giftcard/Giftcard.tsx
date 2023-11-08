import { h } from 'preact';
import UIElement from '../UIElement';
import GiftcardComponent from './components/GiftcardComponent';
import CoreProvider from '../../core/Context/CoreProvider';

import PayButton from '../internal/PayButton';
import AdyenCheckoutError from '../../core/Errors/AdyenCheckoutError';
import { PaymentAmount } from '../../types';
import { PaymentResponse } from '../types';
import { GiftCardElementData } from './types';

export class GiftcardElement extends UIElement {
    public static type = 'giftcard';

    protected static defaultProps = {
        brandsConfiguration: {}
    };

    formatProps(props) {
        return {
            ...props?.configuration,
            ...props
        };
    }

    formatData(): GiftCardElementData {
        return {
            paymentMethod: {
                type: this.constructor['type'],
                brand: this.props.brand,
                encryptedCardNumber: this.state.data?.encryptedCardNumber,
                encryptedSecurityCode: this.state.data?.encryptedSecurityCode
            }
        };
    }

    formatBalanceCheckData(): GiftCardElementData {
        return this.formatData();
    }

    get isValid() {
        if (this.props.storedPaymentMethodId) {
            return true;
        }

        return !!this.state.isValid;
    }

    get icon() {
        return this.props.brandsConfiguration[this.props.brand]?.icon || this.props.icon || this.resources.getImage()(this.props.brand);
    }

    get displayName() {
        if (this.props.storedPaymentMethodId && this.props.lastFour) {
            // this applies for MealVoucher since it has the logic for lastFour
            return `•••• ${this.props.lastFour}`;
        }

        return this.props.brandsConfiguration[this.props.brand]?.name || this.props.name;
    }

    private handleBalanceCheck = data => {
        if (this.props.onBalanceCheck) {
            return new Promise((resolve, reject) => {
                this.props.onBalanceCheck(resolve, reject, data);
            });
        }

        if (this.props.session) {
            return this.props.session.checkBalance(data);
        }
    };

    private onOrderRequest = data => {
        if (this.props.onOrderRequest)
            return new Promise((resolve, reject) => {
                this.props.onOrderRequest(resolve, reject, data);
            });

        if (this.props.session) {
            return this.props.session.createOrder();
        }
    };

    protected handleOrder = ({ order }: PaymentResponse) => {
        this.updateParent({ order });
        if (this.props.session && this.props.onOrderCreated) {
            return this.props.onOrderCreated(order);
        }
    };

    public balanceCheck() {
        return this.onBalanceCheck();
    }

    public onBalanceCheck = () => {
        // skip balance check if no onBalanceCheck event has been defined
        const hasBalanceCheck = this.props.session || this.props.onBalanceCheck;
        if (!hasBalanceCheck) return this.submit();

        if (!this.isValid) {
            this.showValidation();
            return false;
        }

        this.setStatus('loading');

        this.handleBalanceCheck(this.formatBalanceCheckData())
            .then(({ balance, transactionLimit = {} as PaymentAmount }) => {
                if (!balance) throw new Error('card-error'); // card doesn't exist
                if (balance?.currency !== this.props.amount?.currency) throw new Error('currency-error');
                if (balance?.value <= 0) throw new Error('no-balance');

                this.componentRef.setBalance({ balance, transactionLimit });

                if (this.props.amount.value > balance.value || this.props.amount.value > transactionLimit.value) {
                    if (this.props.order) {
                        return this.submit();
                    }

                    return this.onOrderRequest(this.data).then((order: { orderData: string; pspReference: string }) => {
                        this.setState({ order: { orderData: order.orderData, pspReference: order.pspReference } });
                        this.submit();
                    });
                } else {
                    if (this.props.onRequiringConfirmation) {
                        this.props.onRequiringConfirmation();
                    }
                }
            })
            .catch(error => {
                this.setStatus(error?.message || 'error');
                if (this.props.onError) this.handleError(new AdyenCheckoutError('ERROR', error));
            });
    };

    // Giftcards override the regular payButton flow
    public payButton = props => {
        return <PayButton {...props} />;
    };

    render() {
        return (
            <CoreProvider i18n={this.props.i18n} loadingContext={this.props.loadingContext} resources={this.resources}>
                <GiftcardComponent
                    ref={ref => {
                        this.componentRef = ref;
                    }}
                    {...this.props}
                    onChange={this.setState}
                    onBalanceCheck={this.onBalanceCheck}
                    onSubmit={this.submit}
                    payButton={this.payButton}
                />
            </CoreProvider>
        );
    }
}

export default GiftcardElement;
