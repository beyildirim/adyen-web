import { Component, FunctionComponent, h } from 'preact';
import SecuredFieldsProvider from '../../internal/SecuredFields/SFP/SecuredFieldsProvider';
import Alert from '../../internal/Alert';
import GiftcardResult from './GiftcardResult';
import useCoreContext from '../../../core/Context/useCoreContext';
import { PaymentAmount } from '../../../types';
import { GIFT_CARD } from '../../internal/SecuredFields/lib/configuration/constants';
import { GiftCardFields } from './GiftcardFields';
import { GiftcardFieldsProps } from './types';
import StoreDetails from '../../internal/StoreDetails';

interface GiftcardComponentProps {
    onChange: (state) => void;
    onFocus: (event) => void;
    onBlur: (event) => void;
    onSubmit: (event) => void;
    onBalanceCheck: (event) => void;

    amount: PaymentAmount;
    showPayButton?: boolean;
    payButton: (config) => any;
    brand: string;

    pinRequired: boolean;
    expiryDateRequired?: boolean;
    fieldsLayoutComponent: FunctionComponent<GiftcardFieldsProps>;

    enableStoreDetails: boolean;
    storedPaymentMethodId: string;
}

class Giftcard extends Component<GiftcardComponentProps> {
    public state = {
        status: 'ready',
        data: {},
        balance: null,
        transactionLimit: null,
        focusedElement: false,
        isValid: false
    };

    public static defaultProps = {
        pinRequired: true,
        expiryDateRequired: false,
        onChange: () => {},
        onFocus: () => {},
        onBlur: () => {},
        fieldsLayoutComponent: GiftCardFields
    };

    public sfp;

    public handleSecureFieldsChange = sfpState => {
        this.props.onChange({
            data: sfpState.data,
            isValid: sfpState.isSfpValid
        });
    };

    public handleOnStoreDetails = storedDetails => {
        this.props.onChange({
            storePaymentMethod: storedDetails
        });
    };

    public showValidation = () => {
        // in case it's a stored gift card (stored mealvoucher) there will be no SFP
        if (this.sfp) {
            this.sfp.showValidation();
        }
    };

    setStatus(status) {
        this.setState({ status });
    }

    public handleFocus = e => {
        this.setState({ focusedElement: e.currentFocusObject });

        const isFocused = e.focus === true;
        if (isFocused) {
            this.props.onFocus(e);
        } else {
            this.props.onBlur(e);
        }
    };

    public setBalance = ({ balance, transactionLimit }) => {
        this.setState({ balance, transactionLimit });
    };

    render(props: GiftcardComponentProps, { focusedElement, balance, transactionLimit }) {
        const { i18n } = useCoreContext();

        const transactionAmount = transactionLimit?.value < balance?.value ? transactionLimit : balance;
        const hasEnoughBalance = transactionAmount?.value >= this.props.amount?.value;

        if (transactionAmount && hasEnoughBalance) {
            return <GiftcardResult balance={balance} transactionLimit={transactionLimit} onSubmit={props.onSubmit} {...props} />;
        }

        if (props.storedPaymentMethodId) {
            return this.props.payButton({
                status: this.state.status,
                onClick: this.props.onBalanceCheck,
                label: i18n.get('applyGiftcard'),
                classNameModifiers: ['standalone']
            });
        }

        const getCardErrorMessage = sfpState => {
            if (sfpState.errors.encryptedCardNumber) return i18n.get(sfpState.errors.encryptedCardNumber);

            switch (this.state.status) {
                case 'no-balance':
                    return i18n.get('error.giftcard.no-balance');
                case 'card-error':
                    return i18n.get('error.giftcard.card-error');
                case 'currency-error':
                    return i18n.get('error.giftcard.currency-error');
                default:
                    return null;
            }
        };

        return (
            <div className="adyen-checkout__giftcard">
                {this.state.status === 'error' && <Alert icon={'cross'}>{i18n.get('error.message.unknown')}</Alert>}

                <SecuredFieldsProvider
                    {...this.props}
                    ref={ref => {
                        this.sfp = ref;
                    }}
                    onChange={this.handleSecureFieldsChange}
                    onFocus={this.handleFocus}
                    type={GIFT_CARD}
                    render={({ setRootNode, setFocusOn }, sfpState) =>
                        this.props.fieldsLayoutComponent({
                            i18n: i18n,
                            pinRequired: this.props.pinRequired,
                            focusedElement: focusedElement,
                            getCardErrorMessage: getCardErrorMessage,
                            setRootNode: setRootNode,
                            setFocusOn: setFocusOn,
                            sfpState: sfpState,
                            // TODO maybe remove this?
                            ...props
                        })
                    }
                />

                {props.enableStoreDetails && <StoreDetails onChange={this.handleOnStoreDetails} />}

                {this.props.showPayButton &&
                    this.props.payButton({
                        status: this.state.status,
                        onClick: this.props.onBalanceCheck,
                        label: i18n.get('applyGiftcard')
                    })}
            </div>
        );
    }
}

export default Giftcard;
