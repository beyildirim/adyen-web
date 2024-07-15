import { UIElementProps } from '../types';

export interface GooglePayPropsConfiguration {
    /**
     * Adyen's merchant account name
     * @see https://developers.google.com/pay/api/web/reference/request-objects#gateway
     */
    gatewayMerchantId: string;

    /**
     * A Google merchant identifier issued after registration with the {@link https://pay.google.com/business/console | Google Pay Business Console}.
     * Required when PaymentsClient is initialized with an environment property of PRODUCTION.
     * @see https://developers.google.com/pay/api/web/reference/request-objects#MerchantInfo
     */
    merchantId?: string;

    /**
     * Merchant name is rendered in the payment sheet.
     * @see https://developers.google.com/pay/api/web/reference/request-objects#MerchantInfo
     */
    merchantName?: string;

    /**
     * Merchant fully qualified domain name.
     */
    merchantOrigin?: string;

    /**
     * Google JWT solution for platforms
     * To request Google Pay credentials, you can enable platforms to send requests that are authenticated with the platform credentials. You don't need to register individual domain names to call Google Pay APIs.
     */
    authJwt?: string;
}

export interface GooglePayProps extends UIElementProps {
    type?: 'googlepay' | 'paywithgoogle';

    environment?: google.payments.api.Environment | string;
    configuration?: GooglePayPropsConfiguration;

    /**
     * @see https://developers.google.com/pay/api/web/reference/request-objects#IsReadyToPayRequest
     * @defaultValue true
     */
    existingPaymentMethodRequired?: boolean;

    /**
     * The status of the total price
     * @see https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo
     */
    totalPriceStatus?: google.payments.api.TotalPriceStatus;

    /**
     * @see https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo
     */
    countryCode?: string;

    allowedAuthMethods?: google.payments.api.CardAuthMethod[];
    allowedCardNetworks?: google.payments.api.CardNetwork[];

    /**
     * Set to true to request assuranceDetails. This object provides information
     * about the validation performed on the returned payment data.
     *
     * @defaultValue false
     */
    assuranceDetailsRequired?: boolean;

    /**
     * Set to false if you don't support credit cards.
     * @defaultValue true
     */
    allowCreditCards?: boolean;

    /**
     * Set to false if you don't support prepaid cards.
     * @defaultValue true
     */
    allowPrepaidCards?: boolean;

    /**
     * Set to true if you require a billing address
     *
     * @remarks
     * A billing address should only be requested if it's required to process the transaction.
     *
     * @defaultValue false
     */
    billingAddressRequired?: boolean;

    /**
     * The expected fields returned if billingAddressRequired is set to true.
     */
    billingAddressParameters?: google.payments.api.BillingAddressParameters;

    /**
     * Set to true to request an email address.
     * @defaultValue false
     */
    emailRequired?: boolean;

    /**
     * Used for analytics
     */
    expressPage?: 'cart' | 'minicart' | 'pdp' | 'checkout';

    /**
     * Used for analytics
     * @defaultValue false
     */
    isExpress?: boolean;

    /**
     * Set to true to request a full shipping address.
     * @defaultValue false
     */
    shippingAddressRequired?: boolean;

    /**
     * If shippingAddressRequired is set to true, specify shipping address restrictions. This object is used to set shipping restrictions.
     *
     * @see https://developers.google.com/pay/api/web/reference/request-objects#ShippingAddressParameters
     */
    shippingAddressParameters?: google.payments.api.ShippingAddressParameters;

    /**
     * Set to true when the SHIPPING_OPTION callback intent is used. This field is required if you implement support
     * for Authorize Payments or Dynamic Price Updates.
     *
     * @see https://developers.google.com/pay/api/web/reference/request-objects#ShippingOptionParameters
     */
    shippingOptionRequired?: boolean;

    /**
     * @see https://developers.google.com/pay/api/web/reference/request-objects#ShippingOptionParameters
     */
    shippingOptionParameters?: google.payments.api.ShippingOptionParameters;

    /**
     * Specifies the following callback intents for PaymentDataCallbacks
     * @see https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataCallbacks
     */
    callbackIntents?: google.payments.api.CallbackIntent[];

    /**
     * @see https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataCallbacks
     */
    paymentDataCallbacks?: google.payments.api.PaymentDataCallbacks;

    /**
     * @see https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo
     */
    transactionInfo?: Partial<google.payments.api.TransactionInfo>;

    // Button
    buttonColor?: google.payments.api.ButtonColor;
    buttonType?: google.payments.api.ButtonType;
    buttonSizeMode?: google.payments.api.ButtonSizeMode;
    buttonRootNode?: HTMLDocument | ShadowRoot;
    buttonLocale?: string;
    buttonRadius?: number;

    // Events
    onClick?: (resolve, reject) => void;
    onAuthorized?: (paymentData: google.payments.api.PaymentData) => void;
}

// Used to add undocumented google payment options
export interface GooglePaymentDataRequest extends google.payments.api.PaymentDataRequest {
    merchantInfo: ExtendedMerchantInfo;
}

export interface ExtendedMerchantInfo extends google.payments.api.MerchantInfo {
    merchantOrigin?: string;
}
